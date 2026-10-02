import { NextResponse } from "next/server"

import { emitirNotificacionesDeVigencia, getStore } from "@/lib/aprobaciones/store"

// Registro de notificaciones enviadas (mock del push a cliente/vendedor).
export async function GET() {
  emitirNotificacionesDeVigencia()
  const store = getStore()
  return NextResponse.json({ notificaciones: store.notificaciones })
}
