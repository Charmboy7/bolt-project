import { useState, useCallback, useEffect } from 'react';
import { Task } from '../types/task';
import { createTask, updateTask, deleteTask, getTasks, archiveTask } from '../lib/tasks';
import { supabase } from '../lib/supabase';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const loadTasks = useCallback(async () => {
    if (!initialized) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [initialized]);

  // Initialize auth state and load tasks
  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setInitialized(true);
      if (session) {
        loadTasks();
      }
    };

    initializeAuth();
  }, [loadTasks]);

  // Subscribe to auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN') {
        await loadTasks();
      } else if (event === 'SIGNED_OUT') {
        setTasks([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadTasks]);

  const addTask = useCallback(async (task: Partial<Task>) => {
    try {
      const newTask = await createTask(task);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create task';
      setError(message);
      throw err;
    }
  }, []);

  const updateTaskById = useCallback(async (id: string, updates: Partial<Task>) => {
    try {
      const updatedTask = await updateTask(id, updates);
      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, ...updatedTask } : task
      ));
      return updatedTask;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update task';
      setError(message);
      throw err;
    }
  }, []);

  const archiveTaskById = useCallback(async (id: string) => {
    try {
      await archiveTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to archive task';
      setError(message);
      throw err;
    }
  }, []);

  const deleteTaskById = useCallback(async (id: string) => {
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete task';
      setError(message);
      throw err;
    }
  }, []);

  return {
    tasks,
    loading,
    error,
    loadTasks,
    addTask,
    updateTask: updateTaskById,
    archiveTask: archiveTaskById,
    deleteTask: deleteTaskById,
  };
}