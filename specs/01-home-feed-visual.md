# SPEC 01 — Home visual del feed

> **Estado:** Aprobado
> **Depende de:** Ninguna
> **Fecha:** 2026-08-18
> **Objetivo:** Reemplazar la pantalla inicial en `/` por una réplica visual estática y adaptable de `references/pantallas/feed.dc.html`, sin autenticación, persistencia ni navegación funcional.

## Alcance

**Incluye:**

- Sustituir la pantalla inicial de Next.js por el feed de OpenDayCare en la ruta `/`.
- Reproducir la estructura de escritorio de la referencia: sidebar, encabezado, acceso visual para publicar, separador y tres tarjetas de publicación.
- Copiar literalmente los nombres, fechas, textos, etiquetas, destinatarios y contadores de `references/pantallas/feed.dc.html`.
- Reproducir las tipografías Nunito y Fredoka, la paleta, los bordes, las sombras, los radios, los espaciados y los SVG de la referencia.
- Mantener el sidebar de 248 px y el área principal desplazable de forma independiente en escritorio.
- Ocultar el sidebar por debajo de 768 px y mostrar el feed a ancho completo con márgenes reducidos, sin desbordamiento horizontal.
- Presentar todos los controles como elementos visuales inertes: no navegan, no modifican datos y no abren otras pantallas.
- Limitar la implementación a `app/page.tsx`, `app/layout.tsx` y `app/globals.css`.

**Fuera de alcance (para futuras specs):**

- Autenticación, autorización y cierre de sesión real.
- Base de datos, API, carga remota, persistencia local o contenido dinámico.
- Creación, edición, detalle, reacciones o comentarios funcionales.
- Rutas para Niños, Avisos, Mi cuenta, nueva publicación, detalle o fotografía.
- Navegación móvil alternativa, como menú desplegable o barra inferior.
- Componentes reutilizables, assets nuevos, dependencias nuevas o configuración adicional de Tailwind.
- Pruebas automatizadas o infraestructura de comparación visual.

## Modelo de datos

Esta funcionalidad no introduce estructuras de datos nuevas. El contenido de muestra se representa directamente en `app/page.tsx` y no se obtiene ni se conserva fuera del renderizado estático.

## Plan de implementación

1. Actualizar `app/layout.tsx` y `app/globals.css` para configurar Nunito como tipografía principal, Fredoka como tipografía de títulos, el documento en español y la base visual definida por la referencia; la aplicación debe seguir arrancando con la pantalla inicial existente.
2. Reemplazar el contenido inicial de `app/page.tsx` por el contenedor de página, el sidebar de escritorio y el perfil de Caro Giménez, manteniendo la ruta `/` renderizable y sin agregar navegación funcional.
3. Incorporar en el área principal el saludo, los datos de la sala, el acceso visual de nueva publicación y el separador “PUBLICADO HOY”.
4. Añadir la tarjeta estática de logro de Mateo con su encabezado, destinatario, texto, etiqueta y contadores exactos.
5. Añadir las tarjetas estáticas de actividad y anuncio general, incluido el placeholder visual de fotografía y todos los SVG presentes en la referencia.
6. Incorporar el breakpoint inferior a 768 px para ocultar el sidebar, adaptar paddings y anchos del feed y evitar cualquier scroll horizontal a 390 px de ancho.

## Criterios de aceptación

- [x] La ruta `/` carga el feed sin errores en la consola del navegador.
- [x] En escritorio se muestran un sidebar de 248 px, un contenido central con ancho máximo de 760 px y el fondo `#F6ECDF` de la referencia.
- [x] La composición de escritorio coincide con `references/pantallas/feed.dc.html` y `references/screenshots/feed.png` en estructura, contenido, tipografías, colores, bordes, sombras, radios y espaciados; solo se admiten diferencias de rasterizado de fuentes y antialiasing.
- [x] El contenido visible reproduce literalmente las tres publicaciones, sus horarios, destinatarios, textos, etiquetas y contadores.
- [x] El sidebar permanece visible mientras el área principal se desplaza en un viewport de escritorio.
- [x] Ningún control cambia la URL, abre una ruta, modifica contenido o realiza una solicitud a una API.
- [x] A 390 px de ancho el sidebar no se muestra, el feed ocupa el ancho disponible y no existe desbordamiento horizontal.
- [x] La implementación no incorpora estado de cliente, autenticación, persistencia, componentes adicionales, assets adicionales ni dependencias nuevas.
- [x] Los únicos archivos de aplicación modificados son `app/page.tsx`, `app/layout.tsx` y `app/globals.css`.
- [x] `npm run lint -- app` finaliza correctamente.
- [x] `npm run build` finaliza correctamente.

## Decisiones

- **Sí:** usar contenido estático idéntico a la referencia. No existe todavía una fuente de datos ni se necesita variación entre sesiones.
- **No:** calcular la fecha actual. La cadena `martes 17 jun` forma parte del contenido visual que se debe reproducir literalmente.
- **Sí:** mantener todos los controles como elementos visuales inertes. Crear destinos vacíos introduciría rutas fuera del objetivo de esta spec.
- **No:** conservar enlaces que terminen en páginas 404. La ruta `/` es la única pantalla incluida.
- **Sí:** ocultar el sidebar por debajo de 768 px. La referencia no define navegación móvil y el feed debe seguir siendo utilizable sin inventar una interfaz nueva.
- **Sí:** mantener toda la pantalla en los tres archivos existentes de `app/`. La extracción de componentes no aporta reutilización en esta primera pantalla.
- **Sí:** reutilizar Tailwind CSS 4 y estilos globales existentes. No se añadirá otra solución de estilos ni un archivo `tailwind.config.*`.
- **Sí:** representar los iconos con los SVG incluidos en la referencia. No se añadirá una biblioteca de iconos.

## Riesgos

| Riesgo                                                                          | Mitigación                                                                                                                      |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Las fuentes pueden rasterizarse de forma distinta entre sistemas y navegadores. | Usar las familias, pesos y métricas de Nunito y Fredoka indicadas por la referencia y aceptar solo diferencias de antialiasing. |
| No existe una referencia visual móvil.                                          | Limitar la adaptación a ocultar el sidebar, reducir márgenes y eliminar desbordamientos sin rediseñar el feed.                  |
| Mantener toda la pantalla en `app/page.tsx` produce un archivo extenso.         | Agrupar el marcado por regiones semánticas y posponer la extracción hasta que exista reutilización real.                        |

## Lo que **no** incluye esta spec

- Autenticación, usuarios reales o cierre de sesión.
- Base de datos, API o cualquier forma de persistencia.
- Interacciones funcionales y rutas adicionales.
- Contenido dinámico o editable.
- Una navegación móvil nueva.
- Componentes, assets, dependencias o pruebas automatizadas nuevas.

Cada capacidad funcional posterior debe definirse en su propia spec.
