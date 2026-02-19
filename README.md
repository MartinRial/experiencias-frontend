# Experiencias UY – Frontend

Frontend de una **aplicación web full stack** para la gestión y reserva de experiencias turísticas y culturales en Uruguay, desarrollada con **React**.

La aplicación permite conectar **creadores de experiencias** con **usuarios finales**, ofreciendo flujos diferenciados según el rol, paneles de control específicos y visualización de información en tiempo real.

> Proyecto académico desarrollado en el marco del curso **Desarrollo Full Stack** (2025).  
> Este repositorio corresponde a la **versión frontend del sistema**, utilizada con fines de presentación profesional y portfolio.

---

## 📖 Descripción

**Experiencias UY** es una plataforma web que permite:

- A **usuarios** explorar experiencias disponibles, realizar reservas y consultar su historial.
- A **creadores** publicar, administrar y analizar el desempeño de sus experiencias mediante un dashboard dedicado.

El frontend consume una **API REST desarrollada en Node.js**, manteniendo una separación clara de responsabilidades entre interfaz, estado global y lógica de comunicación con el backend.

---

## 🌐 Demo y Backend

- 🔗 **Demo en vivo (Frontend):** https://frontendexp2.vercel.app  
- 🔗 **API Backend:** https://experiencias-uy.vercel.app/api/v1  

Repositorio del backend:
> https://github.com/MartinRial/experiencias-uy-backend *(ajustar si el nombre difiere)*

---

## ✨ Funcionalidades

### 👤 Autenticación y Autorización
- Registro e inicio de sesión con roles diferenciados (`user` / `creator`)
- Rutas protegidas con redirección automática según rol
- Manejo de sesión desde estado global
- Validación de formularios con **Formik + Yup**
- Internacionalización de mensajes con **i18next** (ES)

---

### 🎯 Funcionalidades para Usuarios
- Exploración del catálogo de experiencias disponibles
- Reserva de experiencias indicando cantidad de participantes
- Visualización del historial de reservas personales
- Estadísticas rápidas:
  - total de experiencias disponibles
  - experiencias con cupos activos

---

### 🛠️ Funcionalidades para Creadores (Dashboard)
- Publicación de nuevas experiencias (imágenes, precio, categoría, ubicación)
- Edición y eliminación de experiencias propias
- **Mapa interactivo** con geolocalización de experiencias (Leaflet)
- **Gráficos estadísticos**:
  - distribución de experiencias por categoría
  - ingresos estimados por período
- Filtrado de experiencias por rango de fechas
- Panel de **upgrade de plan** para desbloqueo de funcionalidades premium
- Reporte de uso del plan activo

---

### 🗺️ Mapa de Experiencias
- Visualización geográfica de experiencias en un mapa de Uruguay
- Marcadores con información contextual (categoría, precio)

---

## 🏗️ Arquitectura y Stack Tecnológico

| Categoría | Tecnología |
|---|---|
| Framework UI | React 19 + Vite 5 |
| Estilos | CSS Modules · Bootstrap 5 · Tailwind CSS · MUI |
| Estado global | Redux Toolkit 2 + React-Redux 9 |
| Routing | React Router DOM 7 |
| Formularios | Formik 2 + Yup |
| Cliente HTTP | Axios |
| Mapas | React Leaflet 5 |
| Gráficos | Chart.js 4 · react-chartjs-2 · Recharts 3 |
| Internacionalización | i18next · react-i18next |
| Notificaciones | React Toastify |
| Testing | Jest · Testing Library · JSDOM |
| Linting | ESLint 9 |
| Deploy | Vercel |

---

## 📁 Estructura del Proyecto

src/
├── assets/ # Recursos estáticos
├── components/ # Componentes de la UI
├── config/
│ └── api.js # Configuración de la URL base de la API
├── constants/ # Constantes globales
├── redux/
│ ├── store.js # Configuración del store
│ └── features/ # Slices y thunks por dominio
│ ├── user/
│ ├── experiences/
│ ├── bookings/
│ └── categories/
├── routes/ # Definición de rutas y protección por rol
├── schemas/ # Validaciones (Yup)
├── services/ # Comunicación con la API
├── styles/ # Estilos por componente
├── utils/ # Utilidades y datos auxiliares
└── i18n.js # Configuración de internacionalización

---

## 🔐 Rutas de la Aplicación

| Ruta | Acceso | Rol |
|---|---|---|
| `/login` | Público | — |
| `/register` | Público | — |
| `/home` | Privado | user |
| `/mis-reservas` | Privado | user |
| `/dashboard` | Privado | creator |
| `/` | Redirección automática | según rol |

---

## ⚙️ Instalación y Uso Local

### Prerrequisitos
- Node.js >= 18
- npm >= 9

### Pasos

```bash
# Clonar el repositorio
git clone https://github.com/MartinRial/experiencias-uy-frontend.git
cd experiencias-uy-frontend

# Instalar dependencias
npm install

# Iniciar el entorno de desarrollo
npm run dev
