import React from 'react';
import { Task, SortDirection } from './types';
import { SortIndicator } from './SortIndicator';
import { ResizeHandle } from './ResizeHandle';

interface TableHeaderProps {
  column: {
    field: string;
    header: string;
    sortable?: boolean;
  };
  width: number;
  sortField?: keyof Task;
  sortDirection?: SortDirection;
  onSort?: () => void;
  onResizeStart: (e: React.MouseEvent) => void;
  isResizing: boolean;
}

export function TableHeader({
  column,
  width,
  sortField,
  sortDirection,
  onSort,
  onResizeStart,
  isResizing
}: TableHeaderProps) {
  const isSorted = sortField === column.field;
  
  return (
    <th 
      className={`
        group relative px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
        ${column.sortable ? 'cursor-pointer hover:bg-gray-50' : ''}
      `}
      style={{ width }}
      onClick={() => column.sortable && onSort?.()}
    >
      <div className="flex items-center">
        <span>{column.header}</span>
        {column.sortable && isSorted && (
          <SortIndicator direction={sortDirection} />
        )}
      </div>
      <ResizeHandle
        onResizeStart={onResizeStart}
        isResizing={isResizing}
      />
    </th>
  );
}