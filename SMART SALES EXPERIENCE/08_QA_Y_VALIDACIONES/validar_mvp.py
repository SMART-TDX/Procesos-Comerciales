#!/usr/bin/env python3
"""Auditoría reproducible del MVP estático y su catálogo publicable."""

from __future__ import annotations

import json
import hashlib
import re
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]


class HtmlAudit(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.ids: list[str] = []
        self.labels_for: list[str] = []
        self.select_ids: list[str] = []
        self.local_assets: list[str] = []
        self.external_assets: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if values.get("id"):
            self.ids.append(values["id"] or "")
        if tag == "label" and values.get("for"):
            self.labels_for.append(values["for"] or "")
        if tag == "select" and values.get("id"):
            self.select_ids.append(values["id"] or "")
        if tag in {"script", "link", "img"}:
            source = values.get("src") or values.get("href")
            if source:
                if re.match(r"^(?:https?:)?//", source, re.IGNORECASE):
                    self.external_assets.append(source)
                else:
                    self.local_assets.append(source)


def load_catalog() -> dict[str, Any]:
    text = (ROOT / "js" / "tarifas.js").read_text(encoding="utf-8")
    match = re.search(r"Object\.freeze\((\{.*\})\);\s*$", text, re.DOTALL)
    if not match:
        raise AssertionError("No se pudo leer el catálogo generado.")
    return json.loads(match.group(1))


def assert_true(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def main() -> int:
    checks = 0
    html_path = ROOT / "index.html"
    html_text = html_path.read_text(encoding="utf-8")
    audit = HtmlAudit()
    audit.feed(html_text)

    duplicates = [item for item, count in Counter(audit.ids).items() if count > 1]
    assert_true(not duplicates, f"IDs HTML duplicados: {duplicates}")
    checks += 1
    assert_true(set(audit.select_ids).issubset(set(audit.labels_for)), "Hay selectores sin label asociado.")
    checks += 1
    assert_true(not audit.external_assets, f"Recursos externos detectados: {audit.external_assets}")
    checks += 1
    for asset in audit.local_assets:
        assert_true((ROOT / asset).is_file(), f"Recurso local inexistente: {asset}")
    checks += 1

    executable_files = [
        ROOT / "index.html",
        ROOT / "css" / "estilos.css",
        ROOT / "css" / "propuesta.css",
        ROOT / "js" / "aplicacion.js",
        ROOT / "js" / "propuesta.js",
        ROOT / "js" / "validaciones.js",
        ROOT / "js" / "tarifas.js",
    ]
    combined = "\n".join(path.read_text(encoding="utf-8") for path in executable_files)
    forbidden = {
        "fetch": r"\bfetch\s*\(",
        "URL externa": r"https?://",
        "React": r"\bReact\b",
        "Angular": r"\bAngular\b",
        "Vue": r"\bVue\b",
    }
    # Los SVG embebidos en data: son recursos locales, no conexiones externas.
    combined_without_data_icons = re.sub(r'data:image/svg\+xml,[^"\)]*', '', combined)
    detected = [name for name, pattern in forbidden.items() if re.search(pattern, combined_without_data_icons, re.IGNORECASE)]
    assert_true(not detected, f"Tecnologías o conexiones prohibidas: {detected}")
    checks += 1

    catalog = load_catalog()
    records = catalog["registros"]
    normalized_model = json.loads(
        (ROOT / "datos" / "modelo_tarifas_normalizado.json").read_text(encoding="utf-8")
    )
    normalized_by_id = {record["id"]: record for record in normalized_model["registros"]}
    for source_file in normalized_model["metadatos"]["archivos"]:
        original = ROOT / "ORIGINALES_NO_MODIFICAR" / source_file["archivo"]
        actual_hash = hashlib.sha256(original.read_bytes()).hexdigest()
        assert_true(actual_hash == source_file["sha256"], f"Excel original modificado: {source_file['archivo']}")
    checks += 1
    assert_true(len(records) == catalog["metadatos"]["registrosPublicados"] == 415, "Conteo publicable inesperado.")
    checks += 1
    assert_true({record["linea"] for record in records} == {"SMART_FLEX", "SMART_ONLINE"}, "Líneas incorrectas.")
    checks += 1
    assert_true(all(record["valorTotal"] is not None and record["valorTotal"] >= 0 for record in records), "Total inválido.")
    checks += 1
    assert_true(all(record["cuotas"] and record["cuotas"] >= 1 for record in records), "Cuotas inválidas.")
    checks += 1
    assert_true(
        all(record["nivelIngreso"] for record in records if record["linea"] == "SMART_FLEX"),
        "Smart Flex sin nivel de ingreso.",
    )
    checks += 1

    value_mapping = {
        "descuento": "descuento",
        "valorFullPlan": "valor_full_plan",
        "cuotaInicial": "cuota_inicial",
        "valorCuota": "valor_cuota",
        "valorTotal": "valor_total",
        "valorHora": "valor_hora",
        "intensidadMensual": "intensidad_mensual",
        "cuotas": "numero_cuotas",
    }
    for published in records:
        source = normalized_by_id.get(published["_origenId"])
        assert_true(source is not None, f"Origen inexistente: {published['id']}")
        assert_true(
            source["estado_validacion"] in {"VALIDO", "CON_ADVERTENCIA"},
            f"Se publicó un origen inválido: {source['id']}",
        )
        for public_field, source_field in value_mapping.items():
            assert_true(
                published[public_field] == source[source_field],
                f"Valor alterado en {published['id']}: {public_field}",
            )
    checks += 1
    assert_true(
        all(record["nivelIngreso"] is None for record in records if record["linea"] == "SMART_ONLINE"),
        "Smart Online contiene nivel de ingreso inesperado.",
    )
    checks += 1
    assert_true(
        {record["meses"] for record in records if record["linea"] == "SMART_ONLINE"} == {6, 9, 12}
        and all(record["horas"] is None and record["tipoTarifa"] is None for record in records if record["linea"] == "SMART_ONLINE"),
        "Smart Online no conserva exclusivamente sus planes mensuales.",
    )
    checks += 1
    assert_true(
        {record["tipoTarifa"] for record in records if record["linea"] == "SMART_FLEX"} == {"SCORE", "MP"},
        "Smart Flex no contiene ambos tipos de tarifa.",
    )
    checks += 1
    assert_true(
        all(record["condicion"] != "Preventa" for record in records if record["tipoTarifa"] == "MP"),
        "Smart Flex MP contiene Preventa.",
    )
    checks += 1
    assert_true(
        all(not re.search(r"horas\s+(?:reloj|acad[eé]micas)", record["plan"], re.IGNORECASE) for record in records),
        "Una etiqueta pública conserva terminología de horas no permitida.",
    )
    checks += 1
    assert_true(
        sum(bool(record["_observacionInterna"]) for record in records) == 3,
        "Conteo inesperado de observaciones internas publicadas.",
    )
    checks += 1
    assert_true(
        all(
            record["_trazabilidad"].get("archivo")
            and record["_trazabilidad"].get("hoja")
            and record["_trazabilidad"].get("fila")
            for record in records
        ),
        "Hay tarifas publicadas sin trazabilidad.",
    )
    checks += 1

    quotation_keys = [
        (
            record["linea"],
            record["nivelIngreso"],
            record["tipoTarifa"],
            record["planId"],
            record["condicion"],
            record["formaPago"],
            record["cuotas"],
        )
        for record in records
    ]
    assert_true(len(quotation_keys) == len(set(quotation_keys)), "Existen cotizaciones ambiguas.")
    checks += 1

    plan_labels: dict[tuple[Any, ...], set[str]] = {}
    for record in records:
        key = (record["linea"], record["nivelIngreso"], record["tipoTarifa"], record["plan"].casefold())
        plan_labels.setdefault(key, set()).add(record["planId"])
    assert_true(all(len(ids) == 1 for ids in plan_labels.values()), "Hay planes indistinguibles en la interfaz.")
    checks += 1

    for months in (6, 9, 12):
        methods = {record["formaPago"] for record in records if record["linea"] == "SMART_ONLINE" and record["meses"] == months}
        assert_true(methods == {"CONTADO", "FINANCIADO"}, f"Smart Online {months} meses no ofrece contado y financiado.")
    online_12_cash = next(record for record in records if record["linea"] == "SMART_ONLINE" and record["meses"] == 12 and record["condicion"] == "Público" and record["formaPago"] == "CONTADO")
    assert_true(online_12_cash["valorTotal"] == 1325700 and online_12_cash["_trazabilidad"]["fila"] == 19, "El contado público de Smart Online 12 meses no conserva la fila 19 oficial.")
    checks += 1

    expected_score = {"A1": 5, "A2": 4, "B1": 3, "B2": 2, "C1": 1}
    for level, expected in expected_score.items():
        plans = {record["planId"] for record in records if record["linea"] == "SMART_FLEX" and record["tipoTarifa"] == "SCORE" and record["nivelIngreso"] == level}
        assert_true(len(plans) == expected, f"Conteo Score incorrecto para {level}: {len(plans)}")
    checks += 1

    mp_a1_one_level = {record["planId"] for record in records if record["tipoTarifa"] == "MP" and record["nivelIngreso"] == "A1" and record["niveles"] == ["A1"] and record["plan"].casefold().startswith("plan 1 nivel")}
    assert_true(len(mp_a1_one_level) == 1, "MP A1 conserva duplicado el plan de un nivel A1.")
    checks += 1

    assert_true(catalog["metadatos"]["exclusiones"] == {
        "condicion_no_activa": 36,
        "fuera_alcance_mvp": 5,
        "origen_mp_equivalente": 40,
        "pago_unico_duplicado": 3,
        "registro_invalido": 181,
    }, "Las exclusiones del MVP cambiaron.")
    checks += 1

    print(json.dumps({
        "resultado": "APROBADO",
        "comprobaciones": checks,
        "registros_publicados": len(records),
        "smart_flex": sum(record["linea"] == "SMART_FLEX" for record in records),
        "smart_online": sum(record["linea"] == "SMART_ONLINE" for record in records),
        "observaciones_internas": sum(bool(record["_observacionInterna"]) for record in records),
        "trazabilidad_incompleta": 0,
        "cotizaciones_ambiguas": 0,
    }, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
