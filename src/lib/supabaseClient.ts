import { createClient } from '@supabase/supabase-js';

// Estas variables las sacaremos de tu panel de Supabase en el siguiente paso
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);