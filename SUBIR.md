# Cómo subir sin romper nada

## El problema
Todas las páginas se llaman `index.html`. Lo que las diferencia es la CARPETA.
Si arrastras ficheros sueltos a la raíz de GitHub, se machacan entre ellos.

## La forma correcta (git) — recomendada
Desde la carpeta del proyecto, una sola vez:

    git init
    git remote add origin https://github.com/alexbcn1991-wq/columnadeagua.git
    git branch -M main

Y cada vez que actualices:

    git add .
    git commit -m "actualización"
    git push

Git respeta la estructura siempre. Es imposible equivocarse de carpeta.

## Si subes por la web de GitHub
Arrastra las CARPETAS sin abrir, nunca su contenido:

    assets/  equipo/  guias/  contacto/
    sobre-columna-de-agua/  aviso-legal-y-privacidad/

Y aparte, solo estos ficheros en la raíz:

    index.html  404.html  CNAME  .nojekyll
    robots.txt  sitemap.xml  README.md  SUBIR.md
    enlaces.txt  aplicar-enlaces.py

## Comprobación después de subir
Abre columnadeagua.com. El titular debe decir:

    "Equipo de arrecife elegido en serio."

Si dice otra cosa, la home está machacada: vuelve a subir index.html a la raíz.
