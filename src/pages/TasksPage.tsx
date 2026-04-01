import React, { useEffect } from 'react';
import { TaskTable } from '../components/tasks/TaskTable';
import { useTasks } from '../hooks/useTasks';
import { Task } from '../types/task';

export function TasksPage() {
  const { 
    tasks, 
    loading, 
    error, 
    loadTasks, 
    addTask, 
    updateTask,
    archiveTask,
    deleteTask 
  } = useTasks();

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleAddTask = async (task: Partial<Task>) => {
    try {
      await addTask(task);
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      const task = tasks?.find(t => t.id === taskId);
      if (task) {
        await updateTask(taskId, { is_completed: !task.is_completed });
      }
    } catch (err) {
      console.error('Error toggling task completion:', err);
    }
  };

  const handleArchiveTask = async (taskId: string) => {
    try {
      await archiveTask(taskId);
    } catch (err) {
      console.error('Error archiving task:', err);
    }
  };

  const handleScheduleTask = (taskId: string) => {
    // TODO: Implement calendar integration
    console.log('Schedule task:', taskId);
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      await updateTask(taskId, updates);
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Tasks</h1>
        
        <TaskTable
          tasks={tasks || []}
          onAddTask={handleAddTask}
          onCompleteTask={handleCompleteTask}
          onArchiveTask={handleArchiveTask}
          onScheduleTask={handleScheduleTask}
          onUpdateTask={handleUpdateTask}
        />
      </div>
    </div>
  );
}