import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

interface DatePickerCellProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export function DatePickerCell({ value, onChange }: DatePickerCellProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value).toISOString() : null;
    onChange(date);
    setIsEditing(false);
  };

  return (
    <div className="relative flex items-center">
      {isEditing ? (
        <input
          type="date"
          value={value ? new Date(value).toISOString().split('T')[0] : ''}
          onChange={handleDateChange}
          onBlur={() => setIsEditing(false)}
          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          autoFocus
        />
      ) : (
        <div className="flex items-center space-x-2">
          <span>{value ? new Date(value).toLocaleDateString() : '-'}</span>
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-400 hover:text-gray-600"
          >
            <Calendar size={16} />
          </button>
        </div>
      )}
    </div>
  );
}