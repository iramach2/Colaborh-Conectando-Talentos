import { createClient } from '@supabase/supabase-js';

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Sanitize URL: remove trailing slash and common subpaths if present
supabaseUrl = supabaseUrl.replace(/\/$/, ''); // Remove trailing slash
supabaseUrl = supabaseUrl.replace(/\/rest\/v1$/, ''); // Remove /rest/v1 if present
supabaseUrl = supabaseUrl.replace(/\/auth\/v1$/, ''); // Remove /auth/v1 if present

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Read-only client without the browser session. Some legacy company sessions can
// carry an invalid/stale Authorization token even while the dashboard remains
// open. Public reads that are already allowed by the database can safely retry
// through this client instead of being rendered as an empty result.
export const supabasePublicRead = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
