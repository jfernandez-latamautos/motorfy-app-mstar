"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import {
  ChevronLeft,
  Search,
  X,
  FileText,
  XCircle,
  Play,
  Building2,
  ChevronDown,
  ChevronUp,
  Clock,
  MessageSquare,
  ShieldCheck,
  Loader2,
} from "lucide-react"
import { Toaster, toast } from "sonner"

import { BottomNavigation } from "@/components/common/bottom-navigation"
import { StatusBar } from "@/components/common/status-bar"
import type {
  AprobacionVista,
  EstadoVigencia,
  MotivoPerdidaCatalogo,
  TipificacionCatalogo,
} from "@/lib/aprobaciones/store"

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Error ${res.status} al consultar ${url}`)
  return res.json() as Promise<T>
}

const getFinancierColor = (financier: string) => {
  switch (financier) {
    case "COPPEL":
      return "bg-blue-100 text-blue-700"
    case "CREDITAS":
      return "bg-slate-100 text-slate-700"
    case "RAPIAUTO":
      return "bg-cyan-100 text-cyan-700"
    default:
      return "bg-gray-100 text-gray-700"
  }
}

const STATUS_STYLES: Record<
  EstadoVigencia,
  { label: string; border: string; badge: string; accentText: string; accentBox: string }
> = {
  vigente: {
    label: "VIGENTE",
    border: "border-l-4 border-[#0AAC5F]",
    badge: "bg-[#0AAC5F] text-white",
    accentText: "text-gray-900",
    accentBox: "bg-gray-50 border border-gray-100",
  },
  "por-vencer": {
    label: "POR VENCER",
    border: "border-l-4 border-[#F59E0B]",
    badge: "bg-[#F59E0B] text-white",
    accentText: "text-[#F59E0B]",
    accentBox: "bg-amber-50/50 border border-amber-100",
  },
  vencida: {
    label: "VENCIDA",
    border: "border-l-4 border-[#DC2626]",
    badge: "bg-[#DC2626] text-white",
    accentText: "text-[#DC2626]",
    accentBox: "bg-red-50/50 border border-red-100",
  },
}

const formatDate = (iso: string) => {
  const date = new Date(iso + "T00:00:00")
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  return `${day}/${month}/${date.getFullYear()}`
}

interface ApprovalsScreenProps {
  onNavigate: (screen: string) => void
  userData: { name: string; email: string; businessName: string; phone?: string }
}

export default function ApprovalsScreen({ onNavigate, userData }: ApprovalsScreenProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<EstadoVigencia>("vigente")
  const [expandedAgencies, setExpandedAgencies] = useState<Set<string>>(new Set())

  const [aprobaciones, setAprobaciones] = useState<AprobacionVista[]>([])
  const [tipificaciones, setTipificaciones] = useState<TipificacionCatalogo[]>([])
  const [motivosPerdida, setMotivosPerdida] = useState<MotivoPerdidaCatalogo[]>([])
  const [loading, setLoading] = useState(true)

  // Modales
  const [seguimientoDe, setSeguimientoDe] = useState<AprobacionVista | null>(null)
  const [perderDe, setPerderDe] = useState<AprobacionVista | null>(null)
  const [iniciarDe, setIniciarDe] = useState<AprobacionVista | null>(null)

  const cargarAprobaciones = useCallback(async () => {
    try {
      const data = await fetchJson<{ aprobaciones?: AprobacionVista[] }>("/api/aprobaciones")
      setAprobaciones(data.aprobaciones ?? [])
    } catch {
      toast.error("No se pudieron cargar las aprobaciones")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargarAprobaciones()
    fetchJson<{
      tipificaciones?: TipificacionCatalogo[]
      motivosDePerdida?: MotivoPerdidaCatalogo[]
    }>("/api/catalogos/tipificaciones")
      .then((data) => {
        setTipificaciones(data.tipificaciones ?? [])
        setMotivosPerdida(data.motivosDePerdida ?? [])
      })
      .catch(() => toast.error("No se pudo cargar el catálogo de tipificaciones"))
  }, [cargarAprobaciones])

  // Nota: se muestran todas las agencias (la exclusión de la agencia propia
  // quedó pendiente de confirmar con producto — GAP-8/ítem 4 del backlog).
  const filteredApprovals = aprobaciones.filter(
    (a) =>
      a.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.consecutivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.agencia.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const approvalsByStatus: Record<EstadoVigencia, AprobacionVista[]> = {
    vigente: filteredApprovals.filter((a) => a.estadoVigencia === "vigente"),
    "por-vencer": filteredApprovals.filter((a) => a.estadoVigencia === "por-vencer"),
    vencida: filteredApprovals.filter((a) => a.estadoVigencia === "vencida"),
  }

  const currentApprovals = approvalsByStatus[activeTab]

  const groupedApprovals = useMemo(() => {
    if (currentApprovals.length === 0) return null
    const grouped = new Map<string, AprobacionVista[]>()
    currentApprovals.forEach((a) => {
      grouped.set(a.agencia, [...(grouped.get(a.agencia) || []), a])
    })
    return {
      groups: Array.from(grouped.entries())
        .map(([agencyName, approvals]) => ({ agencyName, approvals, count: approvals.length }))
        .sort((a, b) => a.agencyName.localeCompare(b.agencyName)),
    }
  }, [currentApprovals])

  const toggleAgency = (agencyName: string) => {
    setExpandedAgencies((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(agencyName)) newSet.delete(agencyName)
      else newSet.add(agencyName)
      return newSet
    })
  }

  useEffect(() => {
    if (searchTerm.length > 0 && groupedApprovals) {
      setExpandedAgencies((prev) => {
        const newSet = new Set(prev)
        groupedApprovals.groups.forEach((g) => newSet.add(g.agencyName))
        return newSet
      })
    }
  }, [searchTerm, groupedApprovals])

  const renderApprovalCard = (approval: AprobacionVista, isGrouped = false) => {
    const status = approval.estadoVigencia
    const styles = STATUS_STYLES[status]
    const seguimiento = approval.seguimiento
    const seguimientoCerrado = seguimiento != null && !seguimiento.tipificacion.seguimientoAbierto

    return (
      <div
        key={approval.id}
        className={`relative ${isGrouped ? "rounded-lg" : "mb-3 rounded-xl"} ${styles.border} border-r border-t border-b border-gray-200 bg-white shadow-sm p-3`}
      >
        <div className="space-y-2">
          {/* Estado + días restantes + financiera */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${styles.badge}`}>
                {styles.label}
              </span>
              <span
                className={`flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${styles.accentBox} ${styles.accentText}`}
              >
                <Clock className="h-3 w-3" strokeWidth={2.4} />
                {status === "vencida"
                  ? approval.caducada
                    ? "Caducada"
                    : `${approval.diasParaDecidir} ${approval.diasParaDecidir === 1 ? "día" : "días"} para decidir`
                  : `Quedan ${approval.diasRestantes} ${approval.diasRestantes === 1 ? "día" : "días"}`}
              </span>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${getFinancierColor(approval.financiera)}`}
            >
              {approval.financiera}
            </span>
          </div>

          {/* Acciones según estado */}
          <div className="flex items-center justify-center">
            {status === "vencida" && approval.caducada ? (
              <div className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-3 py-2.5 text-center">
                <div className="flex items-center justify-center gap-2 text-gray-500">
                  <ShieldCheck className="h-4 w-4" strokeWidth={2.2} />
                  <span className="text-xs font-semibold">Notificada a backoffice de aprobaciones</span>
                </div>
                <p className="mt-1 text-[11px] leading-snug text-gray-400">
                  Tipificada por defecto como{" "}
                  <span className="font-semibold">{approval.tipificacionCaducidad?.etiqueta ?? "Vigencia mayor a 30 días"}</span>{" "}
                  tras {approval.diasVencida} días vencida. Inhabilitada; pendiente de finalizar en el Admin.
                </p>
              </div>
            ) : status === "vencida" ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setPerderDe(approval)}
                  className="flex items-center gap-2 rounded-lg border-2 border-[#DC2626] bg-[#DC2626] px-3 py-2 text-white transition hover:bg-[#B91C1C] hover:border-[#B91C1C] active:scale-95"
                >
                  <XCircle className="h-4 w-4" strokeWidth={2} />
                  <span className="text-xs font-semibold">PERDER</span>
                </button>
                <button
                  onClick={() => setIniciarDe(approval)}
                  className="flex items-center gap-2 rounded-lg border-2 border-[#0AAC5F] bg-[#0AAC5F] px-3 py-2 text-white transition hover:bg-[#099B56] hover:border-[#099B56] active:scale-95"
                >
                  <Play className="h-4 w-4" strokeWidth={2} />
                  <span className="text-xs font-semibold">INICIAR</span>
                </button>
              </div>
            ) : seguimientoCerrado ? (
              <div className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-400">
                <ShieldCheck className="h-4 w-4" strokeWidth={2.2} />
                <span className="text-xs font-semibold">Seguimiento cerrado</span>
              </div>
            ) : (
              <button
                onClick={() => setSeguimientoDe(approval)}
                className={`flex w-full items-center justify-center gap-2 rounded-lg border-2 px-3 py-2.5 transition active:scale-95 ${
                  status === "por-vencer"
                    ? "border-[#F59E0B] bg-white text-[#F59E0B] hover:bg-amber-50"
                    : "border-[#020617] bg-white text-[#020617] hover:bg-gray-50"
                }`}
              >
                <FileText className="h-4 w-4" strokeWidth={2.2} />
                <span className="text-xs font-semibold">
                  {seguimiento ? "Actualizar seguimiento" : "Dar seguimiento"}
                </span>
              </button>
            )}
          </div>

          {/* Seguimiento registrado */}
          {seguimiento && (
            <div className="rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-400">
                  <MessageSquare className="h-3 w-3" strokeWidth={2.4} />
                  SEGUIMIENTO
                </span>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[9px] font-bold text-gray-700">
                  {seguimiento.tipificacion.etiqueta}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-700">{seguimiento.comentarioComercial}</p>
              <p className="mt-1 text-[9px] text-gray-400">
                {seguimiento.autor} · v{seguimiento.versiones} ·{" "}
                {new Date(seguimiento.actualizadoEl).toLocaleDateString("es-MX")}
              </p>
            </div>
          )}

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-400">CLIENTE</p>
            <p className="mt-0.5 text-sm font-semibold text-gray-900">{approval.cliente}</p>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-400">VENDEDOR</p>
            <p className="mt-0.5 text-xs font-medium text-gray-700">{approval.vendedor}</p>
          </div>

          <div className={`rounded-lg px-2 py-1.5 ${styles.accentBox}`}>
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">APROBADA</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">CONSECUTIVO</p>
            </div>
            <div className="mt-0.5 flex items-center justify-between">
              <p className={`text-xs font-medium ${styles.accentText}`}>{formatDate(approval.fechaBancoCierre)}</p>
              <p className={`text-xs font-semibold ${styles.accentText}`}>{approval.consecutivo}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#020617]">
      <Toaster position="top-center" richColors />
      <StatusBar tone="light" />

      <div className="flex items-center justify-between px-6 pt-3">
        <button
          onClick={() => onNavigate("dashboard")}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur text-white transition hover:bg-white/25"
        >
          <ChevronLeft size={20} strokeWidth={2.4} />
        </button>
        <h1 className="text-[13px] font-semibold uppercase tracking-[0.28em] text-white/90">APROBACIONES</h1>
        <div className="h-10 w-10" />
      </div>

      <div className="px-6 pt-2 pb-4 text-white">
        <p className="mt-2 text-sm leading-relaxed text-white/80">
          Visualiza y gestiona todas las solicitudes de crédito que han sido aprobadas por las financieras
        </p>

        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" strokeWidth={2.4} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre de cliente, agencia o consecutivo"
              className="w-full rounded-lg border border-gray-200 bg-white px-10 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#0AAC5F] focus:outline-none focus:ring-2 focus:ring-[#0AAC5F]/20"
            />
          </div>
        </div>
      </div>

      <div className="mt-2 flex min-h-0 flex-1 flex-col rounded-t-[32px] bg-white/95 backdrop-blur-md">
        {/* Tabs */}
        <div className="flex border-b bg-gray-50/50">
          {(
            [
              { id: "vigente", label: "VIGENTE", color: "#0AAC5F", activeBg: "bg-white", activeText: "text-[#020617]", badge: "bg-[#0AAC5F]" },
              { id: "por-vencer", label: "POR VENCER", color: "#F59E0B", activeBg: "bg-[#F59E0B]/10", activeText: "text-[#F59E0B]", badge: "bg-[#F59E0B]" },
              { id: "vencida", label: "VENCIDA", color: "#DC2626", activeBg: "bg-[#DC2626]/10", activeText: "text-[#DC2626]", badge: "bg-[#DC2626]" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 py-3 text-center text-[11px] font-semibold tracking-[0.18em] transition ${
                activeTab === tab.id ? `${tab.activeText} ${tab.activeBg}` : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <span className="flex items-center justify-center gap-1.5">
                {tab.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                    activeTab === tab.id ? `${tab.badge} text-white` : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {approvalsByStatus[tab.id].length}
                </span>
              </span>
              {activeTab === tab.id && (
                <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full" style={{ backgroundColor: tab.color }} />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 pb-32 pt-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="mt-3 text-sm">Cargando aprobaciones...</p>
            </div>
          ) : currentApprovals.length > 0 && groupedApprovals ? (
            <div className="space-y-5">
              {groupedApprovals.groups.map((group) => {
                const isExpanded = expandedAgencies.has(group.agencyName)
                return (
                  <div key={group.agencyName} className="rounded-xl border border-gray-200 bg-white shadow-sm">
                    <button
                      onClick={() => toggleAgency(group.agencyName)}
                      className="w-full flex items-center gap-3 border-b border-gray-100 bg-gray-50 px-4 py-3 transition hover:bg-gray-100"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-gray-200">
                        <Building2 className="h-4 w-4 text-[#020617]" strokeWidth={2.2} />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="text-sm font-bold text-gray-900">{group.agencyName}</h3>
                        <p className="text-[10px] font-medium text-gray-500">
                          {group.count} {group.count === 1 ? "solicitud" : "solicitudes"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 items-center justify-center rounded-full bg-[#020617] px-2.5">
                          <span className="text-[10px] font-bold text-white">{group.count}</span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" strokeWidth={2} />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" strokeWidth={2} />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="divide-y divide-gray-100">
                        {group.approvals.map((approval) => (
                          <div key={approval.id} className="px-3 py-2.5 first:pt-3 last:pb-3">
                            {renderApprovalCard(approval, true)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Search className="h-8 w-8 text-gray-400" strokeWidth={2} />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">No se encontraron resultados</h3>
              <p className="max-w-sm text-sm leading-relaxed text-gray-600">
                {searchTerm
                  ? `No encontramos aprobaciones que coincidan con "${searchTerm}". Intenta con otros términos de búsqueda.`
                  : `No hay solicitudes ${activeTab === "vigente" ? "vigentes" : activeTab === "por-vencer" ? "por vencer" : "vencidas"} disponibles en este momento.`}
              </p>
            </div>
          )}
        </div>
      </div>

      {seguimientoDe && (
        <SeguimientoModal
          aprobacion={seguimientoDe}
          tipificaciones={tipificaciones}
          userData={userData}
          onClose={() => setSeguimientoDe(null)}
          onSaved={() => {
            setSeguimientoDe(null)
            cargarAprobaciones()
          }}
        />
      )}

      {perderDe && (
        <PerderModal
          aprobacion={perderDe}
          motivos={motivosPerdida}
          onClose={() => setPerderDe(null)}
          onSaved={() => {
            setPerderDe(null)
            cargarAprobaciones()
          }}
        />
      )}

      {iniciarDe && (
        <IniciarModal
          aprobacion={iniciarDe}
          onClose={() => setIniciarDe(null)}
          onSaved={() => {
            setIniciarDe(null)
            cargarAprobaciones()
          }}
        />
      )}

      <BottomNavigation active="dashboard" onNavigate={onNavigate} disableHighlight />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Modal: Dar / Actualizar seguimiento (tipificación + comentario)     */
/* ------------------------------------------------------------------ */

function SeguimientoModal({
  aprobacion,
  tipificaciones,
  userData,
  onClose,
  onSaved,
}: {
  aprobacion: AprobacionVista
  tipificaciones: TipificacionCatalogo[]
  userData: { name: string }
  onClose: () => void
  onSaved: () => void
}) {
  const [tipificacionCodigo, setTipificacionCodigo] = useState(
    aprobacion.seguimiento?.tipificacion.codigo ?? "",
  )
  const [comentario, setComentario] = useState(aprobacion.seguimiento?.comentarioComercial ?? "")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  const seleccionada = tipificaciones.find((t) => t.codigo === tipificacionCodigo)

  const handleSave = async () => {
    if (!tipificacionCodigo) {
      setError("Selecciona una tipificación")
      return
    }
    if (comentario.trim().length < 5) {
      setError("El comentario comercial es obligatorio (mínimo 5 caracteres)")
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`/api/aprobaciones/${aprobacion.id}/seguimiento`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipificacionCodigo,
          comentarioComercial: comentario,
          autor: userData.name || "Vendedor",
          rol: "vendedor",
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al guardar")
      toast.success("Seguimiento registrado", {
        description: seleccionada?.seguimientoAbierto
          ? "La tipificación queda abierta: podrás actualizar el comentario."
          : "Este seguimiento cierra la gestión de la solicitud.",
      })
      onSaved()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar")
      setSaving(false)
    }
  }

  return (
    <ModalShell title={aprobacion.seguimiento ? "Actualizar seguimiento" : "Dar seguimiento"} onClose={onClose}>
      <ResumenSolicitud aprobacion={aprobacion} />

      <div className="mb-3">
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Tipificación <span className="text-[#DC2626]">*</span>
        </label>
        <select
          value={tipificacionCodigo}
          onChange={(e) => {
            setTipificacionCodigo(e.target.value)
            setError("")
          }}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-[#0AAC5F] focus:outline-none focus:ring-2 focus:ring-[#0AAC5F]/20"
        >
          <option value="">Selecciona una tipificación...</option>
          {tipificaciones.map((t) => (
            <option key={t.codigo} value={t.codigo}>
              {t.etiqueta}
            </option>
          ))}
        </select>
        {seleccionada && (
          <p className={`mt-1.5 text-[11px] ${seleccionada.seguimientoAbierto ? "text-gray-700" : "text-gray-500"}`}>
            {seleccionada.seguimientoAbierto
              ? "✓ Seguimiento abierto: podrás actualizar el comentario más adelante."
              : "Esta tipificación cierra el seguimiento de la solicitud."}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Comentario comercial <span className="text-[#DC2626]">*</span>
        </label>
        <textarea
          value={comentario}
          onChange={(e) => {
            setComentario(e.target.value)
            setError("")
          }}
          placeholder="Describe la situación actual con el cliente..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#0AAC5F] focus:outline-none focus:ring-2 focus:ring-[#0AAC5F]/20"
          rows={4}
          maxLength={500}
        />
        <p className="mt-1 text-right text-[10px] text-gray-400">{comentario.length}/500</p>
      </div>

      {error && <p className="mb-3 text-xs font-medium text-[#DC2626]">{error}</p>}

      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 rounded-lg bg-[#0AAC5F] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#099B56] disabled:opacity-60"
        >
          {saving ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </ModalShell>
  )
}

/* ------------------------------------------------------------------ */
/* Modal: PERDER solicitud vencida (motivo + propagación)              */
/* ------------------------------------------------------------------ */

function PerderModal({
  aprobacion,
  motivos,
  onClose,
  onSaved,
}: {
  aprobacion: AprobacionVista
  motivos: MotivoPerdidaCatalogo[]
  onClose: () => void
  onSaved: () => void
}) {
  const [motivoCodigo, setMotivoCodigo] = useState("")
  const [comentario, setComentario] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!motivoCodigo) {
      setError("Selecciona el motivo de pérdida")
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`/api/aprobaciones/${aprobacion.id}/perder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motivoCodigo, comentario }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al perder la solicitud")
      toast.success("Solicitud marcada como perdida", {
        description: "Se notificó a backoffice de aprobaciones para su finalización.",
      })
      onSaved()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al perder la solicitud")
      setSaving(false)
    }
  }

  return (
    <ModalShell title="Perder solicitud" onClose={onClose}>
      <ResumenSolicitud aprobacion={aprobacion} />

      <div className="mb-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-[#B91C1C]">
        Al confirmar, la solicitud se marca como <strong>PERDIDA</strong> en la app y se notifica —con tu nota— a{" "}
        <strong>backoffice de aprobaciones</strong> para que la finalice y/o la pierda. Se inhabilitará la opción de{" "}
        <strong>Iniciar solicitud</strong>. Esta acción no se puede deshacer.
      </div>

      <div className="mb-3">
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Motivo de pérdida <span className="text-[#DC2626]">*</span>
        </label>
        <select
          value={motivoCodigo}
          onChange={(e) => {
            setMotivoCodigo(e.target.value)
            setError("")
          }}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-[#DC2626] focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20"
        >
          <option value="">Selecciona el motivo...</option>
          {motivos.map((m) => (
            <option key={m.codigo} value={m.codigo}>
              {m.etiqueta}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-semibold text-gray-700">Comentario (opcional)</label>
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Detalle adicional del motivo..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#DC2626] focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20"
          rows={3}
          maxLength={500}
        />
      </div>

      {error && <p className="mb-3 text-xs font-medium text-[#DC2626]">{error}</p>}

      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 rounded-lg bg-[#DC2626] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#B91C1C] disabled:opacity-60"
        >
          {saving ? "Perdiendo..." : "Confirmar pérdida"}
        </button>
      </div>
    </ModalShell>
  )
}

/* ------------------------------------------------------------------ */
/* Modal: INICIAR (reingreso guiado con datos precargados)             */
/* ------------------------------------------------------------------ */

function IniciarModal({
  aprobacion,
  onClose,
  onSaved,
}: {
  aprobacion: AprobacionVista
  onClose: () => void
  onSaved: () => void
}) {
  const [step, setStep] = useState<1 | 2>(1)
  const [resultado, setResultado] = useState<{ nuevoConsecutivo: string } | null>(null)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  const handleIniciar = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/aprobaciones/${aprobacion.id}/iniciar`, { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al reingresar la solicitud")
      setResultado({ nuevoConsecutivo: data.nuevoConsecutivo })
      toast.success("Solicitud reingresada", {
        description: `Nuevo consecutivo ${data.nuevoConsecutivo}. Buró consultado.`,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al reingresar la solicitud")
      setSaving(false)
    }
  }

  return (
    <ModalShell title="Iniciar solicitud de nuevo" onClose={resultado ? onSaved : onClose}>
      {resultado ? (
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <ShieldCheck className="h-7 w-7 text-[#020617]" strokeWidth={2.2} />
          </div>
          <h3 className="mb-1 text-base font-bold text-gray-900">Reingreso completado</h3>
          <p className="mb-1 text-sm text-gray-600">
            Nueva solicitud <strong>{resultado.nuevoConsecutivo}</strong> creada con los datos precargados.
          </p>
          <p className="mb-4 text-xs text-gray-500">
            Se re-consultó el buró. La solicitud entró al análisis y aparecerá aquí cuando la financiera la apruebe.
          </p>
          <button
            onClick={onSaved}
            className="w-full rounded-lg bg-[#0AAC5F] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#099B56]"
          >
            Entendido
          </button>
        </div>
      ) : step === 1 ? (
        <>
          <p className="mb-3 text-xs leading-relaxed text-gray-600">
            La aprobación venció, pero puedes reingresar la solicitud reutilizando los datos capturados. Revisa que
            sigan correctos: al confirmar, solo se volverá a consultar el buró.
          </p>
          <div className="mb-4 space-y-2 rounded-lg bg-gray-50 p-3">
            {(
              [
                ["CLIENTE", aprobacion.cliente],
                ["VENDEDOR", aprobacion.vendedor],
                ["AGENCIA", aprobacion.agencia],
                ["FINANCIERA ANTERIOR", aprobacion.financiera],
                ["CONSECUTIVO ANTERIOR", aprobacion.consecutivo],
              ] as const
            ).map(([label, value]) => (
              <div key={label}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-400">{label}</p>
                <p className="text-sm font-medium text-gray-900">{value}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={() => setStep(2)}
              className="flex-1 rounded-lg bg-[#0AAC5F] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#099B56]"
            >
              Los datos son correctos
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs leading-relaxed text-gray-600">
            Al confirmar se creará una <strong>nueva solicitud</strong> con estos datos y se{" "}
            <strong>re-consultará el buró</strong> del cliente. El equipo de aprobaciones recibirá la solicitud sin que
            tengas que capturar todo de nuevo.
          </div>
          {error && <p className="mb-3 text-xs font-medium text-[#DC2626]">{error}</p>}
          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Volver
            </button>
            <button
              onClick={handleIniciar}
              disabled={saving}
              className="flex-1 rounded-lg bg-[#0AAC5F] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#099B56] disabled:opacity-60"
            >
              {saving ? "Consultando buró..." : "Consultar buró y reingresar"}
            </button>
          </div>
        </>
      )}
    </ModalShell>
  )
}

/* ------------------------------------------------------------------ */
/* Piezas compartidas de los modales                                   */
/* ------------------------------------------------------------------ */

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200"
          >
            <X className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function ResumenSolicitud({ aprobacion }: { aprobacion: AprobacionVista }) {
  return (
    <div className="mb-4 space-y-1 rounded-lg bg-gray-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-400">CLIENTE</p>
      <p className="text-sm font-semibold text-gray-900">{aprobacion.cliente}</p>
      <div className="mt-1 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-400">CONSECUTIVO</p>
          <p className="text-xs text-gray-600">{aprobacion.consecutivo}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-400">FINANCIERA</p>
          <p className="text-xs font-semibold text-gray-700">{aprobacion.financiera}</p>
        </div>
      </div>
    </div>
  )
}
