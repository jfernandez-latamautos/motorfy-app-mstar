"use client"

import type React from "react"

import { Check, ChevronDown } from "lucide-react"
import { useState } from "react"

import { StatusBar } from "@/components/common/status-bar"

interface CalculatorScreenProps {
  onNavigate: (screen: string) => void
}

export default function CalculatorScreen({ onNavigate }: CalculatorScreenProps) {
  const [formData, setFormData] = useState({
    vehicle: "",
    price: "",
    downPayment: "",
    postalCode: "",
    insurance: true,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    })
  }

  const handleCalculate = () => {
    console.log("Calculating with:", formData)
  }

  const handleShare = () => {
    console.log("Sharing quote:", formData)
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white">
      <StatusBar />

      {/* Header */}
      <div className="sticky top-0 flex items-center justify-between border-b px-5 pb-3 pt-4">
        <h1 className="text-base font-semibold uppercase tracking-[0.24em] text-gray-600">Calcula tus cuotas</h1>
        <button
          onClick={() => onNavigate("credits")}
          className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0AAC5F]"
        >
          Cerrar
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-5 pb-12 pt-8">
        {/* Vehicle data */}
        <div className="mb-8">
          <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-400">
            DATOS DEL VEHÍCULO *
          </label>
          <div className="relative">
            <select
              name="vehicle"
              value={formData.vehicle}
              onChange={handleInputChange}
              className="w-full appearance-none border-b-2 border-gray-200 pb-3 text-sm font-medium tracking-wide text-gray-700 focus:border-[#0AAC5F] focus:outline-none"
            >
              <option value="">Selecciona un vehículo</option>
              <option value="bmw">BMW 120I 2020</option>
              <option value="cadillac">CADILLAC XT4 2020</option>
              <option value="kia-rio">KIA RIO 2019</option>
            </select>
            <ChevronDown className="pointer-events-none absolute bottom-3 right-0 text-gray-400" size={18} />
          </div>
        </div>

        {/* Price and Down Payment */}
        <div className="mb-8 grid grid-cols-2 gap-6">
          <div>
            <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-400">
              PRECIO *
            </label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="$0.00"
              className="w-full border-b-2 border-gray-200 pb-3 text-sm font-medium tracking-wide text-gray-700 focus:border-[#0AAC5F] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-400">
              ENGANCHE *
            </label>
            <input
              type="text"
              name="downPayment"
              value={formData.downPayment}
              onChange={handleInputChange}
              placeholder="$0.00"
              className="w-full border-b-2 border-gray-200 pb-3 text-sm font-medium tracking-wide text-gray-700 focus:border-[#0AAC5F] focus:outline-none"
            />
          </div>
        </div>

        {/* Postal Code */}
        <div className="mb-10">
          <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-400">
            CÓDIGO POSTAL *
          </label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange}
            className="w-full border-b-2 border-gray-200 pb-3 text-sm font-medium tracking-wide text-gray-700 focus:border-[#0AAC5F] focus:outline-none"
          />
        </div>

        {/* Insurance checkbox */}
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 px-4 py-4">
          <div
            className={`w-6 h-6 rounded flex items-center justify-center ${
              formData.insurance ? "bg-[#0AAC5F]" : "border-2 border-gray-300 bg-white"
            }`}
          >
            {formData.insurance && <Check size={14} className="text-white" strokeWidth={3} />}
          </div>
          <span className="flex-1 text-sm font-medium text-gray-700">
            Incluir seguro vehicular en el crédito
          </span>
          <input
            type="checkbox"
            name="insurance"
            checked={formData.insurance}
            onChange={handleInputChange}
            className="hidden"
          />
        </label>
      </div>

      {/* Buttons */}
      <div className="space-y-3 border-t px-5 py-6">
        <button
          onClick={handleCalculate}
          className="w-full rounded-full bg-[#0AAC5F] py-4 text-sm font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-[#099B56]"
        >
          INICIAR SOLICITUD
        </button>
        <button
          onClick={handleShare}
          className="w-full rounded-full border-2 border-[#0AAC5F] py-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#0AAC5F]"
        >
          COMPARTIR COTIZACIÓN
        </button>
      </div>
    </div>
  )
}
