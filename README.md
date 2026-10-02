# Motorfy App (Prototipo)

Este repositorio contiene un prototipo funcional que replica la experiencia de la aplicación móvil de **Motorfy** dentro de un entorno web usando **Next.js 16** y **Tailwind CSS 4**. El objetivo es simular las pantallas principales (splash, onboarding, login, registro, dashboard, créditos, calculadora y perfil) dentro de un “marco” estilo iPhone para facilitar las demostraciones.

## Contenido principal

- `app/`: Entrypoints de Next.js y definición global de estilos (`globals.css`).
- `components/common/`: Elementos reutilizables como la barra de estado y la navegación inferior.
- `components/screens/`: Cada pantalla del prototipo (splash, onboarding, login, etc.).
- `public/`: Recursos estáticos (logos oficiales de Motorfy, favicon, íconos).
- `styles/`: Configuración adicional de estilos si se requiere extender Tailwind.

## Requisitos

- Node.js 20+
- pnpm (recomendado) o npm/yarn

## Instalación

```bash
pnpm install
```

> Si prefieres npm o yarn, sustituye los comandos equivalentes (`npm install`, `yarn install`).

## Ejecución en desarrollo

```bash
pnpm dev
```

Luego abre [http://localhost:3000](http://localhost:3000) en tu navegador. Verás el prototipo centrado dentro de un marco que simula un dispositivo iOS.

## Construcción para producción

```bash
pnpm build
pnpm start
```

## Personalización rápida

- **Logos:** Se encuentran en `public/` (`logo-motorfy-clear.svg`, `motorfy-logo.svg`, etc.). Puedes sustituirlos conservando el mismo nombre de archivo.
- **Contenido:** Ajusta los textos o datos demo en cada archivo dentro de `components/screens/`.
- **Colores y tipografía:** Se controlan principalmente desde `app/globals.css` y utilidades Tailwind.

## Notas

- Este proyecto está pensado para demostraciones internas o pruebas de UX, no como aplicación productiva.
- No hay integración real a servicios ni backend; toda la información es estática o simulada.
- Las pantallas se navegan mediante estado local (`app/page.tsx`), lo que facilita añadir nuevas vistas si es necesario.

## Licencia

Uso interno. Adapta según tus necesidades.

