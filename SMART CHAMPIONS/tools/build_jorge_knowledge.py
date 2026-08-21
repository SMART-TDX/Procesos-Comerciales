"""Construye el índice textual local de Jorge Intelligence desde fuentes oficiales.

No llama servicios externos, no genera embeddings y no copia datos de clientes.
"""

from __future__ import annotations

import hashlib
import json
import re
import sys
import unicodedata
from datetime import date
from pathlib import Path


DOMAIN_BY_SOURCE = {
    "Consultas_SAC_Proceso_Atencion.docx": "SMART_PROCESS_ROUTER",
    "COM_MER-ANX-006_Anexo Portafolio Comercial Instituto_V1_16032026.pdf": "PRODUCT_INSTITUTE",
    "examenes internacionales.xlsx": "SMART_EXAMS",
    "manejo de objeciones.xlsx": "SMART_OBJECTIONS",
    "SEDES SMART.xlsx": "SMART_LOCATIONS",
    "Portafolio Smart Flex (1).pdf": "PRODUCT_FLEX",
    "Portafolio Smart Online (1).pdf": "PRODUCT_ONLINE",
    "politicas-operacion-telemercadeo-2026.pdf": "TMK_PLAYBOOK",
    "politica-gestion-medicion-desempeno-tmk.pdf": "TMK_PLAYBOOK",
}

MATRIX_DOMAINS = {
    "Chat": "SMART_CONVERSATION",
    "Llamadas": "TMK_PLAYBOOK",
    "Sedes Smart": "SMART_LOCATIONS",
    "Objeciones": "SMART_OBJECTIONS",
    "Examenes y Preparacion": "SMART_EXAMS",
    "SMART FLEX": "PRODUCT_FLEX",
    "PRESENCIAL INGLES": "PRODUCT_INSTITUTE",
    "PRESENCIAL FRANCES": "PRODUCT_INSTITUTE",
    "SMART ON LINE": "PRODUCT_ONLINE",
    "CITA VIRTUAL": "SMART_CONVERSATION",
}

SOURCE_PRIORITY = {
    "DOCUMENTO_OFICIAL": 100,
    "POLITICA_INSTITUCIONAL": 95,
    "DIRECCION": 90,
    "MATRIZ_COMUNICACION": 80,
    "BASE_COMPLEMENTARIA": 70,
}


def compact(value: str) -> str:
    value = unicodedata.normalize("NFKC", str(value or ""))
    value = value.replace("\u00a0", " ")
    value = re.sub(r"\s+", " ", value).strip()
    return value


def sanitize(value: str) -> str:
    value = compact(value)
    value = re.sub(r"\b[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}\b", "[CORREO_INSTITUCIONAL_EN_FUENTE]", value)
    value = re.sub(r"(?<!\d)(?:\+?57\s*)?(?:3\d{2}|60[124-8])(?:[\s.-]*\d){7}(?!\d)", "[TELEFONO_INSTITUCIONAL_EN_FUENTE]", value)
    value = re.sub(r"https://docs\.google\.com/\S+", "[ENLACE_INTERNO_EN_FUENTE]", value)
    value = re.sub(r"\b(?:Nombre|E-?Mail|Tel[eé]fono):\s*x+\b", "[DATO_NO_ALMACENADO]", value, flags=re.I)
    value = re.sub(r"promedio las cuotas[^.]*?por mes", "[VALOR OMITIDO: VIGENCIA NO VALIDADA]", value, flags=re.I)
    return value


def content_hash(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def source_class(name: str) -> str:
    if "politica" in name.lower():
        return "POLITICA_INSTITUCIONAL"
    if name == "matriz-de-comunicacion.xlsx":
        return "MATRIZ_COMUNICACION"
    if name in {"SEDES SMART.xlsx", "examenes internacionales.xlsx", "manejo de objeciones.xlsx"}:
        return "BASE_COMPLEMENTARIA"
    return "DOCUMENTO_OFICIAL"


def make_record(records, seen, *, domain, subdomain, title, content, source_name,
                location, kind="FACT", status="VIGENTE", validation="2026-08-13",
                valid_from="PENDIENTE_VALIDACION", valid_until="PENDIENTE_VALIDACION"):
    text = sanitize(content)
    if len(text) < 12 or text.startswith("=+"):
        return
    digest = content_hash(f"{domain}|{text.lower()}")
    if digest in seen:
        return
    seen.add(digest)
    category = source_class(source_name)
    records.append({
        "KnowledgeID": f"K-{len(records) + 1:05d}",
        "Dominio": domain,
        "Subdominio": compact(subdomain) or "GENERAL",
        "Producto": {
            "PRODUCT_INSTITUTE": "INSTITUTO",
            "PRODUCT_ONLINE": "SMART_ONLINE",
            "PRODUCT_FLEX": "SMART_FLEX",
        }.get(domain, "TRANSVERSAL"),
        "Tipo": kind,
        "Titulo": compact(title)[:180],
        "Contenido": text,
        "Resumen": text[:280],
        "Fuente": category,
        "Documento": source_name,
        "Ubicacion": compact(location),
        "FechaDocumento": "PENDIENTE_VALIDACION",
        "VigenteDesde": valid_from,
        "VigenteHasta": valid_until,
        "Estado": status,
        "Prioridad": SOURCE_PRIORITY[category],
        "FechaValidacion": validation,
        "Confidencialidad": "INTERNO",
        "ContentHash": digest,
    })


def row_text(values):
    clean = [compact(v) for v in values if compact(v) and not compact(v).startswith("=+")]
    return " | ".join(clean)


def add_direction_records(records, seen):
    items = [
        ("SMART_CORE", "OBJETIVO", "Objetivo de Jorge", "Jorge orienta la gestión de Telemercadeo para programar una cita calificada con el ejecutivo de cuenta. No cierra matrículas.", "FACT"),
        ("SMART_CORE", "VERDAD", "Hechos y estrategia", "Los hechos institucionales requieren una fuente vigente. Las estrategias conversacionales pueden construirse dentro de reglas aprobadas y no pueden alterar hechos Smart.", "FACT"),
        ("SMART_COMPLIANCE", "NO_CONTACT", "Solicitud de no contacto", "Una solicitud expresa de no contacto bloquea cualquier recomendación comercial. Se debe finalizar respetuosamente y aplicar el proceso institucional.", "FACT"),
        ("SMART_COMPLIANCE", "DATA_DELETION", "Solicitud de eliminación", "Una solicitud de eliminación de datos debe remitirse al proceso institucional y no debe utilizarse para continuar la gestión comercial.", "FACT"),
        ("SMART_COMPLIANCE", "DATA_ORIGIN", "Origen del dato", "No se debe afirmar el origen de un dato sin soporte verificable. La inquietud debe registrarse y validarse por el proceso institucional.", "FACT"),
        ("SMART_COMPLIANCE", "PRIVACY", "Privacidad", "No deben enviarse a proveedores externos nombres completos, teléfonos, correos, documentos, información financiera, contratos o credenciales innecesarias.", "FACT"),
        ("SMART_COMPLIANCE", "CURRENT_STUDENT", "Estudiante actual", "Las solicitudes de estudiantes actuales deben identificarse y enrutarse al proceso o canal oficial correspondiente; no deben tratarse como una nueva oportunidad comercial sin validación.", "FACT"),
        ("SMART_COMPLIANCE", "SAC_ROUTE", "Ruta SAC", "Las consultas de Servicio al Cliente deben seguir la orientación y remisión establecidas en el proceso oficial de SAC.", "FACT"),
        ("SMART_CONVERSATION", "ESTRATEGIA", "Pregunta de precisión", "Cuando falte información, formula una pregunta breve que permita identificar la barrera principal antes de recomendar una acción.", "STRATEGY"),
        ("DYNAMIC_COMMERCIAL", "GOBIERNO", "Condiciones comerciales dinámicas", "Las campañas, promociones, tarifas y condiciones solo pueden utilizarse cuando exista una fuente vigente y aprobada. Si no hay evidencia suficiente, Jorge debe remitir a validación con el ejecutivo.", "FACT"),
    ]
    for domain, subdomain, title, content, kind in items:
        make_record(records, seen, domain=domain, subdomain=subdomain, title=title,
                    content=content, source_name="Autorización Dirección Fase 2A",
                    location="Secciones 1, 10 y 11", kind=kind)


def build(extracted):
    records, seen = [], set()
    add_direction_records(records, seen)
    source_registry = []
    for source in extracted:
        name, data = source["name"], source["data"]
        category = source_class(name)
        source_registry.append({
            "Documento": name,
            "Tipo": data["type"],
            "Fuente": category,
            "Prioridad": SOURCE_PRIORITY[category],
            "EstadoExtraccion": "PROCESADO",
        })
        if name == "COM_MER-ANX-006_Anexo Portafolio Comercial Instituto_V1_16032026.pdf" and not any(p["text"] for p in data["pages"]):
            source_registry[-1]["EstadoExtraccion"] = "CATALOGADO_SIN_TEXTO_EXTRAIBLE"
            continue
        if data["type"] == "pdf":
            domain = DOMAIN_BY_SOURCE[name]
            for page in data["pages"]:
                if page["text"]:
                    make_record(records, seen, domain=domain, subdomain=f"PAGINA_{page['page']}",
                                title=f"{name} - página {page['page']}", content=page["text"],
                                source_name=name, location=f"Página {page['page']}")
        elif data["type"] == "docx":
            domain = DOMAIN_BY_SOURCE[name]
            for index, paragraph in enumerate(data["paragraphs"], 1):
                make_record(records, seen, domain=domain, subdomain="LINEAMIENTO",
                            title=f"Lineamiento SAC {index}", content=paragraph,
                            source_name=name, location=f"Párrafo {index}")
            for table in data["tables"]:
                for row in table["rows"]:
                    make_record(records, seen, domain=domain, subdomain="CONSULTA_SAC",
                                title=f"Consulta SAC {row['row']}", content=row_text(row["values"]),
                                source_name=name, location=f"Tabla {table['table']}, fila {row['row']}")
        elif data["type"] == "xlsx":
            for sheet in data["sheets"]:
                sheet_name = compact(sheet["sheet"])
                if name == "matriz-de-comunicacion.xlsx":
                    if sheet_name == "Varios De La Operacion":
                        continue
                    domain = MATRIX_DOMAINS.get(sheet_name)
                elif name == "SEDES SMART.xlsx":
                    domain = "SMART_LOCATIONS" if sheet_name == "Sedes Smart" else MATRIX_DOMAINS.get(sheet_name)
                    if sheet_name == "Varios De La Operacion":
                        domain = None
                else:
                    domain = DOMAIN_BY_SOURCE[name]
                if not domain:
                    continue
                for row in sheet["rows"]:
                    content = row_text(row["values"])
                    kind = "STRATEGY" if domain == "SMART_OBJECTIONS" else "FACT"
                    make_record(records, seen, domain=domain, subdomain=sheet_name,
                                title=f"{sheet_name} - fila {row['row']}", content=content,
                                source_name=name, location=f"Hoja {sheet['sheet']}, fila {row['row']}", kind=kind)
    domain_counts = {}
    for record in records:
        domain_counts[record["Dominio"]] = domain_counts.get(record["Dominio"], 0) + 1
    return {
        "schemaVersion": "2.0.0",
        "generatedAt": f"{date.today().isoformat()}T00:00:00-05:00",
        "generationMode": "LOCAL_TEXTUAL_NO_EMBEDDINGS",
        "remoteAI": False,
        "sources": source_registry,
        "domainCounts": domain_counts,
        "records": records,
    }


def main():
    extracted_path = Path(sys.argv[1])
    output_path = Path(sys.argv[2])
    extracted = json.loads(extracted_path.read_text(encoding="utf-8"))
    result = build(extracted)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    browser_path = output_path.with_suffix(".js")
    browser_path.write_text(
        "(function(g){'use strict';g.JORGE_KNOWLEDGE_BASE="
        + json.dumps(result, ensure_ascii=False, separators=(",", ":"))
        + ";})(typeof window!=='undefined'?window:globalThis);\n",
        encoding="utf-8",
    )
    print(json.dumps({"records": len(result["records"]), "domains": result["domainCounts"]}, ensure_ascii=False))


if __name__ == "__main__":
    main()
