import { NextResponse } from "next/server"

import { emitirNotificacionesDeVigencia, getStore, serializar } from "@/lib/aprobaciones/store"

// Listado de aprobaciones activas del módulo (las firmadas, perdidas o
// reiniciadas salen automáticamente).
export async function GET() {
  emitirNotificacionesDeVigencia()
  const store = getStore()
  const aprobaciones = store.aprobaciones
    .filter((a) => a.estado === "activa")
    .map(serializar)
  return NextResponse.json({ aprobaciones })
}
