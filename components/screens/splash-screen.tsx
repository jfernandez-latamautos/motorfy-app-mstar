"use client"

import { useEffect } from "react"

import { BrandLogo } from "@/components/common/brand-logo"
import { StatusBar } from "@/components/common/status-bar"

export default function SplashScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNavigate("onboarding")
    }, 2500)
    return () => clearTimeout(timer)
  }, [onNavigate])

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#020617]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-80px] top-[80px] h-56 w-56 rounded-full bg-[#0AAC5F]/25 blur-3xl" />
        <div className="absolute right-[-100px] bottom-[120px] h-64 w-64 rounded-full bg-[#2CBBCE]/20 blur-3xl" />
      </div>
      <StatusBar tone="light" />

      <div className="relative flex flex-1 items-center justify-center px-10 text-center">
        <div className="relative z-10 flex flex-col items-center gap-5">
          <BrandLogo width={200} height={65} priority />
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-white/60">Impulsa tu camino</p>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center gap-2 bg-[#0AAC5F] pb-10 pt-6 text-[11px] font-semibold uppercase tracking-[0.24em] text-white">
        <span>Financiamiento automotriz</span>
      </div>
    </div>
  )
}
