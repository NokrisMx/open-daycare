# SPEC 11 — Fundación de base de datos para guarderías

> **Estado:** Implemetado
> **Depende de:** Ninguna
> **Fecha:** 2026-08-23
> **Objetivo:** Establecer el flujo local de migraciones imperativas y crear en el proyecto Supabase conectado la tabla raíz `public.daycares`, protegida y sembrada con Guardería Sala Soles.

## Por qué existe esta spec

El proyecto remoto conserva dos migraciones de prueba, pero el repositorio todavía no tiene configuración local de Supabase ni archivos de migración. Esta spec establece una cadena reproducible antes de incorporar la primera tabla de dominio y evita que los siguientes cambios de base de datos dependan de operaciones remotas sin versionar.

## Alcance

**Incluye:**

- Instalar `supabase` como dependencia de desarrollo con una versión estable exacta en `package.json` y `package-lock.json`.
- Inicializar el flujo local de Supabase mediante `supabase/config.toml`.
- Crear `supabase/.gitignore` para excluir al menos `.temp/` y `.branches/`, incluidos los datos locales del vínculo con el proyecto remoto.
- Usar exclusivamente migraciones imperativas bajo `supabase/migrations/`; no crear `supabase/schemas/`.
- Autenticar la CLI y vincular el repositorio al proyecto Supabase actual sin guardar tokens, contraseñas ni otros secretos en archivos versionados.
- Recuperar con `npx supabase migration fetch --linked` las migraciones remotas `20260823184446_create_connection_test_table.sql` y `20260823184754_drop_connection_test_table.sql`.
- Confirmar que las migraciones recuperadas reproducen la creación y eliminación ya ejecutadas de `public.connection_test` y que esa tabla no existe en el estado final.
- Generar una migración nueva mediante `npx supabase migration new create_daycares`; el nombre final seguirá el patrón `supabase/migrations/<timestamp>_create_daycares.sql` asignado por la CLI.
- Crear `public.daycares` con las columnas `id`, `name` y `created_at` definidas en la referencia `docs/opendaycare-database-schema.md`, añadiendo las restricciones y valores por defecto acordados.
- Activar RLS explícitamente en la migración aunque el proyecto remoto tenga el event trigger `ensure_rls`, de modo que la cadena también sea reproducible en el stack local.
- Revocar todos los privilegios de tabla a `anon` y `authenticated`, sin crear políticas RLS mientras no exista la relación de pertenencia mediante `users.daycare_id`.
- Insertar en la misma migración la guardería inicial `Guardería Sala Soles` con el UUID fijo `00000000-0000-0000-0000-000000000001`.
- Reconstruir y verificar la cadena completa en el stack local antes de impactar el remoto.
- Previsualizar y aplicar la migración al proyecto conectado mediante `npx supabase db push --linked`.
- Verificar el esquema, la fila inicial, la seguridad, el historial y los asesores en el proyecto remoto después del push.

**Fuera de alcance (para futuras specs):**

- Crear cualquier otra tabla del esquema de referencia, incluidos `users`, `rooms`, `children`, publicaciones o invitaciones.
- Crear políticas RLS de lectura o escritura para `daycares`; requieren un modelo de usuarios y pertenencia todavía inexistente.
- Conceder acceso a `daycares` a los roles `anon` o `authenticated`.
- Instalar el SDK de Supabase, añadir variables de entorno o conectar la aplicación Next.js.
- Generar tipos TypeScript del esquema.
- Crear `supabase/seed.sql`; la fila inicial forma parte de la migración y debe existir también en el proyecto remoto.
- Adoptar esquemas declarativos en `supabase/schemas/` o mezclar los flujos declarativo e imperativo.
- Crear una Supabase development branch; el destino es el proyecto conectado actual.
- Reparar o eliminar entradas del historial remoto de migraciones.
- Corregir los warnings existentes relacionados con `public.rls_auto_enable()`.
- Modificar componentes, rutas, fixtures o estilos de la aplicación.

## Modelo de datos

La migración `<timestamp>_create_daycares.sql` contendrá una unidad atómica equivalente a:

```sql
create table public.daycares (
  id uuid primary key default gen_random_uuid(),
  name text not null
    constraint daycares_name_not_blank check (btrim(name) <> ''),
  created_at timestamptz not null default now()
);

alter table public.daycares enable row level security;

revoke all privileges
on table public.daycares
from anon, authenticated;

insert into public.daycares (id, name)
values (
  '00000000-0000-0000-0000-000000000001',
  'Guardería Sala Soles'
);
```

| Columna      | Tipo          | Nulabilidad | Valor por defecto   | Restricciones                                       |
| ------------ | ------------- | ----------- | ------------------- | --------------------------------------------------- |
| `id`         | `uuid`        | `not null`  | `gen_random_uuid()` | Clave primaria                                      |
| `name`       | `text`        | `not null`  | Ninguno             | `daycares_name_not_blank`, exige contenido no vacío |
| `created_at` | `timestamptz` | `not null`  | `now()`             | Ninguna adicional                                   |

- La guardería inicial usa un UUID fijo para que futuras claves foráneas y fixtures sean reproducibles entre el stack local y el proyecto remoto.
- No se añade una restricción `unique` a `name`; distintas guarderías pueden compartir nombre.
- No se añade `updated_at` porque la referencia de `daycares` solo define `created_at`.
- RLS queda habilitado sin políticas y, además, `anon` y `authenticated` pierden sus privilegios de tabla.
- Los roles administrativos y cualquier rol con `bypassrls` deben permanecer exclusivamente en entornos de servidor y administración.

El historial local recuperará estas dos versiones ya aplicadas en remoto:

| Archivo                                                               | Estado final                                   |
| --------------------------------------------------------------------- | ---------------------------------------------- |
| `supabase/migrations/20260823184446_create_connection_test_table.sql` | Crea la tabla temporal de prueba y activa RLS. |
| `supabase/migrations/20260823184754_drop_connection_test_table.sql`   | Elimina la tabla temporal y sus datos.         |

## Plan de implementación

1. Consultar `npx supabase --help` y la ayuda específica de los comandos que se utilizarán; instalar la versión estable de `supabase` con `npm install supabase@latest --save-dev --save-exact`, inicializar el proyecto con `npx supabase init` y asegurar que `.temp/` y `.branches/` queden ignorados.
2. Autenticar la CLI, vincularla al proyecto Supabase actual, recuperar el historial con `npx supabase migration fetch --linked` y comprobar mediante `npx supabase migration list --linked` que las versiones `20260823184446` y `20260823184754` coinciden local y remotamente.
3. Crear la migración mediante `npx supabase migration new create_daycares` y añadir en ella la tabla, restricciones, RLS, revocaciones y fila inicial descritas en el modelo de datos.
4. Iniciar el stack local, ejecutar `npx supabase db reset --local` y verificar que las tres migraciones se aplican desde cero, `public.connection_test` no existe y `public.daycares` cumple el contrato completo; ejecutar también el lint de base de datos local para el esquema `public`.
5. Revisar `npx supabase migration list --linked` y ejecutar `npx supabase db push --linked --dry-run`; confirmar antes del cambio remoto que solo `create_daycares` está pendiente y después aplicar `npx supabase db push --linked` sin `--include-seed`, `--include-all` ni reset remoto.
6. Verificar en el proyecto conectado la estructura de `public.daycares`, su fila inicial, RLS, ausencia de políticas, privilegios revocados y alineación del historial; ejecutar los asesores de seguridad y rendimiento y comparar sus resultados con el baseline previo.

## Criterios de aceptación

- [x] `package.json` contiene `supabase` en `devDependencies` con una versión exacta, sin `^` ni `~`, y `package-lock.json` queda actualizado.
- [x] `supabase/config.toml` existe, es seguro para versionarse y no contiene tokens, contraseñas ni claves privadas.
- [x] `supabase/.gitignore` excluye `.temp/` y `.branches/`, y ningún estado de vínculo o credencial queda versionado.
- [x] El repositorio usa migraciones imperativas bajo `supabase/migrations/` y no existe `supabase/schemas/`.
- [x] `supabase/migrations/20260823184446_create_connection_test_table.sql` y `supabase/migrations/20260823184754_drop_connection_test_table.sql` fueron recuperados desde el historial remoto sin reparar ni eliminar sus entradas.
- [x] Antes del nuevo push, `npx supabase migration list --linked` muestra alineadas local y remotamente las dos migraciones históricas.
- [x] Existe exactamente una migración nueva cuyo nombre termina en `_create_daycares.sql`.
- [x] `npx supabase db reset --local` reconstruye correctamente la base local aplicando las tres migraciones en orden.
- [x] `public.connection_test` no existe después del reset local ni en el proyecto remoto.
- [x] `public.daycares` existe en local y remoto con exactamente las columnas `id uuid`, `name text` y `created_at timestamptz`.
- [x] `id` es la clave primaria, no admite nulos y usa `gen_random_uuid()` por defecto.
- [x] `name` no admite nulos y la restricción `daycares_name_not_blank` rechaza valores vacíos o compuestos solo por espacios.
- [x] `created_at` no admite nulos y usa `now()` por defecto.
- [x] Existe exactamente una fila con `id = '00000000-0000-0000-0000-000000000001'` y `name = 'Guardería Sala Soles'` en local y remoto.
- [x] RLS está habilitado explícitamente en `public.daycares` tanto en local como en remoto.
- [x] `public.daycares` no tiene políticas RLS.
- [x] Los roles `anon` y `authenticated` no tienen privilegios `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, `REFERENCES` ni `TRIGGER` sobre `public.daycares`.
- [x] `npx supabase db push --linked --dry-run` identifica solo la migración `create_daycares` como pendiente antes de aplicarla.
- [x] `npx supabase db push --linked` finaliza correctamente sin resetear el proyecto remoto ni incluir un archivo de seed.
- [x] Después del push, `npx supabase migration list --linked` muestra alineadas local y remotamente las tres versiones.
- [x] El asesor de rendimiento no reporta hallazgos nuevos causados por `public.daycares`.
- [x] El asesor de seguridad no añade WARN ni ERROR por `public.daycares`; se acepta el INFO esperado `rls_enabled_no_policy` porque el bloqueo sin políticas es intencional.
- [x] Los dos WARN preexistentes sobre `public.rls_auto_enable()` permanecen como baseline y no se modifican en esta spec.
- [x] No se modifican archivos de `app/`, `components/`, referencias visuales ni fixtures.
- [x] No se instalan SDKs de Supabase ni se generan tipos TypeScript.

## Decisiones

- **Sí:** migraciones imperativas versionadas. Es el patrón elegido para todos los cambios de esquema de este proyecto.
- **Sí:** CLI como dependencia de desarrollo con versión exacta. Permite que el equipo use el mismo ejecutable mediante `npx supabase` y deja la resolución registrada en el lockfile.
- **Sí:** recuperar las migraciones de prueba mediante `migration fetch`. Conserva la auditoría remota y evita inventar, reparar o borrar versiones existentes.
- **Sí:** mantener las migraciones de creación y eliminación de `connection_test`. Aunque su efecto neto es vacío, forman parte del historial real y permiten que `migration list` quede alineado.
- **Sí:** UUID con `gen_random_uuid()` para `daycares`. Sigue la convención explícita del esquema de referencia.
- **Sí:** UUID fijo para la fila inicial. Las futuras tablas podrán referenciar la misma guardería en todos los entornos.
- **Sí:** nombre obligatorio y no vacío. Una guardería sin nombre no representa un estado válido del dominio.
- **Sí:** `created_at` obligatorio con `now()`. Evita que cada inserción deba suministrar manualmente la fecha de creación.
- **Sí:** RLS explícito y privilegios revocados a `anon` y `authenticated`. El event trigger remoto no existe necesariamente en el stack local y todavía no hay una relación segura para autorizar filas por guardería.
- **Sí:** fila inicial dentro de la misma migración. La estructura y el dato requerido llegan de forma atómica tanto a local como a remoto.
- **Sí:** aplicar directamente al proyecto conectado después de un reset local y un dry run. El esquema `public` remoto está vacío y ese es el destino solicitado.
- **Sí:** aceptar el INFO `rls_enabled_no_policy`. Describe exactamente el bloqueo intencional hasta que una spec posterior defina usuarios, pertenencia y políticas.
- **No:** permitir lectura a todos los usuarios autenticados. Expondría todas las guarderías sin aislamiento por tenant.
- **No:** usar solo MCP para crear la tabla. No establecería el patrón local reproducible solicitado.
- **No:** usar esquemas declarativos. Mezclaría dos fuentes de verdad y el proyecto eligió explícitamente migraciones imperativas.
- **No:** usar `supabase/seed.sql`. La guardería inicial debe existir también en el proyecto remoto y no es solo un fixture local.
- **No:** reparar el historial remoto. Las dos migraciones de prueba se pueden recuperar directamente y sus entradas son correctas.
- **No:** integrar Supabase con Next.js o generar tipos. Esta spec se limita a infraestructura de base de datos y a la primera tabla.

## Riesgos

| Riesgo                                                                                                  | Mitigación                                                                                                                         |
| ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| La CLI necesita autenticación y la contraseña de base de datos para vincular o hacer push.              | Usar `supabase login` o credenciales suministradas por variables de entorno; nunca escribirlas en archivos versionados.            |
| El stack local necesita Docker y puede descargar imágenes pesadas en el primer inicio.                  | Docker está instalado; iniciar el stack antes de editar el remoto y detenerse si los contenedores no superan sus health checks.    |
| Las migraciones históricas crean y eliminan temporalmente `connection_test` durante cada reset local.   | Conservar ambas en orden; verificar el estado final después de ejecutar la cadena completa.                                        |
| El event trigger remoto `ensure_rls` puede ocultar una omisión de seguridad que sí fallaría localmente. | Incluir `alter table ... enable row level security` explícitamente en la migración y comprobar `relrowsecurity` en ambos entornos. |
| La tabla sin políticas genera el INFO `rls_enabled_no_policy`.                                          | Documentarlo como estado intencional y exigir que no aparezcan WARN o ERROR nuevos por `daycares`.                                 |
| El push impacta directamente el proyecto conectado.                                                     | Revisar el proyecto vinculado, ejecutar `migration list` y `db push --dry-run`, y no utilizar `db reset --linked`.                 |
| Los grants predeterminados de tablas nuevas pueden variar según la configuración del Data API.          | Revocar explícitamente todos los privilegios de `anon` y `authenticated` y verificar con `has_table_privilege`.                    |

## Lo que **no** incluye esta spec

- Las tablas `users`, `rooms`, `children` ni ninguna otra entidad de dominio.
- Políticas RLS o acceso de clientes a `daycares`.
- Supabase Auth, Storage, Realtime o Edge Functions.
- SDK, variables de entorno, tipos generados o integración con Next.js.
- Seed local separado, datos adicionales o edición de la guardería inicial.
- Esquemas declarativos, CI/CD o Supabase branches.
- Reparación del historial remoto o corrección de warnings preexistentes.
- Cambios en la interfaz, fixtures o lógica de la aplicación.

Cada tabla posterior, el modelo de usuarios y las políticas de acceso por guardería deben definirse en sus propias specs.
