DO $$
DECLARE
  v_establishment_id UUID;
  v_director_auth_id UUID;
  v_docente_auth_id UUID;
  v_padre_auth_id UUID;
BEGIN
  -- 1. Crear Establecimiento
  INSERT INTO public.establishments (name, plan)
  VALUES ('Escuela de Prueba', 'modelo_a')
  RETURNING id INTO v_establishment_id;

  -- 2. Crear Director (Contraseña: password123)
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'director@escuela.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''
  ) RETURNING id INTO v_director_auth_id;

  -- Relacionar Director en public.users
  INSERT INTO public.users (establishment_id, email, full_name, role, auth_id, status)
  VALUES (v_establishment_id, 'director@escuela.com', 'Director Prueba', 'director', v_director_auth_id, 'active');

  -- 3. Crear Docente (Contraseña: password123)
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'docente@escuela.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''
  ) RETURNING id INTO v_docente_auth_id;

  -- Relacionar Docente en public.users
  INSERT INTO public.users (establishment_id, email, full_name, role, auth_id, status)
  VALUES (v_establishment_id, 'docente@escuela.com', 'Docente Prueba', 'docente', v_docente_auth_id, 'active');

  -- 4. Crear Padre (Contraseña: password123)
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'padre@escuela.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''
  ) RETURNING id INTO v_padre_auth_id;

  -- Relacionar Padre en public.users
  INSERT INTO public.users (establishment_id, email, full_name, role, auth_id, status)
  VALUES (v_establishment_id, 'padre@escuela.com', 'Padre Prueba', 'padre', v_padre_auth_id, 'active');

END $$;
