import React from 'react';
import { Priority } from '../../types/task';

interface PrioritySelectProps {
  value: Priority;
  onChange: (value: Priority) => void;
}

const PRIORITY_OPTIONS: { value: Priority; label: string; color: string }[] = [
  { value: 'A1', label: 'Critical', color: 'text-red-600' },
  { value: 'A2', label: 'High', color: 'text-orange-500' },
  { value: 'B1', label: 'Medium', color: 'text-yellow-500' },
  { value: 'B2', label: 'Low', color: 'text-green-500' },
];

export function PrioritySelect({ value, onChange }: PrioritySelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Priority)}
      className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      {PRIORITY_OPTIONS.map((option) => (
        <option 
          key={option.value} 
          value={option.value}
          className={option.color}
        >
          {option.label} ({option.value})
        </option>
      ))}
    </select>
  );
}