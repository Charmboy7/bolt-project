import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Area } from '../../../types/area';

interface AreaListItemProps {
  area: Area;
  onEdit: () => void;
  onDelete: () => void;
}

export function AreaListItem({ area, onEdit, onDelete }: AreaListItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-3">
        <div 
          className="w-4 h-4 rounded-full" 
          style={{ backgroundColor: area.color }}
        />
        <h3 className="font-medium text-gray-900">{area.name}</h3>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={onEdit}
          className="p-1 text-gray-400 hover:text-gray-600"
          title="Edit Area"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={onDelete}
          className="p-1 text-gray-400 hover:text-red-600"
          title="Delete Area"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}