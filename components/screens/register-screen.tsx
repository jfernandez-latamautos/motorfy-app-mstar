"use client"

import type React from "react"

import { useState } from "react"
import { ChevronLeft, Eye, EyeOff } from "lucide-react"

import { StatusBar } from "@/components/common/status-bar"

export default function RegisterScreen({
  onNavigate,
  onRegister,
}: {
  onNavigate: (screen: string) => void
  onRegister: (data: any) => void
}) {
  const [step, setStep] = useState<1 | 2>(1)
  const [formData, setFormData] = useState({
    name: "",
    apellidos: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    address: "",
    postalCode: "",
    state: "",
    city: "",
    delegation: "",
    neighborhood: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleNext = () => {
    if (step === 1) {
      setStep(2)
    } else {
      onRegister(formData)
    }
  }

  const steps = [
    { id: 1, label: "Datos personales" },
    { id: 2, label: "Datos del negocio" },
  ] as const

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-gradient-to-br from-[#020617] via-[#020617] to-[#020617] text-white">
      <div className="absolute inset-0">
        <div className="absolute left-[-90px] top-24 h-56 w-56 rounded-full bg-[#0AAC5F]/20 blur-3xl" />
        <div className="absolute right-[-130px] top-[45%] h-64 w-64 rounded-full bg-[#2CBBCE]/15 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#020617] via-transparent" />
      </div>

      <StatusBar tone="light" />

      <div className="relative z-10 flex flex-1 flex-col px-5 pb-6 pt-4">
        <header className="flex items-center justify-between">
          <button
            onClick={() => onNavigate("login")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white/80 backdrop-blur transition hover:bg-white/25"
          >
            <ChevronLeft size={20} strokeWidth={2.4} />
          </button>
          <span className="rounded-2xl bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/80 backdrop-blur">
            Registro MStar
          </span>
          <div className="h-10 w-10" />
        </header>

        <div className="mt-4 flex flex-1 items-stretch justify-center">
          <div
            className="flex w-full flex-col overflow-hidden rounded-3xl bg-white text-gray-900 shadow-2xl shadow-[#0AAC5F]/20 sm:w-[92%]"
            style={{ maxHeight: "min(640px, calc(100vh - 180px))" }}
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">Paso {step} de 2</p>
                <h1 className="mt-2 text-2xl font-semibold text-gray-900">Crea tu cuenta</h1>
                <p className="mt-2 text-sm text-gray-500">
                  Completa la información para empezar a ofrecer créditos y seguros a tus clientes.
                </p>
              </div>
              <div className="flex gap-2">
                {steps.map((item) => (
                  <div
                    key={item.id}
                    className={`h-2 w-16 rounded-full transition ${
                      step >= item.id ? "bg-gradient-to-r from-[#0AAC5F] to-[#3BBD7F]" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-6">
              {step === 1 ? (
                <div className="space-y-6">
                  <InputField label="Nombre *" name="name" value={formData.name} onChange={handleInputChange} />
                  <InputField label="Apellidos *" name="apellidos" value={formData.apellidos} onChange={handleInputChange} />
                  <InputField
                    label="Correo electrónico *"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Celular *"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />

                  <PasswordField
                    label="Crea una contraseña *"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    show={showPassword}
                    onToggle={() => setShowPassword(!showPassword)}
                  />

                  <PasswordField
                    label="Repite la contraseña *"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    show={showConfirm}
                    onToggle={() => setShowConfirm(!showConfirm)}
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  <InputField
                    label="Nombre del negocio *"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                  />
                  <InputField label="Dirección *" name="address" value={formData.address} onChange={handleInputChange} />
                  <InputField
                    label="Código postal *"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                  />
                  <InputField label="Estado *" name="state" value={formData.state} onChange={handleInputChange} />
                  <InputField label="Ciudad" name="city" value={formData.city} onChange={handleInputChange} />
                  <InputField
                    label="Delegación o municipio *"
                    name="delegation"
                    value={formData.delegation}
                    onChange={handleInputChange}
                  />
                  <SelectField
                    label="Colonia *"
                    name="neighborhood"
                    value={formData.neighborhood}
                    onChange={handleInputChange}
                    options={[
                      { value: "", label: "Selecciona una colonia" },
                      { value: "centro", label: "Centro" },
                      { value: "norte", label: "Zona Norte" },
                      { value: "sur", label: "Zona Sur" },
                    ]}
                  />
                </div>
              )}
            </div>

            <div className="space-y-3 border-t border-gray-100 bg-gradient-to-t from-white via-white to-white/70 px-5 pb-6 pt-3">
              <button
                onClick={handleNext}
                className="w-full rounded-full bg-[#0AAC5F] py-4 text-sm font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-[#099B56]"
              >
                {step === 1 ? "Continuar" : "Completar registro"}
              </button>
              {step === 2 && (
                <button
                  onClick={() => setStep(1)}
                  className="w-full rounded-full border border-[#0AAC5F]/30 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-[#0AAC5F] transition hover:bg-[#0AAC5F]/10"
                >
                  Volver al paso anterior
                </button>
              )}
            </div>
          </div>
        </div>

        <footer className="mt-6 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">
          MStar protege tu información
        </footer>
      </div>
    </div>
  )
}

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
}: {
  label: string
  name: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  type?: React.HTMLInputTypeAttribute
}) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-400">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-4 py-3 text-sm font-medium tracking-wide text-gray-700 focus:border-[#0AAC5F] focus:outline-none focus:ring-2 focus:ring-[#0AAC5F]/20"
      />
    </div>
  )
}

function PasswordField({
  label,
  name,
  value,
  onChange,
  show,
  onToggle,
}: {
  label: string
  name: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  show: boolean
  onToggle: () => void
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-400">
        <span>{label}</span>
        <button onClick={onToggle} className="text-[#0AAC5F]">{show ? "Ocultar" : "Mostrar"}</button>
      </div>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-4 py-3 pr-10 text-sm font-medium tracking-wide text-gray-700 focus:border-[#0AAC5F] focus:outline-none focus:ring-2 focus:ring-[#0AAC5F]/20"
        />
        <button
          onClick={onToggle}
          className="absolute inset-y-0 right-3 flex items-center text-[#0AAC5F] transition hover:text-[#0AAC5F]"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  )
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string
  name: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  options: Array<{ value: string; label: string }>
}) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-400">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-4 py-3 text-sm font-medium tracking-wide text-gray-700 focus:border-[#0AAC5F] focus:outline-none focus:ring-2 focus:ring-[#0AAC5F]/20"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
