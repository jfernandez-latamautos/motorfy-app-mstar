"use client"

import { useState } from "react"

import { ChevronLeft, Headset, Lock, LogOut, PhoneCall, ShieldCheck } from "lucide-react"

import { BottomNavigation } from "@/components/common/bottom-navigation"
import { StatusBar } from "@/components/common/status-bar"

interface ProfileScreenProps {
  onNavigate: (screen: string) => void
  userData: { name: string; email: string; businessName: string; phone?: string }
}

export default function ProfileScreen({ onNavigate, userData }: ProfileScreenProps) {
  const [showCallDialog, setShowCallDialog] = useState(false)
  const displayName =
    userData.name?.length > 0 ? userData.name.toUpperCase() : "JORGE ALBERTO FERNÁNDEZ MORALES"
  const displayEmail = userData.email || "jfernandez@latamautos.com"
  const displayPhone = userData.phone || "5544751581"
  const businessInitials =
    userData.businessName && userData.businessName.trim().length > 0
      ? userData.businessName
          .split(" ")
          .map((word) => word[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "MF"

  const menuItems = [
    {
      label: "Llamar a asesor MStar",
      icon: PhoneCall,
      action: () => setShowCallDialog(true),
    },
    {
      label: "Cambiar contraseña",
      icon: Lock,
      action: () => onNavigate("change-password"),
    },
    {
      label: "Términos y condiciones",
      icon: Headset,
      action: () => onNavigate("terms"),
    },
    {
      label: "Cerrar sesión",
      icon: LogOut,
      action: () => onNavigate("login"),
    },
  ]

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-white">
      <StatusBar />

      <div className="flex items-center justify-between px-6 pt-6">
        <button
          onClick={() => onNavigate("dashboard")}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500"
        >
          <ChevronLeft size={20} strokeWidth={2.4} />
        </button>
        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">PERFIL</span>
        <div className="h-10 w-10" />
      </div>

      {/* Profile info */}
      <div className="border-b px-6 pb-8 pt-6">
        <div className="flex items-start gap-4">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0AAC5F] to-[#2CBBCE] text-white text-2xl font-semibold">
            <span>{businessInitials}</span>
            <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#0AAC5F]">
              <ShieldCheck className="h-4 w-4" strokeWidth={2.4} />
            </span>
          </div>
          <div className="flex-1">
            <p className="text-[22px] font-semibold uppercase tracking-[0.1em] text-gray-900 leading-tight">
              {userData.businessName}
            </p>
            <button
              onClick={() => onNavigate("account-selection")}
              className="mt-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#0AAC5F]"
            >
              CAMBIAR CUENTA
            </button>
            <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.24em] text-gray-500">
              {displayName}
            </p>
            <div className="mt-3 space-y-2 text-sm text-gray-600">
              <p>{displayEmail}</p>
              <p>{displayPhone}</p>
            </div>
            <button
              onClick={() => onNavigate("edit-profile")}
              className="mt-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#0AAC5F]"
            >
              Editar perfil
            </button>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div className="flex-1 divide-y">
        {menuItems.map(({ label, icon: Icon, action }) => (
          <button
            key={label}
            onClick={action}
            className="flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                <Icon className="h-5 w-5" strokeWidth={2.2} />
              </div>
              <span className="text-[13px] font-semibold text-gray-700">{label}</span>
            </div>
            <span className="text-gray-300">›</span>
          </button>
        ))}
      </div>

      {/* Call dialog */}
      {showCallDialog && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 px-8">
          <div className="w-full max-w-xs rounded-3xl bg-black/70 px-5 py-6 text-center text-white">
            <p className="text-sm font-semibold tracking-wide">Llamar al 55 9720 8600</p>
            <div className="mt-6 space-y-3">
              <button
                onClick={() => setShowCallDialog(false)}
                className="w-full rounded-full bg-[#0AAC5F] py-3 text-sm font-semibold uppercase tracking-[0.18em]"
              >
                Llamar
              </button>
              <button
                onClick={() => setShowCallDialog(false)}
                className="w-full rounded-full bg-black/30 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/80"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation active="dashboard" onNavigate={onNavigate} disableHighlight />
    </div>
  )
}
