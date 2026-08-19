# SPEC 07 — Inicio de sesión y activación de cuenta

> **Estado:** Aprobado
> **Depende de:** SPEC 01
> **Fecha:** 2026-08-19
> **Objetivo:** Implementar las interfaces responsive y navegables de inicio de sesión en `/login` y activación de cuenta en `/activate-account` a partir de las referencias aprobadas, sin selector de rol, autenticación, validación ni persistencia.

## Alcance

**Incluye:**

- Crear la ruta `/login` en `app/login/page.tsx` con la interfaz de `references/pantallas/login.dc.html`.
- Crear la ruta `/activate-account` en `app/activate-account/page.tsx` con la interfaz de `references/pantallas/activar-cuenta.dc.html`.
- Mantener todos los textos visibles en español y usar inglés para rutas, carpetas, archivos, componentes, tipos y variables.
- Reproducir en `/login` el panel promocional, la marca, los círculos decorativos, el contenido editorial y el formulario de la referencia en escritorio.
- Eliminar por completo de `/login` la etiqueta `INGRESO COMO`, el botón Personal y el botón Familia, sin dejar un hueco reservado para esa región.
- Mostrar en `/login` el email inicial `caro@opendaycare.com`, mantener la contraseña inicialmente vacía y conservar el placeholder de ocho puntos de la referencia.
- Permitir que los campos de login reciban texto mediante inputs nativos no controlados, sin guardar sus valores en estado React.
- Mantener `¿Olvidaste tu contraseña?` como un botón visual inerte que no cambia la URL, no modifica contenido y no realiza una operación de recuperación.
- Hacer que `Iniciar sesión` navegue a `/` y que `Activá tu cuenta` navegue a `/activate-account`.
- Reproducir en `/activate-account` la marca, título, texto introductorio, invitación de Mateo, campos, autorización, CTA y enlace de retorno de la referencia.
- Mostrar en la invitación estática la inicial `M`, el niño `Mateo` y la sala `Sala Soles`.
- Mostrar inicialmente el código `7K4P9`, el email `lucia.fernandez@gmail.com` y la contraseña `contraseña` en inputs editables y no controlados.
- Implementar la autorización de fotos como un checkbox nativo inicialmente marcado, accesible y alternable sin estado React.
- Permitir activar visualmente el CTA con el consentimiento marcado o desmarcado, sin validación ni bloqueo.
- Hacer que `Activar mi cuenta` navegue a `/` y que el enlace `Iniciar sesión` navegue a `/login`.
- Crear `components/auth/auth-brand.tsx` para compartir el icono solar y sus variantes visuales entre ambas rutas.
- Crear `components/auth/auth-field.tsx` para compartir la etiqueta semántica, el input y las variantes visuales de los campos.
- Mantener cada pantalla compuesta en su propio `page.tsx`; los títulos, paneles, invitación, autorización y enlaces permanecerán privados a su página.
- Mantener las dos páginas y los componentes compartidos como Server Components, sin directiva `"use client"`, hooks, efectos ni estado React.
- Usar `references/pantallas/login.dc.html` y `references/pantallas/activar-cuenta.dc.html` como autoridad visual a 1200 × 800, excepto por la eliminación explícita del selector de rol.
- Ocultar por debajo de 768 px todo el panel promocional del login y mostrar sobre el formulario una marca compacta con el icono coral y el nombre OpenDayCare.
- Mostrar por debajo de 768 px el login y la activación en una sola columna desplazable, con padding reducido, zonas seguras y sin desbordamiento horizontal.
- Conservar desde 768 px la composición de dos columnas del login y la composición centrada de la activación definidas por las referencias.
- Añadir etiquetas asociadas, nombres de campo, tipos y atributos de autocompletado adecuados sin modificar la presentación aprobada.

**Fuera de alcance (para futuras specs):**

- Autenticación real, autorización, sesiones, cookies, tokens o protección de rutas.
- Consultar una API, base de datos, servicio de identidad o fuente remota.
- Persistir los valores de los campos en almacenamiento local o entre navegaciones.
- Validar email, contraseña, código de invitación o consentimiento.
- Mostrar estados de carga, credenciales inválidas, invitación inválida, cuenta existente u otros errores.
- Recuperar o restablecer contraseñas y crear una ruta para ese flujo.
- Introducir el selector Personal o Familia, inferir un rol o navegar a destinos diferentes según el usuario.
- Resolver la invitación desde parámetros de URL, datos dinámicos o información distinta del fixture de Mateo.
- Crear un feed familiar o cualquier destino nuevo después del login o la activación.
- Redirigir `/`, exigir login para entrar al feed o modificar la navegación existente.
- Habilitar el control Cerrar sesión del sidebar o del drawer móvil.
- Modificar `app/layout.tsx`, `app/globals.css`, el feed, las rutas de niños o los componentes de navegación.
- Crear primitivas genéricas de design system, una biblioteca de iconos, imágenes o assets nuevos.
- Añadir dependencias, pruebas automatizadas o infraestructura de regresión visual.

## Modelo de datos

Esta funcionalidad no introduce estructuras de datos de dominio, persistencia ni una fuente externa. Los datos de muestra permanecerán como literales estáticos dentro de cada página y los inputs conservarán únicamente su estado nativo durante el montaje actual.

`components/auth/auth-brand.tsx` expondrá las tres presentaciones necesarias del mismo símbolo:

```ts
export type AuthBrandProps = {
  variant: "hero" | "compact" | "activation";
};
```

- `hero` mostrará el icono sobre fondo blanco translúcido y el nombre blanco dentro del panel promocional del login.
- `compact` mostrará el icono coral y el nombre oscuro sobre el fondo claro del login móvil.
- `activation` mostrará únicamente el icono grande con gradiente y sombra sobre la pantalla de activación.

`components/auth/auth-field.tsx` expondrá el contrato común de etiqueta e input:

```ts
export type AuthFieldProps = {
  id: string;
  name: string;
  label: string;
  type: "text" | "email" | "password";
  autoComplete: "email" | "current-password" | "new-password" | "one-time-code";
  defaultValue?: string;
  placeholder?: string;
  appearance?: "default" | "code" | "accent";
};
```

`appearance: "code"` aplicará la tipografía Fredoka, el peso y el espaciado de caracteres del código de invitación. `appearance: "accent"` aplicará el borde coral de la contraseña de activación. La variante `default` conservará el campo blanco con borde neutro usado por los demás inputs.

Los valores estáticos serán exactamente los siguientes:

| Pantalla   | Campo                 | Valor inicial                     |
| ---------- | --------------------- | --------------------------------- |
| Login      | Email                 | `caro@opendaycare.com`            |
| Login      | Contraseña            | Vacío, con placeholder `••••••••` |
| Activación | Código de invitación  | `7K4P9`                           |
| Activación | Email                 | `lucia.fernandez@gmail.com`       |
| Activación | Crear contraseña      | `contraseña`                      |
| Activación | Autorización de fotos | Marcada                           |

Ningún valor se enviará, validará, persistirá ni utilizará para decidir el destino de navegación.

## Plan de implementación

1. Crear `components/auth/auth-brand.tsx` con el SVG solar de las referencias y las variantes `hero`, `compact` y `activation`; comprobar que cada variante renderiza sin estado de cliente.
2. Crear `components/auth/auth-field.tsx` con etiquetas asociadas, props tipadas, inputs no controlados y las variantes `default`, `code` y `accent`; comprobar tipos, foco y edición nativa de cada presentación.
3. Crear `app/login/page.tsx` con el panel promocional y el formulario de escritorio, omitir toda la región de selección de rol y conectar los controles acordados a `/`, `/activate-account` o a la acción inerte correspondiente.
4. Incorporar en `/login` la adaptación inferior a 768 px, ocultar el panel promocional completo, mostrar `AuthBrand` en su variante compacta y comprobar que el formulario puede desplazarse sin desbordamiento horizontal.
5. Crear `app/activate-account/page.tsx` con la invitación estática de Mateo, los tres campos compartidos, el checkbox nativo inicialmente marcado y los enlaces hacia `/` y `/login`.
6. Incorporar en `/activate-account` la columna móvil desplazable, los paddings de zonas seguras, el foco visible y los ajustes de contenido necesarios por debajo de 768 px sin alterar la composición centrada de escritorio.
7. Comparar ambas rutas a 1200 × 800 con sus HTML, revisar 390, 767 y 768 px, comprobar campos, checkbox, enlaces y controles inertes, inspeccionar la consola y ejecutar `npm run lint -- app` y `npm run build`.

## Criterios de aceptación

- [ ] `/login` y `/activate-account` cargan directamente sin errores y no alteran el contenido de `/`.
- [ ] Los únicos archivos de aplicación añadidos son `app/login/page.tsx`, `app/activate-account/page.tsx`, `components/auth/auth-brand.tsx` y `components/auth/auth-field.tsx`.
- [ ] `/login` no muestra `INGRESO COMO`, Personal, Familia ni un espacio vacío reservado para esos controles.
- [ ] A 1200 × 800, `/login` coincide con `references/pantallas/login.dc.html` en estructura restante, contenido, tipografías, colores, medidas, espaciados, bordes, sombras, radios, fondos y SVG; solo se admiten la eliminación acordada del selector y diferencias de rasterizado o antialiasing.
- [ ] El panel izquierdo del login conserva el gradiente coral, los dos círculos decorativos, la marca, el texto principal, la descripción y `🌿 Guardería Sala Soles`.
- [ ] El área derecha del login conserva el ancho máximo de 392 px, el título, el texto introductorio, los campos, la recuperación, el CTA y el enlace de activación.
- [ ] El email de login muestra inicialmente `caro@opendaycare.com` y permanece editable.
- [ ] La contraseña de login comienza vacía, usa `type="password"` y muestra el placeholder `••••••••`.
- [ ] `¿Olvidaste tu contraseña?` es accesible como botón, pero no cambia la URL, no modifica contenido y no inicia una solicitud de recuperación.
- [ ] Pulsar `Iniciar sesión` desde `/login` navega a `/` independientemente de los valores escritos.
- [ ] Pulsar `Activá tu cuenta` desde `/login` navega a `/activate-account`.
- [ ] A 1200 × 800, `/activate-account` coincide con `references/pantallas/activar-cuenta.dc.html` en estructura, contenido, tipografías, colores, medidas, espaciados, bordes, sombras, radios y SVG; solo se admiten diferencias de rasterizado o antialiasing.
- [ ] La activación muestra literalmente `Bienvenida a OpenDayCare`, el texto introductorio y la invitación para `Mateo · Sala Soles` con la inicial `M`.
- [ ] El código muestra inicialmente `7K4P9`, usa la presentación Fredoka espaciada y permanece editable.
- [ ] El email de activación muestra inicialmente `lucia.fernandez@gmail.com` y permanece editable.
- [ ] La contraseña de activación muestra inicialmente `contraseña` mediante `type="password"`, conserva el borde coral y permanece editable.
- [ ] Cada etiqueta visible está asociada programáticamente con su input y cada campo tiene `name`, `type` y `autoComplete` adecuados.
- [ ] La autorización de fotos es un checkbox nativo inicialmente marcado y se puede marcar o desmarcar con puntero y teclado.
- [ ] Cambiar el consentimiento no modifica el CTA, no muestra validación y no bloquea la navegación.
- [ ] Pulsar `Activar mi cuenta` desde `/activate-account` navega a `/` independientemente de los campos y del consentimiento.
- [ ] Pulsar `Iniciar sesión` desde `/activate-account` navega a `/login`.
- [ ] `AuthBrand` renderiza las variantes `hero`, `compact` y `activation` sin duplicar el SVG solar en las páginas.
- [ ] Todos los campos de ambas rutas se renderizan mediante `AuthField` y respetan el contrato y las variantes definidos en esta spec.
- [ ] Por debajo de 768 px el panel promocional del login no se renderiza visualmente y el formulario muestra antes del título el icono coral junto al nombre OpenDayCare.
- [ ] A 390 y 767 px ambas rutas usan una sola columna, respetan los insets de zona segura, permiten scroll vertical y no producen desbordamiento horizontal.
- [ ] A 768 px el login adopta la composición de dos columnas y deja de mostrar la marca compacta móvil sin saltos ni scroll horizontal.
- [ ] Desde 768 px la activación conserva su contenido centrado con un ancho máximo de 440 px.
- [ ] Las dos rutas conservan foco visible y orden de tabulación coherente para inputs, checkbox, botones y enlaces.
- [ ] Ninguno de los cuatro archivos nuevos contiene `"use client"`, hooks, efectos, handlers de estado o inputs controlados.
- [ ] Las páginas no consultan una API, no escriben cookies o almacenamiento y no crean una sesión.
- [ ] Entrar a `/login` o `/activate-account` no redirige automáticamente ni protege `/`, `/kids` o sus perfiles.
- [ ] El sidebar, el drawer móvil y el control Cerrar sesión permanecen sin cambios y Cerrar sesión continúa inerte.
- [ ] `app/layout.tsx`, `app/globals.css`, el feed, las rutas de niños y los componentes de navegación permanecen sin cambios.
- [ ] No se incorporan dependencias, assets, primitivas genéricas, rutas adicionales ni infraestructura de pruebas automatizadas.
- [ ] La consola del navegador no muestra errores al cargar, editar campos, alternar el checkbox o navegar entre las rutas acordadas.
- [ ] `npm run lint -- app` finaliza correctamente.
- [ ] `npm run build` finaliza correctamente.

## Decisiones

- **Sí:** usar `/login` y `/activate-account`. Las rutas y los nombres de código permanecen en inglés como en el resto del proyecto.
- **No:** usar `/activar-cuenta`. El texto visible seguirá en español, pero no se mezclará el idioma de las rutas.
- **Sí:** depender de SPEC 01. Esta funcionalidad reutiliza las fuentes globales y navega al feed existente creado por esa spec.
- **Sí:** implementar un prototipo navegable con campos editables. Permite comprobar las dos interfaces sin fingir una autenticación inexistente.
- **No:** añadir autenticación, validación o persistencia. Cada capacidad requiere contratos de datos, errores y seguridad que no forman parte de estas pantallas.
- **Sí:** eliminar toda la región Personal/Familia. El login será único y no conservará la etiqueta, los botones ni su altura.
- **No:** sustituir el selector por otra elección o inferir un rol desde el email. No existe un modelo de usuario que respalde ese comportamiento.
- **Sí:** hacer que ambos CTA principales naveguen al feed existente en `/`. No hay todavía un feed familiar ni otro destino posterior implementado.
- **Sí:** conservar los valores de muestra de las referencias. Son parte del estado visual aprobado y no representan credenciales reales ni datos persistidos.
- **Sí:** enlazar login y activación entre sí. Ambos destinos existen dentro de la misma spec y evitan enlaces rotos.
- **Sí:** mantener la recuperación como botón inerte. Crear un destino vacío o una recuperación falsa ampliaría el alcance sin aportar un flujo completo.
- **Sí:** usar un checkbox nativo inicialmente marcado para el consentimiento. Aporta interacción y accesibilidad sin estado React.
- **No:** exigir el consentimiento para navegar. La spec no incorpora validación ni procesamiento de la activación.
- **Sí:** compartir `AuthBrand` y `AuthField`. El símbolo aparece en ambas pantallas y los cinco campos comparten estructura y estilos base.
- **No:** extraer el CTA, la invitación, el panel promocional o la autorización a componentes públicos. No tienen todavía otro consumidor independiente.
- **Sí:** usar variantes explícitas en los componentes compartidos. Las diferencias aprobadas son finitas y evitan props genéricas de clases o estilos.
- **Sí:** mantener Server Components e inputs no controlados. Los valores solo necesitan el comportamiento nativo del navegador durante la visita actual.
- **No:** crear un formulario con envío simulado. Los CTA son enlaces y ningún valor debe enviarse accidentalmente en una URL o solicitud.
- **Sí:** tratar los dos HTML como autoridad visual de escritorio. No existen capturas específicas de estas pantallas que deban reemplazarlos.
- **Sí:** ocultar el panel promocional del login por debajo de 768 px. Conserva espacio para los campos sin inventar una portada móvil extensa.
- **Sí:** mostrar una marca compacta en el login móvil. Mantiene la identidad que se perdería al ocultar el panel izquierdo.
- **Sí:** permitir scroll vertical en la activación móvil. Se conserva todo el contenido y se evita comprimir tipografía, campos o controles.
- **No:** modificar el acceso desde el feed o activar Cerrar sesión. Estas rutas se alcanzarán directamente hasta que una spec de autenticación defina la integración.

## Riesgos

| Riesgo                                                                                                                | Mitigación                                                                                                                                                  |
| --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Eliminar el selector de rol puede dejar un hueco o alterar de forma arbitraria la alineación vertical del formulario. | Retirar la región completa y mantener el ritmo natural entre la introducción y el primer campo, conservando el ancho y los demás espacios de la referencia. |
| Ocultar el panel promocional en móvil puede eliminar toda la identidad de OpenDayCare.                                | Renderizar la variante compacta de `AuthBrand` antes del título solo por debajo de 768 px.                                                                  |
| El contenido de activación puede superar la altura de viewports móviles o de escritorio bajos.                        | Usar altura mínima en lugar de altura fija, permitir scroll vertical y conservar paddings de zonas seguras.                                                 |
| Un checkbox dibujado como decoración puede no responder al teclado o no comunicar su estado.                          | Mantener un input checkbox nativo asociado a la etiqueta y estilizar su estado marcado sin reemplazar su semántica.                                         |
| Los valores prellenados pueden parecer datos enviados o credenciales reales.                                          | Mantenerlos como `defaultValue` local, no incorporar envío y comprobar que ninguna interacción produce solicitudes de autenticación.                        |
| Extraer componentes demasiado genéricos puede convertir dos pantallas en un design system prematuro.                  | Limitar `AuthBrand` y `AuthField` a las variantes concretas utilizadas por estas referencias y conservar las demás regiones dentro de sus páginas.          |
| Los enlaces hacia `/` pueden interpretarse como una sesión válida aunque no exista autenticación.                     | Documentar que el flujo es un prototipo navegable y excluir explícitamente sesión, protección de rutas y autorización.                                      |

## Lo que **no** incluye esta spec

- Autenticación, autorización, sesión o protección de rutas.
- Selector de Personal o Familia y navegación basada en roles.
- Validación, envío, carga, error o recuperación de contraseña.
- Invitaciones dinámicas, parámetros de URL, API, base de datos o persistencia.
- Un feed familiar o destinos posteriores adicionales.
- Cambios en el feed, la navegación, Cerrar sesión, las rutas de niños o los estilos globales.
- Componentes genéricos adicionales, assets, dependencias o pruebas automatizadas.

Cada integración con identidad real, recuperación de contraseña, rol o invitación dinámica debe definirse en su propia spec.
