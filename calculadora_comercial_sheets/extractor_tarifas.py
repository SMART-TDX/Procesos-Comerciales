"""Extrae y valida las tarifas Instituto 2026 de Inglés y Francés.

Los libros Excel se leen como Office Open XML y nunca se modifican. El archivo
tarifas.js solo se reemplaza después de validar exactamente 750 registros. La
actualización crea un respaldo y un reporte de diferencias.
"""

from __future__ import annotations

import json
import re
import shutil
import sys
import zipfile
from datetime import datetime
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
from pathlib import Path
from typing import Any
from xml.etree import ElementTree as ET
from zoneinfo import ZoneInfo


ROOT = Path(__file__).resolve().parent
NS_MAIN = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
NS_REL = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
TIME_ZONE = ZoneInfo("America/Bogota")

SOURCES = (
    {
        "idioma_id": "INGLES",
        "idioma_nombre": "Inglés",
        "producto_id": "INGLES_INSTITUTO",
        "plan_prefix": "ING_INST",
        "zona_id": "REGIONALES",
        "zona_tarifaria": "Regionales",
        "archivo": "Tarifas Regionales - 2026 V3.xlsx",
        "hoja": "Tarifas Ing Regionales",
        "expected_rows": 49,
        "expected_records": 245,
        "expected_plans": 15,
    },
    {
        "idioma_id": "INGLES",
        "idioma_nombre": "Inglés",
        "producto_id": "INGLES_INSTITUTO",
        "plan_prefix": "ING_INST",
        "zona_id": "CUND_ANT",
        "zona_tarifaria": "Cundinamarca y Antioquia",
        "archivo": "Tarifas Cundinamarca y Antioquia - 2026 V3.xlsx",
        "hoja": "Tarifas Ing Cund y Ant",
        "expected_rows": 49,
        "expected_records": 245,
        "expected_plans": 15,
    },
    {
        "idioma_id": "FRANCES",
        "idioma_nombre": "Francés",
        "producto_id": "FRANCES_INSTITUTO",
        "plan_prefix": "FRA_INST",
        "zona_id": "REGIONALES",
        "zona_tarifaria": "Regionales",
        "archivo": "Tarifas Regionales - 2026 V3.xlsx",
        "hoja": "Tarifas Fran Regionales",
        "expected_rows": 26,
        "expected_records": 130,
        "expected_plans": 10,
    },
    {
        "idioma_id": "FRANCES",
        "idioma_nombre": "Francés",
        "producto_id": "FRANCES_INSTITUTO",
        "plan_prefix": "FRA_INST",
        "zona_id": "CUND_ANT",
        "zona_tarifaria": "Cundinamarca y Antioquia",
        "archivo": "Tarifas Cundinamarca y Antioquia - 2026 V3.xlsx",
        "hoja": "Tarifas Fran Cund y Ant",
        "expected_rows": 26,
        "expected_records": 130,
        "expected_plans": 10,
    },
)

CONDITIONS = (
    {
        "id": "PRECIO_AL_PUBLICO",
        "nombre": "Precio al público",
        "columnas": ("D", "E", "F", "G", "H", "I", "J"),
    },
    {
        "id": "ALIANZA_MASIVA",
        "nombre": "Alianza masiva / Campaña",
        "columnas": ("L", "M", "N", "O", "P", "Q", "R"),
    },
    {
        "id": "ALIANZA_EMPRESARIAL",
        "nombre": "Alianza empresarial",
        "columnas": ("T", "U", "V", "W", "X", "Y", "Z"),
    },
    {
        "id": "PREVENTA_ESPECIAL",
        "nombre": "Preventa / Especial",
        "columnas": ("AB", "AC", "AD", "AE", "AF", "AG", "AH"),
    },
    {
        "id": "COLABORADOR",
        "nombre": "Colaborador",
        "columnas": ("AJ", "AK", "AL", "AM", "AN", "AO", "AP"),
    },
)

MONETARY_FIELDS = (
    "valor_full_oficial_cop",
    "cuota_inicial_minima_cop",
    "cuota_mensual_referencia_cop",
    "valor_total_oficial_cop",
    "valor_por_hora_mostrado_cop",
)

REQUIRED_FIELDS = (
    "idioma_id",
    "idioma_nombre",
    "producto_id",
    "zona_id",
    "zona_tarifaria",
    "plan_id",
    "nombre_plan_original",
    "nombre_plan_interfaz",
    "numero_niveles",
    "niveles_incluidos",
    "horas_academicas",
    "condicion_id",
    "condicion_comercial",
    "numero_pagos",
    "porcentaje_descuento_raw_excel",
    "porcentaje_descuento_exacto",
    "valor_full_raw_excel",
    "valor_full_oficial_cop",
    "cuota_inicial_raw_excel",
    "cuota_inicial_minima_cop",
    "cuota_mensual_referencia_raw_excel",
    "cuota_mensual_referencia_cop",
    "valor_total_raw_excel",
    "valor_total_oficial_cop",
    "valor_por_hora_raw_excel",
    "valor_por_hora_mostrado_cop",
    "maxima_intensidad_mensual_raw",
    "maxima_intensidad_mensual_mostrada",
    "archivo_origen",
    "hoja_origen",
    "fila_origen",
)


class ExtractionError(ValueError):
    """Error contextual que impide publicar un catálogo incompleto."""

    def __init__(
        self,
        message: str,
        source: dict[str, Any] | None = None,
        row: int | None = None,
        field: str | None = None,
    ) -> None:
        self.source = source
        self.row = row
        self.field = field
        details = []
        if source:
            details.append(f"archivo={source['archivo']}")
            details.append(f"hoja={source['hoja']}")
        if row is not None:
            details.append(f"fila={row}")
        if field:
            details.append(f"campo={field}")
        suffix = f" ({', '.join(details)})" if details else ""
        super().__init__(message + suffix)


def qname(namespace: str, tag: str) -> str:
    return f"{{{namespace}}}{tag}"


def decimal_value(raw: str, source: dict[str, Any], row: int, field: str) -> Decimal:
    try:
        return Decimal(raw)
    except (InvalidOperation, TypeError) as error:
        raise ExtractionError("Valor numérico inválido.", source, row, field) from error


def excel_round_cop(raw: str) -> int:
    """Redondea al peso como la visualización aprobada de Excel."""

    return int(Decimal(raw).quantize(Decimal("1"), rounding=ROUND_HALF_UP))


def normalize_discount(raw: str) -> str:
    """Conserva el descuento exacto sin artefactos binarios de Excel."""

    value = Decimal(raw).quantize(Decimal("0.0001"), rounding=ROUND_HALF_UP)
    text = format(value, "f").rstrip("0").rstrip(".")
    return text or "0"


def read_shared_strings(archive: zipfile.ZipFile) -> list[str]:
    if "xl/sharedStrings.xml" not in archive.namelist():
        return []
    root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
    return [
        "".join(node.text or "" for node in item.iter(qname(NS_MAIN, "t")))
        for item in root.findall(qname(NS_MAIN, "si"))
    ]


def worksheet_root(archive: zipfile.ZipFile, sheet_name: str) -> ET.Element:
    workbook = ET.fromstring(archive.read("xl/workbook.xml"))
    relationships = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
    relation_map = {item.attrib["Id"]: item.attrib["Target"] for item in relationships}
    sheets = workbook.find(qname(NS_MAIN, "sheets"))
    if sheets is None:
        raise ExtractionError("El libro no contiene hojas.")

    for sheet in sheets:
        if sheet.attrib.get("name") != sheet_name:
            continue
        relation_id = sheet.attrib[qname(NS_REL, "id")]
        target = relation_map[relation_id].replace("\\", "/")
        if target.startswith("/"):
            target = target.lstrip("/")
        elif not target.startswith("xl/"):
            target = f"xl/{target}"
        return ET.fromstring(archive.read(target))
    raise ExtractionError(f"No se encontró la hoja autorizada: {sheet_name}")


def read_cells(path: Path, sheet_name: str) -> dict[str, dict[str, str | None]]:
    with zipfile.ZipFile(path) as archive:
        shared = read_shared_strings(archive)
        root = worksheet_root(archive, sheet_name)
        cells: dict[str, dict[str, str | None]] = {}
        for item in root.findall(f".//{qname(NS_MAIN, 'c')}"):
            address = item.attrib["r"]
            cell_type = item.attrib.get("t")
            value_node = item.find(qname(NS_MAIN, "v"))
            formula_node = item.find(qname(NS_MAIN, "f"))
            raw = value_node.text if value_node is not None else None
            display: str | None = raw
            if cell_type == "s" and raw is not None:
                display = shared[int(raw)]
            elif cell_type == "inlineStr":
                inline = item.find(qname(NS_MAIN, "is"))
                display = (
                    "".join(node.text or "" for node in inline.iter(qname(NS_MAIN, "t")))
                    if inline is not None
                    else ""
                )
            cells[address] = {
                "raw": raw,
                "display": display,
                "formula": formula_node.text if formula_node is not None else None,
            }
        return cells


def cell(cells: dict[str, dict[str, str | None]], address: str) -> dict[str, str | None]:
    return cells.get(address, {"raw": None, "display": None, "formula": None})


def plan_metadata(original: str, plan_prefix: str) -> dict[str, object]:
    clean = re.sub(r"\s+", " ", original).strip()
    levels = re.findall(r"\b(?:A1|A2|B1|B2|C1)\b", clean)
    hours_match = re.search(r"(\d+)\s+Horas", clean, flags=re.IGNORECASE)
    count_match = re.search(r"Plan\s+(\d+)\s+Nivel", clean, flags=re.IGNORECASE)
    if not levels or not hours_match or not count_match:
        raise ExtractionError(f"No fue posible interpretar el plan: {original!r}")

    hours = int(hours_match.group(1))
    level_count = int(count_match.group(1))
    plan_id = plan_prefix + "_" + "_".join(levels)
    if len(levels) == 1:
        interface_name = f"Plan de 1 nivel – {levels[0]} ({hours} horas)"
    elif levels == ["A1", "A2", "B1", "B2", "C1"]:
        interface_name = f"Plan completo de 5 niveles – A1 a C1 ({hours} horas)"
    elif plan_prefix == "FRA_INST" and levels == ["A1", "A2", "B1", "B2"]:
        interface_name = f"Plan completo de 4 niveles – A1 a B2 ({hours} horas)"
    else:
        level_text = ", ".join(levels[:-1]) + f" y {levels[-1]}"
        interface_name = f"Plan de {level_count} niveles – {level_text} ({hours} horas)"

    return {
        "plan_id": plan_id,
        "nombre_plan_original": original,
        "nombre_plan_interfaz": interface_name,
        "numero_niveles": level_count,
        "niveles_incluidos": levels,
        "horas_academicas": hours,
    }


def detect_tariff_rows(cells: dict[str, dict[str, str | None]]) -> list[int]:
    payment_columns = [condition["columnas"][0] for condition in CONDITIONS]
    return [
        row
        for row in range(5, 1001)
        if any(cell(cells, f"{column}{row}")["raw"] is not None for column in payment_columns)
    ]


def required_raw(
    cells: dict[str, dict[str, str | None]],
    address: str,
    source: dict[str, Any],
    row: int,
    field: str,
) -> str:
    raw = cell(cells, address)["raw"]
    if raw is None or str(raw).strip() == "":
        raise ExtractionError("Campo obligatorio vacío.", source, row, field)
    return str(raw)


def build_records(source: dict[str, Any]) -> list[dict[str, object]]:
    path = ROOT / source["archivo"]
    if not path.exists():
        raise ExtractionError("No existe el archivo autorizado.", source)
    cells = read_cells(path, source["hoja"])
    rows = detect_tariff_rows(cells)
    if len(rows) != source["expected_rows"]:
        raise ExtractionError(
            f"Cantidad de filas tarifarias inválida: esperadas {source['expected_rows']}, obtenidas {len(rows)}.",
            source,
        )

    records: list[dict[str, object]] = []
    current_plan: dict[str, object] | None = None
    current_full_raw: str | None = None

    for row in rows:
        plan_cell = cell(cells, f"A{row}")
        if plan_cell["display"]:
            current_plan = plan_metadata(str(plan_cell["display"]), source["plan_prefix"])
        full_cell = cell(cells, f"B{row}")
        if full_cell["raw"] is not None:
            current_full_raw = str(full_cell["raw"])
        if current_plan is None or current_full_raw is None:
            raise ExtractionError("No fue posible heredar plan o valor full.", source, row)

        for condition in CONDITIONS:
            columns = condition["columnas"]
            payments_raw = cell(cells, f"{columns[0]}{row}")["raw"]
            if payments_raw is None:
                continue
            names = (
                "numero_pagos",
                "porcentaje_descuento",
                "cuota_inicial",
                "cuota_mensual_referencia",
                "valor_total",
                "valor_por_hora",
                "maxima_intensidad_mensual",
            )
            values = {
                name: required_raw(cells, f"{column}{row}", source, row, name)
                for name, column in zip(names, columns)
            }
            for field, raw in values.items():
                decimal_value(raw, source, row, field)
            decimal_value(current_full_raw, source, row, "valor_full")

            record = {
                "idioma_id": source["idioma_id"],
                "idioma_nombre": source["idioma_nombre"],
                "producto_id": source["producto_id"],
                "zona_id": source["zona_id"],
                "zona_tarifaria": source["zona_tarifaria"],
                **current_plan,
                "condicion_id": condition["id"],
                "condicion_comercial": condition["nombre"],
                "numero_pagos": int(Decimal(values["numero_pagos"])),
                "porcentaje_descuento_raw_excel": values["porcentaje_descuento"],
                "porcentaje_descuento_exacto": normalize_discount(values["porcentaje_descuento"]),
                "valor_full_raw_excel": current_full_raw,
                "valor_full_oficial_cop": excel_round_cop(current_full_raw),
                "cuota_inicial_raw_excel": values["cuota_inicial"],
                "cuota_inicial_minima_cop": excel_round_cop(values["cuota_inicial"]),
                "cuota_mensual_referencia_raw_excel": values["cuota_mensual_referencia"],
                "cuota_mensual_referencia_cop": excel_round_cop(values["cuota_mensual_referencia"]),
                "valor_total_raw_excel": values["valor_total"],
                "valor_total_oficial_cop": excel_round_cop(values["valor_total"]),
                "valor_por_hora_raw_excel": values["valor_por_hora"],
                "valor_por_hora_mostrado_cop": excel_round_cop(values["valor_por_hora"]),
                "maxima_intensidad_mensual_raw": values["maxima_intensidad_mensual"],
                "maxima_intensidad_mensual_mostrada": excel_round_cop(values["maxima_intensidad_mensual"]),
                "archivo_origen": source["archivo"],
                "hoja_origen": source["hoja"],
                "fila_origen": row,
            }
            records.append(record)

    if len(records) != source["expected_records"]:
        raise ExtractionError(
            f"Cantidad de tarifas inválida: esperadas {source['expected_records']}, obtenidas {len(records)}.",
            source,
        )
    if len({record["plan_id"] for record in records}) != source["expected_plans"]:
        raise ExtractionError("Cantidad de planes inválida.", source)
    return records


def tariff_key(item: dict[str, Any]) -> tuple[Any, ...]:
    idioma = item.get("idioma_id") or (
        "FRANCES" if str(item.get("plan_id", "")).startswith("FRA_INST_") else "INGLES"
    )
    return (
        idioma,
        item.get("zona_id"),
        item.get("plan_id"),
        item.get("condicion_id"),
        item.get("numero_pagos"),
    )


def validate(records: list[dict[str, object]]) -> None:
    if len(records) != 750:
        raise ExtractionError(f"Se esperaban 750 tarifas y se obtuvieron {len(records)}.")
    keys = [tariff_key(item) for item in records]
    if len(set(keys)) != len(keys):
        raise ExtractionError("Existen claves tarifarias duplicadas.")

    expected = {
        ("INGLES", "REGIONALES"): (245, 15),
        ("INGLES", "CUND_ANT"): (245, 15),
        ("FRANCES", "REGIONALES"): (130, 10),
        ("FRANCES", "CUND_ANT"): (130, 10),
    }
    for (language, zone), (record_count, plan_count) in expected.items():
        subset = [
            item
            for item in records
            if item["idioma_id"] == language and item["zona_id"] == zone
        ]
        if len(subset) != record_count:
            raise ExtractionError(
                f"{language}/{zone}: esperadas {record_count} tarifas, obtenidas {len(subset)}."
            )
        if len({item["plan_id"] for item in subset}) != plan_count:
            raise ExtractionError(f"{language}/{zone}: cantidad de planes inválida.")
        if len({item["condicion_id"] for item in subset}) != 5:
            raise ExtractionError(f"{language}/{zone}: deben existir cinco condiciones.")

    for index, item in enumerate(records):
        missing = [field for field in REQUIRED_FIELDS if field not in item or item[field] in (None, "")]
        if missing:
            raise ExtractionError(
                "Registro normalizado incompleto: " + ", ".join(missing),
                row=int(item.get("fila_origen", index)),
            )
        if not isinstance(item["numero_pagos"], int) or item["numero_pagos"] < 1:
            raise ExtractionError("Número de pagos inválido.", row=int(item["fila_origen"]))
        for field in MONETARY_FIELDS:
            if not isinstance(item[field], int) or item[field] < 0:
                raise ExtractionError(
                    "Valor monetario oficial inválido.",
                    row=int(item["fila_origen"]),
                    field=field,
                )
        if item["valor_total_oficial_cop"] <= 0:
            raise ExtractionError(
                "El valor total oficial debe ser positivo.",
                row=int(item["fila_origen"]),
                field="valor_total_oficial_cop",
            )


def build_metadata(records: list[dict[str, object]], now: datetime) -> dict[str, Any]:
    return {
        "producto": "Smart Instituto",
        "version": "2026 V3",
        "actualizado_en": now.isoformat(timespec="minutes"),
        "actualizado_en_mostrado": now.strftime("%d/%m/%Y %I:%M %p"),
        "total_registros": len(records),
        "registros_por_idioma": {"INGLES": 490, "FRANCES": 260},
        "registros_por_idioma_y_zona": {
            "INGLES": {"REGIONALES": 245, "CUND_ANT": 245},
            "FRANCES": {"REGIONALES": 130, "CUND_ANT": 130},
        },
        "fuentes_autorizadas": [
            {
                "idioma_id": source["idioma_id"],
                "zona_id": source["zona_id"],
                "archivo": source["archivo"],
                "hoja": source["hoja"],
            }
            for source in SOURCES
        ],
    }


def javascript_content(records: list[dict[str, object]], metadata: dict[str, Any]) -> str:
    return (
        "/* Archivo generado por extractor_tarifas.py. No editar tarifas manualmente. */\n"
        "(function (global) {\n"
        f"  const metadata = {json.dumps(metadata, ensure_ascii=False, indent=2)};\n"
        f"  const tarifas = {json.dumps(records, ensure_ascii=False, indent=2)};\n"
        "  global.SMART_TARIFAS_META = Object.freeze(metadata);\n"
        "  global.SMART_TARIFAS = Object.freeze(tarifas.map(Object.freeze));\n"
        "})(typeof window !== 'undefined' ? window : globalThis);\n"
    )


def read_previous_records(path: Path) -> list[dict[str, Any]]:
    if not path.exists():
        return []
    content = path.read_text(encoding="utf-8")
    marker = "  const tarifas = "
    start = content.find(marker)
    if start < 0:
        raise ExtractionError("No fue posible leer el catálogo tarifas.js anterior.")
    start += len(marker)
    end = content.find(";\n  global.SMART_TARIFAS_META", start)
    if end < 0:
        raise ExtractionError("No fue posible delimitar el catálogo tarifas.js anterior.")
    return json.loads(content[start:end])


def comparable_record(record: dict[str, Any]) -> dict[str, Any]:
    ignored = {"idioma_id", "idioma_nombre", "producto_id"}
    return {key: value for key, value in record.items() if key not in ignored}


def compare_records(
    previous: list[dict[str, Any]], current: list[dict[str, Any]]
) -> dict[str, list[tuple[Any, ...]]]:
    old_map = {tariff_key(item): comparable_record(item) for item in previous}
    new_map = {tariff_key(item): comparable_record(item) for item in current}
    old_keys = set(old_map)
    new_keys = set(new_map)
    return {
        "nuevas": sorted(new_keys - old_keys),
        "eliminadas": sorted(old_keys - new_keys),
        "modificadas": sorted(
            key for key in old_keys & new_keys if old_map[key] != new_map[key]
        ),
    }


def format_key(key: tuple[Any, ...]) -> str:
    return " | ".join(str(value) for value in key)


def write_update_report(
    now: datetime,
    records: list[dict[str, object]],
    differences: dict[str, list[tuple[Any, ...]]],
    backup: Path | None,
) -> None:
    lines = [
        "# Reporte de actualización de tarifas",
        "",
        f"Fecha: **{now.strftime('%d/%m/%Y %I:%M %p')}**",
        "",
        f"- Total validado: **{len(records)}**.",
        "- Inglés: **490** (245 Regionales + 245 CUND_ANT).",
        "- Francés: **260** (130 Regionales + 130 CUND_ANT).",
        f"- Respaldo anterior: `{backup.relative_to(ROOT) if backup else 'No existía tarifas.js'}`.",
        "",
    ]
    labels = {
        "nuevas": "Tarifas nuevas",
        "eliminadas": "Tarifas eliminadas",
        "modificadas": "Tarifas modificadas",
    }
    for key, label in labels.items():
        items = differences[key]
        lines.extend([f"## {label} ({len(items)})", ""])
        lines.extend([f"- `{format_key(item)}`" for item in items] or ["- Ninguna."])
        lines.append("")
    (ROOT / "REPORTE_ACTUALIZACION_TARIFAS.md").write_text(
        "\n".join(lines), encoding="utf-8"
    )


def update_validation_report(
    now: datetime,
    differences: dict[str, list[tuple[Any, ...]]],
    backup: Path | None,
) -> None:
    """Actualiza el estado tarifario sin borrar el historial de validación."""
    report = ROOT / "REPORTE_VALIDACION.md"
    start = "<!-- ACTUALIZACION_TARIFAS_INICIO -->"
    end = "<!-- ACTUALIZACION_TARIFAS_FIN -->"
    block = "\n".join(
        [
            start,
            "## Última actualización segura de tarifas",
            "",
            f"- Fecha: **{now.strftime('%d/%m/%Y %I:%M %p')}**.",
            "- Catálogo validado: **750 tarifas** (490 de Inglés y 260 de Francés).",
            "- Zonas: Inglés 245 + 245; Francés 130 + 130.",
            f"- Nuevas: **{len(differences['nuevas'])}**; eliminadas: **{len(differences['eliminadas'])}**; modificadas: **{len(differences['modificadas'])}**.",
            f"- Respaldo previo: `{backup.relative_to(ROOT) if backup else 'No existía tarifas.js'}`.",
            "- Pruebas automatizadas: ejecutar `node pruebas.js` y registrar el resultado después de cada actualización.",
            "",
            end,
        ]
    )
    current = report.read_text(encoding="utf-8") if report.exists() else "# Reporte de validación\n"
    if start in current and end in current:
        before = current.split(start, 1)[0].rstrip()
        after = current.split(end, 1)[1].lstrip()
        updated = before + "\n\n" + block + ("\n\n" + after if after else "\n")
    else:
        updated = current.rstrip() + "\n\n" + block + "\n"
    temporary = ROOT / ".REPORTE_VALIDACION.md.tmp"
    try:
        temporary.write_text(updated, encoding="utf-8")
        temporary.replace(report)
    finally:
        if temporary.exists():
            temporary.unlink()


def write_error_report(error: Exception, now: datetime) -> None:
    lines = [
        "# Error de extracción de tarifas",
        "",
        f"Fecha: **{now.strftime('%d/%m/%Y %I:%M %p')}**",
        "",
        "`tarifas.js` anterior fue conservado sin cambios.",
        "",
        f"Causa: `{error}`",
        "",
    ]
    if isinstance(error, ExtractionError):
        if error.source:
            lines.append(f"- Archivo: `{error.source['archivo']}`")
            lines.append(f"- Hoja: `{error.source['hoja']}`")
        if error.row is not None:
            lines.append(f"- Fila: `{error.row}`")
        if error.field:
            lines.append(f"- Campo: `{error.field}`")
    (ROOT / "REPORTE_ERROR_EXTRACCION_TARIFAS.md").write_text(
        "\n".join(lines), encoding="utf-8"
    )


def safe_write_javascript(
    records: list[dict[str, object]], metadata: dict[str, Any], now: datetime
) -> tuple[Path, Path | None, dict[str, list[tuple[Any, ...]]]]:
    output = ROOT / "tarifas.js"
    previous = read_previous_records(output)
    backup: Path | None = None
    if output.exists():
        backup_dir = ROOT / "respaldos"
        backup_dir.mkdir(parents=True, exist_ok=True)
        backup = backup_dir / f"tarifas_{now.strftime('%Y-%m-%d_%H%M%S')}.js"
        shutil.copy2(output, backup)
    differences = compare_records(previous, records)

    temporary = ROOT / ".tarifas.js.tmp"
    try:
        temporary.write_text(javascript_content(records, metadata), encoding="utf-8")
        temporary.replace(output)
    finally:
        if temporary.exists():
            temporary.unlink()
    write_update_report(now, records, differences, backup)
    update_validation_report(now, differences, backup)
    return output, backup, differences


def main() -> None:
    now = datetime.now(TIME_ZONE)
    try:
        records: list[dict[str, object]] = []
        for source in SOURCES:
            records.extend(build_records(source))
        validate(records)
        metadata = build_metadata(records, now)
        output, backup, differences = safe_write_javascript(records, metadata, now)
        print(f"OK: {len(records)} tarifas validadas y guardadas en {output.name}")
        print(f"Respaldo: {backup.name if backup else 'no requerido'}")
        print(
            "Diferencias: "
            f"{len(differences['nuevas'])} nuevas, "
            f"{len(differences['eliminadas'])} eliminadas, "
            f"{len(differences['modificadas'])} modificadas"
        )
    except Exception as error:
        write_error_report(error, now)
        print(f"ERROR: {error}", file=sys.stderr)
        raise SystemExit(1) from error


if __name__ == "__main__":
    main()
