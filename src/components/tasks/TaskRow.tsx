import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Task, Column } from './types';

interface TaskRowProps {
  task: Task;
  columns: Column<Task>[];
  columnWidths: Record<string, number>;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function TaskRow({
  task,
  columns,
  columnWidths,
  isExpanded,
  onToggleExpand
}: TaskRowProps) {
  return (
    <>
      <tr className="hover:bg-gray-50">
        {columns.map((column, index) => (
          <td 
            key={`${task.id}-${column.field}`} 
            className={`px-6 py-4 whitespace-nowrap ${index === 0 ? 'flex items-center gap-2' : ''}`}
            style={{ width: columnWidths[column.field] }}
          >
            {index === 0 && (
              <button 
                onClick={onToggleExpand}
                className="p-1 hover:bg-gray-100 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </button>
            )}
            {column.render ? column.render(task) : String(task[column.field as keyof Task] || '')}
          </td>
        ))}
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={columns.length} className="bg-gray-50 px-6 py-4">
            <div className="text-sm text-gray-600">
              <h4 className="font-medium mb-2">Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Created</p>
                  <p>{new Date(task.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Last Updated</p>
                  <p>{new Date(task.updated_at).toLocaleString()}</p>
                </div>
              </div>
              {task.description && (
                <div className="mt-4">
                  <p className="text-gray-500">Description</p>
                  <p className="whitespace-pre-wrap">{task.description}</p>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}