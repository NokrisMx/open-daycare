# SPEC 09 — Diálogo para vincular padre

> **Estado:** Aprobado
> **Depende de:** SPEC 05, SPEC 08
> **Fecha:** 2026-08-20
> **Objetivo:** Implementar el diálogo Vincular padre sobre `/kids/[id]` con validación de nombre y email en el cliente y altas efímeras de padres pendientes en memoria, sin backend ni persistencia.

## Alcance

**Incluye:**

- Crear `components/kids/link-parent-dialog.tsx` con la interfaz de `references/pantallas/vincular-padre.dc.html` presentada como diálogo modal sobre `/kids/[id]`.
- Crear `components/kids/linked-parents-card.tsx` como componente cliente que reemplaza la sección PADRES VINCULADOS actual, mantiene el botón Vincular otro padre, gestiona la apertura del diálogo y la colección efímera de padres añadidos.
- Modificar `components/kids/kid-profile.tsx` para renderizar la nueva tarjeta de padres y mantener el resto del perfil como Server Component.
- Abrir el diálogo al pulsar el botón Vincular otro padre de la sección PADRES VINCULADOS.
- Reproducir del HTML la cabecera con el título Vincular padre (Fredoka, 18 px), el subtítulo `a {nombre del niño}` y el botón de cierre X (34 × 34, fondo `#F0E6D8`, radio 10 px, nombre accesible `Cerrar`).
- Reproducir la tarjeta de 480 px de ancho máximo, fondo `#FBF4EC`, borde `#ECE0D0`, radio 24 px y sombra de la referencia; cabecera y cuerpo con sus paddings y separadores exactos.
- Reproducir el banner informativo azul (fondo `#E3ECFB`, radio 14 px, icono `#4E72C8`, texto `#3F5694`) con el texto dinámico `Le enviaremos un correo con un código para que active su cuenta. Solo verá el feed de {primer nombre del niño}.`
- Implementar los campos NOMBRE DEL PADRE/MADRE (texto, placeholder `Ej. Diego Fernández`) y EMAIL (`type="email"`, placeholder `correo@ejemplo.com`) con inputs blancos de radio 14 px, borde 1,5 px `#EADFD0` y padding 13 × 16 px, y etiquetas en mayúsculas de 12 px con peso 800 y espaciado 0,7 px.
- Implementar el selector PARENTESCO como tres botones pill (Mamá, Papá, Tutor/a) de radio 999 px en fila con la misma anchura: la opción activa con fondo `#CCD8F4`, borde `#9FB8EC` y texto `#4E72C8`; las inactivas con fondo `#FFFDF9`, borde `#ECE0D0` y texto `#6E6359`. Mamá queda preseleccionada y siempre hay exactamente una activa.
- Reproducir la tarjeta de código: fondo `#FBF1D6`, borde discontinuo 1,5 px `#E6D08A`, radio 16 px, etiqueta CÓDIGO DE INVITACIÓN, código estático `7K4P9` en Fredoka 34 px con espaciado 7 px en `#8A7234` y el texto `Vence en 7 días`.
- Reproducir el botón Enviar invitación a ancho completo con degradado `#F4977E → #EE8164`, texto blanco, radio 14 px, sombra y el icono de envío de la referencia.
- Validar al pulsar Enviar invitación: nombre vacío → `Ingresa el nombre del padre o madre.`; email vacío o con formato inválido → `Ingresa un email válido.`; los errores se muestran en coral `#D9583C` con borde del campo, no cierra el diálogo y el foco pasa al primer campo inválido.
- Limpiar el error de un campo en cuanto se edita tras un intento fallido.
- Al enviar con datos válidos: cerrar el diálogo, restablecer el formulario y añadir un padre efímero pendiente al final de la lista de PADRES VINCULADOS.
- Derivar el padre efímero: nombre sin espacios externos, inicial en mayúscula, `relationshipLabel` según la opción activa, `statusLabel` `invitación enviada`, estado pending con badge `PENDIENTE` y tono de avatar alternando `purple` y `blue` por orden de alta.
- Mantener el alta efímera solo en memoria: al recargar `/kids/[id]` o volver a entrar se restauran los padres de los fixtures.
- Renderizar el diálogo mediante un portal en `document.body` con overlay oscuro semitransparente y los niveles de profundidad del drawer (overlay 45, tarjeta 50), replicando el contrato de accesibilidad de SPEC 08: `role="dialog"` con `aria-modal`, etiquetado por el título, foco inicial en el campo Nombre, cierre con Escape, cierre al pulsar el overlay y el botón X, contención de foco con Tab, fondo `inert` y `aria-hidden`, bloqueo del scroll del contenedor de página y restauración del foco al botón Vincular otro padre al cerrar.
- Usar un formulario nativo cuyo envío se intercepta: Enter en los campos intenta enviar como Enviar invitación, sin recargar la página ni navegar.
- Restablecer el formulario (nombre y email vacíos, parentesco en Mamá, sin errores) al cerrar por cualquier vía.
- Adaptar el diálogo por debajo de 768 px: tarjeta al ancho disponible con padding reducido, altura máxima con scroll interno y sin desbordamiento horizontal.

**Fuera de alcance (para futuras specs):**

- Backend, API, base de datos, envío real de correos, códigos de invitación reales ni persistencia.
- Guardar en `localStorage`, cookies, sesión o cualquier mecanismo del navegador.
- Actualizar `linkedParentsLabel` de la tarjeta en `/kids` (dato server de otra ruta).
- Edición o eliminación de padres vinculados, incluido el efímero.
- Reenviar invitación, copiar el código o caducidad real del código.
- Toasts, confirmaciones de éxito o estados de envío en curso.
- Validaciones adicionales (nombre duplicado, dominios de email, longitudes máximas).
- Modificar `app/kids/data.ts`, `app/kids/[id]/page.tsx`, `app/kids/layout.tsx`, la navegación, el feed o `app/globals.css`.
- Añadir dependencias, componentes genéricos compartidos o infraestructura de pruebas automatizadas.

## Modelo de datos

`components/kids/link-parent-dialog.tsx` expondrá:

```ts
export type LinkParentRelationship = "Mamá" | "Papá" | "Tutor/a";

export type NewParentDraft = {
  fullName: string;
  email: string;
  relationship: LinkParentRelationship;
};

export type LinkParentDialogProps = {
  isOpen: boolean;
  kidName: string;
  onClose: () => void;
  onLinkParent: (draft: NewParentDraft) => void;
};
```

- `kidName` alimenta el subtítulo `a {kidName}` y el banner con el primer nombre (`kidName` sin espacios externos, primera palabra).
- El diálogo mantendrá estado interno controlado para nombre, email y parentesco (por defecto `Mamá`) y marcas de error por campo (`fullName`, `email`). El envío se intercepta con `preventDefault`; ningún valor se envía ni persiste.

`components/kids/linked-parents-card.tsx` será un componente cliente con:

```ts
export type LinkedParentsCardProps = {
  parents: readonly LinkedParent[];
};
```

- Recibe los padres del fixture vía props desde `kid-profile.tsx` e importa `LinkedParent` como tipo desde `kid-profile.tsx`.
- Mantiene en estado la colección efímera y la apertura del diálogo; renderiza `[...parents, ...ephemeralParents]` en orden.
- Deriva de cada `NewParentDraft` un `LinkedParent`:

| Campo               | Valor derivado                                                                     |
| ------------------- | ---------------------------------------------------------------------------------- |
| `id`                | Contador local descendente desde `-1` (sin colisión con `1`–`9` de los fixtures)   |
| `name`              | `fullName` sin espacios externos                                                   |
| `initial`           | Primera letra del nombre en mayúscula                                              |
| `relationshipLabel` | `Mamá`, `Papá` o `Tutor/a` según la opción activa                                  |
| `statusLabel`       | `invitación enviada`                                                               |
| `status`            | `pending` (badge `PENDIENTE`)                                                      |
| `avatarTone`        | Alternancia determinista `purple`, `blue` por orden de alta                        |

`components/kids/kid-profile.tsx` sustituirá la sección PADRES VINCULADOS por `<LinkedParentsCard parents={profile.linkedParents} />`, conservando la columna derecha de 300 px y el botón Resumen del día como Server Component. El resto del componente permanece como Server Component y `LinkedParent`/`ParentStatus` siguen definidos en `kid-profile.tsx`.

## Plan de implementación

1. Crear `components/kids/link-parent-dialog.tsx` con el portal a `document.body`, el overlay, la tarjeta de la referencia, los dos campos controlados, el selector pill de parentesco, la tarjeta de código estática, la validación inline y el contrato modal completo (Escape, overlay, X, contención de foco, inert, bloqueo de scroll, foco inicial, restauración de foco y formulario interceptado).
2. Crear `components/kids/linked-parents-card.tsx` con la lista de padres recibida por props, el botón Vincular otro padre, el estado de apertura, la colección efímera y la derivación de `LinkedParent` desde `NewParentDraft`.
3. Modificar `components/kids/kid-profile.tsx` para renderizar la nueva tarjeta en la columna derecha y eliminar el JSX de la sección anterior; comprobar que los ocho perfiles muestran sus padres de fixture sin cambios.
4. Verificar con Playwright: apertura y cierre por las tres vías, foco y contención de Tab, validación y limpieza de errores, alta válida con badge PENDIENTE, cancelación, Enter en los campos, recarga de la ruta, diálogo a 390, 767, 768 y 1200 px y consola sin errores.
5. Ejecutar `npm run lint -- app` y `npm run build`.

## Criterios de aceptación

- [ ] El botón Vincular otro padre de `/kids/[id]` abre el diálogo; X, Escape y el overlay cierran sin añadir padres, sin cambiar la URL y sin solicitudes de red.
- [ ] Al abrirse, el foco pasa al campo NOMBRE DEL PADRE/MADRE y el Tab permanece dentro del diálogo; el fondo queda `inert` y `aria-hidden`, y el scroll se bloquea hasta cerrarlo.
- [ ] Al cerrarse por cualquier vía, el foco vuelve al botón Vincular otro padre y el scroll se restaura.
- [ ] En `/kids/1` la cabecera muestra literalmente `Vincular padre` y `a Mateo Fernández`, y el banner muestra `Solo verá el feed de Mateo.`
- [ ] Pulsar Enviar invitación con los campos vacíos muestra `Ingresa el nombre del padre o madre.` y `Ingresa un email válido.`, no cierra el diálogo y el foco pasa al primer campo inválido.
- [ ] Un email sin formato válido (p. ej. `correo@`) mantiene el error `Ingresa un email válido.`; escribir en cualquier campo elimina su error tras un intento fallido.
- [ ] Mamá aparece seleccionada al abrir; pulsar Papá o Tutor/a cambia la selección y siempre hay exactamente una opción activa.
- [ ] La tarjeta de código muestra literalmente `CÓDIGO DE INVITACIÓN`, `7K4P9` y `Vence en 7 días` en todos los niños.
- [ ] Enviar con datos válidos cierra el diálogo y añade al final de PADRES VINCULADOS un padre con el nombre escrito, su inicial, `{parentesco} · invitación enviada` y badge `PENDIENTE`.
- [ ] El avatar del padre efímero alterna purple y blue entre altas sucesivas.
- [ ] Pulsar Enter en cualquier campo intenta enviar con el mismo comportamiento que Enviar invitación, sin recargar la página.
- [ ] Recargar `/kids/1` restaura exactamente los dos padres de los fixtures; el padre efímero desaparece.
- [ ] Reabrir el diálogo tras cerrarlo muestra el formulario vacío, parentesco en Mamá y sin errores.
- [ ] En `/kids/4` (Valentina, sin padres) el botón abre el diálogo y el alta añade el primer padre a una lista inicialmente vacía.
- [ ] A 1200 × 800 la tarjeta del diálogo coincide con `references/pantallas/vincular-padre.dc.html` en estructura, tipografías, colores, medidas, espaciados, bordes, sombras y radios; solo se admiten las adaptaciones acordadas (overlay de modal, estados de error) y diferencias de rasterizado.
- [ ] Por debajo de 768 px el diálogo ocupa el ancho disponible sin desbordamiento horizontal y la tarjeta se desplaza internamente en viewports bajos.
- [ ] Los ocho perfiles conservan sus padres de fixture, notas, datos y estilos tras el cambio de `kid-profile.tsx`.
- [ ] Los únicos archivos de aplicación creados o modificados son `components/kids/link-parent-dialog.tsx`, `components/kids/linked-parents-card.tsx` y `components/kids/kid-profile.tsx`.
- [ ] Ningún valor se envía a una URL, se escribe en almacenamiento del navegador ni genera solicitudes de red.
- [ ] La consola del navegador no muestra errores al abrir, validar, enviar, cancelar ni recargar.
- [ ] `npm run lint -- app` finaliza correctamente.
- [ ] `npm run build` finaliza correctamente.

## Decisiones

- **Sí:** depender de SPEC 05 y SPEC 08. El diálogo se abre desde el perfil creado en SPEC 05 y replica el contrato modal aprobado en SPEC 08.
- **Sí:** alta efímera en memoria al enviar. Permite ver el resultado sin fingir un backend inexistente; la persistencia llegará con su propia spec.
- **Sí:** extraer la tarjeta de padres a un componente cliente y mantener el resto del perfil como Server Component. Minimiza el JSX hidratado y deja el diálogo aislado.
- **Sí:** código estático `7K4P9`. Coherente con la referencia y con el código que ya muestra `/activate-account` (SPEC 07); sin backend no hay código real que generar.
- **Sí:** validación de obligatorios y formato de email con errores inline y foco al primer inválido. Replica el flujo aprobado de SPEC 08.
- **Sí:** mensaje único `Ingresa un email válido.` para vacío y formato inválido. El remedio es el mismo y simplifica el estado de errores.
- **Sí:** Mamá preseleccionada con selección exclusiva. Como en la referencia; evita una tercera validación.
- **Sí:** `statusLabel` `invitación enviada` y badge `PENDIENTE`. Replica la entrada existente de Diego Fernández en el fixture de Mateo.
- **Sí:** avatares alternando `purple` y `blue`. Son los dos tonos de padre existentes; la alternancia evita repetir sin introducir azar.
- **Sí:** IDs negativos descendentes. Claves estables sin colisión con los IDs 1–9 de los fixtures (precedente de SPEC 08).
- **Sí:** restablecer el formulario al cerrar por cualquier vía. Reabrir siempre parte de un estado limpio y sin errores.
- **Sí:** overlay oscuro semitransparente igual que SPEC 08. La referencia muestra fondo pleno `#F6ECDF`; como modal necesita contraste con la pantalla subyacente.
- **Sí:** subtítulo y banner dinámicos con el nombre del niño. El diálogo se abre desde el perfil de cada niño, no solo de Mateo.
- **No:** actualizar `linkedParentsLabel` en `/kids`. El dato vive en el server de otra ruta; la sincronización pertenece a la futura spec de persistencia.
- **No:** copiar el código, reenviar invitación o caducidad real. No hay mecanismo real detrás; la tarjeta es informativa.
- **No:** toast ni confirmación de éxito. El cierre y el padre nuevo en la lista son la confirmación suficiente (criterio de SPEC 08).
- **No:** validar duplicados, dominios o longitudes. La petición limita la validación a obligatoriedad y formato.
- **No:** extraer primitivas de modal compartidas. Solo existen dos consumidores; generalizar ahora sería prematuro.
- **No:** añadir dependencias ni pruebas automatizadas. Se conserva la estrategia de verificación manual, lint y build.

## Riesgos

| Riesgo                                                                                            | Mitigación                                                                                                        |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| El portal puede acceder a `document` durante SSR.                                                 | Crear el portal tras el montaje y renderizar el diálogo solo cuando esté abierto.                                 |
| Marcar `inert` el contenido de la página puede desactivar también el diálogo.                     | Renderizar siempre mediante portal como hermano del árbol de página, nunca dentro de `data-page-content`.         |
| El cambio de `kid-profile.tsx` puede regresar la presentación de los padres de fixture.           | Mantener la definición de `LinkedParent` en `kid-profile.tsx` y repetir la verificación de los ocho perfiles.     |
| La comprobación de email puede rechazar direcciones válidas o aceptar inválidas.                  | Usar una comprobación sencilla de formato (texto, `@`, texto, `.` y texto) documentada en el componente.          |
| El diálogo puede desbordar en viewports móviles bajos con teclado abierto.                        | Limitar la altura máxima de la tarjeta, habilitar scroll interno y conservar los paddings de zona segura.         |
| El diálogo y el drawer móvil podrían solaparse en profundidad.                                    | Ambos comparten overlay 45 y panel 50; con el drawer abierto el contenido está `inert`, por lo que no coinciden.  |
| Perder las altas al recargar puede parecer un fallo.                                              | Comportamiento acordado y documentado: la persistencia queda fuera del alcance hasta que exista backend.          |

## Lo que **no** incluye esta spec

- Backend, API, envío de correos, códigos reales ni persistencia.
- Edición o eliminación de padres vinculados.
- Actualización del contador de padres en `/kids`.
- Validaciones adicionales, toasts o estados de envío.
- Cambios en fixtures, navegación, feed o estilos globales.
- Componentes genéricos, dependencias o pruebas automatizadas nuevas.

Cada integración con backend, persistencia o gestión de padres debe definirse en su propia spec.
