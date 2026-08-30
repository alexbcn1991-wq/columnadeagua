# Columna de Agua

Web de contenido y afiliación sobre acuariofilia marina. HTML estático, sin dependencias ni build. Se sirve desde GitHub Pages en columnadeagua.com.

## Estructura

```
index.html                                   Home
404.html                                     Página de error
CNAME                                        Dominio personalizado
.nojekyll                                    Desactiva el procesado Jekyll
robots.txt  ·  sitemap.xml                   Indexación
assets/style.css                             Hoja de estilos global
assets/sequence.css                          Estilos del módulo de scroll (solo la guía de montaje)
assets/favicon.svg                           Icono del sitio
equipo/index.html                            Hub de equipo
equipo/<slug>/index.html                     Análisis de producto
guias/index.html                             Hub de guías
guias/montar-nano-reef-paso-a-paso/          Guía con secuencia animada
especies/  ·  calculadoras/                  Pendientes
sobre-columna-de-agua/  ·  contacto/         Método y contacto
aviso-legal-y-privacidad/                    Legal
```

Cada página nueva es una carpeta con `index.html` dentro, para que la URL acabe en barra y sin extensión.

---

## 1. Subir a GitHub

Crea un repositorio **público** llamado `columnadeagua`. Desde la carpeta del proyecto:

```bash
git init
git add .
git commit -m "Primera versión: home, artículo, legales"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/columnadeagua.git
git push -u origin main
```

## 2. Activar GitHub Pages

En el repositorio: **Settings → Pages**.

- Source: `Deploy from a branch`
- Branch: `main`, carpeta `/ (root)`
- Guardar

Al minuto tendrás el sitio en `https://TU-USUARIO.github.io/columnadeagua/`.

## 3. Conectar el dominio

En **Settings → Pages → Custom domain**, escribe `columnadeagua.com` y guarda. El fichero `CNAME` ya está en el repositorio, así que debería detectarlo solo.

En el panel DNS de tu registrador, crea estos registros:

| Tipo | Nombre | Valor |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | TU-USUARIO.github.io |

Borra cualquier registro A o CNAME previo en `@` y `www` que haya puesto el registrador (páginas de aparcamiento, redirecciones).

La propagación tarda de 10 minutos a 24 horas. Cuando GitHub valide el dominio, marca **Enforce HTTPS** en la misma pantalla. No publiques enlaces hasta que HTTPS esté activo.

Nota: GitHub Pages no hace redirecciones del lado del servidor. Elige ahora si la versión canónica es el dominio raíz (recomendado, es lo que está configurado en los `canonical`) y no lo cambies después.

---

## 4. Antes de publicar

- [ ] Rellenar los campos `[NOMBRE Y APELLIDOS]`, `[NIF]`, `[DIRECCIÓN POSTAL]` y `[TU CORREO]` en `aviso-legal-y-privacidad/index.html`
- [ ] Configurar el correo `hola@columnadeagua.com` o cambiarlo en `contacto/index.html`
- [ ] Añadir el dominio `columnadeagua.com` a la lista de sitios web de tu cuenta de Amazon Afiliados
- [ ] Crear un **tracking ID nuevo** para este sitio, distinto del que ya usas
- [ ] Sustituir los `href="#"` de los botones "Ver en Amazon" por los enlaces reales con ese tracking ID
- [ ] Borrar o corregir los enlaces sociales del pie si no vas a crear esas cuentas
- [ ] Quitar los recuentos de análisis de las tarjetas de categoría hasta que los artículos existan
- [ ] Dar de alta el sitio en Google Search Console y enviar `sitemap.xml`

## 5. Al añadir cada artículo

1. Crear `equipo/<slug>/index.html` copiando el de `refractometro-o-densimetro`
2. Cambiar `<title>`, `<meta name="description">` y `<link rel="canonical">`
3. Añadir la URL a `sitemap.xml`
4. Enlazarlo desde la home y desde al menos una guía relacionada
5. Enlazar desde el artículo hacia 2 guías (el enlazado interno en las dos direcciones es lo que evita las páginas huérfanas)

Todos los enlaces salientes a Amazon deben llevar `rel="sponsored nofollow noopener"` y `target="_blank"`.
