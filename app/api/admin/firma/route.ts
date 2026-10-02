import { NextResponse } from "next/server"

import { getStore } from "@/lib/aprobaciones/store"

// MOCK de la integración Pipedrive/Pipefy: cuando la solicitud se mueve a
// firma de contrato / compras, desaparece automáticamente del módulo de
// aprobaciones (de Vigente y Por vencer). No requiere tipificación: el
// "FIRMADO" se deriva de este evento.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const { consecutivo } = (body ?? {}) as { consecutivo?: string }

  const store = getStore()
  const aprobacion = store.aprobaciones.find(
    (a) => a.consecutivo === consecutivo && a.estado === "activa",
  )
  if (!aprobacion) {
    return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 })
  }

  aprobacion.estado = "firmada"
  return NextResponse.json({ ok: true, consecutivo: aprobacion.consecutivo })
}
