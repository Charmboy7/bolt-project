import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { SortDirection } from './Table';

interface ResizableHeaderProps {
  column: {
    field: string;
    header: string;
    width?: number;
  };
  sortField?: string;
  sortDirection?: SortDirection;
  onSort?: () => void;
  onResizeStart: (e: React.MouseEvent) => void;
  isResizing: boolean;
}

export function ResizableHeader({
  column,
  sortField,
  sortDirection,
  onSort,
  onResizeStart,
  isResizing
}: ResizableHeaderProps) {
  return (
    <th
      className="group relative px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider select-none border-r border-gray-100 last:border-r-0"
      style={{ width: column.width }}
    >
      <div 
        className="flex items-center cursor-pointer"
        onClick={onSort}
      >
        <span>{column.header}</span>
        {sortField === column.field && (
          <span className="ml-2">
            {sortDirection === 'asc' ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </span>
        )}
      </div>
      
      <div
        className={`absolute right-0 top-0 bottom-0 w-px cursor-col-resize group-hover:bg-gray-300 transition-colors ${
          isResizing ? 'bg-gray-400' : ''
        }`}
        onMouseDown={onResizeStart}
      />
    </th>
  );
}