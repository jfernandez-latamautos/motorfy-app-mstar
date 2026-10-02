import { NextResponse } from "next/server"

import { estadoVigencia, getStore, notificar, vencidaCaducada } from "@/lib/aprobaciones/store"

// INICIAR (reingreso) de una solicitud vencida: se reutilizan los datos
// precargados, el vendedor los revisa pantalla por pantalla y al confirmar
// solo se re-consulta el buró. Mock: genera el consecutivo de la nueva
// solicitud, que entra al análisis (no aparece en el módulo hasta aprobarse).
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const store = getStore()
  const aprobacion = store.aprobaciones.find((a) => a.id === Number(id))
  if (!aprobacion || aprobacion.estado !== "activa") {
    return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 })
  }
  if (estadoVigencia(aprobacion) !== "vencida") {
    return NextResponse.json(
      { error: "Solo se pueden reiniciar solicitudes vencidas" },
      { status: 409 },
    )
  }
  if (vencidaCaducada(aprobacion)) {
    return NextResponse.json(
      { error: "La solicitud caducó (más de 3 días vencida) y ya fue notificada a backoffice; está inhabilitada" },
      { status: 409 },
    )
  }

  aprobacion.estado = "reiniciada"
  const nuevoConsecutivo = `4031${String(store.seq++).padStart(6, "0")}`

  notificar(
    "reinicio",
    aprobacion.consecutivo,
    ["vendedor"],
    `Se reingresó la solicitud de ${aprobacion.cliente}. Nuevo consecutivo: ${nuevoConsecutivo}. Buró consultado.`,
  )

  return NextResponse.json({
    ok: true,
    nuevoConsecutivo,
    buro: "consultado", // mock de la re-consulta de buró
  })
}
