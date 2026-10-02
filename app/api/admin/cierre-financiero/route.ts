import { NextResponse } from "next/server"

import { fechaLocalISO, getStore, notificar, serializar, type Financiera } from "@/lib/aprobaciones/store"

const FINANCIERAS: Financiera[] = ["COPPEL", "CREDITAS", "RAPIAUTO"]

// MOCK del Admin Motorfy: el analista asigna el banco de cierre en la
// sección "Cierre Financiero del Crédito" → la aprobación se crea
// automáticamente en el módulo de la app y se notifica a cliente y vendedor.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const { cliente, agencia, vendedor, financiera } = (body ?? {}) as {
    cliente?: string
    agencia?: string
    vendedor?: string
    financiera?: Financiera
  }

  if (!cliente || !agencia || !vendedor || !financiera || !FINANCIERAS.includes(financiera)) {
    return NextResponse.json(
      { error: "cliente, agencia, vendedor y financiera (COPPEL|CREDITAS|RAPIAUTO) son obligatorios" },
      { status: 400 },
    )
  }

  const store = getStore()
  const aprobacion = {
    id: Math.max(0, ...store.aprobaciones.map((a) => a.id)) + 1,
    consecutivo: `4031${String(store.seq++).padStart(6, "0")}`,
    cliente,
    agencia,
    vendedor,
    financiera,
    fechaBancoCierre: fechaLocalISO(),
    estado: "activa" as const,
    seguimiento: null,
  }
  store.aprobaciones.push(aprobacion)

  notificar(
    "aprobacion",
    aprobacion.consecutivo,
    ["cliente", "vendedor"],
    `¡Crédito aprobado! La solicitud de ${cliente} fue aprobada por ${financiera}.`,
  )

  return NextResponse.json({ aprobacion: serializar(aprobacion) }, { status: 201 })
}
