# Módulo de Aprobaciones — Definición funcional

**App:** Motorfy (asesores de financiamiento y vendedores)
**Pantalla:** `components/screens/approvals-screen.tsx`
**Fecha de revisión:** 2026-07-07
**Estado:** funcional en front con datos mock; sin integración a backend/Admin Motorfy

Regla de negocio central: una aprobación de financiera tiene **30 días de vigencia** desde su fecha de aprobación.

| Estado | Regla (días restantes) | Color |
|---|---|---|
| VIGENTE | más de 5 días | Morado `#7859AB` |
| POR VENCER | entre 1 y 5 días | Ámbar `#F59E0B` |
| VENCIDA | 0 días | Rojo `#DC2626` |

---

## F1. Acceso al módulo desde el Dashboard

**Descripción:** en el dashboard existe la tarjeta "APROBACIONES" (con etiqueta "NUEVO") que lleva al módulo. Desde el módulo se regresa al dashboard con el botón atrás.

**Escenarios**
- **E1.1** Dado que el usuario está autenticado y en el dashboard, cuando pulsa la tarjeta "APROBACIONES", entonces navega a la pantalla de aprobaciones.
- **E1.2** Dado que el usuario está en aprobaciones, cuando pulsa el botón atrás (chevron), entonces regresa al dashboard conservando su sesión.

**Criterios de aceptación**
- [ ] La tarjeta es visible para los roles asesor de financiamiento y vendedor.
- [ ] La etiqueta "NUEVO" se muestra mientras la funcionalidad esté en periodo de lanzamiento (definir vigencia de la etiqueta).
- [ ] El regreso al dashboard no pierde el estado de sesión ni los datos del usuario.

---

## F2. Clasificación por vigencia en pestañas (Vigente / Por vencer / Vencida)

**Descripción:** las aprobaciones se clasifican automáticamente en 3 pestañas según los días transcurridos desde la fecha de aprobación. Cada pestaña muestra un contador.

**Escenarios**
- **E2.1** Dado que una solicitud fue aprobada hace menos de 25 días (quedan más de 5), cuando el usuario abre el módulo, entonces aparece en la pestaña VIGENTE con borde e indicadores morados.
- **E2.2** Dado que a una solicitud le quedan entre 1 y 5 días de vigencia, entonces aparece en POR VENCER con indicadores ámbar.
- **E2.3** Dado que una solicitud cumplió 30 días o más desde su aprobación, entonces aparece en VENCIDA con indicadores rojos.
- **E2.4** Dado que el usuario está en cualquier pestaña, cuando cambia de pestaña, entonces la lista se actualiza sin recargar la pantalla y el contador de cada pestaña refleja el total de esa categoría.
- **E2.5** Dado que una pestaña no tiene solicitudes, cuando el usuario la abre, entonces ve el estado vacío con el mensaje correspondiente a la categoría.

**Criterios de aceptación**
- [ ] El cálculo de días usa la **fecha actual del dispositivo/servidor** (hoy está fija en código: `2026-01-22`; ver GAP-1).
- [ ] Límites exactos: 0 días → VENCIDA; 1–5 → POR VENCER; ≥6 → VIGENTE.
- [ ] El contador de cada pestaña coincide con el número de tarjetas listadas.
- [ ] La pestaña por defecto al entrar es VIGENTE.
- [ ] Una solicitud pertenece a una sola categoría a la vez.

---

## F3. Búsqueda de solicitudes

**Descripción:** campo de búsqueda que filtra en vivo por cliente, consecutivo, agencia o vendedor, sin distinguir mayúsculas/minúsculas. El filtro aplica sobre las tres pestañas (los contadores se recalculan).

**Escenarios**
- **E3.1** Dado que el usuario escribe "juan", entonces se muestran solo las solicitudes cuyo cliente, vendedor, agencia o consecutivo contengan "juan" (insensible a mayúsculas).
- **E3.2** Dado que hay búsqueda activa, cuando existen grupos de agencias, entonces todos los grupos se expanden automáticamente para mostrar las coincidencias.
- **E3.3** Dado que la búsqueda no tiene coincidencias, entonces se muestra el estado vacío con el texto «No encontramos aprobaciones que coincidan con "..."».
- **E3.4** Dado que el usuario borra el término de búsqueda, entonces la lista vuelve a mostrarse completa (los grupos expandidos por la búsqueda permanecen expandidos hasta que el usuario los colapse — confirmar si es el comportamiento deseado).

**Criterios de aceptación**
- [ ] La búsqueda filtra en los 4 campos: cliente, consecutivo, agencia, vendedor.
- [ ] El placeholder menciona los campos buscables (hoy dice "cliente, vendedor o agencia" pero también busca por consecutivo; alinear texto).
- [ ] El filtrado es inmediato (sin botón de buscar) y no bloquea la escritura.
- [ ] Los contadores de pestañas reflejan los resultados filtrados.

---

## F4. Agrupación por agencia (expandir/colapsar)

**Descripción:** dentro de cada pestaña las solicitudes se agrupan por agencia, ordenadas alfabéticamente. Cada grupo muestra nombre, número de solicitudes y se expande/colapsa al tocar el encabezado.

**Escenarios**
- **E4.1** Dado que hay solicitudes de varias agencias, entonces se muestran encabezados por agencia ordenados alfabéticamente con su contador ("N solicitudes").
- **E4.2** Dado que un grupo está colapsado, cuando el usuario toca el encabezado, entonces el grupo se expande mostrando sus tarjetas; al tocar de nuevo se colapsa.
- **E4.3** Dado que el usuario cambia de pestaña, entonces el estado expandido/colapsado de las agencias se conserva por nombre de agencia.

**Criterios de aceptación**
- [ ] Todos los grupos inician colapsados al entrar al módulo (comportamiento actual; confirmar con producto).
- [ ] El contador del grupo coincide con las tarjetas contenidas.
- [ ] Singular/plural correcto: "1 solicitud" / "N solicitudes".

---

## F5. Exclusión de la agencia propia

**Descripción:** las solicitudes cuya agencia coincide con la agencia del usuario logueado (`userData.businessName`) **no se muestran** en el listado.

**Escenarios**
- **E5.1** Dado que el usuario pertenece a "TESTQA YAMI", cuando abre el módulo, entonces no ve ninguna solicitud de "TESTQA YAMI".

**Criterios de aceptación**
- [ ] ⚠️ **Confirmar con producto**: ¿la regla correcta es excluir la agencia propia o justo lo contrario (mostrar solo la propia)? El comportamiento actual implica que el usuario da seguimiento a aprobaciones de *otras* agencias. Documentar la decisión.
- [ ] La comparación de agencia debe hacerse por identificador, no por nombre exacto (hoy es string match sensible a espacios/acentos).

---

## F6. Tarjeta de aprobación (información mostrada)

**Descripción:** cada solicitud se muestra en una tarjeta con: badge de estado de vigencia, badge de financiera (COPPEL azul, CREDITAS verde, RAPIAUTO morado), cliente, vendedor, agencia, fecha de aprobación (dd/mm/aaaa) y consecutivo, con acentos de color según el estado.

**Escenarios**
- **E6.1** Dado que una solicitud es de COPPEL y está vigente, entonces la tarjeta muestra badge morado "VIGENTE", badge azul "COPPEL", borde izquierdo morado y el bloque fecha/consecutivo en morado.
- **E6.2** Dado que una solicitud está vencida, entonces badge rojo "VENCIDA", borde rojo y bloque fecha/consecutivo en rojo.

**Criterios de aceptación**
- [ ] La fecha se muestra en formato `dd/mm/aaaa` independiente del locale del dispositivo.
- [ ] El consecutivo cumple el formato definido: prefijo `4030`/`4031` + **6 dígitos** (hoy el generador mock produce 5 dígitos; ver GAP-7).
- [ ] Los días restantes de vigencia deberían mostrarse en la tarjeta ("Quedan N días") — hoy se calculan pero no se muestran (ver GAP-4).
- [ ] Colores accesibles (contraste AA) para los tres estados y las tres financieras.

---

## F7. Dar seguimiento (solicitudes vigentes y por vencer)

**Descripción:** las tarjetas VIGENTE y POR VENCER tienen el botón "Dar seguimiento" que abre un modal con los datos de la solicitud (cliente y consecutivo) y un campo de comentario con acciones Cancelar/Guardar.

**Escenarios**
- **E7.1** Dado que el usuario pulsa "Dar seguimiento", entonces se abre el modal con cliente y consecutivo de esa solicitud y el comentario vacío.
- **E7.2** Dado que el usuario escribe un comentario y pulsa Guardar, entonces el comentario se envía al backend asociado a la solicitud, con autor (usuario, rol), fecha/hora y estado de vigencia al momento; el modal se cierra y se muestra confirmación.
- **E7.3** Dado que el usuario pulsa Cancelar o la X, entonces el modal se cierra sin guardar y el comentario se descarta.
- **E7.4** Dado que el comentario está vacío, cuando pulsa Guardar, entonces se muestra validación y no se envía (hoy no valida; ver GAP-3).

**Criterios de aceptación**
- [ ] El comentario se persiste en backend y queda disponible para el Admin Motorfy (hoy solo hace `console.log`; ver GAP-2).
- [ ] Payload mínimo: id de solicitud, consecutivo, comentario, tipo de seguimiento, autor (id, nombre, rol), origen `app_movil`, timestamp, estado de vigencia y días restantes al comentar.
- [ ] Comentario obligatorio, mínimo 10 caracteres, máximo 500 (propuesta; validar con producto).
- [ ] Feedback visual de éxito (toast/confirmación) y manejo de error de red con reintento.
- [ ] El historial de seguimientos previos de la solicitud es consultable desde el modal (nuevo requerimiento; ver GAP-5).

---

## F8. Acciones sobre solicitudes vencidas: PERDER e INICIAR

**Descripción:** las tarjetas VENCIDA muestran dos botones: **PERDER** (rojo) e **INICIAR** (morado). Hoy ambos abren el mismo modal genérico de comentario.

**Escenarios esperados (a completar — hoy no diferenciados)**
- **E8.1** Dado que el usuario pulsa PERDER, entonces se abre un modal específico que exige **motivo de pérdida** (catálogo) + comentario, y al guardar la solicitud pasa a estado "PERDIDA" y desaparece de la pestaña VENCIDA.
- **E8.2** Dado que el usuario pulsa INICIAR, entonces se abre un modal de reactivación/reinicio del proceso (re-solicitud a la financiera) con comentario, y al guardar la solicitud queda marcada "EN REINICIO" y se notifica al asesor correspondiente.
- **E8.3** Dado que una solicitud fue marcada PERDIDA o EN REINICIO, entonces el evento queda registrado en el Admin Motorfy con autor, motivo, comentario y timestamp.

**Criterios de aceptación**
- [ ] PERDER e INICIAR tienen flujos y payloads distintos (hoy comparten modal; ver GAP-6).
- [ ] PERDER requiere motivo de un catálogo administrable desde el Admin (ver mock `catalogo-motivos.json`).
- [ ] Ambas acciones piden confirmación antes de guardar (son cambios de estado, no solo comentarios).
- [ ] El cambio de estado se refleja en la lista sin recargar manualmente.

---

## F9. Estado vacío

**Descripción:** cuando una pestaña no tiene resultados (por datos o por búsqueda) se muestra ícono, título "No se encontraron resultados" y mensaje contextual.

**Criterios de aceptación**
- [ ] Mensaje diferenciado: con búsqueda activa cita el término; sin búsqueda indica la categoría ("No hay solicitudes vigentes/por vencer/vencidas...").
- [ ] El estado vacío no oculta las pestañas ni la barra de búsqueda.

---

## F10. Navegación inferior

**Descripción:** la barra inferior persiste en el módulo (sin resaltar ítem activo) y permite salir a otras secciones.

**Criterios de aceptación**
- [ ] La navegación desde aprobaciones a otra sección no genera errores ni pierde datos del usuario.
- [ ] Definir si "Aprobaciones" debe tener ítem propio en la barra inferior (hoy se marca `dashboard` con highlight deshabilitado).

---

# Brechas identificadas (qué falta)

| # | Brecha | Impacto | Prioridad |
|---|---|---|---|
| GAP-1 | Fecha de referencia **hardcodeada** (`2026-01-22`) para calcular vigencia; en producción todas las solicitudes caerían en VENCIDA | Cálculo de estados incorrecto | Alta |
| GAP-2 | **Guardar comentario no persiste** (solo `console.log`); no existe API ni sincronización con Admin Motorfy | El feedback de asesores/vendedores se pierde | Alta |
| GAP-3 | Sin **validación** de comentario (se puede guardar vacío), sin confirmación de éxito ni manejo de errores | Datos basura / mala UX | Alta |
| GAP-4 | Los **días restantes** se calculan pero no se muestran en la tarjeta | El usuario no sabe cuánto le queda a la vigencia | Media |
| GAP-5 | No hay **historial de seguimientos** por solicitud (comentarios previos, quién y cuándo) | Sin trazabilidad para el equipo | Alta |
| GAP-6 | **PERDER e INICIAR** abren el mismo modal genérico: no hay motivo de pérdida, ni cambio de estado, ni flujo de reinicio | La acción principal del módulo no está implementada | Alta |
| GAP-7 | El consecutivo mock genera **5 dígitos** tras el prefijo, la definición dice 6 (`String(100000 + index).slice(1)`) | Inconsistencia con el formato real | Baja |
| GAP-8 | Regla de **exclusión de la agencia propia** sin confirmar con producto (¿ver otras agencias o solo la propia?) | Posible lógica invertida | Alta |
| GAP-9 | Sin **notificaciones** push/aviso cuando una solicitud pasa a POR VENCER o VENCIDA | Se pierden aprobaciones por falta de acción a tiempo | Media |
| GAP-10 | Sin **filtros adicionales** (por financiera, por vendedor, por rango de fecha) ni ordenamiento | Escalabilidad de uso con muchos registros | Baja |
| GAP-11 | Datos mock embebidos en el componente; falta **integración a API** con paginación/estados de carga | Requisito para salir a producción | Alta |
| GAP-12 | Sin diferenciación por **rol** (asesor de financiamiento vs vendedor): mismos permisos y vistas | Reglas de negocio por rol sin definir | Media |

---

# Integración con Admin Motorfy (propuesta)

El feedback capturado en la app (seguimientos, pérdidas, reinicios) debe alojarse en el Admin Motorfy. Modelo propuesto y juegos de datos mock en [`mocks/admin/`](../../mocks/admin/):

- `feedback-aprobaciones.json` — registros de feedback enviados desde la app por asesores de financiamiento y vendedores.
- `catalogo-motivos.json` — catálogo administrable de motivos por tipo de acción (seguimiento, pérdida, reinicio).
- `resumen-metricas.json` — agregados para el dashboard del admin (por financiera, agencia, estado y tipo de acción).

**Endpoints sugeridos**

| Método | Ruta | Uso |
|---|---|---|
| `POST` | `/api/v1/aprobaciones/{id}/feedback` | La app registra seguimiento / pérdida / reinicio |
| `GET` | `/api/v1/aprobaciones/{id}/feedback` | Historial de la solicitud (app y admin) |
| `GET` | `/api/v1/admin/feedback?estado=pendiente&financiera=COPPEL` | Bandeja de revisión del admin con filtros |
| `PATCH` | `/api/v1/admin/feedback/{id}` | El admin marca revisado / escalado |
| `GET` | `/api/v1/admin/catalogos/motivos` | Catálogo de motivos administrable |
