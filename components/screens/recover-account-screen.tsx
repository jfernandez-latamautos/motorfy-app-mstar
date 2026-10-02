"use client"

import { useState } from "react"

import { ChevronLeft, Mail } from "lucide-react"

import { StatusBar } from "@/components/common/status-bar"

type RecoverAccountScreenProps = {
  onNavigate: (screen: string) => void
}

export default function RecoverAccountScreen({ onNavigate }: RecoverAccountScreenProps) {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  const handleRecover = () => {
    if (!email) return
    setSent(true)
    setTimeout(() => {
      onNavigate("login")
    }, 1500)
  }

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-gradient-to-br from-[#020617] via-[#020617] to-[#020617] text-white">
      <div className="absolute inset-0">
        <div className="absolute left-[-100px] top-24 h-56 w-56 rounded-full bg-[#0AAC5F]/20 blur-3xl" />
        <div className="absolute right-[-140px] top-[35%] h-64 w-64 rounded-full bg-[#2CBBCE]/15 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#020617] via-transparent" />
      </div>

      <StatusBar tone="light" />

      <div className="relative z-10 flex flex-1 flex-col px-7 pb-10 pt-8">
        <header className="flex items-center justify-between">
          <button
            onClick={() => onNavigate("login")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white/80 backdrop-blur transition hover:bg-white/25"
          >
            <ChevronLeft size={20} strokeWidth={2.4} />
          </button>
          <span className="rounded-2xl bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/80 backdrop-blur">
            Recuperar cuenta
          </span>
          <div className="h-10 w-10" />
        </header>

        <main className="mt-10 flex-1 space-y-6 rounded-3xl bg-white/95 px-6 py-8 text-gray-900 shadow-2xl shadow-[#0AAC5F]/20 backdrop-blur">
          <div className="flex items-center gap-3 text-[#0AAC5F]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e7f7ef]">
              <Mail size={20} />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Recupera tu acceso</h1>
              <p className="text-sm text-gray-500">
                Te enviaremos un enlace para restablecer tu contraseña y volver a la aplicación.
              </p>
            </div>
          </div>

          <div>
            <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-400">
              CORREO ELECTRÓNICO *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-4 py-3 text-sm font-medium tracking-wide text-gray-700 focus:border-[#0AAC5F] focus:outline-none focus:ring-2 focus:ring-[#0AAC5F]/20"
            />
          </div>

          <button
            onClick={handleRecover}
            disabled={!email}
            className={`w-full rounded-full bg-[#0AAC5F] py-4 text-sm font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-[#099B56] ${
              !email ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {sent ? "Enlace enviado" : "Recuperar contraseña"}
          </button>
        </main>

        <footer className="mt-6 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">
          MStar · Seguridad ante todo
        </footer>
      </div>
    </div>
  )
}

