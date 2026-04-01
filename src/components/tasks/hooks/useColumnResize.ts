import { useState, useCallback } from 'react';
import { Column } from '../types';

const MIN_COLUMN_WIDTH = 80;

export function useColumnResize(initialColumns: Column<any>[]) {
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(
    initialColumns.reduce((acc, col) => ({
      ...acc,
      [col.field]: col.width || 150
    }), {})
  );
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  const handleResizeStart = useCallback((field: string, e: React.MouseEvent) => {
    e.preventDefault();
    setResizingColumn(field);
    setStartX(e.clientX);
    setStartWidth(columnWidths[field] || 150);
  }, [columnWidths]);

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!resizingColumn) return;

    const diff = e.clientX - startX;
    const newWidth = Math.max(MIN_COLUMN_WIDTH, startWidth + diff);

    setColumnWidths(prev => ({
      ...prev,
      [resizingColumn]: newWidth
    }));
  }, [resizingColumn, startX, startWidth]);

  const handleResizeEnd = useCallback(() => {
    setResizingColumn(null);
  }, []);

  return {
    columnWidths,
    resizingColumn,
    handleResizeStart,
    handleResizeMove,
    handleResizeEnd
  };
}