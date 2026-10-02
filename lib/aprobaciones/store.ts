// Store en memoria que simula el backend del módulo de aprobaciones.
// Modela la comunicación Admin Motorfy → App: las aprobaciones nacen cuando
// el analista asigna el banco de cierre en el Admin (mock) y salen del módulo
// al firmarse (mock), perderse o reiniciarse.

export type Financiera = "COPPEL" | "CREDITAS" | "RAPIAUTO"
export type EstadoVigencia = "vigente" | "por-vencer" | "vencida"
export type EstadoSolicitud = "activa" | "perdida" | "reiniciada" | "firmada"
export type RolAutor = "vendedor" | "asesor_financiamiento"

// Vigencia en días por financiera, contada desde la asignación del banco de
// cierre. RAPIAUTO cuenta desde la creación de la tarjeta: se restan ~3 días.
export const VIGENCIAS: Record<Financiera, number> = {
  COPPEL: 30, // pendiente confirmar si son 45
  CREDITAS: 30,
  RAPIAUTO: 27,
}

export const DIAS_POR_VENCER = 10

// Días que el vendedor tiene, ya en la columna Vencida, para decidir (perder o
// iniciar). Al cuarto día la solicitud caduca: toma por defecto la tipificación
// "Vigencia mayor a 30 días", se notifica a backoffice y se inhabilita en la app.
export const DIAS_ACCION_VENCIDA = 3

export const TIPIFICACION_CADUCIDAD = {
  codigo: "PERDIDO_VIGENCIA_MAYOR_30",
  etiqueta: "Vigencia mayor a 30 días",
}

export interface Seguimiento {
  tipificacion: { codigo: string; etiqueta: string; seguimientoAbierto: boolean }
  comentarioComercial: string
  autor: string
  rol: RolAutor
  estadoVigenciaAlComentar: EstadoVigencia
  creadoEl: string
  actualizadoEl: string
  versiones: number
}

export interface Aprobacion {
  id: number
  consecutivo: string
  cliente: string
  agencia: string
  vendedor: string
  financiera: Financiera
  fechaBancoCierre: string // ISO yyyy-mm-dd — asignación del banco de cierre en el Admin
  estado: EstadoSolicitud
  seguimiento: Seguimiento | null
  motivoPerdida?: { codigo: string; etiqueta: string; comentario?: string }
  notificadaPorVencer?: boolean
  notificadaVencida?: boolean
  caducidadNotificada?: boolean
}

export type Destinatario = "cliente" | "vendedor" | "backoffice_aprobaciones"

export interface Notificacion {
  id: number
  tipo: "aprobacion" | "por-vencer" | "vencida" | "perdida" | "reinicio"
  consecutivo: string
  destinatarios: Destinatario[]
  mensaje: string
  creadoEl: string
}

interface Store {
  aprobaciones: Aprobacion[]
  notificaciones: Notificacion[]
  seq: number
  notifSeq: number
}

const DAY_MS = 24 * 60 * 60 * 1000

const consecutivo = (n: number, prefix: "4031" | "4030" = "4031") =>
  `${prefix}${String(n).padStart(6, "0")}`

// Fecha local en formato yyyy-mm-dd (toISOString usaría UTC y desfasa un día)
export const fechaLocalISO = (date: Date = new Date()) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

const isoDaysAgo = (days: number) => fechaLocalISO(new Date(Date.now() - days * DAY_MS))

// Días restantes de vigencia (puede ser negativo si ya venció)
export function diasRestantes(a: Aprobacion): number {
  const inicio = new Date(a.fechaBancoCierre + "T00:00:00").getTime()
  const transcurridos = Math.floor((Date.now() - inicio) / DAY_MS)
  return VIGENCIAS[a.financiera] - transcurridos
}

export function estadoVigencia(a: Aprobacion): EstadoVigencia {
  const restantes = diasRestantes(a)
  if (restantes <= 0) return "vencida"
  if (restantes <= DIAS_POR_VENCER) return "por-vencer"
  return "vigente"
}

// Días transcurridos desde el vencimiento (0 el mismo día que vence).
export function diasVencida(a: Aprobacion): number {
  const restantes = diasRestantes(a)
  return restantes < 0 ? -restantes : 0
}

// Días que quedan dentro de la ventana de acción de 3 días en la columna Vencida.
export function diasParaDecidir(a: Aprobacion): number {
  return Math.max(0, DIAS_ACCION_VENCIDA - diasVencida(a))
}

// Una solicitud vencida "caduca" cuando ya pasó la ventana de 3 días de acción.
export function vencidaCaducada(a: Aprobacion): boolean {
  return estadoVigencia(a) === "vencida" && diasVencida(a) >= DIAS_ACCION_VENCIDA
}

// Semilla con fechas relativas a hoy para poblar las tres pestañas.
// daysAgo controla el estado: p. ej. COPPEL (30): vigente < 20, por vencer 20-29, vencida ≥ 30.
function seed(): Aprobacion[] {
  const base: Array<
    [cliente: string, agencia: string, financiera: Financiera, vendedor: string, daysAgo: number]
  > = [
    // Vigentes
    ["CAROLINA FERNÁNDEZ JIMÉNEZ", "AUTO SHOP CUERNAVACA", "COPPEL", "ANDRÉS FELIPE VARGAS", 3],
    ["FERNANDO RAMOS HERRERA", "AUTOS COLON", "CREDITAS", "MARÍA ISABEL GARCÍA", 6],
    ["ROSA ELENA TORRES", "BMW CANCÚN(FARRERA)", "RAPIAUTO", "DIEGO ARMANDO NAVARRO", 9],
    ["ANTONIO MARTÍNEZ FLORES", "AUTOS GEZZA", "COPPEL", "LAURA PATRICIA SANTOS", 12],
    ["MARÍA FERNANDA LÓPEZ", "AUTOS GP", "COPPEL", "CARLOS EDUARDO RAMÍREZ", 15],
    ["MIGUEL ÁNGEL CRUZ", "AUTOS SAN ISIDRO", "COPPEL", "SOFÍA ELENA MORALES", 8],
    ["ALEJANDRA VEGA SANTOS", "CALL CENTER ATM", "CREDITAS", "RICARDO MARTÍNEZ LÓPEZ", 17],
    ["RICARDO ALBERTO FLORES", "SEMINUEVOS TLAXCALA YORDANIS", "RAPIAUTO", "MARÍA ISABEL GUTIÉRREZ", 5],
    ["LUIS MIGUEL HERNÁNDEZ", "AUTOS GP", "COPPEL", "SOFÍA ALEJANDRA CASTRO", 2],
    // Por vencer (COPPEL/CREDITAS: 20-29 días; RAPIAUTO: 17-26)
    ["DANIELA ORTEGA SILVA", "AUTO SHOP CUERNAVACA", "COPPEL", "JOSÉ LUIS RAMOS VEGA", 26],
    ["FERNANDO CASTRO MENDOZA", "AUTOS COLON", "CREDITAS", "MARÍA ELENA VARGAS", 22],
    ["ROBERTO SANTOS LÓPEZ", "BMW CANCÚN(FARRERA)", "RAPIAUTO", "CARLOS ALBERTO RUIZ", 20],
    ["LAURA MARTÍNEZ GARCÍA", "AUTOS GEZZA", "COPPEL", "ANA PATRICIA FLORES", 28],
    ["JOSÉ ANTONIO VARGAS", "AUTOS GP", "CREDITAS", "ANA CECILIA MORALES", 25],
    ["CLAUDIA PATRICIA NAVARRO", "SEMINUEVOS TLAXCALA YORDANIS", "COPPEL", "JOSÉ LUIS MARTÍNEZ", 21],
    // Vencidas (COPPEL/CREDITAS ≥ 30; RAPIAUTO ≥ 27)
    ["JUAN PÉREZ GARCÍA", "AUTO SHOP CUERNAVACA", "COPPEL", "ROBERTO MARTÍNEZ LÓPEZ", 31],
    ["MARÍA GONZÁLEZ LÓPEZ", "AUTOS COLON", "CREDITAS", "CAROLINA RODRÍGUEZ SÁNCHEZ", 33],
    ["CARLOS RODRÍGUEZ MARTÍNEZ", "BMW CANCÚN(FARRERA)", "RAPIAUTO", "FERNANDO GARCÍA TORRES", 28],
    ["ANA SÁNCHEZ HERNÁNDEZ", "AUTOS GEZZA", "COPPEL", "PATRICIA MORALES JIMÉNEZ", 38],
    ["DIANA PATRICIA SOTO", "AUTOS GP", "RAPIAUTO", "ROBERTO CARLOS MENDOZA", 32],
    ["GABRIELA ESPERANZA RUIZ", "AUTOS GP", "CREDITAS", "FERNANDO JAVIER TORRES", 34],
    ["EDUARDO FRANCISCO JIMÉNEZ", "SEMINUEVOS TLAXCALA YORDANIS", "CREDITAS", "PATRICIA ELENA SÁNCHEZ", 36],
    ["MIGUEL ÁNGEL SANTOS", "SEMINUEVOS TLAXCALA YORDANIS", "COPPEL", "LAURA CRISTINA RAMOS", 39],
  ]

  return base.map(([cliente, agencia, financiera, vendedor, daysAgo], i) => ({
    id: i + 1,
    consecutivo: consecutivo(733600 + i, i % 2 === 0 ? "4031" : "4030"),
    cliente,
    agencia,
    vendedor,
    financiera,
    fechaBancoCierre: isoDaysAgo(daysAgo),
    estado: "activa" as EstadoSolicitud,
    seguimiento: null,
  }))
}

const g = globalThis as unknown as { __aprobacionesStore?: Store }

export function getStore(): Store {
  if (!g.__aprobacionesStore) {
    g.__aprobacionesStore = { aprobaciones: seed(), notificaciones: [], seq: 733700, notifSeq: 1 }
  }
  return g.__aprobacionesStore
}

export function notificar(
  tipo: Notificacion["tipo"],
  consecutivo: string,
  destinatarios: Notificacion["destinatarios"],
  mensaje: string,
) {
  const store = getStore()
  store.notificaciones.unshift({
    id: store.notifSeq++,
    tipo,
    consecutivo,
    destinatarios,
    mensaje,
    creadoEl: new Date().toISOString(),
  })
}

// Emite (una sola vez por solicitud) las notificaciones de cambio de estado
// vigente → por vencer y por vencer → vencida, evaluadas al consultar.
export function emitirNotificacionesDeVigencia() {
  const store = getStore()
  for (const a of store.aprobaciones) {
    if (a.estado !== "activa") continue
    const estado = estadoVigencia(a)
    if (estado === "por-vencer" && !a.notificadaPorVencer) {
      a.notificadaPorVencer = true
      notificar(
        "por-vencer",
        a.consecutivo,
        ["vendedor"],
        `La aprobación de ${a.cliente} (${a.financiera}) está por vencer: quedan ${diasRestantes(a)} días.`,
      )
    }
    if (estado === "vencida" && !a.notificadaVencida) {
      a.notificadaVencida = true
      notificar(
        "vencida",
        a.consecutivo,
        ["vendedor"],
        `La aprobación de ${a.cliente} (${a.financiera}) venció. Tienes ${DIAS_ACCION_VENCIDA} días para perderla o reingresarla.`,
      )
    }
    // Al cuarto día en Vencida (pasada la ventana de acción), la solicitud
    // caduca: toma por defecto la tipificación "Vigencia mayor a 30 días" y se
    // notifica a backoffice de aprobaciones para su finalización.
    if (vencidaCaducada(a) && !a.caducidadNotificada) {
      a.caducidadNotificada = true
      notificar(
        "vencida",
        a.consecutivo,
        ["backoffice_aprobaciones"],
        `Solicitud de ${a.cliente} (${a.consecutivo}) sin acción tras ${DIAS_ACCION_VENCIDA} días vencida: se tipifica por defecto como "${TIPIFICACION_CADUCIDAD.etiqueta}". Inhabilitada en la app; pendiente de finalizar en el Admin.`,
      )
    }
  }
}

export function serializar(a: Aprobacion) {
  const caducada = vencidaCaducada(a)
  return {
    ...a,
    diasRestantes: diasRestantes(a),
    estadoVigencia: estadoVigencia(a),
    vigenciaDias: VIGENCIAS[a.financiera],
    diasVencida: diasVencida(a),
    diasParaDecidir: diasParaDecidir(a),
    caducada,
    tipificacionCaducidad: caducada ? TIPIFICACION_CADUCIDAD : null,
  }
}

/** Shape que consume la UI / API de listado (aprobación + campos derivados). */
export type AprobacionVista = ReturnType<typeof serializar>

export interface TipificacionCatalogo {
  codigo: string
  etiqueta: string
  seguimientoAbierto: boolean
}

export interface MotivoPerdidaCatalogo {
  codigo: string
  etiqueta: string
}
