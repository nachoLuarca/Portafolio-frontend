# Portfolio Frontend

SPA de un portafolio profesional: sitio público (perfil, experiencia, proyectos, educación, certificaciones y contacto) y panel de administración para gestionar todo el contenido.

Consume la API de [Portafolio-backend](https://github.com/nachoLuarca/Portafolio-backend).

## Stack

- React 18 + Vite
- React Router
- Tailwind CSS 4 + shadcn/ui (Radix UI)
- Framer Motion
- Axios (con renovación automática del token JWT)

## Requisitos

- Node.js 20+
- El backend corriendo (por defecto en `http://localhost:4000`)

## Configuración

```bash
cp .env.example .env   # ajustar VITE_API_URL si el backend no corre en localhost:4000
npm install
```

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `VITE_API_URL` | URL base de la API | `http://localhost:4000/api` |

## Uso

```bash
npm run dev       # servidor de desarrollo en http://localhost:5173
npm run build     # build de producción en dist/
npm run preview   # sirve el build localmente
```

## Rutas

**Públicas**

| Ruta | Descripción |
|---|---|
| `/` | Inicio: perfil, experiencia, proyectos, educación, certificaciones y contacto |
| `/proyectos` | Listado de proyectos |
| `/proyectos/:slug` | Detalle de un proyecto |

**Admin** (requieren login en `/admin/login`)

| Ruta | Descripción |
|---|---|
| `/admin` | Proyectos |
| `/admin/experiencia` | Experiencia laboral |
| `/admin/educacion` | Educación |
| `/admin/certificaciones` | Certificaciones |
| `/admin/mensajes` | Mensajes de contacto |
| `/admin/perfil` | Perfil público |

## Estructura

```
src/
├── api/          Cliente Axios y manejo de tokens
├── components/   Componentes reutilizables (ui/ = componentes de shadcn)
├── context/      AuthContext (sesión del admin)
├── hooks/        Hooks personalizados
├── lib/          Utilidades y presets de animación
└── pages/        Una página por ruta
```

## Docker

El `Dockerfile` compila la app con Node y la sirve con nginx:

```bash
docker build --build-arg VITE_API_URL=https://mi-api.com/api -t portfolio-frontend .
docker run -p 8080:80 portfolio-frontend
```

También se puede levantar desde la raíz del proyecto con `docker compose up -d`.
