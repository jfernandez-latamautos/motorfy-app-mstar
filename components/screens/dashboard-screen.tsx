"use client"

import { BellRing, CarFront, ChevronRight, CircleDollarSign, FileSpreadsheet, ShieldCheck, CheckCircle2 } from "lucide-react"

import { BrandLogo } from "@/components/common/brand-logo"
import { StatusBar } from "@/components/common/status-bar"

const featureCards = [
  {
    title: "CRÉDITOS",
    description: "Acelera tus ventas ofreciendo financiamiento.",
    icon: CircleDollarSign,
    accent: "bg-[#e7f7ef] text-[#0AAC5F]",
    target: "credits",
  },
  {
    title: "SEGUROS",
    description: "Incluye seguros en la venta de tus autos.",
    icon: ShieldCheck,
    accent: "bg-[#e6f7fa] text-[#2CBBCE]",
  },
  {
    title: "AVISOS",
    description: "Mantente al tanto de todo lo que sucede en MStar.",
    icon: BellRing,
    accent: "bg-[#fef3c7] text-[#c97716]",
  },
  {
    title: "REGISTRO DE VISITAS",
    description: "Registra tus visitas a dealers.",
    icon: CarFront,
    accent: "bg-[#e5ffe9] text-[#0AAC5F]",
  },
  {
    title: "APROBACIONES",
    description: "Consulta tus aprobaciones por las financieras.",
    icon: CheckCircle2,
    accent: "bg-[#e7f7ef] text-[#0AAC5F]",
    target: "approvals",
    isNew: true,
  },
]

export default function DashboardScreen({
  onNavigate,
  userData,
}: { onNavigate: (screen: string) => void; userData: { name: string; email: string; businessName: string } }) {
  const handleFeatureClick = (id: string) => {
    if (id === "credits") {
      onNavigate("credits")
    } else if (id === "approvals") {
      onNavigate("approvals")
    }
  }

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#020617]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56">
        <div className="absolute left-[-80px] top-8 h-40 w-40 rounded-full bg-[#0AAC5F]/20 blur-3xl" />
        <div className="absolute right-[-60px] top-16 h-36 w-36 rounded-full bg-[#2CBBCE]/15 blur-3xl" />
      </div>
      <StatusBar tone="light" />

      <div className="flex items-center justify-end px-6 pt-3">
        <button
          onClick={() => onNavigate("profile")}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur transition hover:bg-white/25"
        >
          <span className="text-lg font-semibold text-white/90">JF</span>
        </button>
      </div>

      <div className="px-6 pt-2 text-white">
        <div className="flex flex-col items-center text-center">
          <BrandLogo width={168} height={55} priority />
          <p className="mt-2 text-xs font-medium uppercase tracking-[0.28em] text-white/70">
            Impulsa tu camino
          </p>
          <p className="mt-4 text-xl font-light uppercase tracking-[0.12em] text-white">{userData.businessName}</p>
        </div>
      </div>

      <div className="mt-6 flex-1 rounded-t-[32px] bg-white/95 px-6 pb-28 pt-8 backdrop-blur-md">
        <div className="space-y-4">
          {featureCards.map(({ title, description, icon: Icon, accent, target, isNew }) => (
            <button
              key={title}
              onClick={() => {
                if (target) handleFeatureClick(target)
              }}
              className="flex w-full items-center justify-between rounded-2xl bg-white px-5 py-4 text-left shadow-sm shadow-[#0AAC5F]/10 transition hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${accent}`}>
                  <Icon className="h-6 w-6" strokeWidth={2.2} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-gray-900">{title}</h3>
                    {isNew && (
                      <span className="rounded-full bg-[#0AAC5F] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white">
                        NUEVO
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-[12px] leading-relaxed text-gray-600">{description}</p>
                </div>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <ChevronRight className="h-4 w-4" strokeWidth={2.6} />
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => onNavigate("calculator")}
        className="absolute bottom-12 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#0AAC5F] px-8 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#099B56]"
      >
        <FileSpreadsheet className="h-5 w-5 text-white" strokeWidth={2.2} />
        CALCULADORA
      </button>
    </div>
  )
}
