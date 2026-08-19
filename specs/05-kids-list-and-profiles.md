# SPEC 05 — Listado y perfiles de niños

> **Estado:** Implementado
> **Depende de:** SPEC 04
> **Fecha:** 2026-08-19
> **Objetivo:** Implementar las interfaces visuales responsive del listado y los ocho perfiles de niños en `/kids` y `/kids/[id]`, reutilizando la navegación existente y datos estáticos tipados, sin API, persistencia ni acciones de gestión.

## Por qué existe esta spec

La aplicación solo implementa actualmente el feed en `/`, aunque las referencias de producto ya definen las pantallas de gestión y detalle de niños. La navegación compartida también permanece dentro de `components/feed/` y mantiene todos sus controles inertes, por lo que debe adquirir una ubicación común y habilitar únicamente los destinos que existirán después de este cambio.

## Alcance

**Incluye:**

- Crear la ruta `/kids` en `app/kids/page.tsx` con la interfaz de `references/pantallas/ninos.dc.html`.
- Crear la ruta dinámica `/kids/[id]` en `app/kids/[id]/page.tsx` con la interfaz de `references/pantallas/perfil-nino.dc.html`.
- Resolver los identificadores numéricos canónicos del `1` al `8` en la ruta dinámica y devolver el 404 estándar de Next.js para cualquier otro valor o formato.
- Mantener todos los textos visibles en español y usar inglés para rutas, carpetas, archivos, componentes, tipos y variables.
- Crear `app/kids/data.ts` con una única colección tipada que contenga los ocho resúmenes y sus perfiles completos.
- Crear `components/kids/kid-card.tsx`, `components/kids/kids-list.tsx` y `components/kids/kid-profile.tsx` con contratos de props tipados.
- Renderizar las ocho tarjetas mediante datos estáticos y un único componente `KidCard`.
- Convertir las ocho tarjetas en enlaces a `/kids/1`, `/kids/2`, `/kids/3`, `/kids/4`, `/kids/5`, `/kids/6`, `/kids/7` y `/kids/8`, respectivamente.
- Permitir que el campo de búsqueda reciba texto como input no controlado, sin filtrar, ordenar ni modificar las tarjetas.
- Crear `app/kids/layout.tsx` para compartir entre el listado y el perfil el sidebar, la navegación móvil, el contenedor de scroll y las zonas seguras.
- Mover `components/feed/sidebar.tsx` y `components/feed/mobile-navigation.tsx` a `components/navigation/sidebar.tsx` y `components/navigation/mobile-navigation.tsx`.
- Actualizar `app/page.tsx` para importar la navegación desde su nueva ubicación sin alterar la interfaz del feed.
- Habilitar Feed y Niños como enlaces reales a `/` y `/kids` en las variantes de escritorio y móvil.
- Cerrar el drawer móvil al pulsar Feed o Niños, incluido el enlace que ya esté activo.
- Mantener Avisos, Mi cuenta, Nueva publicación y Cerrar sesión como controles visuales inertes.
- Mantener activos los ocho enlaces de perfil, Volver a Niños y los enlaces Feed y Niños; Agregar niño, Editar, Resumen del día y Vincular otro padre serán controles visuales inertes.
- Promover la configuración `viewportFit: "cover"` desde `app/page.tsx` a `app/layout.tsx` para cubrir todas las rutas.
- Renombrar los contratos DOM `data-feed-scroll-container` y `data-feed-content` como `data-page-scroll-container` y `data-page-content` en el feed, el layout de niños y la navegación móvil.
- Reproducir los HTML citados como autoridad visual para escritorio, usando el perfil de Mateo como plantilla visual de los ocho perfiles e individualizando sus datos, alertas, avatares y padres.
- Reutilizar por debajo de 768 px la cabecera, el drawer, el bloqueo de scroll, la accesibilidad y las zonas seguras aprobadas en SPEC 04.
- Adaptar por debajo de 768 px el listado a una columna y el perfil a un flujo vertical en orden identidad, Editar, alerta, datos, Resumen del día y padres vinculados.
- Mantener las páginas y componentes de dominio como Server Components; solo `MobileNavigation` conservará estado y efectos de cliente.

**Fuera de alcance (para futuras specs):**

- Crear, editar o eliminar niños.
- Implementar perfiles adicionales fuera de los ocho niños definidos en esta spec.
- Filtrar, ordenar o buscar niños, aunque el campo permita escribir.
- Implementar Resumen del día o la vinculación de padres.
- Habilitar Avisos, Mi cuenta, Nueva publicación o Cerrar sesión.
- API, base de datos, autenticación, autorización, persistencia o carga remota.
- Estados de carga, error de red o vacío derivados de una fuente de datos externa.
- Un 404 personalizado para identificadores de niño desconocidos.
- Un design system genérico con primitivas globales como Button, Avatar, Badge o Card.
- Una biblioteca de iconos, imágenes de perfil u otros assets nuevos.
- Un componente global `AppShell`; `/` conservará su composición y `app/kids/layout.tsx` compondrá el shell de sus rutas.
- Cambios visuales en el feed, el drawer o el sidebar más allá del estado activo y la navegación habilitada.
- Cambios en `app/globals.css`, dependencias nuevas o configuración adicional de Tailwind.
- Pruebas automatizadas o infraestructura de regresión visual.

## Modelo de datos

`components/kids/kid-card.tsx` expondrá el resumen utilizado por la tarjeta y el listado:

```ts
export type KidAvatarTone = "sky" | "pink" | "green" | "yellow" | "purple";

export type KidBadgeTone = "allergy" | "link";

export type KidSummary = {
  id: number;
  name: string;
  initial: string;
  ageLabel: string;
  linkedParentsLabel: string;
  avatarTone: KidAvatarTone;
  badge?: {
    label: string;
    tone: KidBadgeTone;
  };
};

export type KidCardProps = {
  kid: KidSummary;
};
```

`components/kids/kids-list.tsx` recibirá el contexto de sala y la colección completa:

```ts
export type KidsListProps = {
  roomName: string;
  kids: readonly KidSummary[];
};
```

`components/kids/kid-profile.tsx` expondrá los datos del perfil y sus padres vinculados:

```ts
export type ParentStatus = "active" | "pending";

export type LinkedParent = {
  id: number;
  name: string;
  initial: string;
  relationshipLabel: string;
  statusLabel: string;
  status: ParentStatus;
  avatarTone: "purple" | "blue";
};

export type KidProfileData = KidSummary & {
  roomName: string;
  birthDateLabel: string;
  enrollmentLabel: string;
  note?: {
    title: string;
    body: string;
  };
  linkedParents: readonly LinkedParent[];
};

export type KidProfileProps = {
  profile: KidProfileData;
};
```

`app/kids/data.ts` exportará `kids: readonly KidProfileData[]` y una consulta local `getKidById(id: number): KidProfileData | undefined`. El listado y la ruta de perfil consumirán la misma colección para evitar diferencias de nombre, edad, avatar, badge o cantidad de padres.

Los fixtures serán exactamente los siguientes; todos pertenecen a Sala Soles y el primer padre usará `avatarTone: "purple"`, mientras que el segundo usará `avatarTone: "blue"`. Los IDs de padres seguirán el orden Lucía=1, Diego=2, Mariana=3, Paula=4, Nicolás=5, Gabriela=6, Laura=7, Martín=8 y Camila=9:

|  ID | Niño            | Nacimiento  | Ingreso  | Alerta                                                                                                | Padres vinculados                                                                              |
| --: | --------------- | ----------- | -------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
|   1 | Mateo Fernández | 12 mar 2022 | feb 2025 | `Alergias y notas`: `Alergia al maní. Evitar frutos secos. Lleva inhalador en la mochila.`            | Lucía Fernández, mamá activa; Diego Fernández, papá con invitación enviada y estado pendiente. |
|   2 | Sofía Méndez    | 8 sep 2022  | mar 2025 | Sin bloque de alerta.                                                                                 | Mariana Méndez, mamá activa.                                                                   |
|   3 | Benjamín Ruiz   | 21 nov 2021 | feb 2024 | Sin bloque de alerta.                                                                                 | Paula Ruiz, mamá activa; Nicolás Ruiz, papá activo.                                            |
|   4 | Valentina Soto  | 5 dic 2022  | abr 2025 | Sin bloque de alerta.                                                                                 | Sin padres vinculados.                                                                         |
|   5 | Tomás Díaz      | 30 ene 2022 | mar 2024 | `Alergias y notas`: `Intolerancia a la lactosa. Consumir únicamente alimentos y bebidas sin lactosa.` | Gabriela Díaz, mamá activa.                                                                    |
|   6 | Emma Castro     | 14 oct 2022 | feb 2025 | Sin bloque de alerta.                                                                                 | Laura Castro, mamá activa.                                                                     |
|   7 | Lucas Romero    | 3 may 2022  | mar 2024 | Sin bloque de alerta.                                                                                 | Martín Romero, papá activo.                                                                    |
|   8 | Olivia Vega     | 27 ago 2022 | abr 2025 | Sin bloque de alerta.                                                                                 | Camila Vega, mamá activa.                                                                      |

Los resúmenes conservarán literalmente las edades, cantidades de padres y badges de `references/pantallas/ninos.dc.html`. Mateo usará `MANÍ`, Valentina usará `VINCULAR`, Tomás usará `LACTOSA` y los otros cinco niños no tendrán badge. Los perfiles 1 y 5 mostrarán la alerta; los otros seis omitirán completamente esa región sin sustituirla por un estado neutral.

La ruta validará el parámetro como la representación decimal canónica del ID. Solo las cadenas `"1"` a `"8"` serán válidas; valores como `"01"`, `"9"`, `"mateo-fernandez"`, decimales, signos o texto devolverán el 404 estándar. `generateStaticParams` generará los ocho valores canónicos desde la colección.

No se introduce persistencia ni una fuente de datos externa. El único estado nuevo será el valor nativo y no controlado del input de búsqueda; no existirá estado React para el listado ni el perfil.

## Plan de implementación

1. Mover `sidebar.tsx` y `mobile-navigation.tsx` desde `components/feed/` a `components/navigation/`, actualizar sus importaciones internas y las de `app/page.tsx`, y comprobar que `/` conserva su presentación y comportamiento actuales.
2. Promover `viewportFit: "cover"` a `app/layout.tsx`, retirar su exportación de `app/page.tsx` y renombrar en el feed y en `MobileNavigation` los selectores a `data-page-scroll-container` y `data-page-content` sin alterar el bloqueo de scroll ni la gestión de foco.
3. Ampliar el contrato de `SidebarContent` para renderizar Feed y Niños como enlaces a `/` y `/kids`, mantener los otros controles como botones inertes y permitir que `MobileNavigation` cierre el drawer después de pulsar cualquiera de los dos enlaces.
4. Crear `app/kids/data.ts` y `components/kids/kid-card.tsx` con los ocho perfiles tipados, variantes visuales, badges, chevron, hover y enlace numérico obligatorio; verificar las ocho tarjetas sin añadir interactividad de cliente.
5. Crear `components/kids/kids-list.tsx`, `app/kids/layout.tsx` y `app/kids/page.tsx`; componer el encabezado, Agregar niño, búsqueda, separador y cuadrícula dentro del shell compartido con Niños activo.
6. Crear `components/kids/kid-profile.tsx` con la identidad, Editar, alerta opcional, detalles, Resumen del día y padres vinculados; reutilizar la misma plantilla para los ocho fixtures y mantener privadas las subpartes que no tengan otro consumidor.
7. Crear `app/kids/[id]/page.tsx`, leer el parámetro asíncrono `id`, validar su formato decimal canónico, resolver el niño mediante `getKidById`, generar los ocho parámetros estáticos y usar el 404 estándar cuando el formato o el ID no sean válidos.
8. Incorporar a las tres piezas de `components/kids/` la adaptación por debajo de 768 px, la ausencia de desbordamiento horizontal y los paddings de zonas seguras heredados del layout, sin modificar la composición de escritorio desde 768 px.
9. Comparar `/kids` y `/kids/1` a 1200 × 800 con sus respectivos HTML, recorrer `/kids/1` a `/kids/8`, revisar listado y perfiles a 390, 767 y 768 px con el drawer cerrado y abierto, comprobar rutas inválidas, navegación y controles inertes, revisar la consola y ejecutar `npm run lint -- app` y `npm run build`.

## Criterios de aceptación

- [x] `/kids` renderiza el listado y `/kids/1` a `/kids/8` renderizan respectivamente los perfiles de Mateo, Sofía, Benjamín, Valentina, Tomás, Emma, Lucas y Olivia.
- [x] `/kids/01`, `/kids/9`, `/kids/mateo-fernandez` y cualquier parámetro no canónico o desconocido muestran el 404 estándar sin renderizar datos de otro niño.
- [x] `app/kids/data.ts` contiene una sola colección con los ocho perfiles completos aprobados, sin API, fetch, persistencia ni duplicación entre datos de listado y perfil.
- [x] `components/kids/kid-card.tsx`, `components/kids/kids-list.tsx` y `components/kids/kid-profile.tsx` existen y reciben los datos mediante los contratos tipados definidos en esta spec.
- [x] Las ocho tarjetas se renderizan con un único `KidCard` y claves estables basadas en `id`.
- [x] El listado muestra literalmente los nombres, edades, cantidades de padres, iniciales y badges de `references/pantallas/ninos.dc.html`.
- [x] Las ocho tarjetas son enlaces accesibles y cada una navega al ID numérico que le corresponde entre `/kids/1` y `/kids/8`.
- [x] Todas las tarjetas conservan el borde, elevación y cambio de borde del hover mostrado en la referencia.
- [x] El input muestra `Buscar niño…`, acepta texto sin estado React y escribir no oculta, ordena ni modifica ninguna tarjeta.
- [x] Agregar niño se presenta como botón, pero no cambia la URL, no modifica contenido y no realiza solicitudes de red.
- [x] `/kids/1` muestra literalmente el nombre, edad, sala, fecha de nacimiento, ingreso, alerta, padres, relaciones y estados de `references/pantallas/perfil-nino.dc.html`.
- [x] `/kids/2` a `/kids/8` reutilizan la misma plantilla visual y muestran exactamente los nombres, fechas, ingresos, alertas y padres aprobados en la tabla de fixtures.
- [x] Solo Mateo y Tomás muestran el bloque `Alergias y notas`; los otros seis perfiles omiten por completo esa región y no muestran un estado neutral.
- [x] Mateo y Benjamín muestran dos filas de padres, Sofía, Tomás, Emma, Lucas y Olivia muestran una, y Valentina no muestra ninguna fila de padre.
- [x] Volver a Niños navega desde el perfil a `/kids`.
- [x] Editar, Resumen del día y Vincular otro padre se presentan como controles, pero no cambian la URL, no modifican contenido y no realizan solicitudes de red.
- [x] `app/kids/layout.tsx` compone una sola vez el sidebar, la navegación móvil, el contenedor de scroll y el wrapper de contenido para `/kids` y `/kids/[id]`.
- [x] El sidebar y el drawer se importan desde `components/navigation/`; no permanecen copias bajo `components/feed/` ni `components/kids/`.
- [x] Feed navega a `/`, Niños navega a `/kids` y el estado activo correcto se comunica visualmente y mediante `aria-current` en cada ruta.
- [x] En el drawer móvil, pulsar Feed o Niños cierra el panel incluso cuando el destino ya está activo.
- [x] Avisos, Mi cuenta, Nueva publicación y Cerrar sesión permanecen inertes en escritorio y móvil.
- [x] Abrir y cerrar el drawer conserva el bloqueo del scroll, el contenido inerte, Escape, overlay, contención de foco, restauración de foco y transiciones aprobados en SPEC 04.
- [x] `app/layout.tsx` exporta la única configuración `viewportFit: "cover"` y `app/page.tsx` deja de exportarla.
- [x] `/`, `/kids` y las ocho rutas de perfil usan `data-page-scroll-container` y `data-page-content`; no quedan selectores `data-feed-scroll-container` ni `data-feed-content`.
- [x] A 1200 × 800, `/kids` coincide con `references/pantallas/ninos.dc.html` en estructura, tipografías, colores, dimensiones, espaciados, bordes, sombras, radios, SVG y contenido; solo se admiten diferencias de rasterizado y antialiasing.
- [x] A 1200 × 800, `/kids/1` coincide con `references/pantallas/perfil-nino.dc.html` bajo el mismo criterio de fidelidad.
- [x] A 1200 × 800, `/kids/2` a `/kids/8` conservan la estructura, medidas, tipografías, colores, componentes y estados de la plantilla de perfil, con las variaciones de contenido aprobadas.
- [x] Por debajo de 768 px el listado usa una columna, la cabecera se adapta al ancho disponible y no existe desbordamiento horizontal.
- [x] Por debajo de 768 px el perfil sigue el orden identidad, Editar, alerta, datos, Resumen del día y padres vinculados, sin comprimir regiones en columnas laterales.
- [x] A 390 y 767 px la cabecera móvil, el contenido y el drawer respetan los insets de zona segura en orientación vertical y horizontal.
- [x] A 768 px se oculta la navegación móvil, aparece el sidebar de 248 px y ambas interfaces adoptan su composición de escritorio sin saltos ni scroll horizontal.
- [x] El sidebar permanece fijo y `main` es el único contenedor desplazable en escritorio; en móvil la cabecera queda fuera de ese scroll como en SPEC 04.
- [x] Ningún archivo de `components/kids/` ni ninguna página nueva contiene `"use client"`, hooks, efectos o estado React.
- [x] `app/globals.css` permanece sin cambios.
- [x] No se incorporan dependencias, assets, configuración adicional de Tailwind, `AppShell`, 404 personalizado ni infraestructura de pruebas.
- [x] La ruta `/` conserva la interfaz del feed aprobada en SPEC 04 después de mover la navegación, promover el viewport y renombrar los marcadores DOM.
- [x] La consola del navegador no muestra errores al cargar, navegar, escribir en la búsqueda ni operar el drawer.
- [x] `npm run lint -- app` finaliza correctamente.
- [x] `npm run build` finaliza correctamente.

## Decisiones

- **Sí:** usar `/kids` y `/kids/[id]`. Las rutas y los nombres de código deben estar en inglés aunque la interfaz visible permanezca en español.
- **Sí:** usar los IDs numéricos `1` a `8` en el orden del listado. Los nombres no son identificadores seguros porque dos niños pueden compartir nombre y apellido.
- **No:** usar nombres o slugs en la URL. La identidad de la ruta no debe depender del contenido visible ni de su unicidad.
- **Sí:** aceptar únicamente la representación decimal canónica de cada ID. `/kids/01`, IDs fuera de rango y slugs devolverán 404 en lugar de normalizarse o conservar compatibilidad innecesaria.
- **Sí:** implementar los ocho perfiles con los fixtures completos aprobados. La referencia de Mateo define la plantilla y los otros siete perfiles varían solo en sus datos y regiones opcionales.
- **Sí:** usar el 404 estándar para cualquier otro identificador. Un diseño de error personalizado no forma parte de las pantallas solicitadas.
- **Sí:** mantener una única colección estática y tipada en `app/kids/data.ts`. Listado y perfiles deben compartir la misma fuente para evitar inconsistencias.
- **Sí:** hacer que `KidProfileData` extienda `KidSummary` y que `note` sea opcional. Todos los niños comparten datos de tarjeta y solo Mateo y Tomás necesitan alerta.
- **Sí:** omitir por completo la alerta cuando no exista una nota. No se inventará un bloque neutral ausente de las referencias y decisiones aprobadas.
- **Sí:** separar `KidCard`, `KidsList` y `KidProfile`. La tarjeta se repite ocho veces y las otras dos piezas representan regiones completas con responsabilidades distintas.
- **No:** fragmentar cabeceras, alertas, detalles, badges o padres en componentes públicos adicionales. Esas subpartes todavía no tienen consumidores independientes.
- **No:** crear primitivas genéricas de design system. Esta spec solo demuestra reutilización dentro del dominio de niños y la navegación ya compartida.
- **Sí:** mover el sidebar y la navegación móvil a `components/navigation/`. Su uso deja de pertenecer exclusivamente al feed.
- **Sí:** habilitar únicamente Feed y Niños. Son los únicos destinos implementados después de esta spec.
- **Sí:** cerrar el drawer móvil después de pulsar Feed o Niños. La selección debe descubrir inmediatamente el contenido de destino, incluso cuando se pulse el enlace activo.
- **No:** habilitar Avisos, Mi cuenta, publicación o cierre de sesión. Sus flujos no están definidos y requieren specs independientes.
- **Sí:** compartir el shell de las dos rutas de niños mediante `app/kids/layout.tsx`. Evita duplicar navegación, scroll y zonas seguras entre listado y perfil.
- **No:** crear un `AppShell` global. El feed puede conservar su composición actual y esta funcionalidad solo necesita compartir el shell dentro del segmento `/kids`.
- **Sí:** promover `viewportFit: "cover"` a `app/layout.tsx`. La configuración deja de ser exclusiva del feed y debe existir una sola vez para toda la aplicación.
- **Sí:** renombrar los marcadores `data-feed-*` como `data-page-*`. El contrato de bloqueo pasa a servir a más de un dominio.
- **Sí:** conservar el input como control nativo no controlado. Permite reproducir la interfaz sin añadir estado o fingir una búsqueda funcional.
- **Sí:** adaptar el contenido a un flujo vertical por debajo de 768 px. Mantiene legibilidad y evita scroll horizontal donde no existe una referencia móvil literal.
- **Sí:** usar los dos `.dc.html` citados como autoridad visual. Las capturas existentes no reemplazan ni corrigen su contenido.
- **Sí:** validar visualmente con Playwright sin añadir snapshots automatizados. Es suficiente para estas interfaces estáticas y respeta la infraestructura actual del proyecto.

## Riesgos

| Riesgo                                                                                                       | Mitigación                                                                                                                               |
| ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Mover la navegación puede producir una regresión visual o romper importaciones en `/`.                       | Conservar el marcado y clases existentes, actualizar todas las importaciones y comparar el feed antes de continuar con las rutas nuevas. |
| Convertir dos ítems en enlaces puede romper el cierre, foco o bloqueo de scroll del drawer.                  | Proporcionar un callback de navegación desde `MobileNavigation` y repetir todas las verificaciones modales aprobadas en SPEC 04.         |
| Un selector `data-feed-*` remanente puede dejar una ruta interactiva o desplazable detrás del drawer.        | Renombrar el contrato en una sola etapa y buscar cualquier ocurrencia antigua antes de verificar todas las rutas.                        |
| La ruta dinámica puede normalizar `01`, aceptar texto o mostrar un perfil incorrecto para un ID desconocido. | Comparar el parámetro con la representación canónica del ID y ejecutar `notFound()` antes de renderizar cuando no coincida.              |
| El listado y los perfiles pueden divergir si mantienen resúmenes y detalles por separado.                    | Conservar los ocho registros completos en una única colección y derivar de ella tarjetas, rutas estáticas y perfiles.                    |
| Un perfil sin alerta puede conservar un hueco vacío o romper el ritmo vertical.                              | Renderizar condicionalmente la región completa y verificar perfiles con y sin nota en escritorio y móvil.                                |
| La cantidad visible de padres puede no coincidir con las filas del perfil.                                   | Fijar ambas representaciones en el mismo registro y comprobar los casos de cero, uno y dos padres.                                       |
| La adaptación móvil puede alterar dimensiones aprobadas en escritorio.                                       | Encapsular los cambios bajo el breakpoint de 768 px y comparar ambas rutas a 767, 768 y 1200 px.                                         |
| El perfil puede desbordarse por nombres, badges o estados dentro de la columna lateral.                      | Conservar los anchos de escritorio de la referencia y apilar todas las regiones en móvil sin fijar anchos incompatibles.                 |
| Las diferencias entre los HTML y las capturas existentes pueden provocar una comparación contradictoria.     | Tratar exclusivamente los dos HTML citados como autoridad para estructura, contenido y medidas.                                          |

## Lo que **no** incluye esta spec

- Operaciones reales de alta, edición o eliminación de niños.
- Perfiles adicionales fuera de los ocho fixtures aprobados.
- Búsqueda o filtrado funcional.
- Resumen del día o gestión de padres.
- API, persistencia, autenticación o autorización.
- Navegación funcional para destinos distintos de Feed y Niños.
- Un design system, una biblioteca de iconos o assets nuevos.
- Un `AppShell` global, un 404 personalizado o estados remotos.
- Cambios visuales en el feed y la navegación compartida.
- Dependencias o pruebas automatizadas nuevas.

Cada acción de gestión, niño adicional o integración con datos reales debe definirse en su propia spec.
