"use client"

import { ShieldCheck, Wrench, CircleDollarSign, CarFront, Sparkles } from "lucide-react"

import { BrandLogo } from "@/components/common/brand-logo"
import { StatusBar } from "@/components/common/status-bar"

export default function OnboardingScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  return (
    <div className="flex h-full w-full flex-col items-center overflow-hidden bg-gradient-to-br from-[#020617] via-[#0A1A2F] to-[#020617]">
      <StatusBar tone="light" />

      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-10 text-center">
        {/* Icon orbit */}
        <div className="relative h-44 w-44">
          <div className="absolute inset-6 rounded-full border border-white/20" />
          <div className="absolute inset-0 animate-[orbit_20s_linear_infinite]">
            <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur animate-[orbit-counter_20s_linear_infinite]">
                <Wrench className="h-6 w-6 text-white" strokeWidth={2.4} />
              </div>
            </div>
            <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur animate-[orbit-counter_20s_linear_infinite]">
                <ShieldCheck className="h-6 w-6 text-white" strokeWidth={2.4} />
              </div>
            </div>
            <div className="pointer-events-none absolute left-1/2 bottom-0 -translate-x-1/2">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur animate-[orbit-counter_20s_linear_infinite]">
                <CircleDollarSign className="h-6 w-6 text-white" strokeWidth={2.4} />
              </div>
            </div>
            <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur animate-[orbit-counter_20s_linear_infinite]">
                <Sparkles className="h-6 w-6 text-white" strokeWidth={2.4} />
              </div>
            </div>
            <div className="pointer-events-none absolute left-6 top-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 backdrop-blur animate-[orbit-counter_20s_linear_infinite]">
                <CircleDollarSign className="h-5 w-5 text-white" strokeWidth={2.4} />
              </div>
            </div>
            <div className="pointer-events-none absolute right-6 bottom-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 backdrop-blur animate-[orbit-counter_20s_linear_infinite]">
                <ShieldCheck className="h-5 w-5 text-white" strokeWidth={2.4} />
              </div>
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 backdrop-blur">
              <span className="pointer-events-none absolute inset-0 rounded-3xl border border-white/25" />
              <span className="pointer-events-none absolute inset-0 rounded-3xl bg-[#0AAC5F]/40 blur-lg opacity-60 animate-[glow_6s_ease-in-out_infinite]" />
              <CarFront className="relative h-10 w-10 text-white" strokeWidth={2.6} />
            </div>
          </div>
        </div>
        {/* Text content */}
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-2xl font-semibold text-white">Bienvenido a</h1>
          <BrandLogo width={168} height={55} />
        </div>

        <div className="text-sm leading-relaxed text-white/90">
          <p className="leading-relaxed">
            La herramienta que te permite cotizar y ofrecer crédito
            <br />
            automotriz a tus clientes, de forma rápida y flexible.
          </p>
        </div>
      </div>

      {/* Button */}
      <div className="w-full px-6 pb-10">
        <button
          onClick={() => onNavigate("login")}
          className="w-full rounded-full bg-[#0AAC5F] py-4 text-sm font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-[#099B56]"
        >
          Entendido
        </button>
      </div>
    </div>
  )
}
