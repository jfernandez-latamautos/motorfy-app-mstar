"use client"

import { useState } from "react"

import { ChevronLeft } from "lucide-react"

import { StatusBar } from "@/components/common/status-bar"

type ChangePasswordScreenProps = {
  onNavigate: (screen: string) => void
}

export default function ChangePasswordScreen({ onNavigate }: ChangePasswordScreenProps) {
  const [formData, setFormData] = useState({
    current: "",
    next: "",
    confirm: "",
  })

  const [showPassword, setShowPassword] = useState({
    current: false,
    next: false,
    confirm: false,
  })

  const handleChange = (field: "current" | "next" | "confirm") => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const toggle = (field: "current" | "next" | "confirm") => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const handleSave = () => {
    console.log("Password update simulation:", formData)
    onNavigate("profile")
  }

  const isDisabled = !formData.current || !formData.next || formData.next !== formData.confirm

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white">
      <StatusBar />

      <div className="flex items-center justify-between px-6 pt-6">
        <button
          onClick={() => onNavigate("profile")}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500"
        >
          <ChevronLeft size={20} strokeWidth={2.4} />
        </button>
        <button
          onClick={handleSave}
          disabled={isDisabled}
          className={`text-xs font-semibold uppercase tracking-[0.24em] ${
            isDisabled ? "text-gray-300" : "text-[#0AAC5F]"
          }`}
        >
          Guardar
        </button>
      </div>

      <div className="px-6 pb-6">
        <h1 className="pt-2 text-2xl font-semibold text-gray-900">Cambiar contraseña</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-10">
        <PasswordField
          label="Contraseña actual *"
          value={formData.current}
          onChange={handleChange("current")}
          onToggle={() => toggle("current")}
          show={showPassword.current}
        />
        <PasswordField
          label="Nueva contraseña *"
          value={formData.next}
          onChange={handleChange("next")}
          onToggle={() => toggle("next")}
          show={showPassword.next}
        />
        <PasswordField
          label="Repite la contraseña *"
          value={formData.confirm}
          onChange={handleChange("confirm")}
          onToggle={() => toggle("confirm")}
          show={showPassword.confirm}
        />
      </div>
    </div>
  )
}

function PasswordField({
  label,
  value,
  show,
  onToggle,
  onChange,
}: {
  label: string
  value: string
  show: boolean
  onToggle: () => void
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className="mb-7">
      <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-400">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="w-full border-b-2 border-gray-200 pb-3 pr-16 text-sm font-medium tracking-wide text-gray-700 focus:border-[#0AAC5F] focus:outline-none"
        />
        <button
          onClick={onToggle}
          className="absolute bottom-3 right-0 text-xs font-semibold uppercase tracking-[0.24em] text-[#0AAC5F]"
        >
          {show ? "Ocultar" : "Mostrar"}
        </button>
      </div>
    </div>
  )
}

