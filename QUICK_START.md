# ⚡ Quick Start - GesEscolar en 5 minutos

## TL;DR

```bash
# 1. Copia las credenciales de Supabase a .env.local
# 2. Ejecuta SQL de schema en Supabase
# 3. npm install && npm run dev
# 4. Login en http://localhost:3000/login
```

---

## Paso 1️⃣: Credenciales Supabase (2 min)

Abre tu proyecto en Supabase → Settings → API

Copia en `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Paso 2️⃣: Schema BD (1 min)

En Supabase → SQL Editor:

1. Click en "Crear query"
2. Pega el contenido de `supabase_schema.sql`
3. Click en "Ejecutar"
4. Espera a que termine ✅

---

## Paso 3️⃣: Usuario Demo (1 min)

En Supabase → SQL Editor, ejecuta esto:

```sql
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES (
  'director@demo.com',
  crypt('demo123', gen_salt('bf')),
  now()
);

SELECT id FROM auth.users WHERE email = 'director@demo.com';
-- Copiar ID devuelto

INSERT INTO establishments (name, plan, subscription_status)
VALUES ('Demo School', 'modelo_a', 'active')
RETURNING id;
-- Copiar ID devuelto

INSERT INTO users (establishment_id, email, full_name, role, auth_id, status)
VALUES (
  'ESTABLISHMENT_ID',
  'director@demo.com',
  'Director Demo',
  'director',
  'AUTH_ID',
  'active'
);
```

---

## Paso 4️⃣: Dev Server (1 min)

```bash
npm install
npm run dev
```

Abre: http://localhost:3000/login

**Email:** director@demo.com  
**Password:** demo123

---

## 🎉 ¡Listo!

Ya tienes:
- ✅ Autenticación funcionando
- ✅ Dashboard accesible
- ✅ Listado de alumnos (vacío, crea algunos)
- ✅ Sidebar con navegación

---

## 📋 Próximos pasos

1. Crea datos de prueba (alumnos, notas)
2. Implementa las funciones faltantes
3. Prueba en móvil
4. Deploy en Vercel

---

## 🆘 Problemas comunes

**Error: "No rows returned"**
→ Verifica que creaste los datos de prueba

**Error 401 en login**
→ Revisa variables de entorno en `.env.local`

**Build error**
→ Ejecuta `npm install` nuevamente

---

Ver `README.md` para detalles completos.
