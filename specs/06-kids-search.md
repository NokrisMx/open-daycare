# SPEC 06 — Búsqueda de niños

> **Estado:** Aprobado
> **Depende de:** SPEC 05
> **Fecha:** 2026-08-19
> **Objetivo:** Hacer funcional la búsqueda de `/kids` mediante un filtrado local, temporal y accesible por nombre completo, sin modificar los datos, perfiles ni fuentes remotas.

## Alcance

**Incluye:**

- Modificar únicamente `components/kids/kids-list.tsx` entre los archivos de aplicación.
- Convertir `KidsList` en Client Component para controlar la consulta y el retraso del filtro dentro del componente existente.
- Buscar exclusivamente sobre `kid.name`, que contiene el nombre completo visible de cada niño.
- Eliminar los espacios externos y comparar sin distinguir mayúsculas, minúsculas ni tildes.
- Considerar coincidencia cuando el nombre completo normalizado contenga la consulta completa normalizada en cualquier posición.
- Conservar el orden original recibido mediante la prop `kids` cuando existan varias coincidencias.
- Actualizar el filtro 300 ms después de la última modificación de una consulta no vacía.
- Mantener los resultados y el contador anteriores durante esos 300 ms.
- Cancelar cualquier actualización pendiente cuando la consulta vuelva a cambiar antes de cumplirse el retraso.
- Considerar vacía una consulta sin caracteres o compuesta únicamente por espacios y restaurar inmediatamente la colección completa.
- Mantener el campo de búsqueda controlado, su `aria-label="Buscar niño"` y su placeholder `Buscar niño…`.
- Actualizar el contador con las formas `0 niños`, `1 niño` o `N niños` según la cantidad de tarjetas visibles.
- Anunciar el contador actualizado mediante una región `aria-live="polite"` y atómica.
- Sustituir la cuadrícula por un panel de ancho completo cuando no existan coincidencias.
- Mostrar en el panel sin resultados los textos `No se encontraron niños.` y `Prueba con otro nombre.`.
- Mantener el panel sin resultados dentro del lenguaje visual existente de fondo, borde y radios de las tarjetas.
- Conservar sin cambios el contenido, orden interno, estilos y destinos de las tarjetas que permanezcan visibles.
- Mantener la búsqueda local y temporal: la consulta se reinicia al recargar la página o volver a montar `/kids`.

**Fuera de alcance (para futuras specs):**

- Buscar por edad, cantidad de padres, badges, alertas u otros datos del perfil.
- Ordenar alfabéticamente o calcular relevancia entre las coincidencias.
- Resaltar dentro de las tarjetas el fragmento coincidente.
- Añadir un botón para limpiar la búsqueda.
- Persistir la consulta en la URL, `localStorage`, cookies u otro mecanismo.
- Consultar una API, base de datos o cualquier fuente remota.
- Añadir estados de carga o error de red.
- Modificar `app/kids/data.ts`, `app/kids/page.tsx`, `components/kids/kid-card.tsx` o los perfiles.
- Añadir dependencias, nuevos componentes públicos, utilidades compartidas o hooks extraídos.
- Incorporar un runner de pruebas, pruebas unitarias, pruebas E2E o infraestructura de regresión visual.

## Modelo de datos

Esta funcionalidad no introduce ni modifica estructuras de datos de dominio. Reutiliza `KidsListProps`, `KidSummary` y la colección `kids` definidos en SPEC 05.

`components/kids/kids-list.tsx` mantendrá únicamente estado efímero de interfaz con estos conceptos:

- `query`: valor actual y controlado del input.
- `debouncedQuery`: última consulta no vacía aplicada después de 300 ms, o una cadena vacía al limpiar el campo.
- `visibleKids`: colección derivada de la prop `kids` y `debouncedQuery`; no se persistirá ni duplicará en estado.

La normalización será privada al mismo archivo. Recibirá un texto, eliminará espacios externos y marcas diacríticas, y lo convertirá a minúsculas antes de comparar. La colección original y cada objeto `KidSummary` permanecerán inmutables.

## Plan de implementación

1. Añadir la directiva `"use client"` a `components/kids/kids-list.tsx`, controlar el input mediante `query` y comprobar que escribir todavía conserva visibles las ocho tarjetas.
2. Incorporar `debouncedQuery` y un efecto con temporizador de 300 ms para consultas no vacías; limpiar el temporizador al cambiar la consulta o desmontar el componente y aplicar inmediatamente la cadena vacía cuando `query.trim()` no contenga caracteres.
3. Añadir en el mismo archivo la normalización privada de texto y derivar `visibleKids` filtrando `kids` por inclusión dentro de `kid.name`, sin alterar la colección ni su orden.
4. Sustituir el conteo y el mapeo actuales para usar `visibleKids`, aplicar singular o plural según corresponda y convertir el contador en una región viva no intrusiva y atómica.
5. Renderizar en lugar de la cuadrícula el panel de ancho completo con los dos textos acordados cuando `visibleKids` esté vacío, conservando la composición actual para uno o más resultados.
6. Verificar con Playwright las consultas vacía, parcial, sin tildes, con distinto uso de mayúsculas, sin coincidencias y modificada rápidamente; comprobar también el contador, el anuncio accesible, el orden y la navegación de las tarjetas.
7. Revisar `/kids` a 390, 767, 768 y 1200 px, comprobar que no exista desbordamiento horizontal ni regresión visual, revisar la consola y ejecutar `npm run lint -- app` y `npm run build`.

## Criterios de aceptación

- [x] El único archivo de aplicación modificado es `components/kids/kids-list.tsx`.
- [x] Al entrar en `/kids` con la consulta vacía se muestran las ocho tarjetas en el orden definido por `app/kids/data.ts` y el contador indica `8 niños`.
- [x] El input conserva el placeholder `Buscar niño…`, la etiqueta accesible `Buscar niño` y permite editar su valor normalmente.
- [x] La búsqueda compara únicamente el campo `kid.name` de cada elemento.
- [x] Escribir `sofia` muestra únicamente la tarjeta de Sofía Méndez después de 300 ms.
- [x] Escribir `mendez` encuentra a Sofía Méndez aunque el dato contenga la tilde en `Méndez`.
- [x] Escribir `FER` encuentra a Mateo Fernández sin distinguir mayúsculas de minúsculas.
- [x] Una consulta parcial coincide en cualquier posición del nombre completo normalizado.
- [x] Los espacios al inicio y al final de una consulta no cambian sus coincidencias.
- [x] Durante los 300 ms posteriores a una consulta no vacía permanecen visibles los resultados y el contador de la consulta aplicada anteriormente.
- [x] Cuando el texto cambia varias veces antes de 300 ms, solo se aplica la última consulta y ningún temporizador anterior reemplaza posteriormente sus resultados.
- [x] Borrar todo el contenido restaura inmediatamente las ocho tarjetas sin esperar 300 ms.
- [x] Introducir únicamente espacios se trata como una consulta vacía y restaura inmediatamente las ocho tarjetas.
- [x] Cuando una consulta devuelve una sola coincidencia, el contador muestra `1 niño`.
- [x] Cuando una consulta no devuelve coincidencias, el contador muestra `0 niños`.
- [x] Cuando existen dos o más coincidencias, el contador muestra `N niños` con la cantidad visible exacta.
- [x] Cada actualización aplicada del contador se anuncia mediante una región `aria-live="polite"` y `aria-atomic="true"`.
- [x] Una consulta sin coincidencias reemplaza la cuadrícula por un panel de ancho completo con `No se encontraron niños.` y `Prueba con otro nombre.`.
- [x] El estado sin resultados no incluye la consulta escrita ni un botón para limpiar el campo.
- [x] Las coincidencias conservan el mismo orden relativo que tienen en la prop `kids`.
- [x] Las tarjetas visibles conservan literalmente sus nombres, edades, padres, badges, estilos y enlaces aprobados en SPEC 05.
- [x] Pulsar una tarjeta después de filtrar navega al perfil numérico correcto.
- [x] Recargar `/kids` o salir y volver a montar la ruta reinicia la consulta y muestra la colección completa.
- [x] La búsqueda no añade parámetros a la URL, no accede al almacenamiento del navegador y no realiza solicitudes de red.
- [x] `app/kids/data.ts`, `app/kids/page.tsx`, `components/kids/kid-card.tsx` y las rutas de perfil permanecen sin cambios.
- [x] A 390 y 767 px la búsqueda, el contador, una tarjeta única y el panel vacío ocupan el ancho disponible sin producir desbordamiento horizontal.
- [x] A 768 y 1200 px la composición conserva el breakpoint, las dimensiones y la cuadrícula de dos columnas aprobados en SPEC 05 cuando existen varias coincidencias.
- [x] La consola del navegador no muestra errores al escribir, borrar, cambiar rápidamente la consulta o navegar desde un resultado.
- [x] No se incorporan dependencias, utilidades compartidas, hooks extraídos ni infraestructura de pruebas automatizadas.
- [x] `npm run lint -- app` finaliza correctamente.
- [x] `npm run build` finaliza correctamente.

## Decisiones

- **Sí:** depender de SPEC 05. Esta funcionalidad activa el campo y la colección estática creados allí sin redefinir el listado.
- **Sí:** modificar únicamente `components/kids/kids-list.tsx`. El estado, la normalización y el filtrado son pequeños y solo tienen un consumidor.
- **No:** extraer una utilidad o un hook. No existe todavía un segundo caso de búsqueda que justifique una abstracción compartida.
- **Sí:** convertir `KidsList` en Client Component. El valor controlado y el temporizador requieren estado y efectos en el navegador.
- **Sí:** derivar los resultados desde las props en cada render relevante. La colección filtrada no necesita estado independiente y así no puede desincronizarse.
- **Sí:** buscar exclusivamente por nombre completo. Es el criterio esperado para una barra de búsqueda de niños y evita coincidencias inesperadas por metadatos secundarios.
- **Sí:** ignorar mayúsculas, minúsculas, tildes y espacios externos. Los usuarios no deben reproducir exactamente la ortografía del fixture para encontrar un nombre.
- **Sí:** usar coincidencia parcial sobre la consulta completa. Permite encontrar tanto nombres como apellidos sin introducir reglas de relevancia.
- **Sí:** esperar 300 ms desde la última modificación no vacía. Evita actualizar la cuadrícula en cada pulsación sin hacer perceptiblemente lenta la interacción.
- **Sí:** conservar los resultados anteriores durante la espera. La operación es local y no necesita un estado de carga intermedio.
- **Sí:** cancelar temporizadores obsoletos y restaurar inmediatamente al limpiar. Impide que una consulta anterior reaparezca después de vaciar el campo.
- **Sí:** mantener el orden de la colección original. El filtrado no debe introducir una política de ordenamiento nueva.
- **Sí:** actualizar el contador con singular y plural y anunciarlo de forma no intrusiva. El cambio visual debe estar disponible también para tecnologías de asistencia.
- **Sí:** mostrar un panel de ancho completo con un mensaje breve cuando no existan resultados. Comunica el estado sin alterar las tarjetas ni añadir nuevas acciones.
- **No:** añadir un botón Limpiar o repetir la consulta en el mensaje. El campo permanece visible y editable, y el contenido acordado debe ser breve.
- **Sí:** mantener la consulta solo durante el montaje actual de `KidsList`. No existe un requisito para compartir, restaurar o persistir búsquedas.
- **No:** añadir pruebas automatizadas. El repositorio no tiene runner y esta spec conserva la estrategia manual, lint y build de las specs anteriores.

## Riesgos

| Riesgo                                                                                                        | Mitigación                                                                                                                            |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Un temporizador anterior puede aplicar una consulta obsoleta después de una pulsación nueva o de limpiar.     | Limpiar el temporizador en cada cambio y desmontaje, y cancelar cualquier espera antes de restaurar inmediatamente la consulta vacía. |
| Comparar el texto directamente puede impedir que `sofia` o `mendez` encuentren valores con tildes.            | Normalizar consulta y nombres con el mismo proceso antes de usar la coincidencia parcial.                                             |
| Duplicar los resultados filtrados en estado puede desincronizarlos de la prop `kids`.                         | Mantener solo `query` y `debouncedQuery` como estado y derivar `visibleKids` sin mutar la colección.                                  |
| Convertir `KidsList` en Client Component puede producir una regresión visual o de navegación en las tarjetas. | Mantener sin cambios `KidCard`, sus props y enlaces, y repetir las comprobaciones responsive y de navegación de SPEC 05.              |
| El contador puede anunciar cambios excesivos mientras se escribe.                                             | Actualizar la región viva solo cuando se aplique la consulta diferida o se limpie inmediatamente el campo.                            |

## Lo que **no** incluye esta spec

- Búsqueda por campos distintos del nombre completo.
- Ordenamiento, relevancia o resaltado de coincidencias.
- Persistencia en URL o navegador.
- API, base de datos, carga remota o estados de red.
- Cambios en fixtures, páginas, tarjetas o perfiles.
- Componentes, hooks, utilidades o dependencias nuevas.
- Un botón para limpiar o acciones nuevas dentro del estado vacío.
- Pruebas automatizadas o infraestructura adicional.

Cualquier ampliación de criterios, persistencia o integración con datos remotos debe definirse en su propia spec.
