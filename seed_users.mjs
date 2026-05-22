import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const getEnv = (key) => {
  const match = envContent.match(new RegExp(`^${key}="?([^"\\n]+)"?`, 'm'));
  return match ? match[1] : null;
};

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseServiceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

// Initialize Supabase admin client using the service role key to bypass RLS and create auth users
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function seed() {
  console.log("Seeding test users and data...");

  // 1. Create a test establishment
  const { data: establishment, error: estError } = await supabaseAdmin
    .from('establishments')
    .insert([{
      name: 'Escuela de Prueba',
      plan: 'modelo_a'
    }])
    .select()
    .single();

  if (estError) {
    console.error("Error creating establishment:", estError);
    return;
  }
  
  console.log(`Created Establishment: ${establishment.name} (${establishment.id})`);

  const usersToCreate = [
    { email: 'director@escuela.com', password: 'password123', full_name: 'Director Prueba', role: 'director' },
    { email: 'docente@escuela.com', password: 'password123', full_name: 'Docente Prueba', role: 'docente' },
    { email: 'padre@escuela.com', password: 'password123', full_name: 'Padre Prueba', role: 'padre' }
  ];

  for (const u of usersToCreate) {
    console.log(`Creating user: ${u.email}...`);
    
    // Check if auth user already exists (to avoid duplicate errors if run multiple times)
    const { data: authUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    let authUser = authUsers?.users?.find(user => user.email === u.email);

    if (!authUser) {
      // Create user in Auth
      const { data: newAuthUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true
      });

      if (authError) {
        console.error(`Error creating auth user ${u.email}:`, authError);
        continue;
      }
      authUser = newAuthUser.user;
    } else {
      console.log(`Auth user ${u.email} already exists.`);
    }

    // Insert into public.users
    const { error: publicUserError } = await supabaseAdmin
      .from('users')
      .upsert({
        establishment_id: establishment.id,
        email: u.email,
        full_name: u.full_name,
        role: u.role,
        auth_id: authUser.id,
        status: 'active'
      }, { onConflict: 'establishment_id, email' });

    if (publicUserError) {
      console.error(`Error linking public user ${u.email}:`, publicUserError);
    } else {
      console.log(`Successfully created/linked user: ${u.email} (Password: ${u.password})`);
    }
  }

  console.log("Seeding complete!");
}

seed();
