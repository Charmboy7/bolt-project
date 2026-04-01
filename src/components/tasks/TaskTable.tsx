import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Task } from '../../types/task';
import { TableHeader } from './TableHeader';
import { NewTaskRow } from './NewTaskRow';
import { useColumns } from './useColumns';
import { useTableSort } from './useTableSort';
import { useColumnResize } from './useColumnResize';
import './Table.css';

interface TaskTableProps {
  tasks: Task[];
  onAddTask: (task: Partial<Task>) => void;
  onCompleteTask: (id: string) => void;
  onArchiveTask: (id: string) => void;
  onScheduleTask: (id: string) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
}

export function TaskTable({
  tasks,
  onAddTask,
  onCompleteTask,
  onArchiveTask,
  onScheduleTask,
  onUpdateTask
}: TaskTableProps) {
  const [showNewTaskRow, setShowNewTaskRow] = useState(false);
  const columns = useColumns({ onCompleteTask, onArchiveTask, onScheduleTask, onUpdateTask });
  const { sortedData, sortField, sortDirection, handleSort } = useTableSort(tasks);
  const { columnWidths, handleResizeStart, handleResizeMove, handleResizeEnd, resizingColumn } = useColumnResize();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setShowNewTaskRow(true)}
          className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Task
        </button>
      </div>

      <div 
        className="bg-white rounded-lg shadow overflow-hidden"
        onMouseMove={handleResizeMove}
        onMouseUp={handleResizeEnd}
        onMouseLeave={handleResizeEnd}
      >
        <table className="task-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <TableHeader
                  key={column.field}
                  column={column}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  width={columnWidths[column.field]}
                  onSort={() => column.sortable && handleSort(column.field as keyof Task)}
                  onResizeStart={(e) => handleResizeStart(column.field, e)}
                  isResizing={resizingColumn === column.field}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {showNewTaskRow && (
              <NewTaskRow
                onSave={(task) => {
                  onAddTask(task);
                  setShowNewTaskRow(false);
                }}
              />
            )}
            {sortedData.map((task) => (
              <tr key={task.id}>
                {columns.map((column) => (
                  <td
                    key={`${task.id}-${column.field}`}
                    style={{ width: columnWidths[column.field] }}
                  >
                    {column.render ? column.render(task) : String(task[column.field as keyof Task] || '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}