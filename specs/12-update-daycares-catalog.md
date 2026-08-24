# SPEC 12 — Actualización del catálogo de guarderías

> **Estado:** Aprobado
> **Depende de:** SPEC 11
> **Fecha:** 2026-08-23
> **Objetivo:** Aplicar mediante una nueva migración imperativa los cambios de estructura, políticas y datos del catálogo `public.daycares` sin alterar el historial ya ejecutado en Supabase.

## Por qué existe esta spec

La migración `20260823220658_create_daycares.sql` ya está registrada en el proyecto Supabase conectado y creó una versión anterior de `public.daycares`. El archivo fue editado después de aplicarse, por lo que volver a usar el mismo timestamp produciría divergencia entre el historial versionado y el estado remoto.

## Alcance

**Incluye:**

- Restaurar `supabase/migrations/20260823220658_create_daycares.sql` al contenido que ya fue aplicado y que está registrado en SPEC 11.
- Crear una nueva migración imperativa versionada con nombre descriptivo `update_daycares_catalog` para representar únicamente el delta.
- Aplicar la nueva migración al proyecto Supabase conectado mediante MCP y conservar el SQL aplicado bajo `supabase/migrations/<version>_update_daycares_catalog.sql`.
- Añadir a `public.daycares` la columna nullable `address text`.
- Añadir a `public.daycares` la columna `updated_at timestamptz not null default now()` sin trigger de actualización automática.
- Eliminar la restricción `daycares_name_not_blank` para permitir nombres vacíos o compuestos solo por espacios.
- Mantener `id`, `name` y `created_at` con sus tipos, nulabilidad y valores por defecto actuales, excepto por la eliminación de la restricción de contenido de `name`.
- Mantener RLS habilitado en `public.daycares`.
- Crear las políticas `daycares_read`, `daycares_insert`, `daycares_update` y `daycares_delete` con las condiciones definidas en el archivo editado.
- Mantener revocados todos los privilegios de tabla de `anon` y `authenticated`; no conceder `SELECT` ni ningún permiso de escritura.
- Eliminar la fila existente de `public.daycares`, incluida `Guardería Sala Soles` con UUID fijo.
- Insertar exactamente las cuatro guarderías acordadas con UUID generados mediante el valor por defecto de `id`.
- Verificar estructura, restricciones, políticas, privilegios, datos, historial y asesores después de aplicar la migración.

**Fuera de alcance (para futuras specs):**

- Modificar tablas distintas de `public.daycares`.
- Conceder acceso mediante la Data API a `anon` o `authenticated`.
- Autorizar escritura para clientes o roles autenticados.
- Crear un trigger que actualice `updated_at` automáticamente.
- Conservar el UUID fijo anterior de `Guardería Sala Soles`.
- Conservar filas adicionales que pudieran existir en `public.daycares` al ejecutar la migración.
- Integrar Supabase con Next.js, instalar SDKs o generar tipos TypeScript.
- Modificar componentes, rutas, fixtures o estilos de la aplicación.
- Reparar, eliminar o volver a ejecutar la entrada remota `20260823220658_create_daycares`.

## Modelo de datos

El estado final de `public.daycares` será:

| Columna      | Tipo          | Nulabilidad | Valor por defecto   | Restricciones  |
| ------------ | ------------- | ----------- | ------------------- | -------------- |
| `id`         | `uuid`        | `not null`  | `gen_random_uuid()` | Clave primaria |
| `name`       | `text`        | `not null`  | Ninguno             | Ninguna        |
| `address`    | `text`        | Nullable    | Ninguno             | Ninguna        |
| `created_at` | `timestamptz` | `not null`  | `now()`             | Ninguna        |
| `updated_at` | `timestamptz` | `not null`  | `now()`             | Ninguna        |

- `updated_at` recibe `now()` al insertar una fila, pero no cambia automáticamente en operaciones `UPDATE`.
- La migración elimina todos los datos existentes antes de insertar el nuevo catálogo.
- Los cuatro UUID se generan mediante `gen_random_uuid()`; ninguno conserva el UUID fijo de SPEC 11.

El catálogo final contendrá exactamente:

| Nombre                  | Dirección                             |
| ----------------------- | ------------------------------------- |
| `Guardería Sala Soles`  | `Av. Principal 123, Centro`           |
| `Guardería Arcoíris`    | `Calle Luna 456, Zona Norte`          |
| `Guardería Semillitas`  | `Blvd. del Sol 789, Col. Jardines`    |
| `Guardería Estrellitas` | `Paseo de los Niños 321, Residencial` |

Las políticas finales serán:

| Política          | Operación | `USING`   | `WITH CHECK` |
| ----------------- | --------- | --------- | ------------ |
| `daycares_read`   | `SELECT`  | `true`    | No aplica    |
| `daycares_insert` | `INSERT`  | No aplica | `false`      |
| `daycares_update` | `UPDATE`  | `false`   | Implícito    |
| `daycares_delete` | `DELETE`  | `false`   | No aplica    |

La política `daycares_read` expresa lectura sin filtro de filas, pero no vuelve pública la tabla por sí sola. Los roles `anon` y `authenticated` seguirán sin poder leerla porque no recibirán privilegio `SELECT`.

## Plan de implementación

1. Consultar la documentación y el changelog vigentes de Supabase para migraciones, RLS y privilegios; inspeccionar nuevamente la estructura, filas, políticas, privilegios e historial del proyecto conectado antes de escribir SQL.
2. Restaurar `supabase/migrations/20260823220658_create_daycares.sql` a la versión aplicada en SPEC 11 y comprobar que su contenido vuelve a coincidir con el historial existente.
3. Preparar una migración transaccional `update_daycares_catalog` que añada `address` y `updated_at`, elimine `daycares_name_not_blank`, cree las cuatro políticas, elimine todas las filas existentes e inserte las cuatro guarderías acordadas, sin conceder privilegios a clientes.
4. Aplicar la migración mediante Supabase MCP `apply_migration` y guardar exactamente el SQL aplicado en `supabase/migrations/<version>_update_daycares_catalog.sql`, usando la versión registrada por el proyecto remoto.
5. Consultar el proyecto remoto para verificar columnas, defaults, nulabilidad, ausencia de `daycares_name_not_blank`, RLS, políticas, privilegios, cuatro filas, UUID nuevos e historial de migraciones.
6. Ejecutar los asesores de seguridad y rendimiento, documentar cualquier hallazgo relacionado con `public.daycares` y confirmar que no se introducen errores de seguridad ni problemas de rendimiento no explicados por el contrato aprobado.

## Criterios de aceptación

- [x] `supabase/migrations/20260823220658_create_daycares.sql` coincide nuevamente con la migración aplicada en SPEC 11 y no contiene el delta de esta spec.
- [x] Existe exactamente una nueva migración local cuyo nombre termina en `_update_daycares_catalog.sql`.
- [x] El contenido de la nueva migración local coincide con el SQL aplicado mediante Supabase MCP.
- [x] El historial remoto conserva `20260823220658_create_daycares` sin reparación, eliminación ni reejecución y registra una versión posterior para `update_daycares_catalog`.
- [x] `public.daycares` contiene exactamente las columnas `id`, `name`, `address`, `created_at` y `updated_at` con el contrato indicado en el modelo de datos.
- [x] La restricción `daycares_name_not_blank` ya no existe y la base de datos acepta un `name` vacío cuando la operación se ejecuta con un rol administrativo autorizado.
- [x] `updated_at` usa `now()` por defecto, no admite nulos y no existe ningún trigger de actualización automática asociado a la tabla.
- [x] RLS permanece habilitado en `public.daycares`.
- [x] Existen exactamente las políticas `daycares_read`, `daycares_insert`, `daycares_update` y `daycares_delete` con las operaciones y condiciones acordadas.
- [x] Los roles `anon` y `authenticated` no tienen privilegios `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, `REFERENCES` ni `TRIGGER` sobre `public.daycares`.
- [x] Una consulta a `public.daycares` como `anon` o `authenticated` no obtiene acceso aunque `daycares_read` use `true`.
- [x] La fila anterior con UUID `00000000-0000-0000-0000-000000000001` ya no existe.
- [x] `public.daycares` contiene exactamente cuatro filas con los pares `name` y `address` definidos en el modelo de datos.
- [x] Las cuatro filas tienen UUID no nulos y distintos generados por el valor por defecto de `id`.
- [x] Las cuatro filas tienen `created_at` y `updated_at` no nulos.
- [x] Los asesores de seguridad y rendimiento se ejecutan después de la migración y no reportan errores nuevos sin resolver causados por `public.daycares`.
- [x] No se modifican archivos de aplicación, dependencias, configuración de Next.js ni otras tablas del proyecto.

## Decisiones

- **Sí:** crear una migración incremental nueva. La migración original ya está aplicada y debe permanecer inmutable para que el historial sea reproducible.
- **Sí:** restaurar el archivo original antes de representar el delta. Evita que un reset futuro construya un estado distinto bajo un timestamp histórico.
- **Sí:** aplicar el cambio mediante Supabase MCP y conservar una copia local exacta de la migración registrada. Cumple el flujo imperativo y mantiene el repositorio como fuente auditable.
- **Sí:** reemplazar todas las filas actuales. El usuario eligió sustituir el seed anterior por el catálogo de cuatro guarderías.
- **Sí:** generar UUID nuevos para las cuatro guarderías. La fila de Sala Soles no conserva el identificador fijo de SPEC 11.
- **Sí:** eliminar `daycares_name_not_blank`. El estado deseado permite nombres vacíos o compuestos solo por espacios.
- **Sí:** añadir `address` como texto nullable. Replica el contrato del archivo editado sin imponer una dirección obligatoria.
- **Sí:** añadir `updated_at` con `default now()` y sin automatización posterior. El valor solo se actualiza cuando una operación futura lo asigna explícitamente.
- **Sí:** crear una política de lectura con `USING (true)` y políticas de escritura que siempre rechazan filas. Replica el contrato solicitado de RLS.
- **Sí:** mantener revocados los privilegios de `anon` y `authenticated`. La existencia de políticas no expone la tabla mediante la Data API.
- **No:** editar y volver a ejecutar `20260823220658_create_daycares`. Supabase ya registra esa versión y no ejecutará de nuevo su contenido modificado.
- **No:** preservar el UUID fijo de Sala Soles. Esta decisión puede romper referencias futuras, pero actualmente no existen otras tablas de dominio en el proyecto conectado.
- **No:** conceder `SELECT` a clientes. La política de lectura queda preparada, pero sin efecto para `anon` y `authenticated` hasta una spec posterior.
- **No:** crear un trigger para `updated_at`. No forma parte del SQL solicitado.
- **No:** modificar la aplicación. Esta spec se limita a la base de datos y su historial versionado.

## Riesgos

| Riesgo                                                                               | Mitigación                                                                                                                           |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| Editar una migración ya aplicada deja el historial local divergente.                 | Restaurar el archivo histórico y mover todo el delta a una versión nueva.                                                            |
| El reemplazo de filas elimina el UUID fijo y cualquier dato agregado fuera del seed. | Verificar antes de aplicar que la tabla conserva únicamente la fila conocida y abortar si aparecen datos o dependencias inesperadas. |
| Futuras claves foráneas podrían impedir el borrado o quedar rotas.                   | Inspeccionar dependencias antes de aplicar; el estado actual no contiene otras tablas de dominio.                                    |
| `daycares_read` puede interpretarse erróneamente como acceso público efectivo.       | Verificar por separado políticas y privilegios; mantener revocados los permisos de cliente.                                          |
| `updated_at` puede quedar obsoleto después de un cambio.                             | Documentar que las operaciones futuras deben asignarlo explícitamente o aprobar otra spec para automatizarlo.                        |
| Permitir nombres vacíos reduce la integridad del dominio.                            | Registrar la decisión explícita y limitar esta spec al contrato solicitado.                                                          |

## Lo que **no** incluye esta spec

- Reescribir el historial remoto ya aplicado.
- Conservar datos existentes ni el UUID fijo de Sala Soles.
- Acceso de lectura o escritura para clientes de Supabase.
- Automatización de `updated_at`.
- Otras tablas, relaciones, claves foráneas o entidades del esquema de referencia.
- Integración con Next.js, SDKs, tipos generados o cambios visuales.

Cada concesión de acceso, relación con otras tablas o automatización de timestamps debe definirse en una spec posterior.
