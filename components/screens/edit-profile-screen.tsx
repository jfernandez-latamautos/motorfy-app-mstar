"use client"

import type React from "react"

import { useState } from "react"

import { ChevronLeft } from "lucide-react"

import { StatusBar } from "@/components/common/status-bar"

type EditProfileScreenProps = {
  onNavigate: (screen: string) => void
  initialData: {
    name: string
    email: string
    phone?: string
  }
  onSave: (data: { name: string; email: string; phone: string }) => void
}

export default function EditProfileScreen({ onNavigate, initialData, onSave }: EditProfileScreenProps) {
  const firstName =
    initialData.name && initialData.name.trim().length > 0
      ? initialData.name.split(" ")[0]
      : "Jorge Alberto"
  const lastName =
    initialData.name && initialData.name.trim().length > 0
      ? initialData.name.split(" ").slice(1).join(" ") || "Fernández Morales"
      : "Fernández Morales"

  const [formData, setFormData] = useState({
    email: initialData.email || "jfernandez@latamautos.com",
    name: firstName,
    lastName,
    phone: initialData.phone || "5544751581",
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    onSave({
      name: `${formData.name} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
    })
    onNavigate("profile")
  }

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
          className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0AAC5F]"
        >
          Guardar
        </button>
      </div>

      <div className="px-6 pb-6">
        <h1 className="pt-2 text-2xl font-semibold text-gray-900">Editar perfil</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-10">
        <FormGroup label="Correo electrónico">
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border-b-2 border-gray-200 pb-3 text-sm font-medium tracking-wide text-gray-700 focus:border-[#0AAC5F] focus:outline-none"
          />
        </FormGroup>

        <FormGroup label="Nombres *">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border-b-2 border-gray-200 pb-3 text-sm font-medium tracking-wide text-gray-700 focus:border-[#0AAC5F] focus:outline-none"
          />
        </FormGroup>

        <FormGroup label="Apellidos *">
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full border-b-2 border-gray-200 pb-3 text-sm font-medium tracking-wide text-gray-700 focus:border-[#0AAC5F] focus:outline-none"
          />
        </FormGroup>

        <FormGroup label="Teléfono celular *">
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border-b-2 border-gray-200 pb-3 text-sm font-medium tracking-wide text-gray-700 focus:border-[#0AAC5F] focus:outline-none"
          />
        </FormGroup>
      </div>
    </div>
  )
}

function FormGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-7">
      <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-400">
        {label}
      </label>
      {children}
    </div>
  )
}

