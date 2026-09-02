#!/usr/bin/env python3
"""Valida por HTTP las rutas estáticas incluidas en el deployment raíz."""

from __future__ import annotations

import argparse
import re
import urllib.error
import urllib.parse
import urllib.request
from collections import deque
from html.parser import HTMLParser


RUTAS_OBLIGATORIAS = (
    "SMART_SALES_EXPERIENCE/index.html",
    "SMART_SALES_EXPERIENCE/summary.html",
    "SMART_SALES_HUB_PRODUCCION_FINAL/index.html",
    "SMART_SALES_HUB_PRODUCCION_FINAL/print.html",
)


class ReferenciasHTML(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.referencias: list[str] = []

    def handle_starttag(self, _tag: str, attrs: list[tuple[str, str | None]]) -> None:
        valores = dict(attrs)
        for atributo in ("src", "href"):
            if valores.get(atributo):
                self.referencias.append(valores[atributo] or "")


def es_recurso_local(url: str, origen: str) -> bool:
    destino = urllib.parse.urlparse(url)
    base = urllib.parse.urlparse(origen)
    return destino.scheme in {"", "http", "https"} and destino.netloc in {"", base.netloc}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", default="http://127.0.0.1:4174/")
    args = parser.parse_args()
    base_url = args.base_url.rstrip("/") + "/"
    pendientes = deque(urllib.parse.urljoin(base_url, ruta) for ruta in RUTAS_OBLIGATORIAS)
    visitadas: set[str] = set()
    errores: list[tuple[str, int | str]] = []

    while pendientes:
        url = urllib.parse.urldefrag(pendientes.popleft())[0]
        if url in visitadas or not es_recurso_local(url, base_url):
            continue
        visitadas.add(url)
        try:
            with urllib.request.urlopen(url, timeout=10) as respuesta:
                estado = respuesta.status
                tipo = respuesta.headers.get_content_type()
                contenido = respuesta.read()
        except urllib.error.HTTPError as error:
            errores.append((url, error.code))
            continue
        except urllib.error.URLError as error:
            errores.append((url, str(error.reason)))
            continue
        if estado >= 400:
            errores.append((url, estado))
            continue

        texto = contenido.decode("utf-8", errors="replace")
        referencias: list[str] = []
        if tipo == "text/html" or url.endswith(".html"):
            lector = ReferenciasHTML()
            lector.feed(texto)
            referencias.extend(lector.referencias)
        if tipo == "text/css" or url.endswith(".css"):
            referencias.extend(re.findall(r"url\(\s*['\"]?([^'\")]+)", texto, re.IGNORECASE))

        for referencia in referencias:
            if referencia.startswith(("#", "data:", "mailto:", "tel:", "javascript:")):
                continue
            destino = urllib.parse.urljoin(url, referencia)
            if es_recurso_local(destino, base_url):
                pendientes.append(destino)

    print(f"Rutas verificadas: {len(visitadas)}")
    print(f"404/errores HTTP: {len(errores)}")
    for url, estado in errores:
        print(f"- {estado}: {url}")
    return 1 if errores else 0


if __name__ == "__main__":
    raise SystemExit(main())
