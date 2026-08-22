# SPEC 10 — Diálogo para nueva publicación

> **Estado:** Implementado
> **Depende de:** SPEC 01, SPEC 02, SPEC 03
> **Fecha:** 2026-08-21
> **Objetivo:** Implementar el diálogo Nueva publicación sobre `/` abierto desde el botón del sidebar/drawer y el prompt del feed, con destinatarios múltiples, tipo único y alta efímera de publicaciones en el feed, sin backend ni persistencia.

## Alcance

**Incluye:**

- Crear `components/feed/new-post-dialog.tsx` con la interfaz de `references/pantallas/crear-publicacion.dc.html` presentada como diálogo modal sobre `/`.
- Crear `components/feed/feed-screen.tsx` como componente cliente que posee la apertura del diálogo y la colección efímera de publicaciones, y renderiza el armazón completo de `/` (sidebar, navegación móvil, encabezado, prompt, divisor, tarjetas y diálogo).
- Modificar `app/page.tsx` para mantener los fixtures en el servidor, derivar los destinatarios desde `app/kids/data.ts` y renderizar `FeedScreen`.
- Modificar `components/navigation/sidebar.tsx` añadiendo la prop opcional `onNewPost` que conecta el botón Nueva publicación.
- Modificar `components/navigation/mobile-navigation.tsx` añadiendo la prop opcional `onNewPost`: el botón del drawer cierra el drawer y abre el diálogo.
- Modificar `components/feed/composer-prompt.tsx` para aceptar `onClick` opcional y abrir el diálogo desde Compartí un momento…
- Reproducir la cabecera con Cancelar (izquierda, `#94887B`, 700, 15 px), el título Nueva publicación (Fredoka, 600, 18 px, `#3F362E`) y Publicar (derecha, coral `#D9583C`, 800, 15 px).
- Reproducir la tarjeta de 580 px de ancho máximo, fondo `#FBF4EC`, borde `#ECE0D0`, radio 24 px y sombra `0 20px 50px -24px rgba(63,54,46,.35)`; cabecera 20 × 26 px y cuerpo 24 × 26 px con su separador.
- Reproducir las etiquetas PARA, TIPO, DESCRIPCIÓN y FOTOS en mayúsculas de 12 px, peso 800 y espaciado 0,7 px en `#94887B`.
- Implementar PARA como selección múltiple de niños con chips pill (avatar 26 px con inicial y tono del fixture; activo con fondo/borde `#3F362E` y texto blanco; inactivo con fondo `#FFFDF9`, borde `#ECE0D0` y texto `#6E6359`) más el chip Toda la sala sin avatar: activar Toda la sala desmarca todos los niños y activar un niño desmarca Toda la sala; pulsar un niño marcado lo desmarca.
- Derivar los chips de destinatarios desde los 8 niños de `app/kids/data.ts` (nombre de pila = primera palabra del nombre, inicial y `avatarTone` del fixture).
- Implementar TIPO como selección única de los siete tipos de la referencia con sus colores literales (Comida `#9A7B1E` blanco, Siesta `#E7DCF6`/`#7B5FC0`, Actividad `#2E89A6` blanco, Logro `#CFEBD8`/`#3E9B6C`, Ánimo `#F9D2DE`/`#C56486`, Foto `#FBD8CC`/`#D9684A`, Anuncio `#CCD8F4`/`#4E72C8`): el tipo activo se muestra a opacidad plena y los inactivos al 45 %; pulsar el tipo activo lo desmarca.
- Implementar la descripción como textarea blanca de 120 px de altura mínima, radio 14 px, borde 1,5 px `#EADFD0` y padding 14 × 16 px con placeholder `Contá cómo le fue hoy…`, inicialmente vacía.
- Implementar FOTOS en memoria: inicialmente solo el mosaico Agregar (96 × 96, borde discontinuo `#DBCDBA`, icono `#C5503A`, texto Agregar); cada pulsación añade un mosaico de foto (96 × 96, icono de imagen `#CBB89F`) y pulsar un mosaico añadido lo quita; los mosaicos no afectan a la tarjeta efímera.
- Validar al pulsar Publicar: sin destinatario → `Selecciona al menos un destinatario.`; sin tipo → `Selecciona un tipo de publicación.`; descripción vacía (tras recortar espacios) → `Ingresa una descripción.`; errores inline en coral `#D9583C`, el diálogo no se cierra y el foco pasa a la primera sección inválida (primer chip PARA, primer chip TIPO o el textarea).
- Limpiar el error de cada sección en cuanto se edita tras un intento fallido.
- Al publicar con datos válidos: cerrar el diálogo, restablecer el formulario y añadir una publicación efímera al final de PUBLICADO HOY.
- Derivar la publicación efímera mapeando a los kinds existentes de `PostCard`: Anuncio → announcement; Foto y Actividad → activity con `photoPlaceholder` `Fotos de la publicación`; Comida, Siesta, Logro y Ánimo → achievement.
- Derivar cabecera y audiencia: Toda la sala → `Sala Soles`/`S` y `toda la sala`; un niño → su nombre de pila e inicial y `familia de {nombre}`; varios niños → `Varios niños`/`V` y `familias de {a, b y c}`; announcement usa el título `Anuncio general`.
- Usar `publicado por vos` como authorLabel, la hora local en formato HH:MM como publishedAt, 0 reacciones y 0 comentarios, y el id `new-post-{n}` con contador ascendente.
- Renderizar el diálogo mediante un portal en `document.body` con overlay oscuro semitransparente y los niveles de profundidad del drawer (overlay 45, tarjeta 50), replicando el contrato de accesibilidad de SPEC 08: `role="dialog"` con `aria-modal`, etiquetado por el título, foco inicial en el primer chip PARA, cierre con Escape, Cancelar y overlay, contención de foco con Tab, fondo `inert` y `aria-hidden`, bloqueo del scroll del contenedor de página y restauración del foco al elemento que abrió el diálogo (botón del sidebar, prompt o botón del menú móvil cuando se abrió desde el drawer), capturando `document.activeElement` en el efecto de apertura.
- Usar un formulario nativo cuyo envío se intercepta con `preventDefault`: Publicar es el botón submit y la página no se recarga ni navega.
- Restablecer el formulario (sin destinatarios, sin tipo, descripción vacía, sin mosaicos, sin errores) al cerrar por cualquier vía.
- Mantener el alta efímera solo en memoria: al recargar `/` se restauran las tres publicaciones del fixture.
- Mantener `/kids` sin cambios: el botón Nueva publicación allí sigue sin acción y no existe diálogo en esa ruta.
- Adaptar el diálogo por debajo de 768 px: tarjeta al ancho disponible con padding reducido, altura máxima con scroll interno y sin desbordamiento horizontal.

**Fuera de alcance (para futuras specs):**

- Backend, API, base de datos, persistencia real o sincronización entre rutas.
- Guardar en `localStorage`, cookies, sesión o cualquier mecanismo del navegador.
- Modificar `PostCard`: los tipos nuevos se mapean a los kinds existentes y el badge no refleja el tipo original.
- Conectar el botón Nueva publicación en `/kids`.
- Subida real de archivos, previsualización de imágenes reales o galería.
- Editar o eliminar publicaciones efímeras, toasts, confirmaciones o estados de envío en curso.
- Validaciones adicionales (longitud máxima de descripción, límite de fotos).
- Modificar `app/kids/data.ts`, los fixtures del feed, `app/globals.css`, la navegación más allá de las props opcionales.
- Añadir dependencias, componentes genéricos compartidos o infraestructura de pruebas automatizadas.

## Modelo de datos

`components/feed/new-post-dialog.tsx` expondrá:

```ts
export type NewPostType =
  | "comida"
  | "siesta"
  | "actividad"
  | "logro"
  | "animo"
  | "foto"
  | "anuncio";

export type NewPostRecipientKid = {
  id: number;
  firstName: string;
  initial: string;
  avatarTone: KidAvatarTone;
};

export type NewPostDraft = {
  kidIds: number[];
  isWholeRoom: boolean;
  type: NewPostType;
  description: string;
  photoCount: number;
};

export type NewPostDialogProps = {
  isOpen: boolean;
  kids: readonly NewPostRecipientKid[];
  onClose: () => void;
  onPublish: (draft: NewPostDraft) => void;
};
```

- El diálogo mantiene estado interno controlado para `kidIds`, `isWholeRoom`, `type` (`NewPostType | null`), `description`, el número de mosaicos y marcas de error por sección (`recipients`, `type`, `description`).
- `KidAvatarTone` se importa como tipo desde `@/components/kids/kid-card`; el diálogo define su propio mapa de tonos a 26 px (sky `#A9D9E8`/`#1F7A93`, pink `#F4B8CC`/`#C44A7A`, green `#B9DEC4`/`#3E8B62`, yellow `#F4DC8E`/`#9A7B1E`, purple `#C9B6E8`/`#7B5FC0`).

`components/feed/feed-screen.tsx` será un componente cliente con:

```ts
export type FeedScreenProps = {
  posts: readonly FeedPost[];
  recipientKids: readonly NewPostRecipientKid[];
  sidebarProps: SidebarProps;
  headerProps: FeedHeaderProps;
};
```

- Mantiene en estado la apertura del diálogo y la colección efímera; renderiza `[...posts, ...ephemeralPosts]` en orden.
- Deriva de cada `NewPostDraft` un `FeedPost`:

| Campo                         | Valor derivado                                                                                    |
| ----------------------------- | ------------------------------------------------------------------------------------------------- |
| `id`                          | `new-post-{n}` con contador ascendente desde 1                                                    |
| `kind`                        | `anuncio` → announcement; `foto`/`actividad` → activity; resto → achievement                      |
| `childName`/`childInitial`    | Toda la sala → `Sala Soles`/`S`; un niño → nombre de pila e inicial; varios → `Varios niños`/`V`  |
| `title` (announcement)        | `Anuncio general`                                                                                 |
| `audience`                    | Toda la sala → `toda la sala`; un niño → `familia de {nombre}`; varios → `familias de {a, b y c}` |
| `publishedAt`                 | Hora local al publicar en formato HH:MM (24 h)                                                    |
| `authorLabel`                 | `publicado por vos`                                                                               |
| `body`                        | `description` sin espacios externos                                                               |
| `photoPlaceholder` (activity) | `Fotos de la publicación`                                                                         |
| `reactions`/`comments`        | `0`/`0`                                                                                           |

`components/navigation/sidebar.tsx` y `components/navigation/mobile-navigation.tsx` añaden `onNewPost?: () => void` a sus props; `components/feed/composer-prompt.tsx` añade `onClick?: () => void`. Sin la prop, el comportamiento es el actual (sin acción).

## Plan de implementación

1. Añadir las props opcionales en `sidebar.tsx`, `mobile-navigation.tsx` (clic → cerrar drawer y llamar `onNewPost`) y `composer-prompt.tsx`; comprobar que `/` y `/kids` quedan funcionando sin cambios.
2. Crear `components/feed/new-post-dialog.tsx` con el portal a `document.body`, el overlay, la tarjeta de la referencia, los chips PARA multi-select con exclusión de Toda la sala, el selector TIPO single-select con distinción por opacidad, el textarea, los mosaicos FOTOS, la validación inline y el contrato modal completo (Escape, overlay, Cancelar, contención de foco, inert, bloqueo de scroll, foco inicial, restauración de foco y formulario interceptado).
3. Crear `components/feed/feed-screen.tsx` con el estado del diálogo y la colección efímera, la derivación de `FeedPost` desde `NewPostDraft` y el armazón completo de la página.
4. Modificar `app/page.tsx` para derivar `recipientKids` de `app/kids/data.ts` en el servidor y renderizar `FeedScreen`; comprobar que el feed inicial es idéntico al actual.
5. Verificar con Playwright: apertura por las tres vías, cierre del drawer al abrir, foco y contención de Tab, validación y limpieza de errores, publicación con un niño, varios niños, Toda la sala y cada mapeo de tipo, mosaicos, recarga de la ruta, `/kids` sin cambios, diálogo a 390, 767, 768 y 1200 px y consola sin errores.
6. Ejecutar `npm run lint -- app` y `npm run build`.

## Criterios de aceptación

- [x] El botón Nueva publicación del sidebar desktop en `/` abre el diálogo sin navegar ni cambiar la URL.
- [x] El botón Nueva publicación del drawer móvil cierra el drawer y abre el diálogo; el foco inicial queda en el primer chip PARA y, al cerrar, vuelve al botón del menú móvil.
- [x] El prompt Compartí un momento… abre el diálogo y, al cerrar, el foco vuelve al prompt.
- [x] En `/kids` el botón Nueva publicación sigue sin acción y no se renderiza ningún diálogo.
- [x] Al abrirse, el foco pasa al primer chip PARA y el Tab permanece dentro del diálogo; el fondo queda `inert` y `aria-hidden`, y el scroll se bloquea hasta cerrarlo.
- [x] Cancelar, Escape y el overlay cierran sin publicar, sin solicitudes de red y restablecen el formulario.
- [x] Se pueden marcar varios niños a la vez; Toda la sala desmarca todos los niños y activar un niño desmarca Toda la sala.
- [x] Exactamente un tipo puede estar activo, se distingue visualmente de los inactivos y pulsarlo de nuevo lo desmarca.
- [x] Publicar con todo vacío muestra literalmente `Selecciona al menos un destinatario.`, `Selecciona un tipo de publicación.` e `Ingresa una descripción.` en coral `#D9583C`, no cierra el diálogo y el foco pasa a la primera sección inválida.
- [x] Marcar un destinatario, elegir un tipo o escribir en la descripción elimina el error de esa sección tras un intento fallido.
- [x] Agregar añade mosaicos de foto y pulsar un mosaico lo quita; al cerrar la sección vuelve a mostrar solo Agregar.
- [x] Publicar con un único niño añade una tarjeta con su nombre e inicial, `Para: familia de {nombre}`, la hora actual en HH:MM, `publicado por vos` y 0 reacciones y comentarios.
- [x] Publicar con varios niños muestra `Varios niños` con inicial `V` y `Para: familias de {a, b y c}`.
- [x] Publicar con Toda la sala muestra `Sala Soles`/`S` y `Para: toda la sala`; con tipo Anuncio muestra el título `Anuncio general` y badge ANUNCIO.
- [x] Los tipos Foto y Actividad muestran el placeholder `Fotos de la publicación`; Comida, Siesta, Logro y Ánimo se muestran con badge LOGRO.
- [x] Reabrir el diálogo tras cerrarlo muestra el formulario en su estado inicial sin errores.
- [x] Recargar `/` restaura exactamente las tres publicaciones del fixture.
- [x] A 1200 × 800 la tarjeta del diálogo coincide con `references/pantallas/crear-publicacion.dc.html` en estructura, tipografías, colores, medidas, espaciados, bordes, sombras y radios; solo se admiten las adaptaciones acordadas (overlay de modal, estados de error, chips sin preselección, distinción de tipo por opacidad y estado inicial de FOTOS) y diferencias de rasterizado.
- [x] Por debajo de 768 px el diálogo ocupa el ancho disponible sin desbordamiento horizontal y la tarjeta se desplaza internamente en viewports bajos.
- [x] Los únicos archivos de aplicación creados o modificados son `components/feed/new-post-dialog.tsx`, `components/feed/feed-screen.tsx`, `components/feed/composer-prompt.tsx`, `components/navigation/sidebar.tsx`, `components/navigation/mobile-navigation.tsx` y `app/page.tsx`.
- [x] Ningún valor se envía a una URL, se escribe en almacenamiento del navegador ni genera solicitudes de red.
- [x] La consola del navegador no muestra errores al abrir, validar, publicar, cancelar ni recargar.
- [x] `npm run lint -- app` finaliza correctamente.
- [x] `npm run build` finaliza correctamente.

## Decisiones

- **Sí:** alta efímera en memoria al publicar. Precedente de SPEC 08/09; permite ver el resultado sin fingir un backend inexistente.
- **Sí:** mapear los tipos nuevos a los kinds existentes de `PostCard`. Evita tocar el feed; el coste asumido es que el badge no refleja el tipo original (Comida se publica como LOGRO).
- **Sí:** abrir el diálogo solo en `/` desde tres disparadores (sidebar, drawer y prompt). Petición explícita; `/kids` queda sin cambios.
- **Sí:** chips de destinatarios derivados de los fixtures con nombre de pila. Evita hardcodear y mantiene los tonos de avatar coherentes con el resto de la app.
- **Sí:** selección múltiple de niños con Toda la sala excluyente. Petición explícita del usuario.
- **Sí:** TIPO single-select con distinción por opacidad (activo 100 %, inactivo 45 %). La referencia no define estado de selección en TIPO; preserva la fila colorida con retroalimentación clara.
- **Sí:** nada preseleccionado y todo obligatorio. Hace reales las tres validaciones; los defaults de la referencia eran estáticos del mock.
- **Sí:** capturar `document.activeElement` en el efecto de apertura para la restauración de foco. Resuelve los tres disparadores sin plomería de refs; al abrirse desde el drawer, el cierre de este ya habrá enfocado el botón del menú.
- **Sí:** copys derivados `Varios niños`, `familias de…`, `Fotos de la publicación` y `Anuncio general`. Deterministas y coherentes con los literales del fixture.
- **Sí:** mosaicos en memoria removibles con clic. Sin archivos reales, el álbum es decorativo pero manejable.
- **No:** tocar `PostCard`, los fixtures o `/kids`. El cambio vive en el feed y en props opcionales de navegación.
- **No:** subida real de fotos, persistencia, toasts ni edición. Sin backend no hay mecanismo real detrás.
- **No:** extraer primitivas de modal compartidas pese a ser el tercer diálogo. Mantener la replicación del patrón aprobado; el refactor irá en su propia spec si procede.

## Riesgos

| Riesgo                                                                                          | Mitigación                                                                                                                                                                           |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| El orden de efectos drawer→diálogo puede afectar foco, scroll o inert en la misma confirmación. | Las limpiezas del drawer se ejecutan antes que los efectos del diálogo (hermano posterior); verificar la secuencia con Playwright y, si flaquea, enfocar en `requestAnimationFrame`. |
| El diálogo y el drawer comparten niveles de profundidad (45/50).                                | El drawer se cierra siempre antes de abrir el diálogo; no coexisten.                                                                                                                 |
| La hora local depende del dispositivo.                                                          | Formato HH:MM de 24 horas explícito, verificado con expresión `\d{2}:\d{2}`.                                                                                                         |
| `/` pasa a depender de `app/kids/data.ts`.                                                      | Importación de módulo compartido de solo lectura con derivación en el servidor; sin acoplamiento de escritura.                                                                       |
| Copys inventados (`Varios niños`, `Fotos de la publicación`) pueden no gustar.                  | Documentados en decisiones; son literales de un solo lugar, fáciles de ajustar.                                                                                                      |
| Perder las publicaciones al recargar puede parecer un fallo.                                    | Comportamiento acordado y documentado: la persistencia queda fuera de alcance hasta que exista backend.                                                                              |

## Lo que **no** incluye esta spec

- Backend, API, persistencia real o sincronización entre rutas.
- Modificar `PostCard` ni reflejar los tipos nuevos en los badges del feed.
- Conectar el botón Nueva publicación en `/kids`.
- Subida real de fotos, edición o eliminación de publicaciones.
- Validaciones adicionales, toasts o estados de envío.
- Cambios en fixtures, estilos globales, dependencias o pruebas automatizadas.

Cada integración con backend, persistencia o gestión de publicaciones debe definirse en su propia spec.
