import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Initialize error handling
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    console.log('User signed in successfully');
  } else if (event === 'SIGNED_OUT') {
    console.log('User signed out');
  } else if (event === 'TOKEN_REFRESHED') {
    console.log('Session refreshed');
  }
});

// Handle connection errors
let retryCount = 0;
const maxRetries = 3;

async function handleConnectionError() {
  if (retryCount < maxRetries) {
    retryCount++;
    console.log(`Retrying connection (attempt ${retryCount}/${maxRetries})...`);
    try {
      await supabase.auth.refreshSession();
      retryCount = 0; // Reset on success
    } catch (err) {
      console.error('Failed to reconnect:', err);
    }
  }
}

window.addEventListener('online', handleConnectionError);