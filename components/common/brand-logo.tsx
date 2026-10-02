"use client"

import Image from "next/image"

type BrandLogoProps = {
  width?: number
  height?: number
  className?: string
  variant?: "white" | "dark"
  priority?: boolean
}

export function BrandLogo({
  width = 160,
  height = 52,
  className,
  variant = "white",
  priority = false,
}: BrandLogoProps) {
  const src = variant === "white" ? "/mstar-logo-white.svg" : "/mstar-logo-dark.svg"

  return (
    <Image
      src={src}
      alt="MStar"
      width={width}
      height={height}
      priority={priority}
      className={className}
    />
  )
}
