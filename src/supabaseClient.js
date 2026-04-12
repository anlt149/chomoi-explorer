import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check environment variables initialization
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Missing Supabase Client Configuration. Please check your .env file.")
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder')
