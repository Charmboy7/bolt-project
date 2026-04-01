import { useState, useCallback } from 'react';

const MIN_COLUMN_WIDTH = 80;

export function useColumnResize() {
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [resizeStartWidth, setResizeStartWidth] = useState(0);

  const handleResizeStart = useCallback((field: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setResizingColumn(field);
    setResizeStartX(e.clientX);
    setResizeStartWidth(columnWidths[field] || 0);
  }, [columnWidths]);

  const handleResizeMove = useCallback((e: React.MouseEvent) => {
    if (!resizingColumn) return;

    const diff = e.clientX - resizeStartX;
    const newWidth = Math.max(MIN_COLUMN_WIDTH, resizeStartWidth + diff);

    setColumnWidths(prev => ({
      ...prev,
      [resizingColumn]: newWidth
    }));
  }, [resizingColumn, resizeStartX, resizeStartWidth]);

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