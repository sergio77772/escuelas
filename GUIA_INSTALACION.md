# GesEscolar - Guía de Instalación y Deployment

## ✅ Lo que hemos completado (Parte 1)

### 1. **Configuración de Supabase**
   - ✅ Schema SQL con todas las tablas
   - ✅ Relaciones entre tablas
   - ✅ Índices para optimización
   - ✅ Row Level Security (RLS) preparado
   - ✅ Triggers para actualizaciones automáticas

### 2. **Proyecto Next.js**
   - ✅ Creado con TypeScript y Tailwind
   - ✅ Dependencias instaladas (Supabase, Zustand, etc.)

### 3. **Estructura del Código**
   - ✅ Cliente Supabase (navegador y servidor)
   - ✅ Store global con Zustand para autenticación
   - ✅ Tipos TypeScript completos
   - ✅ Servicios de API para CRUD (Supabase)
   - ✅ Componentes de layout (Sidebar, DashboardLayout)
   - ✅ Páginas principales (Login, Signup, Dashboard, Estudiantes)

---

## 🚀 Próximos Pasos

### PASO 1: Finalizar variables de entorno en Supabase

1. Ve a tu dashboard de Supabase
2. Copia tu **Project URL** y **Anon Public Key**
3. Actualiza `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### PASO 2: Crear datos de prueba (Demo)

Ejecuta este SQL en Supabase para crear un establecimiento de demo:

```sql
-- Crear establecimiento demo
INSERT INTO establishments (name, email, phone, address, plan, subscription_status)
VALUES (
  'Colegio Demo',
  'demo@colegio.com',
  '+54 3884 123456',
  'Av. Sirio 123',
  'modelo_a',
  'active'
) RETURNING id;

-- Copiar el ID devuelto y usarlo en el siguiente:

-- Crear usuario demo
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES (
  'director@demo.com',
  crypt('demo123', gen_salt('bf')),
  now()
);

-- Obtener el ID del usuario de auth
SELECT id FROM auth.users WHERE email = 'director@demo.com';

-- Crear usuario en tabla users (usar el auth_id del paso anterior)
INSERT INTO users (establishment_id, email, full_name, role, auth_id, status)
VALUES (
  'ESTABLISHMENT_ID_HERE',
  'director@demo.com',
  'Director Demo',
  'director',
  'AUTH_ID_HERE',
  'active'
);
```

### PASO 3: Probar localmente

```bash
cd /home/claude/gestion-escolar
npm run dev
```

Accede a: `http://localhost:3000/login`
- Email: `director@demo.com`
- Password: `demo123`

### PASO 4: Completar funcionalidades pendientes

Necesitamos agregar estas páginas (puedo crearlas si lo deseas):

#### Críticas:
- [ ] `/students/new` - Formulario para crear alumno
- [ ] `/students/[id]` - Detalle de alumno (legajo)
- [ ] `/students/[id]/edit` - Editar alumno
- [ ] `/grades` - Listado de notas
- [ ] `/grades/upload` - Cargar notas
- [ ] `/attendance` - Registro de asistencias
- [ ] `/attendance/record` - Cargar asistencias
- [ ] `/reports` - Generador de reportes/boletines
- [ ] `/settings` - Configuración (solo Director)

#### Modelo A (Padres y Familias):
- [ ] `/portal/parents` - Portal de padres
- [ ] `/portal/parent-login` - Login separado para padres
- [ ] `/notifications` - Centro de notificaciones
- [ ] `/announcements` - Comunicados institucionales
- [ ] Servicio de emails con Resend

---

## 📦 Deployment en Vercel

### PASO 1: Preparar el código para Vercel

Crea un archivo `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm ci",
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase_anon_key",
    "NEXT_PUBLIC_SITE_URL": "@site_url"
  }
}
```

### PASO 2: Pushear a GitHub

```bash
cd /home/claude/gestion-escolar
git init
git add .
git commit -m "Initial commit: GesEscolar platform"
git branch -M main
git remote add origin https://github.com/tu-usuario/gestion-escolar.git
git push -u origin main
```

### PASO 3: Conectar a Vercel

1. Ve a https://vercel.com
2. Haz click en "New Project"
3. Selecciona tu repositorio
4. Configura las variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (https://tu-dominio.vercel.app)
5. Click en "Deploy"

### PASO 4: Actualizar URLs en Supabase

Una vez deployado en Vercel, ve a Supabase:

1. Authentication → URL Configuration
2. Agrega tu URL de Vercel:
   - Redirect URL: `https://tu-dominio.vercel.app/auth/callback`
   - Site URL: `https://tu-dominio.vercel.app`

---

## 🔐 Consideraciones de Seguridad

1. **RLS Policies** - Activa las políticas RLS en Supabase
2. **Permisos por Rol** - Las queries ya filtran por establishment_id
3. **Contraseñas** - Usar hash automático de Supabase Auth
4. **Emails** - Integrar Resend para notificaciones (Modelo A)

---

## 📧 Integración con Resend (Modelo A)

Para habilitar notificaciones por email:

1. Crea una cuenta en https://resend.com
2. Copia tu API Key
3. Agrega a `.env.local`:
   ```
   RESEND_API_KEY=re_xxxxx
   ```

4. Crear archivo `/lib/services/email.ts`:
   ```typescript
   import { Resend } from 'resend';

   const resend = new Resend(process.env.RESEND_API_KEY);

   export const sendGradeNotification = async (
     parentEmail: string,
     studentName: string,
     grade: number,
     subject: string
   ) => {
     await resend.emails.send({
       from: 'noreply@gesescolar.com',
       to: parentEmail,
       subject: `Nota cargada: ${subject}`,
       html: `<p>${studentName} tiene una nueva nota en ${subject}: ${grade}</p>`
     });
   };
   ```

---

## 📱 Estructura de Carpetas Final

```
gestion-escolar/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── signup/
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── students/
│   │   ├── grades/
│   │   ├── attendance/
│   │   ├── reports/
│   │   ├── settings/
│   │   └── layout.tsx
│   ├── layout.tsx
│   ├── globals.css
│   └── page.tsx
├── components/
│   └── layout/
│       ├── Sidebar.tsx
│       └── DashboardLayout.tsx
├── lib/
│   ├── services/
│   │   ├── supabase.ts
│   │   └── email.ts
│   ├── store/
│   │   └── auth.ts
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   └── types/
│       └── index.ts
├── public/
├── .env.local
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## ✨ Funcionalidades Implementadas (Fase 1)

- ✅ Autenticación (Login/Signup)
- ✅ Gestión de usuarios por rol
- ✅ Listado de alumnos
- ✅ Store global con Zustand
- ✅ UI responsiva con Tailwind
- ✅ Integración Supabase completa

## 🔄 Próxima Fase

- [ ] CRUD completo de alumnos (crear, leer, actualizar)
- [ ] Gestión de notas
- [ ] Registro de asistencias
- [ ] Portal de padres (Modelo A)
- [ ] Sistema de notificaciones por email
- [ ] Generador de boletines/reportes
- [ ] Panel de administración
- [ ] Bitácora de auditoría

---

## 🆘 Troubleshooting

**Error: "No rows returned"**
→ Verifica que los datos existan en Supabase

**Error de autenticación**
→ Revisa las credenciales en `.env.local`

**RLS Policy violation**
→ Asegúrate que el usuario está logueado y pertenece al establishment

**Emails no se envían**
→ Verifica tu API Key de Resend y el dominio autorizado

---

## 📞 Contacto y Soporte

Para preguntas o problemas durante el desarrollo, revisa:
- Documentación de Supabase: https://supabase.com/docs
- Documentación de Next.js: https://nextjs.org/docs
- Documentación de Vercel: https://vercel.com/docs
