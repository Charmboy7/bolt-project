import { supabase } from './supabase';
import { User } from '../types/user';

export async function getProfile(): Promise<User | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error in getProfile:', err);
    return null;
  }
}

export async function createProfile(userId: string, name: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert([{ 
        id: userId, 
        name, 
        role: 'user',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error in createProfile:', err);
    return null;
  }
}

export async function updateProfile(updates: Partial<User>): Promise<User | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error in updateProfile:', err);
    return null;
  }
}