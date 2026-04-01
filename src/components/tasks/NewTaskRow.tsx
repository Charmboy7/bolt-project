import React, { useState } from 'react';
import { EditableCell } from './EditableCell';
import { DatePickerCell } from './DatePickerCell';
import { AreaSelect } from './AreaSelect';
import { PrioritySelect } from './PrioritySelect';
import { Task, Priority } from '../../types/task';

interface NewTaskRowProps {
  onSave: (task: Partial<Task>) => void;
}

export function NewTaskRow({ onSave }: NewTaskRowProps) {
  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [area, setArea] = useState<string | null>(null);
  const [priority, setPriority] = useState<Priority>('B2');

  const handleNameChange = (newName: string) => {
    setName(newName);
    if (newName) {
      onSave({
        name: newName,
        due_date: dueDate,
        area,
        priority,
        is_completed: false,
        is_archived: false,
      });
      // Reset the form
      setName('');
      setDueDate(null);
      setArea(null);
      setPriority('B2');
    }
  };

  const handleDateChange = (newDate: string | null) => {
    setDueDate(newDate);
    if (name) {
      onSave({
        name,
        due_date: newDate,
        area,
        priority,
        is_completed: false,
        is_archived: false,
      });
    }
  };

  const handleAreaChange = (newArea: string | null) => {
    setArea(newArea);
    if (name) {
      onSave({
        name,
        due_date: dueDate,
        area: newArea,
        priority,
        is_completed: false,
        is_archived: false,
      });
    }
  };

  const handlePriorityChange = (newPriority: Priority) => {
    setPriority(newPriority);
    if (name) {
      onSave({
        name,
        due_date: dueDate,
        area,
        priority: newPriority,
        is_completed: false,
        is_archived: false,
      });
    }
  };

  return (
    <tr className="bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap" style={{ width: 80 }}>
        <div className="w-3 h-3 rounded-full bg-gray-300" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap" style={{ width: 300 }}>
        <EditableCell
          value={name}
          onChange={handleNameChange}
          placeholder="New Task"
          autoFocus
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap" style={{ width: 150 }}>
        <DatePickerCell
          value={dueDate}
          onChange={handleDateChange}
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap" style={{ width: 150 }}>
        <AreaSelect
          value={area}
          onChange={handleAreaChange}
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap" style={{ width: 120 }}>
        <PrioritySelect
          value={priority}
          onChange={handlePriorityChange}
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap" style={{ width: 120 }}>-</td>
    </tr>
  );
}