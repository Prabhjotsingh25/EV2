import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// WE ARE HARDCODING THESE VALUES TO FORCE THE UPDATE
// Project ID: pjroglrmvitlldismdzc
const SUPABASE_URL = "https://pjroglrmvitlldismdzc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_oG2fll4ft8T2teA6C2ZC8g_t8OHQwQp";

console.log("FORCE UPDATED URL:", SUPABASE_URL); 

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});