# SPEC 08 — Modal para agregar niño

> **Estado:** Aprobado
> **Depende de:** SPEC 05, SPEC 06
> **Fecha:** 2026-08-20
> **Objetivo:** Implementar el diálogo Agregar niño sobre `/kids` con validación de campos obligatorios en el cliente y alta de tarjetas efímeras en memoria, sin backend ni persistencia.

## Alcance

**Incluye:**

- Crear `components/kids/add-kid-dialog.tsx` con la interfaz de `references/pantallas/agregar-nino.dc.html` presentada como diálogo modal sobre `/kids`.
- Modificar `components/kids/kids-list.tsx` para abrir el diálogo desde el botón Agregar niño existente y mantener la colección efímera de niños añadidos.
- Modificar `components/kids/kid-card.tsx` para admitir una variante sin enlace destinada a los niños efímeros sin perfil.
- Mantener todos los textos visibles en español y usar inglés para rutas, carpetas, archivos, componentes, tipos y variables.
- Reproducir del HTML la cabecera con Cancelar (izquierda, gris `#94887B`), el título Agregar niño (Fredoka, 18 px) y Guardar (derecha, coral `#D9583C`).
- Reproducir la tarjeta de 520 px de ancho máximo, fondo `#FBF4EC`, borde `#ECE0D0`, radio 24 px y sombra de la referencia; cabecera y cuerpo con sus paddings y separadores exactos.
- Reproducir las etiquetas en mayúsculas de 12 px con peso 800 y espaciado 0,7 px, y los inputs blancos con radio 14 px, borde 1,5 px `#EADFD0` y padding 13 × 16 px.
- Implementar cinco campos: Nombre completo (texto, placeholder `Ej. Martina López`, obligatorio), Fecha de nacimiento (`type="date"` nativo, obligatorio), Sala (select nativo, obligatorio), Alergias (texto opcional, placeholder `Ej. Maní, Lactosa`) y Notas médicas (textarea opcional de 90 px de altura mínima).
- Ofrecer en Sala exactamente tres opciones hardcodeadas: `Soles`, `Lunas` y `Estrellas`, precedidas por una opción vacía deshabilitada `Selecciona una sala`.
- Mantener Fecha de nacimiento y Sala en una fila de dos columnas iguales con separación de 14 px, apiladas por debajo de 768 px.
- Validar al pulsar Guardar: cada obligatorio vacío muestra borde y mensaje coral `#D9583C`; Guardar no cierra mientras falte alguno y el foco pasa al primer campo inválido.
- Limpiar el error de un campo en cuanto se edita o se selecciona un valor tras un intento fallido.
- Al guardar con datos válidos: cerrar el diálogo, restablecer el formulario y añadir una tarjeta efímera al final de la cuadrícula.
- Derivar la tarjeta efímera: nombre con espacios externos eliminados, inicial en mayúscula, edad calculada, `sin padres vinculados`, tono de avatar rotativo y badge según alergias.
- Calcular la edad al guardar: años cumplidos (`3 años`) o meses cumplidos por debajo de un año (`8 meses`), con singular y plural.
- Mostrar en la tarjeta el badge de la primera alergia en mayúsculas con tono allergy cuando existan alergias, y `VINCULAR` con tono link cuando no existan.
- Hacer que la tarjeta efímera participe en el filtrado por nombre de SPEC 06 y en el contador visible.
- Presentar la tarjeta efímera sin enlace: no navega, no cambia la URL y no realiza solicitudes.
- Renderizar el diálogo mediante un portal en `document.body` con overlay oscuro semitransparente y los niveles de profundidad del drawer (overlay 45, tarjeta 50).
- Replicar el contrato de accesibilidad del drawer: `role="dialog"` con `aria-modal`, etiquetado por el título Agregar niño, foco inicial en el primer campo, cierre con Escape, cierre al pulsar el overlay, contención de foco con Tab, fondo `inert` y `aria-hidden`, bloqueo del scroll del contenedor de página y restauración del foco al botón Agregar niño al cerrar.
- Hacer que Cancelar, Escape y el overlay cierren sin añadir la tarjeta y restablezcan el formulario.
- Usar un formulario nativo cuyo envío se intercepta: Enter en los campos intenta guardar como Guardar, sin recargar la página ni navegar.
- Adaptar el diálogo por debajo de 768 px: tarjeta al ancho disponible con padding reducido, altura máxima con scroll interno y sin desbordamiento horizontal.
- Mantener la alta efímera solo en memoria: al recargar `/kids` o volver a montar la ruta se restauran las ocho tarjetas originales.

**Fuera de alcance (para futuras specs):**

- Backend, API, base de datos, mutaciones o persistencia real de niños.
- Guardar en `localStorage`, cookies, sesión o cualquier mecanismo del navegador.
- Navegación a un perfil para la tarjeta efímera o creación de rutas nuevas.
- Editar o eliminar niños, incluida la tarjeta efímera.
- Validar fecha futura, formato de etiquetas de alergias, longitudes máximas o cualquier regla adicional a la obligatoriedad.
- Toasts, confirmaciones de éxito o estados de guardado en curso.
- Usar los valores de Sala y Notas médicas más allá de recogerlos y validarlos.
- Modificar `app/kids/data.ts`, `app/kids/page.tsx`, `app/kids/layout.tsx`, la navegación, el feed o `app/globals.css`.
- Añadir dependencias, componentes genéricos compartidos o infraestructura de pruebas automatizadas.

## Modelo de datos

`components/kids/add-kid-dialog.tsx` expondrá:

```ts
export type AddKidDialogRoom = "Soles" | "Lunas" | "Estrellas";

export type NewKidDraft = {
  fullName: string;
  birthDate: string;
  room: AddKidDialogRoom;
  allergies: string;
  medicalNotes: string;
};

export type AddKidDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddKid: (draft: NewKidDraft) => void;
};
```

- `birthDate` conservará el valor `yyyy-mm-dd` del input date nativo.
- `room` será siempre una de las tres salas válidas tras superar la validación.
- `allergies` y `medicalNotes` serán cadenas posiblemente vacías.

El diálogo mantendrá estado interno controlado para los cinco campos y marcas de error por cada obligatorio (`fullName`, `birthDate`, `room`). Ningún valor se enviará ni persistirá; el envío del formulario se intercepta con `preventDefault`.

`components/kids/kid-card.tsx` pasará a aceptar:

```ts
export type KidCardProps = {
  kid: KidSummary;
  href?: string;
};
```

- Con `href` definido renderizará el enlace actual; sin `href` renderizará una tarjeta estática visualmente idéntica, sin navegación.
- La llamada existente en `kids-list.tsx` pasará `href={`/kids/${kid.id}`}` de forma explícita; las tarjetas efímeras omitirán la prop.

`components/kids/kids-list.tsx` añadirá la colección efímera en estado y derivará de cada `NewKidDraft` un `KidSummary` con:

| Campo                | Valor derivado                                                                           |
| -------------------- | ---------------------------------------------------------------------------------------- |
| `id`                 | Contador local descendente desde `-1` (claves estables sin colisión con `1`–`8`)         |
| `name`               | `fullName` sin espacios externos                                                         |
| `initial`            | Primera letra del nombre en mayúscula                                                    |
| `ageLabel`           | Años cumplidos o meses cumplidos por debajo de un año, con singular y plural             |
| `linkedParentsLabel` | `sin padres vinculados`                                                                  |
| `avatarTone`         | Rotación determinista `sky`, `pink`, `green`, `yellow`, `purple` por orden de alta       |
| `badge`              | Primera alergia en mayúsculas (tono allergy); si no hay alergias, `VINCULAR` (tono link) |

El filtrado y el contador de SPEC 06 operarán sobre la colección combinada `[...kids, ...ephemeralKids]`, conservando el orden con las tarjetas efímeras al final.

## Plan de implementación

1. Modificar `components/kids/kid-card.tsx` con la prop `href` opcional y la variante estática; actualizar la llamada existente en `kids-list.tsx` para pasar el enlace explícito y comprobar que las ocho tarjetas conservan navegación y presentación.
2. Crear `components/kids/add-kid-dialog.tsx` con el portal a `document.body`, el overlay, la tarjeta de la referencia, los cinco campos controlados, el select con opción vacía, la validación inline y el contrato modal completo (Escape, overlay, contención de foco, inert, bloqueo de scroll, foco inicial y formulario interceptado).
3. Conectar el diálogo en `kids-list.tsx`: estado de apertura, referencia al botón Agregar niño, restauración de foco al cerrar y manejador `onAddKid` que derive el resumen efímero y lo añada al final de la colección.
4. Integrar la colección combinada en el filtrado por nombre y el contador existentes, y verificar que la búsqueda encuentra tarjetas efímeras por nombre.
5. Verificar con Playwright: apertura y cierre por las cuatro vías, foco y contención de Tab, validación y limpieza de errores, alta válida, cancelación, Enter en los campos, búsqueda de la tarjeta efímera, recarga de la ruta, dialogo a 390, 767, 768 y 1200 px y consola sin errores.
6. Ejecutar `npm run lint -- app` y `npm run build`.

## Criterios de aceptación

- [x] El botón Agregar niño de `/kids` abre el diálogo; Cancelar, Escape y el overlay cierran sin añadir tarjetas, sin cambiar la URL y sin solicitudes de red.
- [x] Al abrirse, el foco pasa al campo Nombre completo y el Tab permanece dentro del diálogo; el fondo queda `inert` y `aria-hidden`, y el scroll de la página se bloquea hasta cerrarlo.
- [x] Al cerrarse por cualquier vía, el foco vuelve al botón Agregar niño y el scroll se restaura.
- [x] Pulsar Guardar con los tres obligatorios vacíos muestra los tres mensajes de error, no cierra el diálogo y el foco pasa al primer campo inválido.
- [x] Los mensajes muestran literalmente `Ingresa el nombre completo.`, `Ingresa la fecha de nacimiento.` y `Selecciona una sala.` en coral `#D9583C`.
- [x] Escribir el nombre, elegir fecha o seleccionar sala elimina el error de ese campo tras un intento fallido.
- [x] Pulsar Enter en cualquier campo intenta guardar con el mismo comportamiento que Guardar, sin recargar la página.
- [x] Guardar con datos válidos cierra el diálogo, añade una tarjeta al final de la cuadrícula y el contador pasa a `9 niños`.
- [x] La tarjeta efímera muestra el nombre escrito, su inicial, la edad calculada, `sin padres vinculados`, un avatar rotativo y el badge de la primera alergia en mayúsculas o `VINCULAR` si no hay alergias.
- [x] La tarjeta efímera no navega al pulsarla ni muestra el chevron de enlace cuando tiene badge; sin badge y sin enlace no navega.
- [x] La búsqueda por nombre filtra la tarjeta efímera como a cualquier otra y el contador refleja el resultado.
- [x] Recargar `/kids` restaura exactamente las ocho tarjetas originales y el contador `8 niños`.
- [x] Reabrir el diálogo tras cerrarlo muestra el formulario vacío, la sala en su opción vacía y sin errores.
- [x] El select Sala ofrece exactamente `Soles`, `Lunas` y `Estrellas` precedidos por la opción vacía `Selecciona una sala`.
- [x] La fecha de nacimiento usa `type="date"` nativo y Alergias y Notas médicas son opcionales: su vacío no bloquea el guardado.
- [x] A 1200 × 800 la tarjeta del diálogo coincide con `references/pantallas/agregar-nino.dc.html` en estructura, tipografías, colores, medidas, espaciados, bordes, sombras y radios; solo se admiten las adaptaciones acordadas (input date nativo, select con opción vacía, estados de error y overlay de modal) y diferencias de rasterizado.
- [x] Por debajo de 768 px el diálogo ocupa el ancho disponible sin desbordamiento horizontal, Fecha de nacimiento y Sala se apilan y la tarjeta se desplaza internamente en viewports bajos.
- [x] Las ocho tarjetas originales conservan literalmente sus nombres, edades, badges, estilos y enlaces a `/kids/1`–`/kids/8` tras el cambio de `KidCard`.
- [x] La búsqueda, el debounce, el panel sin resultados y el contador de SPEC 06 siguen funcionando sin tarjetas efímeras.
- [x] Los únicos archivos de aplicación creados o modificados son `components/kids/add-kid-dialog.tsx`, `components/kids/kids-list.tsx` y `components/kids/kid-card.tsx`.
- [x] Ningún valor se envía a una URL, se escribe en almacenamiento del navegador ni genera solicitudes de red.
- [x] La consola del navegador no muestra errores al abrir, validar, guardar, cancelar, buscar ni recargar.
- [x] `npm run lint -- app` finaliza correctamente.
- [x] `npm run build` finaliza correctamente.

## Decisiones

- **Sí:** depender de SPEC 05 y SPEC 06. El diálogo se abre desde el listado creado en SPEC 05 y la tarjeta efímera se integra en el filtrado y el contador de SPEC 06.
- **Sí:** diálogo modal sobre `/kids` en lugar de una ruta nueva. La referencia es una tarjeta superpuesta y no debe sustituir la pantalla de listado.
- **Sí:** renderizar mediante portal en `document.body`. Permite aplicar `inert` y `aria-hidden` sobre `data-page-content` sin desactivar el propio diálogo, replicando el contrato del drawer.
- **Sí:** replicar el patrón de accesibilidad del drawer de SPEC 04. Es el precedente aprobado del proyecto para superficies superpuestas.
- **Sí:** inputs controlados dentro del diálogo. La validación inline requiere leer los valores en cada intento de guardado.
- **Sí:** select nativo con opción vacía `Selecciona una sala`. Hace real la obligatoriedad de sala; con `Soles` preseleccionado la validación nunca se ejercitaría.
- **Sí:** `type="date"` nativo. Aporta picker local dd/mm/aaaa, valor validable y accesibilidad sin construir un calendario.
- **Sí:** validar solo al pulsar Guardar con errores inline y foco al primer inválido. Es el flujo pedido; deshabilitar Guardar ocultaría qué falta.
- **Sí:** alta efímera en memoria al final de la cuadrícula. Permite ver el resultado sin fingir un backend inexistente; la persistencia llegará con su propia spec.
- **Sí:** tarjeta efímera sin enlace. No existe perfil para un niño no persistido y un 404 sería un destino roto.
- **Sí:** badge de la primera alergia o `VINCULAR` sin alergias. Replica la lógica visible de Mateo, Tomás y Valentina en los fixtures.
- **Sí:** edad calculada en años y meses al guardar. Etiqueta estática coherente con `ageLabel` de los fixtures, sin reactividad posterior.
- **Sí:** avatarTone rotativo determinista. Evita avatares repetidos sin introducir azar en snapshots visuales.
- **Sí:** IDs negativos descendentes. Claves estables sin colisión con los IDs 1–8 de los fixtures.
- **Sí:** restablecer el formulario al cerrar por cualquier vía. Reabrir siempre parte de un estado limpio y sin errores.
- **Sí:** formulario nativo con envío interceptado. Enter intenta guardar como en un formulario real, sin recargar ni navegar.
- **Sí:** overlay oscuro semitransparente igual que el drawer. La referencia muestra fondo pleno `#F6ECDF`; como modal necesita contraste con la pantalla subyacente.
- **Sí:** mensajes de error en el coral `#D9583C` del sistema. Evita introducir un nuevo rojo de error en la paleta.
- **No:** validar fecha futura, formato de alergias o longitudes. La petición limita la validación a la obligatoriedad.
- **No:** toast ni confirmación de éxito. El cierre y la tarjeta nueva son la confirmación suficiente.
- **No:** usar Sala o Notas médicas en la tarjeta. `KidSummary` no representa sala ni notas; se recogen para el futuro backend.
- **No:** modificar `app/kids/data.ts`, páginas, layout, navegación o estilos globales. El cambio vive íntegro en los tres componentes de `components/kids/`.
- **No:** extraer primitivas de modal compartidas. Solo existe este consumidor; generalizar ahora sería prematuro.
- **No:** añadir dependencias ni pruebas automatizadas. Se conserva la estrategia de verificación manual, lint y build de las specs anteriores.

## Riesgos

| Riesgo                                                                                            | Mitigación                                                                                                                            |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| El portal puede acceder a `document` durante SSR.                                                 | Crear el contenedor del portal tras el montaje y renderizar el diálogo solo cuando esté abierto.                                      |
| Marcar `inert` el contenido de la página puede desactivar también el diálogo.                     | Renderizar siempre mediante portal como hermano del árbol de página, nunca dentro de `data-page-content`.                             |
| El cambio de `KidCard` puede regresar la navegación o el aspecto de las ocho tarjetas existentes. | Pasar `href` explícito en la llamada existente y repetir las verificaciones de tarjeta y navegación de SPEC 05.                       |
| El cálculo de edad puede fallar en bordes de meses, años bisiestos o fechas de hoy.               | Calcular años cumplidos por comparación de mes y día y meses como resto, verificando los casos 0 años, 1 año y fechas del día actual. |
| Las claves de tarjetas efímeras pueden colisionar o desincronizarse.                              | Usar IDs negativos descendentes desde `-1` y derivar siempre la colección combinada desde las props más el estado efímero.            |
| El diálogo puede desbordar en viewports móviles bajos con teclado abierto.                        | Limitar la altura máxima de la tarjeta, habilitar scroll interno y conservar los paddings de zona segura.                             |
| El diálogo y el drawer móvil podrían solaparse en profundidad.                                    | Ambos comparten overlay 45 y panel 50; con el drawer abierto el contenido está `inert`, por lo que no pueden abrirse simultáneamente. |
| Perder las altas al recargar puede parecer un fallo.                                              | Comportamiento acordado y documentado: la persistencia queda explícitamente fuera del alcance hasta que exista backend.               |

## Lo que **no** incluye esta spec

- Backend, API, base de datos o persistencia real.
- Edición o eliminación de niños, incluida la tarjeta efímera.
- Perfil navegable o rutas nuevas para niños añadidos.
- Validaciones adicionales a la obligatoriedad, toasts o estados de guardado.
- Cambios en fixtures, navegación, feed o estilos globales.
- Componentes genéricos, dependencias o pruebas automatizadas nuevas.

Cada integración con backend, persistencia, edición o perfil de niños nuevos debe definirse en su propia spec.
