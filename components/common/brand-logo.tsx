"use client"

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
}: BrandLogoProps) {
  const src = variant === "white" ? "/mstar-logo-white.svg" : "/mstar-logo-dark.svg"

  return (
    <img
      src={src}
      alt="MStar"
      width={width}
      height={height}
      className={className}
      style={{ width, height }}
    />
  )
}
