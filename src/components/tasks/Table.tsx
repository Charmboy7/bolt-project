import React, { useState, useEffect, useCallback } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export type SortDirection = 'asc' | 'desc';

interface Column<T> {
  field: keyof T | 'actions';
  header: string;
  render?: (item: T) => React.ReactNode;
  width?: number;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  sortField?: keyof T;
  sortDirection?: SortDirection;
  onSort?: (field: keyof T) => void;
}

export function Table<T>({ data, columns: initialColumns, sortField, sortDirection, onSort }: TableProps<T>) {
  const [columns, setColumns] = useState(initialColumns);
  const [draggingColumn, setDraggingColumn] = useState<number | null>(null);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(
    initialColumns.reduce((acc, col) => ({ ...acc, [col.field]: col.width || 150 }), {})
  );
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [resizeStartWidth, setResizeStartWidth] = useState(0);

  // Handle column drag and drop
  const handleDragStart = (index: number) => {
    setDraggingColumn(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggingColumn === null || draggingColumn === index) return;

    const newColumns = [...columns];
    const draggedColumn = newColumns[draggingColumn];
    newColumns.splice(draggingColumn, 1);
    newColumns.splice(index, 0, draggedColumn);
    setColumns(newColumns);
    setDraggingColumn(index);
  };

  const handleDragEnd = () => {
    setDraggingColumn(null);
  };

  // Handle column resize
  const handleResizeStart = useCallback((field: string, e: React.MouseEvent) => {
    setResizingColumn(field);
    setResizeStartX(e.clientX);
    setResizeStartWidth(columnWidths[field]);
  }, [columnWidths]);

  useEffect(() => {
    const handleResize = (e: MouseEvent) => {
      if (!resizingColumn) return;

      const diff = e.clientX - resizeStartX;
      setColumnWidths(prev => ({
        ...prev,
        [resizingColumn]: Math.max(100, resizeStartWidth + diff)
      }));
    };

    const handleResizeEnd = () => {
      setResizingColumn(null);
    };

    if (resizingColumn) {
      window.addEventListener('mousemove', handleResize);
      window.addEventListener('mouseup', handleResizeEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleResize);
      window.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [resizingColumn, resizeStartX, resizeStartWidth]);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6 text-center">
          <p className="text-sm text-gray-500">No data found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={String(column.field)}
                className={`group relative px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider select-none cursor-move ${
                  draggingColumn === index ? 'bg-gray-100' : ''
                }`}
                style={{ width: columnWidths[column.field] }}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                onClick={() => column.field !== 'actions' && onSort?.(column.field as keyof T)}
              >
                <div className="flex items-center">
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
                  className={`absolute right-0 top-0 bottom-0 w-1 cursor-col-resize group-hover:bg-gray-300 ${
                    resizingColumn === column.field ? 'bg-gray-400' : ''
                  }`}
                  onMouseDown={(e) => handleResizeStart(String(column.field), e)}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
              {columns.map((column) => (
                <td
                  key={`${rowIndex}-${String(column.field)}`}
                  className="px-6 py-4 whitespace-nowrap"
                  style={{ width: columnWidths[column.field] }}
                >
                  {column.render
                    ? column.render(item)
                    : String(item[column.field as keyof T] || '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}