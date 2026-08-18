# SPEC 03 — Navegación móvil del sidebar

> **Estado:** Aprobado
> **Depende de:** SPEC 01, SPEC 02
> **Fecha:** 2026-08-18
> **Objetivo:** Añadir por debajo de 768 px una barra superior sticky con un menú hamburguesa que abra el contenido completo del sidebar en un drawer modal accesible, sin habilitar navegación ni alterar la vista de escritorio.

## Por qué existe esta spec

Las specs anteriores ocultan deliberadamente el sidebar por debajo de 768 px porque no existía una referencia de navegación móvil. Como resultado, el feed se adapta al ancho disponible, pero pierde todos los accesos visuales de navegación, publicación y perfil en pantallas pequeñas.

## Alcance

**Incluye:**

- Mantener el `Sidebar` actual visible desde 768 px y oculto en anchos menores.
- Crear `components/feed/mobile-navigation.tsx` con el componente cliente `MobileNavigation`.
- Mostrar por debajo de 768 px una barra superior sticky dentro del contenedor desplazable de `main`.
- Colocar en la barra móvil la marca OpenDayCare a la izquierda y el botón hamburguesa a la derecha.
- Abrir desde la izquierda un drawer de 248 px que reutilice el contenido completo del sidebar: marca, sala, nueva publicación, navegación, perfil y cierre de sesión.
- Extraer en `components/feed/sidebar.tsx` un `SidebarContent` compartido por el sidebar de escritorio y el drawer, sin duplicar sus textos, ítems ni SVG.
- Incorporar en la cabecera compartida un espacio opcional para mostrar el botón X únicamente dentro del drawer.
- Superponer el drawer al feed mediante un overlay, sin desplazar el contenido.
- Mantener el feed bloqueado mientras el drawer está abierto y permitir desplazamiento vertical dentro del drawer cuando su contenido no quepa.
- Abrir el drawer cerrado por defecto, conservar su estado solo en memoria y cerrarlo al pasar al breakpoint de escritorio.
- Cerrar el drawer mediante el botón X, la tecla Escape o una pulsación sobre el overlay.
- Gestionar el foco como un modal: moverlo al botón X al abrir, mantenerlo dentro del drawer y devolverlo a la hamburguesa al cerrar.
- Añadir etiquetas y relaciones ARIA para comunicar el estado y propósito de la navegación móvil.
- Animar el drawer con un desplazamiento lateral y el overlay con una atenuación breve, respetando `prefers-reduced-motion`.
- Mantener inertes todos los controles internos del sidebar y evitar que cierren el drawer al pulsarlos.
- Limitar los cambios de aplicación a `app/page.tsx`, `components/feed/sidebar.tsx` y el nuevo `components/feed/mobile-navigation.tsx`.

**Fuera de alcance (para futuras specs):**

- Crear rutas o habilitar navegación para Niños, Avisos, Mi cuenta o Feed.
- Habilitar nueva publicación, cierre de sesión u otras acciones del sidebar.
- Autenticación, autorización, persistencia, API o carga remota.
- Una navegación móvil exclusiva distinta del sidebar actual o una barra inferior.
- La variante de navegación para familias mostrada en otras referencias.
- Cambios visuales o de comportamiento en la vista de escritorio.
- Cambios en `app/layout.tsx`, `app/globals.css` o los demás componentes del feed.
- Dependencias nuevas, una biblioteca de iconos o configuración adicional de Tailwind.
- Pruebas automatizadas o infraestructura nueva de comparación visual.

## Modelo de datos

Esta funcionalidad no introduce datos de dominio ni persistencia. Reutiliza las props contextuales aprobadas en SPEC 02 y añade únicamente el estado efímero `isOpen: boolean` dentro de `MobileNavigation`, con valor inicial `false`.

`components/feed/sidebar.tsx` expondrá los contratos compartidos con estos nombres:

```ts
export type SidebarItem = "feed" | "children" | "notices" | "account";

export type SidebarProps = {
  roomName: string;
  userName: string;
  userRole: string;
  userInitial: string;
  activeItem: SidebarItem;
};

type SidebarContentProps = SidebarProps & {
  headerAction?: React.ReactNode;
};
```

`MobileNavigation` recibirá `SidebarProps`. La prop opcional `headerAction` permitirá insertar el botón X en la misma cabecera de la marca sin duplicarla ni modificar la presentación del sidebar de escritorio.

## Plan de implementación

1. Exportar `SidebarItem` y `SidebarProps` desde `components/feed/sidebar.tsx`, extraer el contenido interior actual a `SidebarContent` con la prop opcional `headerAction` y mantener `Sidebar` como el mismo wrapper de escritorio; la ruta `/` debe conservar su apariencia y comportamiento actuales.
2. Crear `components/feed/mobile-navigation.tsx` con `"use client"`, estado local cerrado por defecto, barra móvil sticky, hamburguesa, overlay y drawer izquierdo de 248 px; integrar temporalmente el componente en `app/page.tsx` para poder abrir y cerrar el panel sin habilitar sus controles internos.
3. Añadir al drawer el botón X mediante `headerAction`, semántica modal, `aria-expanded`, `aria-controls`, etiquetas accesibles, cierre por X, Escape y overlay, contención de foco y restauración del foco en la hamburguesa.
4. Bloquear el desplazamiento y la interacción del feed mientras el modal esté abierto, mantener el drawer desplazable con altura basada en el viewport dinámico y cerrar su estado al alcanzar 768 px.
5. Incorporar las transiciones de desplazamiento y atenuación con utilidades existentes de Tailwind, desactivarlas cuando el usuario prefiera movimiento reducido y asegurar que la barra sticky reserve su propio espacio sin cubrir el encabezado del feed.
6. Definir una sola constante `sidebarProps` en `app/page.tsx` y entregarla tanto a `Sidebar` como a `MobileNavigation`, dejando `main` como propietario del scroll y la barra móvil sticky.
7. Verificar manualmente la ruta `/` a 390, 767, 768 y 924 px, comprobar la interacción por puntero y teclado, revisar la consola y ejecutar `npm run lint -- app` y `npm run build`.

## Criterios de aceptación

- [ ] `components/feed/sidebar.tsx` exporta `SidebarItem`, `SidebarProps` y `SidebarContent`, y tanto `Sidebar` como `MobileNavigation` reutilizan el mismo contenido.
- [ ] `components/feed/mobile-navigation.tsx` es el único archivo nuevo y el único componente que incorpora `"use client"`, estado o efectos.
- [ ] `app/page.tsx` define una sola constante con las props del sidebar y la entrega a las variantes de escritorio y móvil.
- [ ] Por debajo de 768 px el sidebar de escritorio permanece oculto y se muestra una barra superior sticky dentro del scroll de `main`.
- [ ] La barra móvil muestra la marca OpenDayCare a la izquierda y una hamburguesa con etiqueta accesible a la derecha.
- [ ] Al pulsar la hamburguesa aparece desde la izquierda un drawer de 248 px sobre el feed y un overlay cubre el espacio restante.
- [ ] El drawer reproduce una sola vez la marca, la sala, nueva publicación, Feed, Niños, Avisos, Mi cuenta, el perfil y cerrar sesión del sidebar actual.
- [ ] El drawer muestra una X en la cabecera de la marca sin alterar esa cabecera en escritorio.
- [ ] La hamburguesa expone `aria-expanded` y `aria-controls`, y el panel comunica semánticamente que es una navegación modal.
- [ ] Al abrir, el foco pasa al botón X y no puede desplazarse mediante teclado hacia controles situados detrás del modal.
- [ ] Al cerrar, el foco vuelve a la hamburguesa que abrió el drawer.
- [ ] El botón X, la tecla Escape y una pulsación sobre el overlay cierran el drawer.
- [ ] Pulsar nueva publicación, un ítem de navegación, el perfil o cerrar sesión no cambia la URL, no ejecuta una acción y no cierra el drawer.
- [ ] Mientras el drawer está abierto el feed no recibe interacción ni se desplaza, y el drawer permite scroll vertical cuando su contenido excede la altura disponible.
- [ ] El drawer inicia cerrado en cada carga, no usa `localStorage` ni `sessionStorage` y se cierra al cambiar a un ancho de 768 px o superior.
- [ ] El panel se desliza lateralmente y el overlay se atenúa durante una transición breve; con `prefers-reduced-motion` ambos cambios ocurren sin movimiento.
- [ ] A 390 y 767 px la barra y el drawer caben sin desbordamiento horizontal, sin cubrir permanentemente el contenido y sin ocultar controles del sidebar.
- [ ] A 768 y 924 px no se muestra la barra móvil ni el drawer, y el sidebar, el feed y su scroll conservan exactamente la presentación aprobada en SPEC 02.
- [ ] Ningún control cambia la URL, abre una ruta, modifica contenido o realiza solicitudes de red.
- [ ] Los únicos archivos de aplicación creados o modificados son `components/feed/mobile-navigation.tsx`, `components/feed/sidebar.tsx` y `app/page.tsx`.
- [ ] No se incorporan dependencias, assets, configuración adicional, estilos globales ni infraestructura de pruebas.
- [ ] La consola del navegador no muestra errores al cargar ni al operar el menú móvil.
- [ ] `npm run lint -- app` finaliza correctamente.
- [ ] `npm run build` finaliza correctamente.

## Decisiones

- **Sí:** reutilizar el sidebar completo dentro de un drawer. Mantiene una sola navegación y evita diseñar y mantener un menú móvil distinto.
- **No:** crear una barra inferior o un menú móvil exclusivo. No existe una referencia que justifique otra jerarquía de navegación.
- **Sí:** conservar el breakpoint actual de 768 px. Mantiene el comportamiento responsive aprobado y limita el cambio a sustituir la navegación que hoy desaparece.
- **Sí:** usar una barra sticky dentro del scroll de `main`, con marca a la izquierda y hamburguesa a la derecha. El acceso permanece visible mientras se recorre el feed sin cambiar el shell global.
- **Sí:** abrir un drawer izquierdo de 248 px. Reutiliza el ancho exacto del sidebar y deja parte del overlay visible incluso en pantallas estrechas.
- **Sí:** extraer `SidebarContent` y añadir un slot `headerAction`. Permite compartir todo el marcado y colocar la X en la cabecera móvil sin coordenadas absolutas ni una segunda marca.
- **Sí:** aislar el estado y los efectos en el nuevo `MobileNavigation`. El resto de la página y el sidebar de escritorio pueden continuar como Server Components.
- **Sí:** tratar el drawer como modal accesible. El fondo queda bloqueado, el foco permanece contenido y existen cierres por botón, teclado y overlay.
- **Sí:** mantener el estado únicamente en memoria y cerrarlo al entrar en escritorio. Recordar un panel abierto entre cargas no aporta valor y puede producir estados inesperados.
- **Sí:** mantener inertes todos los controles del sidebar. Sus destinos y acciones siguen fuera del alcance y deben definirse en specs independientes.
- **Sí:** usar las utilidades actuales de Tailwind para layout y transiciones. No se necesitan estilos globales, configuración adicional ni dependencias.
- **No:** modificar la presentación de escritorio. La composición aprobada en las specs anteriores sigue siendo la referencia desde 768 px.

## Riesgos

| Riesgo                                                                                    | Mitigación                                                                                                                         |
| ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| El foco puede escapar al feed o perderse al desmontar el drawer.                          | Contener el foco mientras esté abierto, enfocarlo inicialmente en la X y restaurarlo explícitamente en la hamburguesa al cerrar.   |
| El contenedor `main` puede seguir desplazándose detrás del overlay.                       | Bloquear el scroll del contenedor propietario mientras el modal esté abierto y mantener el scroll vertical únicamente en el panel. |
| La extracción de contenido puede alterar el sidebar de escritorio aprobado.               | Mantener su wrapper y clases actuales, y verificarlo a 768 y 924 px contra la referencia existente.                                |
| El drawer puede conservarse abierto al cruzar el breakpoint aunque deje de ser visible.   | Detectar la entrada al breakpoint de escritorio, cerrar el estado y aplicar ocultamiento responsive también al shell móvil.        |
| Las barras dinámicas del navegador móvil pueden recortar el perfil o el cierre de sesión. | Basar la altura del drawer en el viewport dinámico y permitir desplazamiento interno.                                              |

## Lo que **no** incluye esta spec

- Rutas o navegación funcional.
- Nueva publicación, cierre de sesión u otras acciones reales.
- Autenticación, API, datos dinámicos o persistencia.
- Un menú móvil alternativo, una barra inferior o la variante para familias.
- Cambios visuales en escritorio o en el contenido del feed.
- Cambios en estilos globales, layout raíz o componentes ajenos a la navegación.
- Dependencias, assets o pruebas automatizadas nuevas.

Cada destino o acción funcional del sidebar debe definirse en su propia spec.
