import React from 'react';
import { useTasks } from '../hooks/useTasks';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { TaskTable } from '../components/tasks/TaskTable';

export function TaskList() {
  const { tasks, loading, error } = useTasks();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Tasks</h2>
      <TaskTable tasks={tasks} />
    </div>
  );
}