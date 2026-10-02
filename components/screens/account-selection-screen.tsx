"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

import { StatusBar } from "@/components/common/status-bar"

// Estructura de cuentas con IDs
const accounts = [
  { name: "ADK SEMINUEVOS PROFESIONALES", id: 1001 },
  { name: "AUTO SHOP CUERNAVACA", id: 1002 },
  { name: "AUTOCONSIGNACIONES GARCIAS", id: 1003 },
  { name: "AUTOS COLON", id: 1004 },
  { name: "AUTOS GEZZA", id: 1005 },
  { name: "AUTOS GP", id: 1006 },
  { name: "AUTOS SAN ISIDRO", id: 1007 },
  { name: "BMW CANCÚN(FARRERA)", id: 1008 },
  { name: "CALL CENTER ATM", id: 1009 },
  { name: "CENTRO AUTOMOVILISTICO MUÑOZ S.A DE C.V", id: 1010 },
  { name: "AUTOS DEL NORTE", id: 1011 },
  { name: "AUTOS Y MOTOS", id: 1012 },
  { name: "CONCESIONARIA DEL SUR", id: 1013 },
  { name: "MOTOR CENTER", id: 1014 },
  { name: "AUTOS PREMIUM", id: 1015 },
  { name: "SEMINUEVOS EXPRESS", id: 1016 },
  { name: "AUTOS Y SERVICIOS", id: 1017 },
  { name: "CONCESIONARIA CENTRAL", id: 1018 },
]

// Colores para los avatares
const avatarColors = [
  "bg-orange-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-red-500",
  "bg-pink-500",
  "bg-yellow-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-cyan-500",
]

// Función para obtener las iniciales de una agencia
const getInitials = (name: string) => {
  const words = name.split(" ")
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

// Función para obtener el color del avatar basado en el índice
const getAvatarColor = (index: number) => {
  return avatarColors[index % avatarColors.length]
}

interface AccountSelectionScreenProps {
  onNavigate: (screen: string) => void
  onSelectAccount: (accountName: string) => void
  userData: { name: string; email: string; businessName: string; phone?: string }
}

export default function AccountSelectionScreen({
  onNavigate,
  onSelectAccount,
  userData,
}: AccountSelectionScreenProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Parsear el nombre del usuario del email o usar valores por defecto
  const getUserName = () => {
    if (userData.name && userData.name.trim().length > 0) {
      const nameParts = userData.name.split(" ")
      return {
        firstName: nameParts[0] || "Yordanis",
        lastName: nameParts.slice(1).join(" ") || "Bridón Danger",
      }
    }
    // Si no hay nombre, intentar extraer del email
    if (userData.email) {
      const emailPrefix = userData.email.split("@")[0]
      if (emailPrefix === "ybridon") {
        return {
          firstName: "Yordanis",
          lastName: "Bridón Danger",
        }
      }
      return {
        firstName: emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1),
        lastName: "Usuario",
      }
    }
    return {
      firstName: "Yordanis",
      lastName: "Bridón Danger",
    }
  }

  const { firstName, lastName } = getUserName()

  // Filtrar cuentas por ID o nombre
  const filteredAccounts = searchTerm
    ? accounts.filter(
        (account) =>
          account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          account.id.toString().includes(searchTerm)
      )
    : accounts

  const handleAccountSelect = (account: { name: string; id: number }) => {
    setSearchTerm(`${account.name} [${account.id}]`)
    onSelectAccount(account.name)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-gradient-to-br from-[#020617] via-[#020617] to-[#020617] text-white">
      <div className="absolute inset-0">
        <div className="absolute left-[-120px] top-[120px] h-56 w-56 rounded-full bg-[#0AAC5F]/20 blur-3xl" />
        <div className="absolute right-[-140px] top-[40%] h-64 w-64 rounded-full bg-[#2CBBCE]/15 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#020617] via-transparent" />
      </div>

      <StatusBar tone="light" />

      <div className="relative z-10 flex flex-1 flex-col overflow-hidden px-6 pb-6 pt-6">
        {/* Header centrado */}
        <header className="mb-4 flex-shrink-0 text-center">
          <h1 className="text-3xl font-bold text-white">Hola bienvenido</h1>
          <p className="mt-2 text-base font-medium text-white">
            {firstName} {lastName}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/80">
            Selecciona la cuenta o agencia con la que deseas trabajar hoy
          </p>
        </header>

        {/* Campo de búsqueda */}
        <div className="mb-4 flex-shrink-0">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Buscar por ID o nombre"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-[#0AAC5F] focus:outline-none focus:ring-2 focus:ring-[#0AAC5F]/20"
            />
            <div className="absolute inset-y-0 right-3 flex items-center text-gray-400">
              <ChevronDown size={20} strokeWidth={2.4} />
            </div>
          </div>
        </div>

        {/* Sección de sugerencias */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl bg-white px-6 py-6 text-gray-900 shadow-2xl shadow-[#0AAC5F]/20">
          <h2 className="mb-4 flex-shrink-0 text-base font-bold text-gray-900">Sugerencias:</h2>

          {/* Lista de agencias como tarjetas con scroll */}
          <div className="min-h-0 flex-1 overflow-y-auto pr-2">
            {filteredAccounts.length > 0 ? (
              <div className="space-y-3">
                {filteredAccounts.map((account, index) => {
                  const initials = getInitials(account.name)
                  const avatarColor = getAvatarColor(index)

                  return (
                    <button
                      key={index}
                      onClick={() => handleAccountSelect(account)}
                      className="flex w-full items-center gap-4 rounded-xl bg-white px-4 py-3 text-left shadow-sm transition hover:shadow-md active:scale-[0.98]"
                    >
                      <div
                        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${avatarColor} text-white text-sm font-bold`}
                      >
                        {initials}
                      </div>
                      <span className="flex-1 text-sm font-semibold text-gray-900">
                        {account.name} [{account.id}]
                      </span>
                    </button>
                  )
                })}
              </div>
            ) : searchTerm.trim().length > 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <svg
                    className="h-8 w-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">No se encontraron resultados</h3>
                <p className="max-w-sm text-sm leading-relaxed text-gray-600">
                  No encontramos ninguna agencia o cuenta que coincida con "{searchTerm}". Por favor, verifica que el nombre o ID sean correctos e intenta nuevamente.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {accounts.map((account, index) => {
                  const initials = getInitials(account.name)
                  const avatarColor = getAvatarColor(index)

                  return (
                    <button
                      key={index}
                      onClick={() => handleAccountSelect(account)}
                      className="flex w-full items-center gap-4 rounded-xl bg-white px-4 py-3 text-left shadow-sm transition hover:shadow-md active:scale-[0.98]"
                    >
                      <div
                        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${avatarColor} text-white text-sm font-bold`}
                      >
                        {initials}
                      </div>
                      <span className="flex-1 text-sm font-semibold text-gray-900">
                        {account.name} [{account.id}]
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-4 flex-shrink-0 text-center text-[10px] font-semibold uppercase tracking-[0.24em] text-white/60">
          © {new Date().getFullYear()} MStar
        </footer>
      </div>
    </div>
  )
}
