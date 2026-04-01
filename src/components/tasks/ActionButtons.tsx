import React from 'react';
import { Check, Archive, Calendar } from 'lucide-react';

interface ActionButtonsProps {
  onComplete: () => void;
  onArchive: () => void;
  onSchedule: () => void;
  isCompleted: boolean;
}

export function ActionButtons({ 
  onComplete, 
  onArchive, 
  onSchedule,
  isCompleted 
}: ActionButtonsProps) {
  return (
    <div className="flex space-x-2">
      <button
        onClick={onComplete}
        className={`transition-colors ${
          isCompleted 
            ? 'text-green-500 hover:text-green-600' 
            : 'text-gray-400 hover:text-green-600'
        }`}
        title="Mark Complete"
      >
        <Check size={18} />
      </button>
      <button
        onClick={onArchive}
        className="text-gray-400 hover:text-gray-600 transition-colors"
        title="Archive Task"
      >
        <Archive size={18} />
      </button>
      <button
        onClick={onSchedule}
        className="text-gray-400 hover:text-blue-600 transition-colors"
        title="Schedule Task"
      >
        <Calendar size={18} />
      </button>
    </div>
  );
}