/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Configurar el directorio raíz para Turbopack
  turbopack: {
    root: process.cwd(),
  },
}

export default nextConfig
