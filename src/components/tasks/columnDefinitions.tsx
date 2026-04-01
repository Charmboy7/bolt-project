import React from 'react';
import { Column, Task } from './types';
import { StatusIndicator } from './StatusIndicator';
import { EditableCell } from './EditableCell';
import { DatePickerCell } from './DatePickerCell';
import { AreaSelect } from './AreaSelect';
import { PrioritySelect } from './PrioritySelect';
import { ActionButtons } from './ActionButtons';

interface GetColumnsProps {
  onCompleteTask: (id: string) => void;
  onArchiveTask: (id: string) => void;
  onScheduleTask: (id: string) => void;
  onUpdateTask?: (id: string, updates: Partial<Task>) => void;
}

export function getColumns({
  onCompleteTask,
  onArchiveTask,
  onScheduleTask,
  onUpdateTask
}: GetColumnsProps): Column<Task>[] {
  return [
    {
      field: 'status',
      header: 'Status',
      sortable: false,
      width: 80,
      render: (task: Task) => (
        <StatusIndicator 
          isCompleted={task.is_completed} 
          dueDate={task.due_date} 
        />
      )
    },
    {
      field: 'name',
      header: 'Task Name',
      sortable: true,
      width: 300,
      render: (task: Task) => (
        <div className={task.is_completed ? 'line-through text-gray-500' : ''}>
          <EditableCell
            value={task.name}
            onChange={(newName) => onUpdateTask?.(task.id, { name: newName })}
            placeholder="Enter task name"
          />
        </div>
      )
    },
    {
      field: 'due_date',
      header: 'Due Date',
      sortable: true,
      width: 150,
      render: (task: Task) => (
        <DatePickerCell
          value={task.due_date}
          onChange={(newDate) => onUpdateTask?.(task.id, { due_date: newDate })}
        />
      )
    },
    {
      field: 'area',
      header: 'Area',
      sortable: true,
      width: 150,
      render: (task: Task) => (
        <AreaSelect
          value={task.area}
          onChange={(areaId) => onUpdateTask?.(task.id, { area: areaId })}
        />
      )
    },
    {
      field: 'priority',
      header: 'Priority',
      sortable: true,
      width: 120,
      render: (task: Task) => (
        <PrioritySelect
          value={task.priority}
          onChange={(newPriority) => onUpdateTask?.(task.id, { priority: newPriority })}
        />
      )
    },
    {
      field: 'actions',
      header: 'Actions',
      sortable: false,
      width: 120,
      render: (task: Task) => (
        <ActionButtons
          onComplete={() => onCompleteTask(task.id)}
          onArchive={() => onArchiveTask(task.id)}
          onSchedule={() => onScheduleTask(task.id)}
          isCompleted={task.is_completed}
        />
      )
    }
  ];
}