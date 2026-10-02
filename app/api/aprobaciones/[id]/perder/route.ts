import { NextResponse } from "next/server"

import catalogo from "@/mocks/admin/catalogo-motivos.json"
import { estadoVigencia, getStore, notificar, vencidaCaducada } from "@/lib/aprobaciones/store"

// PERDER una solicitud vencida: la app la marca como PERDIDA (sale del módulo)
// y se NOTIFICA a backoffice de aprobaciones —con la nota— para que el rol
// admin de reporte la finalice y/o la pierda en el Admin/Pipedrive.
// No es una baja directa en Pipedrive: es una solicitud de finalización.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json().catch(() => null)
  const { motivoCodigo, comentario } = (body ?? {}) as { motivoCodigo?: string; comentario?: string }

  const store = getStore()
  const aprobacion = store.aprobaciones.find((a) => a.id === Number(id))
  if (!aprobacion || aprobacion.estado !== "activa") {
    return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 })
  }
  if (estadoVigencia(aprobacion) !== "vencida") {
    return NextResponse.json(
      { error: "Solo se pueden perder solicitudes vencidas" },
      { status: 409 },
    )
  }
  if (vencidaCaducada(aprobacion)) {
    return NextResponse.json(
      { error: "La solicitud caducó (más de 3 días vencida) y ya fue notificada a backoffice; está inhabilitada" },
      { status: 409 },
    )
  }

  const motivo = catalogo.motivosDePerdida.motivos.find((m) => m.codigo === motivoCodigo)
  if (!motivo) {
    return NextResponse.json({ error: "El motivo de pérdida es obligatorio" }, { status: 400 })
  }

  const nota = comentario?.trim() || undefined
  aprobacion.estado = "perdida"
  aprobacion.motivoPerdida = { ...motivo, comentario: nota }

  notificar(
    "perdida",
    aprobacion.consecutivo,
    ["backoffice_aprobaciones"],
    `Solicitud vencida de ${aprobacion.cliente} (${aprobacion.consecutivo}): el vendedor pide perderla — ${motivo.etiqueta}.${
      nota ? ` Nota: ${nota}` : ""
    } Pendiente de finalizar en el Admin.`,
  )

  return NextResponse.json({
    ok: true,
    // Mock: la app no cierra en Pipedrive; deja la solicitud pendiente de
    // finalización para el rol admin de reporte en backoffice de aprobaciones.
    notificadoBackofficeAprobaciones: true,
    pendienteFinalizacionAdmin: true,
  })
}
