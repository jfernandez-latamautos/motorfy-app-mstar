"use client"

import { BatteryFull, SignalHigh, Wifi } from "lucide-react"

import { cn } from "@/lib/utils"

type StatusBarProps = {
  time?: string
  tone?: "light" | "dark"
}

export function StatusBar({ time = "4:09", tone = "dark" }: StatusBarProps) {
  const isLight = tone === "light"

  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-2 text-[11px] font-semibold tracking-tight",
        isLight ? "text-white/90" : "text-gray-900"
      )}
    >
      <span>{time}</span>
      <div className="flex items-center gap-3">
        <SignalHigh className={cn("h-4 w-4", isLight ? "text-white/90" : "text-gray-900")} strokeWidth={2.2} />
        <Wifi className={cn("h-4 w-4", isLight ? "text-white/90" : "text-gray-900")} strokeWidth={2.2} />
        <div className="flex items-center gap-1">
          <BatteryFull className={cn("h-4 w-4", isLight ? "text-white/90" : "text-gray-900")} strokeWidth={2.2} />
          <span className="text-[10px] font-semibold">51%</span>
        </div>
      </div>
    </div>
  )
}

export default StatusBar

