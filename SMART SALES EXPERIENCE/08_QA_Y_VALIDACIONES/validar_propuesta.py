#!/usr/bin/env python3
"""Auditoría estática de la Propuesta Comercial Premium."""

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
html = (ROOT / "index.html").read_text(encoding="utf-8")
css = (ROOT / "css" / "propuesta.css").read_text(encoding="utf-8")
print_css = (ROOT / "css" / "impresion.css").read_text(encoding="utf-8")
js = (ROOT / "js" / "propuesta.js").read_text(encoding="utf-8")
print_html = (ROOT / "print.html").read_text(encoding="utf-8")
print_js = (ROOT / "js" / "print.js").read_text(encoding="utf-8")
app_js = (ROOT / "js" / "aplicacion.js").read_text(encoding="utf-8")
config_js = (ROOT / "js" / "configuracion-comercial.js").read_text(encoding="utf-8")


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


checks = 0
require(html.count('class="propuesta-pagina ') == 1, "La propuesta no contiene un único documento continuo.")
checks += 1
require('id="propuesta-dialog"' in html and 'id="propuesta-preview"' in html, "Falta la vista previa.")
checks += 1
require("Preparar Propuesta Comercial" in app_js, "Falta la acción principal de preparación.")
checks += 1
require("Descargar PDF" not in html, "Permanece la acción antigua de PDF.")
checks += 1
for field in ("cliente-nombre", "asesor-nombre"):
    require(re.search(rf'<input[^>]*id="{field}"[^>]*>', html) is not None, f"Falta campo de personalización: {field}")
for field in ("cliente-telefono", "cliente-correo", "asesor-sede", "asesor-correo", "asesor-celular", "observaciones"):
    require(field not in html and field not in js, f"Permanece un campo eliminado: {field}")
formulario = re.search(r'<form id="formulario-propuesta">.*?</form>', html, re.S)
require(formulario is not None and "required" not in formulario.group(0), "La personalización conserva validaciones obligatorias.")
checks += 1
official_texts = (
    "Propuesta Comercial Personalizada",
    "Gracias por confiar en Smart.",
    "Hemos preparado esta propuesta de acuerdo con la información compartida durante tu proceso de asesoría.",
    "Aprende a tu ritmo con acceso flexible",
    "Avanza de forma progresiva con formación en vivo",
    "tu asesor estará disponible para acompañarte",
)
for value in official_texts:
    require(value in html or value in js, f"Falta contenido oficial: {value}")
checks += 1
require("Modalidad comercial" in js and "tipoTarifa" in js, "Score/MP no tiene contexto comercial.")
checks += 1
require("logo-smart.svg.png" in config_js and "logoDisponible: true" in config_js and 'class="marca-app__logo"' in html, "Logo oficial no está activo en Hub y propuesta.")
checks += 1
require("documento-amortizacion" in js and "propuesta-amortizacion-total" in js, "Falta la amortización completa y reconciliada.")
checks += 1
require("@page" not in css and "break-after: auto" in css and "@page { size: 8.5in 13in; margin: .3in; }" in print_css, "Impresión Oficio continua incompleta o conflictiva.")
checks += 1
require("@media (max-width: 850px)" in css and "@media (max-width: 560px)" in css, "Responsive incompleto.")
checks += 1
for forbidden in ("fetch(", "localStorage", "http://", "https://"):
    require(forbidden not in js, f"Dependencia o persistencia prohibida: {forbidden}")
require('sessionStorage.setItem("smart.propuesta.impresion"' in js, "Falta la transferencia temporal hacia print.html.")
checks += 1
require("smart:cotizacion" in js and "planPagos" in js, "La propuesta no consume la cotización validada.")
checks += 1
for label in ("Primera cuota y fecha", "Número de cuotas", "Cuotas posteriores", "Segunda fecha de pago", "Día habitual de pago", "Última cuota y fecha", "Valor total"):
    require(label in js, f"Falta dato del resumen financiero: {label}")
checks += 1
require("Beneficios incluidos en tu propuesta" in html and "beneficio.nombrePresentacion || beneficio.nombre" in js and "esNinguno !== true" not in js, "La propuesta no conserva exactamente los beneficios seleccionados.")
checks += 1
require(all(valor in config_js for valor in ("ebookUnitario: 152000", "1: 170000", "2: 304000", "4: 456000", '"curso-business": 823800', '"curso-chef": 549200', '"curso-office": 755400')), "Valores oficiales de beneficios incompletos.")
checks += 1
require("valorComercialBeneficios" in js and "propuesta-valor-recibido" in js and "Tu ahorro total" in js and "Beneficios incluidos" in js, "Narrativa ejecutiva o resumen financiero incompletos.")
checks += 1
require("Página 1" not in html and "Página 2" not in html and "propuesta-paginador" not in css, "La propuesta conserva conceptos visibles de paginación.")
checks += 1
require('new URL("print.html"' in js and 'id="imprimir-documento"' in print_html and "window.print()" in print_js, "Flujo de impresión independiente incompleto.")
checks += 1

print({"resultado": "APROBADO", "comprobaciones": checks, "documentos_continuos": 1, "formato": "Oficio 8.5x13", "campos_personalizacion": 2})
