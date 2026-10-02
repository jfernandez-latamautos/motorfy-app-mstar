"use client"

import { useState } from "react"
import {
  Calculator,
  ChevronRight,
  CirclePlus,
  Search,
  SlidersHorizontal,
} from "lucide-react"

import { BottomNavigation } from "@/components/common/bottom-navigation"
import { StatusBar } from "@/components/common/status-bar"

interface CreditsScreenProps {
  onNavigate: (screen: string) => void
  userData: { businessName: string }
}

export default function CreditsScreen({ onNavigate, userData }: CreditsScreenProps) {
  const [activeTab, setActiveTab] = useState("incomplete")

  const credits = {
    process: [
      {
        id: 1,
        name: "MIGUEL ANGEL SALDAÑA CUATECONTZI",
        vehicle: "BMW 120I 2020",
        price: "$660,000.00",
        source: "FARRERA",
        status: "CRÉDITO AUTORIZADO",
        message: "¡Buenas noticias! el crédito ha sido autorizado. Es momento de continuar.",
        date: "18-06-2025",
      },
    ],
    incomplete: [
      {
        id: 1,
        name: "MIGUEL SALDAÑA CUATECONTZI",
        vehicle: "CADILLAC XT4 2020",
        price: "$100,000.00",
        source: "COPPEL",
        progress: 40,
        date: "07-10-2025",
      },
      {
        id: 2,
        name: "MIGUEL SALDAÑA CUATECONTZI",
        vehicle: "KIA RIO 2019",
        price: "$100,000.00",
        source: "MSTAR",
        progress: 50,
        date: "07-10-2025",
      },
      {
        id: 3,
        name: "MIGUEL SALDAÑA CUATECONTZI",
        vehicle: "KIA SEDONA 2020",
        price: "$100,000.00",
        source: "MSTAR",
        progress: 10,
        date: "02-10-2025",
      },
      {
        id: 4,
        name: "MIGUEL SALDAÑA CUATECONTZI",
        vehicle: "CHANGAN G10 2019",
        price: "$100,000.00",
        source: "MSTAR",
        progress: 20,
        date: "29-09-2025",
      },
      {
        id: 5,
        name: "YORDANIS TEST APPMSTAR",
        vehicle: "ASTON MARTIN 2020",
        price: "$100,000.00",
        source: "MSTAR",
        progress: 30,
        date: "26-09-2025",
      },
    ],
    won: [
      {
        id: 1,
        name: "MIGUEL ANGEL SALDAÑA CUATECONTZI",
        vehicle: "BMW 120I 2020",
        price: "$660,000.00",
        source: "FARRERA",
        status: "CRÉDITO AUTORIZADO",
        message: "¡Buenas noticias! el crédito ha sido autorizado. Es momento de continuar.",
        date: "18-06-2025",
      },
    ],
    lost: [
      {
        id: 1,
        name: "PRUEBA ANDROID IOS",
        vehicle: "CHEVROLET EQUINOX 2018",
        price: "$258,000.00",
        source: "MSTAR",
        status: "SOLICITUD CANCELADA",
        reason: "La solicitud ha sido cancelada por no cumplir los requisitos...",
        date: "7d",
      },
      {
        id: 2,
        name: "YORDANIS BRIDON DANGER",
        vehicle: "AUDI A1 2023",
        price: "$258,000.00",
        source: "MSTAR",
        status: "SOLICITUD CANCELADA",
        reason: "La solicitud ha sido cancelada por no cumplir los requisitos...",
        date: "25-10-2025",
      },
      {
        id: 3,
        name: "MIGUEL SALDAÑA CUATECONTZI",
        vehicle: "KIA RIO 2018",
        price: "$100,000.00",
        source: "COPPEL",
        status: "SOLICITUD CANCELADA",
        reason: "La solicitud ha sido cancelada por no cumplir los requisitos...",
        date: "10-10-2025",
      },
      {
        id: 4,
        name: "MIGUEL SALDAÑA CUATECONTZI",
        vehicle: "CHRYSLER RAM 2500 2020",
        price: "$100,000.00",
        source: "COPPEL",
        status: "SOLICITUD CANCELADA",
        reason: "La solicitud ha sido cancelada por no cumplir los requisitos...",
        date: "10-10-2025",
      },
    ],
  }

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-white">
      <StatusBar />

      {/* Header */}
      <div className="border-b px-5 pb-4">
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <button className="rounded-full bg-gray-100 p-2 text-gray-500">
              <Search size={18} strokeWidth={2.1} />
            </button>
            <button className="rounded-full bg-gray-100 p-2 text-gray-500">
              <SlidersHorizontal size={18} strokeWidth={2.1} />
            </button>
          </div>
          <h1 className="text-[13px] font-semibold uppercase tracking-[0.28em] text-gray-600">
            SOLICITUDES DE CRÉDITO
          </h1>
          <button className="rounded-full bg-[#0AAC5F] p-2 text-white transition hover:bg-[#099B56]">
            <CirclePlus size={20} strokeWidth={2.1} />
          </button>
        </div>

        {/* Business name */}
        <div className="mt-5">
          <h2 className="text-[23px] font-semibold uppercase tracking-[0.08em] text-gray-900">{userData.businessName}</h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b px-4">
        {[
          { id: "process", label: "EN PROCESO" },
          { id: "incomplete", label: "INCOMPLETAS" },
          { id: "won", label: "GANADAS" },
          { id: "lost", label: "PERDIDAS" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative py-3 px-3 text-[11px] font-semibold tracking-[0.18em] whitespace-nowrap ${
              activeTab === tab.id ? "text-[#0AAC5F]" : "text-gray-400"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[#0AAC5F]" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-32 pt-5">
        {activeTab === "incomplete" && (
          <div className="space-y-4">
            {credits.incomplete.map((credit) => (
              <div
                key={credit.id}
                className="space-y-3 border-b border-gray-200 pb-4"
                onClick={() => onNavigate("calculator")}
              >
                <div>
                  <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-gray-900">
                    {credit.name}
                  </h3>
                  <p className="mt-1 text-[12px] font-semibold uppercase tracking-[0.06em] text-gray-700">
                    {credit.vehicle} · <span className="font-normal">{credit.price}</span>
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-gray-400">{credit.source}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-semibold text-[#0AAC5F]">{credit.progress}%</span>
                  <div className="relative h-2 flex-1 rounded-full bg-[#e5e5ea]">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#0AAC5F] to-[#3BBD7F]"
                      style={{ width: `${credit.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-400">
                    <span>{credit.date}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-gray-300" strokeWidth={2.4} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "won" && (
          <div className="space-y-4">
            {credits.won.length > 0 ? (
              credits.won.map((credit) => (
                <div key={credit.id} className="space-y-3 border-b border-gray-200 pb-4">
                  <div>
                    <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-gray-900">
                      {credit.name}
                    </h3>
                    <p className="mt-1 text-[12px] font-semibold uppercase tracking-[0.06em] text-gray-700">
                      {credit.vehicle} · <span className="font-normal">{credit.price}</span>
                    </p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-gray-400">{credit.source}</p>
                  </div>
                  <p className="text-[12px] leading-relaxed text-gray-600">{credit.message}</p>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center rounded-full border border-gray-300 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-700">
                      {credit.status}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-400">
                      <span>{credit.date}</span>
                      <ChevronRight className="h-3.5 w-3.5 text-gray-300" strokeWidth={2.4} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm mb-6">
                  No tienes solicitudes de crédito ganadas, inicia una nueva solicitud.
                </p>
                <div className="flex justify-center mb-8">
                  <div className="w-20 h-20 border-2 border-gray-300 rounded-full flex items-center justify-center text-gray-400 text-2xl">
                    $
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "lost" && (
          <div className="space-y-4">
            {credits.lost.length > 0 ? (
              credits.lost.map((credit) => (
                <div key={credit.id} className="space-y-3 border-b border-gray-200 pb-4">
                  <div>
                    <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-gray-900">
                      {credit.name}
                    </h3>
                    <p className="mt-1 text-[12px] font-semibold uppercase tracking-[0.06em] text-gray-700">
                      {credit.vehicle} · <span className="font-normal">{credit.price}</span>
                    </p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-gray-400">{credit.source}</p>
                  </div>
                  <p className="text-[12px] leading-relaxed text-gray-600">{credit.reason}</p>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center rounded-full border border-gray-300 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-700">
                      {credit.status}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-400">
                      <span>{credit.date}</span>
                      <ChevronRight className="h-3.5 w-3.5 text-gray-300" strokeWidth={2.4} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm">No tienes solicitudes canceladas</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "process" && (
          <div className="space-y-4">
            {credits.process.length > 0 ? (
              credits.process.map((credit) => (
                <div key={credit.id} className="space-y-3 border-b border-gray-200 pb-4">
                  <div>
                    <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-gray-900">
                      {credit.name}
                    </h3>
                    <p className="mt-1 text-[12px] font-semibold uppercase tracking-[0.06em] text-gray-700">
                      {credit.vehicle} · <span className="font-normal">{credit.price}</span>
                    </p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-gray-400">{credit.source}</p>
                  </div>
                  <p className="text-[12px] leading-relaxed text-gray-600">{credit.message}</p>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center rounded-full border border-gray-300 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-700">
                      {credit.status}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-400">
                      <span>{credit.date}</span>
                      <ChevronRight className="h-3.5 w-3.5 text-gray-300" strokeWidth={2.4} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-sm text-gray-500">No hay solicitudes en proceso</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating calculator button */}
      <button
        onClick={() => onNavigate("calculator")}
        className="absolute bottom-24 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#0AAC5F] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#099B56]"
      >
        <Calculator size={18} strokeWidth={2.2} />
        CALCULADORA
      </button>

      {/* Bottom Navigation */}
      <BottomNavigation active="credits" onNavigate={onNavigate} />
    </div>
  )
}
