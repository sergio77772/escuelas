# 🎓 GesEscolar - Gestión Escolar Integral

Una plataforma completa de gestión escolar construida con **Next.js 16**, **Supabase**, **TypeScript** y **Tailwind CSS**. 

Diseñada para digitalizar la gestión académica y administrativa de instituciones educativas con acceso seguro para directivos, docentes, padres y alumnos.

---

## ✨ Características

### Modelo A (Completo) - $200.000/mes
- ✅ Legajos digitales de alumnos
- ✅ Gestión de notas y materias
- ✅ Control de asistencias
- ✅ **Portal web para padres y alumnos**
- ✅ **Notificaciones por email**
- ✅ **Comunicados institucionales**
- ✅ Reportes y boletines en PDF
- ✅ Gestión de usuarios por rol

### Modelo B (Institucional) - $180.000/mes
- ✅ Todas las funcionalidades administrativas internas
- ❌ Sin acceso de padres
- ❌ Sin notificaciones por email
- ❌ Sin comunicados institucionales

---

## 🚀 Stack Tecnológico

| Componente | Tecnología |
|-----------|-----------|
| **Frontend** | Next.js 16 + React |
| **Backend** | Supabase + PostgreSQL |
| **Estado Global** | Zustand |
| **Estilos** | Tailwind CSS |
| **Autenticación** | Supabase Auth |
| **Base de Datos** | PostgreSQL (Supabase) |
| **Hosting** | Vercel |
| **Emails** | Resend |

---

## 📋 Requisitos Previos

- Node.js 18.17+
- npm o yarn
- Cuenta en Supabase
- Cuenta en Vercel (para deployment)
- Cuenta en Resend (para emails en Modelo A)

---

## 🛠️ Instalación Local

### 1. Clonar o descargar el proyecto

```bash
cd gestion-escolar
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
RESEND_API_KEY=re_xxxxx (opcional, solo para Modelo A)
```

### 4. Preparar base de datos en Supabase

1. Ve a tu proyecto en Supabase
2. SQL Editor → Crear nueva query
3. Copia el contenido de `supabase_schema.sql` y ejecuta
4. Espera a que se creen todas las tablas

### 5. Crear usuario de prueba

Ejecuta este SQL en Supabase:

```sql
-- 1. Crear usuario en auth
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES (
  'director@demo.com',
  crypt('demo123', gen_salt('bf')),
  now()
);

-- 2. Obtener el ID del usuario
SELECT id FROM auth.users WHERE email = 'director@demo.com';

-- 3. Crear establecimiento
INSERT INTO establishments (name, email, plan, subscription_status)
VALUES (
  'Colegio Demo',
  'director@demo.com',
  'modelo_a',
  'active'
) RETURNING id;

-- 4. Crear usuario en tabla users (reemplaza los IDs)
INSERT INTO users (establishment_id, email, full_name, role, auth_id, status)
VALUES (
  'ESTABLISHMENT_ID_AQUI',
  'director@demo.com',
  'Director Demo',
  'director',
  'AUTH_ID_AQUI',
  'active'
);
```

### 6. Ejecutar localmente

```bash
npm run dev
```

Abre http://localhost:3000/login

**Credenciales de demo:**
- Email: `director@demo.com`
- Password: `demo123`

---

## 📁 Estructura del Proyecto

```
gestion-escolar/
├── app/
│   ├── (auth)/               # Rutas públicas (login, signup)
│   ├── (dashboard)/          # Rutas protegidas (dashboard)
│   ├── layout.tsx            # Layout raíz
│   └── globals.css           # Estilos globales
├── components/layout/        # Componentes de layout
├── lib/
│   ├── services/             # Servicios de Supabase
│   ├── store/                # Store Zustand
│   ├── supabase/             # Clientes Supabase
│   └── types/                # Tipos TypeScript
└── public/                   # Assets estáticos
```

---

## 🚀 Deployment en Vercel

### Paso 1: Preparar GitHub

```bash
git init
git add .
git commit -m "Initial commit: GesEscolar"
git branch -M main
git remote add origin https://github.com/tu-usuario/gestion-escolar.git
git push -u origin main
```

### Paso 2: Conectar a Vercel

1. Ve a https://vercel.com/dashboard
2. Click en "Add New..." → "Project"
3. Selecciona tu repositorio de GitHub
4. Configura variables de entorno

### Paso 3: Deploy

Vercel desplegará automáticamente en cada push a `main`.

---

## 🔐 Seguridad

- ✅ Autenticación con Supabase Auth
- ✅ Row Level Security (RLS)
- ✅ Cifrado de datos sensibles
- ✅ Validación de roles
- ✅ Bitácora de accesos

---

## 📞 Soporte

- 📖 [Documentación Supabase](https://supabase.com/docs)
- 📖 [Documentación Next.js](https://nextjs.org/docs)
- 📖 [Documentación Vercel](https://vercel.com/docs)

---

**Hecho con ❤️ usando Next.js, Supabase y Vercel**
