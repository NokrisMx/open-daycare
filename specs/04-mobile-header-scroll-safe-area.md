# SPEC 04 — Cabecera móvil, scroll y zonas seguras

> **Estado:** Aprobado
> **Depende de:** SPEC 03
> **Fecha:** 2026-08-18
> **Objetivo:** Corregir por debajo de 768 px la separación lateral de la barra móvil colocándola fuera del contenedor desplazable y haciendo que toda la vista respete las zonas seguras, sin alterar el drawer ni la presentación de escritorio.

## Por qué existe esta spec

La barra móvil de SPEC 03 está dentro del `main` desplazable, que reserva un canal mediante `[scrollbar-gutter:stable]`. Cuando el contenido requiere scroll, el fondo de la barra termina antes de ese canal y deja una franja vertical visible a la derecha, aunque sus dimensiones internas sean correctas.

## Alcance

**Incluye:**

- Limitar la corrección a la ruta `/` por debajo de 768 px.
- Mantener `MobileNavigation` como propietario de la barra móvil, el overlay, el drawer y su estado.
- Mover `MobileNavigation` fuera de `main` para que la barra ocupe todo el ancho del viewport y permanezca visible sin formar parte del área desplazable.
- Organizar el shell móvil como una columna con altura basada en el viewport dinámico y conservar la composición en fila desde 768 px.
- Mantener `main` como único contenedor desplazable del feed y hacer que ocupe el espacio restante debajo de la barra.
- Conservar `[scrollbar-gutter:stable]` y el scrollbar nativo, que comenzará debajo de la barra en lugar de atravesar su extremo derecho.
- Añadir a `main` un atributo `data-feed-scroll-container` y usarlo desde `MobileNavigation` para bloquear el contenedor correcto mientras el drawer esté abierto.
- Mantener el espacio superior actual de 24 px entre la barra móvil y el contenido del feed.
- Exportar desde `app/page.tsx` una configuración estática de viewport con `viewportFit: "cover"`.
- Aplicar mediante CSS declarativo los valores `env(safe-area-inset-*)` en los bordes relevantes de la barra, el feed y el drawer.
- Sumar cada inset al padding base actual para conservar el mismo espaciado visual después de la zona insegura.
- Mantener el resultado visual actual cuando los insets valgan cero, salvo por la eliminación de la franja lateral de la barra.
- Ampliar el ancho total del drawer desde sus 248 px mediante `safe-area-inset-left` para conservar sus 248 px útiles cuando exista un notch izquierdo.
- Mantener el overlay sobre toda la superficie del viewport, incluidas la barra y las zonas seguras.
- Conservar sin cambios la apertura, el cierre, el bloqueo de scroll, la contención y restauración de foco, la semántica modal y las transiciones aprobadas en SPEC 03.
- Limitar los cambios de aplicación a `app/page.tsx` y `components/feed/mobile-navigation.tsx`.

**Fuera de alcance (para futuras specs):**

- Ocultar, reemplazar o rediseñar el scrollbar nativo.
- Disimular la separación mediante cambios de color en lugar de corregir la estructura.
- Cambiar la altura, el contenido o los espaciados actuales cuando los insets valgan cero.
- Modificar el breakpoint de 768 px o la composición de escritorio.
- Cambiar el contenido, el ancho útil o el comportamiento del drawer.
- Detectar dispositivos, notch u orientación mediante JavaScript.
- Crear rutas o habilitar acciones del sidebar.
- Modificar `app/layout.tsx`, `app/globals.css`, `components/feed/sidebar.tsx` u otros componentes del feed.
- Añadir dependencias, configuración adicional de Tailwind o infraestructura de pruebas automatizadas.

## Modelo de datos

Esta funcionalidad no introduce datos de dominio, persistencia ni estado nuevo. Conserva `isOpen: boolean` dentro de `MobileNavigation` y añade únicamente una configuración estática de viewport y el marcador DOM `data-feed-scroll-container` para localizar el contenedor desplazable.

## Plan de implementación

1. Añadir `data-feed-scroll-container` a `main` en `app/page.tsx` y actualizar `MobileNavigation` para localizar ese elemento en lugar de depender de `closest("main")`; verificar que el drawer todavía bloquea y restaura el scroll con la composición actual.
2. Reorganizar el shell de `app/page.tsx` como columna de altura `100dvh` por debajo de 768 px y como fila en escritorio, mover `MobileNavigation` antes de `main` y hacer que `main` ocupe el espacio restante con `min-height: 0` y su overflow actual.
3. Retirar de la barra móvil la responsabilidad sticky que deja de necesitar al estar fuera del scroll, mantener sus dimensiones visuales y comprobar que el scrollbar nativo aparece únicamente junto al feed.
4. Exportar desde `app/page.tsx` el objeto estático de viewport tipado con `viewportFit: "cover"` y aplicar al contenido del feed los insets laterales e inferior sumados a sus paddings móviles actuales.
5. Aplicar en `components/feed/mobile-navigation.tsx` los insets superior y laterales de la barra, los insets relevantes del drawer y una anchura total de 248 px más `safe-area-inset-left`, sin añadir estado, efectos ni listeners para detectar el dispositivo.
6. Verificar que el overlay sigue cubriendo todo el viewport y que el drawer conserva cierres, foco, scroll interno, bloqueo del feed, transiciones y comportamiento inerte después de quedar fuera de `main`.
7. Comparar la ruta `/` con el menú cerrado y abierto a 390 y 767 px, comprobar la transición exacta a 768 px y validar un perfil iPhone con insets no nulos en orientación vertical y horizontal.
8. Revisar la consola y ejecutar `npm run lint -- app` y `npm run build`.

## Criterios de aceptación

- [ ] Los únicos archivos de aplicación modificados son `app/page.tsx` y `components/feed/mobile-navigation.tsx`.
- [ ] `app/page.tsx` exporta una configuración estática de viewport que genera `viewport-fit=cover`.
- [ ] Por debajo de 768 px `MobileNavigation` se renderiza fuera de `main` y la barra no forma parte del contenedor desplazable.
- [ ] El shell móvil usa la altura del viewport dinámico, dispone la barra y el feed en columna y no produce scroll adicional en `body`.
- [ ] `main` ocupa todo el espacio restante debajo de la barra, conserva el scroll vertical independiente y sigue ocultando el desbordamiento horizontal.
- [ ] `main` expone `data-feed-scroll-container` y `MobileNavigation` usa ese marcador para bloquear y restaurar su scroll.
- [ ] Con contenido suficiente para producir scroll, la barra móvil cubre todo el ancho disponible sin dejar una franja vertical a la derecha.
- [ ] Cuando el navegador muestra un scrollbar nativo, su canal comienza debajo de la barra y permanece junto al feed.
- [ ] La barra continúa visible mientras se desplaza el feed, sin usar una posición que cubra el contenido.
- [ ] El contenido conserva 24 px de separación superior respecto de la barra y mantiene sus dimensiones actuales cuando los insets valen cero.
- [ ] A 390 y 767 px no existe desbordamiento horizontal con el menú cerrado ni abierto.
- [ ] A 768 px la barra y el drawer móviles permanecen ocultos, y el sidebar, el feed y su scroll conservan la presentación aprobada en SPEC 03.
- [ ] Los paddings móviles de la barra, el feed y el drawer suman los insets relevantes a sus valores base mediante CSS `env()`.
- [ ] En un perfil iPhone vertical con insets no nulos, la marca, la hamburguesa, el feed y el perfil del drawer no quedan debajo del notch ni del indicador inferior.
- [ ] En un perfil iPhone horizontal con insets no nulos, la barra, el feed y el drawer evitan los bordes inseguros sin recortar controles ni texto.
- [ ] Cuando existe `safe-area-inset-left`, el ancho total del drawer es 248 px más ese inset y su contenido conserva el ancho útil actual.
- [ ] Cuando todos los insets valen cero, la barra, el feed y el drawer coinciden con la presentación actual salvo por la franja lateral corregida.
- [ ] El overlay cubre la barra, el feed y las zonas seguras mientras el drawer está abierto.
- [ ] Abrir el drawer bloquea el scroll y la interacción del feed, pero mantiene disponible su propio scroll interno.
- [ ] El botón X, Escape y el overlay cierran el drawer, y los controles internos inertes no lo cierran ni ejecutan acciones.
- [ ] El foco pasa a la X al abrir, permanece dentro del drawer y vuelve a la hamburguesa al cerrar.
- [ ] No se añaden detección de dispositivo u orientación, estado, efectos ni listeners para implementar las zonas seguras.
- [ ] `app/layout.tsx`, `app/globals.css`, `components/feed/sidebar.tsx` y los demás componentes del feed permanecen sin cambios.
- [ ] No se incorporan dependencias, configuración adicional, assets ni infraestructura de pruebas.
- [ ] La consola del navegador no muestra errores al cargar, desplazar el feed ni operar el drawer.
- [ ] `npm run lint -- app` finaliza correctamente.
- [ ] `npm run build` finaliza correctamente.

## Decisiones

- **Sí:** colocar la barra fuera del contenedor desplazable. Corrige la causa estructural y permite que su fondo cubra todo el ancho sin competir con el canal del scrollbar.
- **No:** ocultar el scrollbar móvil. El desplazamiento debe conservar su indicación nativa cuando el navegador decida mostrarla.
- **No:** igualar colores para disimular la franja. Mantendría la estructura defectuosa y dependería del fondo de cada región.
- **Sí:** conservar `main` como propietario exclusivo del scroll. La barra permanece visible de forma natural y el feed sigue desplazándose de manera independiente.
- **Sí:** localizar `main` mediante `data-feed-scroll-container`. Mover la barra fuera de `main` invalida el uso actual de `closest("main")` y requiere un contrato explícito.
- **Sí:** usar `100dvh` en móvil. Evita que las barras dinámicas del navegador resten espacio utilizable al feed.
- **Sí:** activar `viewport-fit=cover` desde `app/page.tsx`. La configuración queda limitada a la ruta afectada y no obliga a modificar el layout raíz.
- **Sí:** usar únicamente CSS `env()` para las zonas seguras. El navegador proporciona los insets y el fallback natural a cero sin lógica de cliente adicional.
- **Sí:** sumar los insets al padding base. Conserva el aire visual existente después de cada zona insegura.
- **Sí:** proteger toda la vista móvil en los bordes relevantes. La barra evita la zona superior y lateral, el feed evita los laterales y el borde inferior, y el drawer evita los bordes que ocupa.
- **Sí:** ampliar el drawer mediante el inset izquierdo. Evita que el notch reduzca sus 248 px útiles.
- **No:** cambiar la vista de escritorio o los componentes ajenos a la navegación móvil. La corrección está limitada al defecto observado.

## Riesgos

| Riesgo                                                                                               | Mitigación                                                                                                                  |
| ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Mover `MobileNavigation` fuera de `main` puede romper el bloqueo y la restauración del scroll.       | Identificar el contenedor con `data-feed-scroll-container` antes de mover el componente y verificar cada vía de cierre.     |
| Una combinación incorrecta de altura dinámica y flex puede crear un segundo scroll en `body`.        | Usar un shell móvil de `100dvh`, hacer que `main` sea flexible con `min-height: 0` y comprobar que solo `main` se desplaza. |
| `viewport-fit=cover` puede llevar contenido debajo del notch o del indicador inferior.               | Aplicar los insets a todos los bordes relevantes y validar perfiles con insets no nulos en ambas orientaciones.             |
| El inset izquierdo puede estrechar el contenido del drawer si su ancho total permanece fijo.         | Sumar `safe-area-inset-left` a los 248 px del panel para conservar su ancho útil.                                           |
| Una emulación móvil sin recorte de pantalla puede devolver todos los insets como cero.               | Complementar las verificaciones por ancho con un perfil o emulación de display cutout que exponga insets no nulos.          |
| Cambiar la posición de la barra puede modificar accidentalmente el espaciado o el breakpoint actual. | Conservar sus paddings base, mantener 24 px antes del feed y comparar 390, 767 y 768 px con los estados cerrado y abierto.  |

## Lo que **no** incluye esta spec

- Ocultar o personalizar el scrollbar.
- Rediseñar la barra, el drawer, el feed o la vista de escritorio.
- Cambiar el breakpoint móvil o los controles existentes.
- Detección de notch, dispositivo u orientación mediante JavaScript.
- Navegación, publicación, cierre de sesión u otras acciones reales.
- Cambios en estilos globales, layout raíz o componentes distintos de los dos archivos acordados.
- Dependencias, assets o pruebas automatizadas nuevas.

Cada cambio funcional o rediseño posterior debe definirse en su propia spec.
