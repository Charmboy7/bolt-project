import { supabase } from './supabase';
import { Task } from '../types/task';

export async function getTasks(): Promise<Task[]> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    throw new Error('Not authenticated');
  }

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('is_archived', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tasks:', error);
    throw new Error('Failed to fetch tasks');
  }

  return data || [];
}

export async function createTask(task: Partial<Task>): Promise<Task> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    throw new Error('Not authenticated');
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert([{ ...task, user_id: session.user.id }])
    .select()
    .single();

  if (error) {
    console.error('Error creating task:', error);
    throw new Error('Failed to create task');
  }

  return data;
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    throw new Error('Not authenticated');
  }

  const { data, error } = await supabase
    .from('tasks')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', session.user.id) // Ensure user can only update their own tasks
    .select()
    .single();

  if (error) {
    console.error('Error updating task:', error);
    throw new Error('Failed to update task');
  }

  return data;
}

export async function archiveTask(id: string): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    throw new Error('Not authenticated');
  }

  const { error } = await supabase
    .from('tasks')
    .update({ 
      is_archived: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('user_id', session.user.id);

  if (error) {
    console.error('Error archiving task:', error);
    throw new Error('Failed to archive task');
  }
}

export async function deleteTask(id: string): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    throw new Error('Not authenticated');
  }

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
    .eq('user_id', session.user.id);

  if (error) {
    console.error('Error deleting task:', error);
    throw new Error('Failed to delete task');
  }
}