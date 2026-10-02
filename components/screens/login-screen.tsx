"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

import { BrandLogo } from "@/components/common/brand-logo"
import { StatusBar } from "@/components/common/status-bar"

export default function LoginScreen({
  onNavigate,
  onLogin,
}: {
  onNavigate: (screen: string) => void
  onLogin: (email: string, password: string) => void
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = () => {
    if (email && password) {
      onLogin(email, password)
    }
  }

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-gradient-to-br from-[#020617] via-[#0A1A2F] to-[#020617] text-white">
      <div className="absolute inset-0">
        <div className="absolute left-[-120px] top-[120px] h-56 w-56 rounded-full bg-[#0AAC5F]/20 blur-3xl" />
        <div className="absolute right-[-140px] top-[40%] h-64 w-64 rounded-full bg-[#2CBBCE]/15 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#020617] via-transparent" />
      </div>

      <StatusBar tone="light" />

      <div className="relative z-10 flex flex-1 flex-col justify-between overflow-y-auto px-7 pb-10 pt-8">
        <header className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">Bienvenido</p>
              <h1 className="text-3xl font-semibold tracking-tight">Inicia sesión</h1>
            </div>
            <BrandLogo width={96} height={31} />
          </div>
          <p className="text-sm leading-relaxed text-white/70">
            Accede a tu cuenta y continúa gestionando tus solicitudes de crédito automotriz.
          </p>
        </header>

        <div className="space-y-5 rounded-3xl bg-white px-6 py-7 text-gray-900 shadow-2xl shadow-[#0AAC5F]/20">
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

          <div>
            <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-400">
              CONTRASEÑA *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-4 py-3 pr-10 text-sm font-medium tracking-wide text-gray-700 focus:border-[#0AAC5F] focus:outline-none focus:ring-2 focus:ring-[#0AAC5F]/20"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-[#0AAC5F] transition hover:text-[#099B56]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            onClick={() => onNavigate("recover")}
            className="w-full text-right text-[11px] font-semibold uppercase tracking-[0.24em] text-[#0AAC5F]"
          >
            ¿Olvidaste la contraseña?
          </button>

          <button
            onClick={handleLogin}
            className="w-full rounded-full bg-[#0AAC5F] py-4 text-sm font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-[#099B56]"
          >
            INICIAR SESIÓN
          </button>

          <div className="text-center text-sm text-gray-600">
            <p className="text-xs uppercase tracking-[0.24em] text-gray-400">¿NO TIENES CUENTA?</p>
            <button
              onClick={() => onNavigate("register")}
              className="mt-3 w-full rounded-full border-2 border-[#0AAC5F] py-3 text-sm font-semibold uppercase tracking-[0.24em] text-[#0AAC5F] transition hover:bg-[#0AAC5F] hover:text-white"
            >
              REGÍSTRATE AHORA
            </button>
          </div>
        </div>

        <footer className="text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">
          © {new Date().getFullYear()} MStar
        </footer>
      </div>
    </div>
  )
}
