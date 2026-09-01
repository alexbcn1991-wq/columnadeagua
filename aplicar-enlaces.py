#!/usr/bin/env python3
"""
Aplica los enlaces de afiliado de Amazon definidos en enlaces.txt.

Uso:
    1. Abre enlaces.txt y pega, después de cada '=', el ASIN o la URL de Amazon.es
    2. python3 aplicar-enlaces.py
    3. Sube los ficheros modificados

Es idempotente: puedes ejecutarlo tantas veces como quieras. Los slots
vacíos se dejan como están, así que puedes ir rellenando poco a poco.
"""
import re
import sys
from pathlib import Path

TAG = "alex19910c-21"
BASE = Path(__file__).parent


def extraer_asin(valor: str):
    """Acepta un ASIN suelto o cualquier URL de Amazon y devuelve el ASIN."""
    valor = valor.strip()
    if not valor:
        return None
    if re.fullmatch(r"[A-Z0-9]{10}", valor):
        return valor
    m = re.search(r"/(?:dp|gp/product|gp/aw/d)/([A-Z0-9]{10})", valor)
    if m:
        return m.group(1)
    m = re.search(r"\b([A-Z0-9]{10})\b", valor)
    return m.group(1) if m else None


def leer_config():
    """Devuelve {(fichero, indice): url_afiliado}"""
    ruta = BASE / "enlaces.txt"
    if not ruta.exists():
        sys.exit("No encuentro enlaces.txt")
    conf, errores = {}, []
    for n, linea in enumerate(ruta.read_text(encoding="utf-8").splitlines(), 1):
        linea = linea.strip()
        if not linea or linea.startswith("#") or "=" not in linea:
            continue
        clave, valor = linea.split("=", 1)
        if "|" not in clave:
            continue
        fichero, indice = clave.strip().split("|")
        asin = extraer_asin(valor)
        if valor.strip() and not asin:
            errores.append(f"  línea {n}: no reconozco un ASIN en «{valor.strip()[:60]}»")
            continue
        if asin:
            conf[(fichero, int(indice))] = f"https://www.amazon.es/dp/{asin}?tag={TAG}"
    if errores:
        print("Avisos:")
        print("\n".join(errores))
    return conf


def aplicar(conf):
    ficheros = sorted({f for f, _ in conf})
    total = 0
    for fichero in ficheros:
        ruta = BASE / fichero
        if not ruta.exists():
            print(f"  ! no existe {fichero}")
            continue
        html = ruta.read_text(encoding="utf-8")
        indice = [0]
        cambios = [0]

        def repl(m):
            i = indice[0]
            indice[0] += 1
            url = conf.get((fichero, i))
            if not url:
                return m.group(0)
            cambios[0] += 1
            return m.group(0).replace('href="#"', f'href="{url}"')

        html = re.sub(r'<a class="gbtn[^"]*" href="#"[^>]*>', repl, html)
        if cambios[0]:
            ruta.write_text(html, encoding="utf-8")
            print(f"  {fichero}: {cambios[0]} enlaces aplicados")
            total += cambios[0]
    return total


def pendientes():
    """Cuenta los botones que siguen sin enlace en todo el sitio."""
    n = 0
    for ruta in list(BASE.glob("*.html")) + list(BASE.glob("*/index.html")) + list(BASE.glob("*/*/index.html")):
        n += len(re.findall(r'<a class="gbtn[^"]*" href="#"', ruta.read_text(encoding="utf-8")))
    return n


if __name__ == "__main__":
    conf = leer_config()
    if not conf:
        sys.exit("enlaces.txt no tiene ningún enlace relleno todavía.")
    print(f"Aplicando {len(conf)} enlaces con el tag {TAG}...")
    total = aplicar(conf)
    print(f"\nTotal aplicados: {total}")
    print(f"Botones aún sin enlace en la web: {pendientes()}")
