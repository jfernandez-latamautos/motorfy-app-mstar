import { NextResponse } from "next/server"

import catalogo from "@/mocks/admin/catalogo-motivos.json"
import { estadoVigencia, getStore, serializar, type RolAutor } from "@/lib/aprobaciones/store"

// Registra o actualiza el seguimiento de una aprobación.
// Reglas acordadas en la reunión del 29-may:
// - Seguimiento = tipificación (catálogo) + comentario comercial.
// - Un solo comentario activo por solicitud; el vendedor lo reemplaza.
// - Solo se puede volver a comentar si la tipificación vigente es "abierta".
// - Aplica a solicitudes vigentes y por vencer (no a vencidas).
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 })

  const { tipificacionCodigo, comentarioComercial, autor, rol } = body as {
    tipificacionCodigo?: string
    comentarioComercial?: string
    autor?: string
    rol?: RolAutor
  }

  const store = getStore()
  const aprobacion = store.aprobaciones.find((a) => a.id === Number(id))
  if (!aprobacion || aprobacion.estado !== "activa") {
    return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 })
  }
  if (estadoVigencia(aprobacion) === "vencida") {
    return NextResponse.json(
      { error: "Una solicitud vencida no admite seguimiento; usa Perder o Iniciar" },
      { status: 409 },
    )
  }
  if (aprobacion.seguimiento && !aprobacion.seguimiento.tipificacion.seguimientoAbierto) {
    return NextResponse.json(
      { error: "El seguimiento de esta solicitud ya está cerrado" },
      { status: 409 },
    )
  }

  const tipificacion = catalogo.tipificaciones.find(
    (t) => t.codigo === tipificacionCodigo && t.visibleEnApp,
  )
  if (!tipificacion) {
    return NextResponse.json({ error: "Tipificación inválida" }, { status: 400 })
  }
  if (!comentarioComercial || comentarioComercial.trim().length < 5) {
    return NextResponse.json(
      { error: "El comentario comercial es obligatorio (mínimo 5 caracteres)" },
      { status: 400 },
    )
  }

  const ahora = new Date().toISOString()
  aprobacion.seguimiento = {
    tipificacion: {
      codigo: tipificacion.codigo,
      etiqueta: tipificacion.etiqueta,
      seguimientoAbierto: tipificacion.seguimientoAbierto,
    },
    comentarioComercial: comentarioComercial.trim(),
    autor: autor || "Vendedor",
    rol: rol || "vendedor",
    estadoVigenciaAlComentar: estadoVigencia(aprobacion),
    creadoEl: aprobacion.seguimiento?.creadoEl ?? ahora,
    actualizadoEl: ahora,
    versiones: (aprobacion.seguimiento?.versiones ?? 0) + 1,
  }

  return NextResponse.json({ aprobacion: serializar(aprobacion) })
}
