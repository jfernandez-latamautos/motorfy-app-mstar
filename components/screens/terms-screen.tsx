"use client"

import { ChevronLeft } from "lucide-react"

import { BrandLogo } from "@/components/common/brand-logo"
import { StatusBar } from "@/components/common/status-bar"

type TermsScreenProps = {
  onNavigate: (screen: string) => void
}

export default function TermsScreen({ onNavigate }: TermsScreenProps) {
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
        <div className="h-10 w-10" />
      </div>

      <div className="px-6 pb-4">
        <h1 className="text-3xl font-light text-gray-900">Términos y condiciones</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="space-y-6 text-sm leading-relaxed text-gray-600">
          <section>
            <h2 className="mb-3 text-sm font-semibold text-gray-900">1. Aceptación</h2>
            <p>
              En el presente documento (el “Contrato”) se establecen los términos y condiciones de MStar
              (“MStar”), con domicilio en Río Guadiana 31, Col. Renacimiento, Cuauhtémoc, C.P. 06500,
              Ciudad de México, CDMX, que serán de aplicación al acceso y uso por parte del usuario
              (“Usuario”) de esta aplicación.
            </p>
            <p className="mt-4">
              El ingreso a la aplicación y/o el acceso o utilización de los servicios constituyen su reconocimiento y aceptación
              irrevocable respecto de la aplicación de los presentes Términos y Condiciones.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-gray-900">2. Uso del servicio</h2>
            <p>
              El Usuario se compromete a utilizar los servicios de MStar de conformidad con la legislación aplicable, la buena
              fe, el orden público y los presentes Términos. Queda prohibido cualquier uso contrario a los derechos de terceros o
              que de cualquier forma dañe, inutilice o sobrecargue los servicios.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-gray-900">3. Responsabilidad</h2>
            <p>
              MStar realiza sus mejores esfuerzos para asegurar la disponibilidad continua de los servicios. No obstante, puede
              suspender temporalmente el acceso por labores de mantenimiento o causas ajenas sin que ello genere responsabilidad.
            </p>
          </section>
        </div>

        <div className="mt-10 flex flex-col items-center gap-2 pb-10 text-center text-[11px] uppercase tracking-[0.24em] text-gray-400">
          <BrandLogo variant="dark" width={120} height={39} />
          <span>Versión 1.0 · MStar · mstarfin.mx</span>
        </div>
      </div>
    </div>
  )
}

