"use client"

import type { ComponentType } from "react"

import { Bell, Car, CircleDollarSign, Home } from "lucide-react"

import { cn } from "@/lib/utils"

type TabId = "dashboard" | "credits" | "visits" | "notices"

type BottomNavigationProps = {
  active: TabId
  onNavigate: (screen: string) => void
  disableHighlight?: boolean
}

const tabs: Array<{ id: TabId; label: string; icon: ComponentType<{ className?: string }> }> = [
  {
    id: "dashboard",
    label: "INICIO",
    icon: Home,
  },
  {
    id: "credits",
    label: "CRÉDITOS",
    icon: CircleDollarSign,
  },
  {
    id: "visits",
    label: "VISITAS",
    icon: Car,
  },
  {
    id: "notices",
    label: "AVISOS",
    icon: Bell,
  },
]

export function BottomNavigation({ active, onNavigate, disableHighlight = false }: BottomNavigationProps) {
  return (
    <nav className="flex items-center justify-around border-t bg-white px-4 py-2">
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = !disableHighlight && active === id
        return (
          <button
            key={id}
            onClick={() => {
              if (id === "dashboard") onNavigate("dashboard")
              if (id === "credits") onNavigate("credits")
              if (id === "notices") onNavigate("profile")
            }}
            className={cn(
              "flex flex-col items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold transition-colors",
              isActive ? "text-[#0AAC5F]" : "text-gray-400"
            )}
          >
            <Icon className={cn("h-5 w-5", isActive ? "text-[#0AAC5F]" : "text-gray-400")} strokeWidth={2.2} />
            <span>{label}</span>
            {isActive && <span className="h-0.5 w-6 rounded-full bg-[#0AAC5F]" />}
          </button>
        )
      })}
    </nav>
  )
}

export default BottomNavigation

