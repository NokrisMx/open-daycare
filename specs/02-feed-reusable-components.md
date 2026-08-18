# SPEC 02 — Componentes reutilizables del feed

> **Estado:** Aprobado
> **Depende de:** SPEC 01
> **Fecha:** 2026-08-18
> **Objetivo:** Refactorizar la ruta `/` para componer el feed existente con componentes de dominio reutilizables y datos estáticos tipados, sin alterar su apariencia ni comportamiento.

## Por qué existe esta spec

La implementación de SPEC 01 concentra toda la pantalla en `app/page.tsx`, incluido el marcado repetido de las publicaciones. Esta estructura dificulta extender el feed y reutilizar sus regiones en futuras pantallas sin duplicar código.

## Alcance

**Incluye:**

- Mantener `app/page.tsx` como punto de composición y propietario del contenido estático de la ruta `/`.
- Crear `components/feed/sidebar.tsx` con el componente `Sidebar`.
- Crear `components/feed/feed-header.tsx` con el componente `FeedHeader`.
- Crear `components/feed/composer-prompt.tsx` con el componente `ComposerPrompt`.
- Crear `components/feed/section-divider.tsx` con el componente `SectionDivider`.
- Crear `components/feed/post-card.tsx` con el componente `PostCard` y los tipos de publicación exportados.
- Pasar mediante props todos los valores contextuales de usuario, sala, encabezado, acceso de publicación, separador y publicaciones.
- Representar las tres publicaciones existentes mediante un array tipado en `app/page.tsx` y renderizarlas con un único `PostCard`.
- Modelar logro, actividad y anuncio mediante una unión discriminada que impida combinaciones inválidas de datos.
- Mantener los SVG únicos dentro del componente que los utiliza y deduplicar los iconos repetidos de reacción y comentario dentro de `post-card.tsx`.
- Conservar los componentes como Server Components sin estado, efectos, callbacks ni directivas `use client`.
- Preservar exactamente el contenido, la estructura visual, el responsive, la semántica y el comportamiento inerte aprobados en SPEC 01.

**Fuera de alcance (para futuras specs):**

- Cambios visuales, de contenido o de comportamiento en el feed.
- Navegación funcional, autenticación, persistencia, API o carga remota.
- Un design system genérico con componentes como `Button`, `Avatar`, `Badge` o `Card`.
- Una biblioteca local o externa de iconos.
- Props para callbacks o preparación anticipada de interacciones futuras.
- Cambios en `app/layout.tsx` o `app/globals.css`.
- Nuevas dependencias, configuración adicional de Tailwind o infraestructura de pruebas automatizadas.
- Componentes para otras pantallas distintas del dominio del feed.

## Modelo de datos

`components/feed/post-card.tsx` exportará una unión `FeedPost` discriminada por `kind`. Los nombres concretos serán:

```ts
type PostBase = {
  id: string;
  publishedAt: string;
  authorLabel: string;
  audience: string;
  body: string;
  reactions: number;
  comments: number;
};

type AchievementPost = PostBase & {
  kind: "achievement";
  childName: string;
  childInitial: string;
};

type ActivityPost = PostBase & {
  kind: "activity";
  childName: string;
  childInitial: string;
  photoPlaceholder: string;
};

type AnnouncementPost = PostBase & {
  kind: "announcement";
  title: string;
};

export type FeedPost = AchievementPost | ActivityPost | AnnouncementPost;
```

Las demás regiones recibirán props de dominio explícitas:

```ts
type SidebarProps = {
  roomName: string;
  userName: string;
  userRole: string;
  userInitial: string;
  activeItem: "feed" | "children" | "notices" | "account";
};

type FeedHeaderProps = {
  daycareName: string;
  roomName: string;
  greeting: string;
  summary: string;
};

type ComposerPromptProps = {
  authorInitial: string;
  placeholder: string;
};

type SectionDividerProps = {
  label: string;
};
```

El array `FeedPost[]` permanecerá en `app/page.tsx`. No se introduce persistencia ni una fuente de datos externa.

## Plan de implementación

1. Crear `components/feed/sidebar.tsx`, trasladar el sidebar completo a `Sidebar`, definir sus props y reemplazar el marcado equivalente de `app/page.tsx` sin modificar textos, SVG, clases ni comportamiento.
2. Crear `components/feed/feed-header.tsx`, trasladar el encabezado a `FeedHeader` y proporcionar desde `app/page.tsx` los valores actuales de guardería, sala, saludo y resumen.
3. Crear `components/feed/composer-prompt.tsx` y `components/feed/section-divider.tsx`, trasladar ambas regiones y conservar sus botones, SVG, clases y contenido actual mediante props.
4. Crear en `components/feed/post-card.tsx` la unión `FeedPost`, el componente `PostCard` y sus subpartes internas para avatar, etiqueta, contenido opcional y acciones; mantener en este archivo los SVG propios de las tarjetas.
5. Definir en `app/page.tsx` un array `FeedPost[]` con el contenido literal de las tres publicaciones de SPEC 01 y sustituir las tarjetas duplicadas por un renderizado con `map` y una clave `id` estable.
6. Simplificar `app/page.tsx` para que solo componga las cinco regiones del feed y mantenga el contenedor principal responsable del layout general y del scroll.
7. Comparar la ruta `/` en escritorio con `references/screenshots/feed.png` y comprobar a 390 px que el sidebar permanece oculto, el feed conserva su adaptación y no aparece desbordamiento horizontal.
8. Ejecutar `npm run lint -- app` y `npm run build` para verificar reglas estáticas, tipos y compilación de producción.

## Criterios de aceptación

- [ ] `app/page.tsx` compone la pantalla mediante `Sidebar`, `FeedHeader`, `ComposerPrompt`, `SectionDivider` y `PostCard` importados desde `components/feed/`.
- [ ] Las tres publicaciones se definen una sola vez en un array `FeedPost[]` dentro de `app/page.tsx` y se renderizan con un único `PostCard` mediante `map`.
- [ ] La unión discriminada diferencia `achievement`, `activity` y `announcement`, y la fotografía placeholder solo es obligatoria para `activity`.
- [ ] Todos los valores contextuales definidos en el modelo se entregan mediante props y no quedan duplicados dentro de los componentes.
- [ ] `Sidebar` recibe usuario, sala y elemento activo, mientras conserva internamente los cuatro ítems visuales y sus SVG.
- [ ] Ningún archivo nuevo contiene `use client`, hooks, estado, efectos o callbacks de interacción.
- [ ] Los iconos de reacción y comentario aparecen una sola vez en la implementación de `PostCard`; los demás SVG permanecen encapsulados en su región.
- [ ] La ruta `/` conserva literalmente los nombres, fechas, textos, etiquetas, destinatarios y contadores aprobados en SPEC 01.
- [ ] En escritorio, la composición coincide con `references/screenshots/feed.png` en estructura, tipografías, colores, bordes, sombras, radios y espaciados; solo se admiten diferencias de rasterizado y antialiasing.
- [ ] A 390 px de ancho el sidebar no se muestra, el feed ocupa el ancho disponible y no existe desbordamiento horizontal.
- [ ] El sidebar sigue fijo y el área principal sigue desplazándose de forma independiente en escritorio.
- [ ] Ningún control cambia la URL, modifica contenido, abre otra pantalla o realiza solicitudes de red.
- [ ] `app/layout.tsx` y `app/globals.css` permanecen sin cambios.
- [ ] No se incorporan componentes genéricos, dependencias, assets, configuración adicional ni infraestructura de pruebas.
- [ ] La consola del navegador no muestra errores al cargar `/`.
- [ ] `npm run lint -- app` finaliza correctamente.
- [ ] `npm run build` finaliza correctamente.

## Decisiones

- **Sí:** limitar la reutilización al dominio del feed. Un design system completo requiere necesidades compartidas entre varias pantallas y merece otra spec.
- **Sí:** ubicar los componentes en `components/feed/`. Esta carpeta los separa del árbol de rutas y permite reutilizarlos desde futuras pantallas.
- **Sí:** usar un archivo por región principal. Mantiene límites reconocibles sin fragmentar avatares, etiquetas o botones en archivos que todavía no tienen otros consumidores.
- **Sí:** mantener el array de publicaciones en `app/page.tsx`. La ruta es propietaria de su contenido y los componentes reutilizables solo presentan los datos recibidos.
- **Sí:** usar una unión discriminada para las variantes de publicación. Evita combinaciones ambiguas de muchas props opcionales.
- **No:** crear `AchievementCard`, `ActivityCard` y `AnnouncementCard`. Las tres publicaciones comparten estructura y se resuelven con variantes del mismo `PostCard`.
- **Sí:** mantener las subpartes de las tarjetas y sus SVG en `post-card.tsx`. No existe todavía reutilización que justifique archivos adicionales.
- **No:** añadir una biblioteca de iconos. Los SVG existentes ya reproducen la referencia y una dependencia nueva no aporta valor al refactor.
- **Sí:** mantener Server Components. La pantalla no necesita estado ni interactividad de cliente.
- **No:** añadir callbacks opcionales para necesidades futuras. Las APIs se ampliarán cuando exista una interacción definida por otra spec.
- **Sí:** preservar `app/layout.tsx` y `app/globals.css`. La tipografía y los estilos globales aprobados no necesitan cambios para extraer componentes.

## Riesgos

| Riesgo                                                                                        | Mitigación                                                                                                                                |
| --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Mover el marcado puede alterar accidentalmente clases, jerarquía o comportamiento responsive. | Trasladar cada región sin rediseñarla y comparar el resultado con `references/screenshots/feed.png` y un viewport de 390 px.              |
| Una API de props demasiado genérica puede ocultar las diferencias entre tipos de publicación. | Usar nombres de dominio y una unión discriminada que haga explícitos logro, actividad y anuncio.                                          |
| Extraer componentes muy pequeños puede aumentar la fragmentación sin aportar reutilización.   | Crear solo cinco archivos de regiones y mantener sus subpartes privadas en el mismo archivo cuando no tengan consumidores independientes. |

## Lo que **no** incluye esta spec

- Cambios visuales o funcionales en la pantalla aprobada por SPEC 01.
- Persistencia, API, autenticación o navegación.
- Componentes de cliente o preparación anticipada de callbacks.
- Un design system o una biblioteca de iconos.
- Cambios en estilos globales, tipografías o layout raíz.
- Pruebas automatizadas o dependencias nuevas.

Cada nueva interacción o abstracción compartida fuera del feed debe definirse en su propia spec.
