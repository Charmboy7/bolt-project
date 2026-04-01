import { supabase } from './supabase';
import { Area } from '../types/area';

export async function getAreas() {
  const { data, error } = await supabase
    .from('areas')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}

export async function createArea(name: string, color: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('areas')
    .insert([{ 
      name, 
      color,
      user_id: user.id 
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateArea(id: string, updates: Partial<Area>) {
  const { data, error } = await supabase
    .from('areas')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteArea(id: string) {
  // First check if area is being used
  const { count, error: countError } = await supabase
    .from('tasks')
    .select('id', { count: 'exact' })
    .eq('area', id);

  if (countError) throw countError;
  
  if (count && count > 0) {
    throw new Error('This area is associated with existing tasks and cannot be deleted');
  }

  const { error } = await supabase
    .from('areas')
    .delete()
    .eq('id', id);

  if (error) throw error;
}