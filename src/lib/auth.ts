import { supabase } from './supabase';
import { AuthError } from '@supabase/supabase-js';

function getAuthErrorMessage(error: AuthError): string {
  switch (error.message) {
    case 'User already registered':
      return 'An account with this email already exists. Please sign in instead.';
    case 'Invalid login credentials':
      return 'Invalid email or password. Please try again.';
    case 'Email rate limit exceeded':
      return 'Too many attempts. Please try again later.';
    default:
      return error.message;
  }
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return profile;
}

export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }
    }
  });
  
  if (error) throw new Error(getAuthErrorMessage(error));

  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: data.user.id,
        name,
        role: 'user',
        created_at: new Date().toISOString()
      }]);

    if (profileError) {
      console.error('Error creating profile:', profileError);
      throw new Error('Failed to create user profile');
    }
  }

  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw new Error(getAuthErrorMessage(error));

  // Ensure profile exists
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (!profile) {
    // Create profile if it doesn't exist
    await supabase
      .from('profiles')
      .insert([{
        id: data.user.id,
        name: data.user.user_metadata.name || email.split('@')[0],
        role: 'user',
        created_at: new Date().toISOString()
      }]);
  }

  return data;
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  });
  
  if (error) throw new Error(getAuthErrorMessage(error));
}

export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) throw new Error(getAuthErrorMessage(error));
  return true;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(getAuthErrorMessage(error));
}