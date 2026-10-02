import { NextResponse } from "next/server"

import catalogo from "@/mocks/admin/catalogo-motivos.json"

// Catálogo administrado desde el Admin Motorfy. La app solo recibe las
// tipificaciones visibles (FIRMADO y "Se cancela por vigencia" se derivan
// automáticamente y no se capturan manualmente).
export async function GET() {
  const tipificaciones = catalogo.tipificaciones.filter((t) => t.visibleEnApp)
  return NextResponse.json({
    tipificaciones,
    motivosDePerdida: catalogo.motivosDePerdida.motivos,
  })
}
