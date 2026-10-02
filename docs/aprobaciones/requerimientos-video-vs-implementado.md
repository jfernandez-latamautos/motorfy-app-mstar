# Módulo de Aprobaciones — Requerimientos del video vs. implementado

**Fuente:** grabación "Módulo Aprobaciones en AppMotorfy y Adm" (1h47m, 29-may, Yordanis + Isabel Cortez [analista back] + Balaam León), analizada fotograma a fotograma + transcripción de audio.
**Fecha del análisis:** 2026-07-07

---

## 1. El proceso actual (lo que el módulo viene a reemplazar/conectar)

El equipo de aprobaciones opera hoy sobre herramientas dispersas, visibles en el video:

| Herramienta | Uso actual |
|---|---|
| **Google Sheets "APROBADOS FINANCIERAS 2026"** | Hoja maestra mensual (pestaña por mes) + pestañas por financiera + pestaña TIPIFICACIONES |
| **Google Sheets "ASIGNACION 2026"** | Asignación de solicitudes a analistas back por célula/zona/perfil, con conteos por equipo |
| **Pipedrive** (pipeline NEGOCIACIÓN, ~17 etapas) | Flujo del análisis: Entrada → Docs Cliente → … → Esp. Aprob → Aprobado; notas de rechazo con formato "FINANCIERA--- motivo" |
| **Pipefy** (pipe "Financiera Creditas") | Fases con Creditas, incl. catálogo de pérdida: Perdido x Incontactable, PERDIDO-POLITICA, Perdido x Otro Banco, Vigencia mayor a 30 días, Perdido x Tasa, Perdido x Compró de contado, Se Gastó el enganche, etc. |
| **Admin Motorfy** (`/admin/solicitudes`) | Sección **BURÓ / BANCO CIERRE** con "Cierre Financiero del Crédito": dropdowns obligatorios COPPEL / CREDITAS / RAPIDAUTO (Aprobado/Rechazado/Sin Proceso) + FINANCIERA DE CIERRE + botón PERDIDA + checklist para FINALIZAR |
| **WhatsApp / Gmail** | Enlaces biométricos (Jumio), cotizaciones máximas, folios, notificaciones Pipefy/Pipedrive |

### Estructura del Excel maestro (hoja "APROBADOS MAYO")

- **Resumen superior** (calculado con `CONTAR.SI`): matriz financiera × estatus → APROBADO / CONDICIONADO / RECHAZADO / SIN PROCESO para COPPEL, CREDITAS, RAPIDAUTO.
- **Detalle por solicitud:** `FECHA | CLIENTE | CONSECUTIVO | ANALISTA BACK | ASESOR DE CAMPO | DEALER | CÉLULA | COPPEL | Creditas | RAPIDAUTO | COMENTARIOS | COMENTARIOS COMERCIAL | TIPIFICACION`
  - CÉLULA = equipos comerciales: CARTEL DEL NORTE, CHARROS, TIGRES, WARRIORS, LEONES.
  - COMENTARIOS = financiera ganadora ("APROBADO COPPEL/CREDITAS/RAPIAUTO").
  - COMENTARIOS COMERCIAL = texto libre del vendedor/asesor (el feedback que hoy recogen por teléfono/WhatsApp).
  - TIPIFICACION = normalización del comentario contra catálogo (~21 valores, pestaña TIPIFICACIONES, iniciado ese mismo mes).
  - Semántica manual por colores de fila/celda (rosa, cian, verde, morado).
- **Pestañas por financiera** (SLA del trámite): `CLIENTE | FOLIO COPPEL | FOLIO | PERFIL (CH1/CH3/SH3) | FECHA DE INGRESO A PIPE | FECHA DE ENVIO A [financiera] | FECHA DE DICTAMEN | ANALISTA | STATUS (APROBADO/RECHAZADO/PROCESO/CONDICIONADO)`.

---

## 2. Requerimientos levantados del video (audio + pantallas)

### Disparador y comunicación Admin → App

- **R1. Origen de la aprobación:** cuando el analista asigna el **banco de cierre** en el Admin (Cierre Financiero del Crédito: estatus por financiera + financiera de cierre), la solicitud aprobada **se crea automáticamente en el módulo de aprobaciones de la app**, agrupada bajo la agencia (dealer) correspondiente. *"Apenas ustedes le asignen esa condición en el admin… automáticamente le va a crear el espacio aquí".*
- **R2. Notificación de aprobación:** al asignar el banco de cierre se notifica **al cliente y al vendedor**; el vendedor además ve la solicitud en su módulo.
- **R3. Ficha con financiera de cierre:** la tarjeta muestra la financiera aprobadora; si el analista la cambia en el Admin, la app se actualiza.

### Reglas de vigencia (núcleo del módulo)

- **R4. Conteo desde la asignación del banco de cierre** (no desde otra fecha).
- **R5. Vigencia por financiera:**
  - COPPEL: **30 días** (⚠️ pendiente confirmar si son 45 — "Osvaldo me contó que eran 45; dejémoslo en 30 y si cambia te aviso").
  - CREDITAS: **30 días**.
  - RAPIAUTO: la financiera cuenta 30 días **desde la creación de la tarjeta**, no desde la aprobación → acuerdo: configurar **27 días** (30 menos ~3 de proceso).
- **R6. "Por vencer" = faltan 10 días o menos** ("para tener dos semanas de margen, que estén alerta 10 días antes").
- **R7. Notificación de cambio de estado:** push al vendedor cuando la solicitud pasa **vigente → por vencer**. Al llegar a **vencida**, avisar **al vendedor (no al cliente)** de que esa solicitud ya no avanza y habría que reingresarla.
- **R8. Salida automática del módulo:** cuando la solicitud se mueve a **firma de contrato / compras** (Pipedrive), **desaparece** de Vigente/Por vencer. Por eso las tipificaciones "FIRMADO" y "Se cancela por vigencia" **no** van en el selector de la app (se derivan solas).

### Dar seguimiento (feedback vendedor → equipo de aprobaciones)

- **R9. El seguimiento es tipificado + comentario**, no texto libre solo: campo **"Comentario comercial"** (texto) + **"Tipificación"** (dropdown con el catálogo del equipo — hoy 21 valores en la pestaña TIPIFICACIONES). *"Mejor la tipificación… aparte te permite descargar reportes sobre las tipificaciones".*
- **R10. Catálogo administrable e incremental:** el catálogo vive en el Admin; se agregan valores conforme aparezcan ("cada vez que veas uno me dices y lo incorporamos").
- **R11. Un solo comentario activo, editable:** no es un chat; el vendedor es el único que escribe y puede **reemplazar/actualizar** su comentario. No hay respuesta del equipo dentro del módulo.
- **R12. Tipificaciones "abiertas"** que mantienen habilitado el botón Dar seguimiento para nuevas actualizaciones (acordadas en la reunión): **Pendiente documentos del auto** (incluye factura), **Pendiente de confirmar cotización**, **Pendiente de unidad**. El resto cierra el seguimiento.
- **R13. "Sin comentario":** cuando una solicitud no tiene seguimiento, en reportes/filtros del Admin debe aparecer como **"Sin comentario"** (hoy son celdas vacías en el Excel).
- **R14. El seguimiento aplica a Vigente y Por vencer** (misma ficha con comentario comercial). A Vencida **no** se le agrega captura de seguimiento.

### Solicitudes vencidas

- **R15. PERDER:** mismo flujo de "Perder solicitud" del Admin (con motivo); al ejecutarlo **se pierde en todos lados** (Admin + Pipedrive/Pipefy) y **notifica al vendedor**. ⚠️ En la demo se detectó un **bug vigente**: perder desde el Admin dejó la tarjeta activa en Pipedrive — la integración de pérdida debe cerrarse antes de replicar el flujo en la app.
- **R16. INICIAR (reingreso):** reinicia la solicitud reutilizando los datos: el vendedor pasa **pantalla por pantalla** revisando/ajustando campos precargados y al final **solo se re-consulta el buró**; el equipo recibe la nueva solicitud sin capturar todo de cero.

### Reportes en el Admin (los "Excel" del equipo)

- **R17. Reporte descargable en el Admin** con el feedback (comentario comercial + tipificación) para negocio ("que lo tenga visible Pati y toda esa gente") — reemplaza las columnas COMENTARIOS COMERCIAL/TIPIFICACION del Excel.
- **R18. Dashboard de conteos** financiera × estatus (hoy `CONTAR.SI` manual en el Excel).
- **R19. Trazabilidad completa por solicitud** (equivalente a las hojas por financiera): analista back, asesor de campo, dealer, célula, folios por financiera, fechas de ingreso/envío/dictamen, perfil (CH1/CH3/SH3) y estatus por financiera.

---

## 3. Lo implementado hoy en la app ([approvals-screen.tsx](../../components/screens/approvals-screen.tsx))

| Funcionalidad | Estado |
|---|---|
| Acceso desde dashboard (tarjeta "APROBACIONES" + badge NUEVO) | ✅ |
| 3 pestañas Vigente / Por vencer / Vencida con contadores | ✅ |
| Agrupación por agencia (acordeón, orden alfabético, auto-expand al buscar) | ✅ |
| Búsqueda por cliente, consecutivo, agencia, vendedor | ✅ |
| Tarjeta: estado, financiera, cliente, vendedor, agencia, fecha aprobada, consecutivo | ✅ |
| Botón "Dar seguimiento" (vigente/por vencer) con modal de comentario | ✅ UI solamente |
| Botones PERDER / INICIAR en vencidas | ✅ UI solamente (ambos abren el mismo modal genérico) |
| Estado vacío con mensajes contextuales | ✅ |
| Datos | ❌ Mock embebido; sin API |

---

## 4. Comparativa: requerimiento del video vs. implementado

| # | Requerimiento (video) | En la app hoy | Veredicto |
|---|---|---|---|
| R1 | Alta automática al asignar banco de cierre en Admin | Datos mock estáticos | ❌ Falta (integración Admin→App) |
| R2 | Notificación de aprobación a cliente y vendedor | No existe | ❌ Falta |
| R3 | Financiera de cierre visible y sincronizada | Badge de financiera estático | 🟡 Parcial (falta sync) |
| R4 | Vigencia desde asignación de banco de cierre | Desde `approvedDate` mock, con "hoy" **hardcodeado** (2026-01-22) | ❌ Falta |
| R5 | Vigencia por financiera: COPPEL 30 (confirmar 45), CREDITAS 30, RAPIAUTO 27 | 30 días fijos para todas | ❌ Falta (config por financiera) |
| R6 | Por vencer = **10 días** antes | Por vencer = **5 días** | ❌ Regla incorrecta |
| R7 | Push vigente→por vencer; aviso al vendedor al vencer | No existe | ❌ Falta |
| R8 | Desaparece al pasar a firma/compras (Pipedrive) | No existe | ❌ Falta |
| R9 | Seguimiento = comentario comercial + **tipificación** (dropdown) | Solo textarea libre, sin catálogo | ❌ Falta (cambio de modal) |
| R10 | Catálogo de tipificaciones administrable en Admin | No existe | ❌ Falta |
| R11 | Un comentario activo, editable por el vendedor | No persiste nada (`console.log`) | ❌ Falta |
| R12 | Tipificaciones abiertas mantienen el botón activo | No existe | ❌ Falta |
| R13 | "Sin comentario" como valor filtrable en reportes | No existe | ❌ Falta (lado Admin) |
| R14 | Comentario comercial en ficha vigente y por vencer | Modal genérico sin campo tipificado | 🟡 Parcial |
| R15 | PERDER = flujo de pérdida del Admin + propagación + notificación | Botón abre modal genérico | ❌ Falta (y hay bug Admin→Pipedrive) |
| R16 | INICIAR = reingreso guiado con datos precargados + re-consulta de buró | Botón abre modal genérico | ❌ Falta (flujo completo nuevo) |
| R17 | Reporte descargable del feedback en Admin | No existe (solo mocks propuestos en `mocks/admin/`) | ❌ Falta |
| R18 | Dashboard conteos financiera × estatus en Admin | No existe | ❌ Falta |
| R19 | Trazabilidad por solicitud (analista, célula, folios, fechas SLA, perfil) | No existe | ❌ Falta (lado Admin) |
| — | Pestañas por estado + agrupación por dealer + búsqueda + tarjeta | **Implementado y validado en la demo** | ✅ Base aprobada en la reunión |

---

## 5. Fusión: backlog priorizado del módulo (App ↔ Admin)

### Fase 1 — Corregir la base ya implementada (app)
1. **Regla "por vencer" a 10 días** (hoy 5) y quitar la fecha "hoy" hardcodeada.
2. **Vigencia por financiera** configurable: COPPEL 30 (confirmar 45), CREDITAS 30, RAPIAUTO 27.
3. Mostrar **días restantes** en la tarjeta (el dato ya se calcula).
4. Confirmar la regla de **exclusión de la agencia propia** (hoy la app oculta las solicitudes de la agencia del usuario; en el video el módulo es del vendedor de esa agencia — la lógica parece invertida).

### Fase 2 — Seguimiento tipificado (app + API)
5. Modal "Dar seguimiento" con **dropdown de tipificación** (catálogo del Admin) + **comentario comercial**; validación de campos.
6. **API de feedback**: persistir consecutivo, tipificación, comentario, autor (vendedor/asesor), rol, timestamp, estado de vigencia al comentar.
7. Lógica de **comentario único editable** + tipificaciones **abiertas** (Pendiente documentos del auto / confirmar cotización / unidad) que mantienen el botón activo.
8. Excluir del selector: FIRMADO, Se cancela por vigencia.

### Fase 3 — Comunicación Admin → App (ciclo de vida)
9. Alta automática de la aprobación al asignar **banco de cierre** en el Admin.
10. **Notificaciones**: aprobación (cliente + vendedor), vigente→por vencer (vendedor), vencida (vendedor).
11. Baja automática al pasar a **firma/compras** (integración Pipedrive/Pipefy).
12. Sincronizar cambios de financiera de cierre.

### Fase 4 — Acciones sobre vencidas (app + Admin)
13. **PERDER** con motivo (catálogo de pérdida) propagando a Admin + Pipedrive + notificación. *Prerrequisito: arreglar el bug actual de pérdida Admin→Pipedrive detectado en la reunión.*
14. **INICIAR**: flujo de reingreso guiado con datos precargados y re-consulta de buró.

### Fase 5 — Reemplazo de los Excel en el Admin
15. **Bandeja de feedback** (comentarios comerciales + tipificaciones, filtro "Sin comentario") con **descarga de reporte**.
16. **Dashboard** financiera × estatus (reemplaza el `CONTAR.SI`).
17. **Catálogo de tipificaciones administrable** (CRUD, unificando: hoja TIPIFICACIONES 2026 + motivos Pipefy + hoja 2024).
18. Vista de trazabilidad por solicitud (analista back, asesor de campo, dealer, célula, folios, fechas SLA, perfil).

### Decisiones pendientes de negocio (salieron del video sin cerrar)
- ¿COPPEL 30 o 45 días? (Isabel quedó de confirmar con Osvaldo/Ricardo).
- Confirmación fina de la notificación al pasar a vencida.
- Homologación definitiva del catálogo de tipificaciones (21 valores iniciales, "apenas empezamos este mes").

---

## 6. Datos mock actualizados

Los mocks de [`mocks/admin/`](../../mocks/admin/) se actualizaron con el **catálogo real de tipificaciones** visto en el video (hoja TIPIFICACIONES del Excel + fases de pérdida de Pipefy) y el modelo de feedback con `comentarioComercial` + `tipificacion` + bandera `seguimientoAbierto`.
