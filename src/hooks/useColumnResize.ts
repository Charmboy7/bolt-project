import { useState, useCallback } from 'react';

export function useColumnResize(initialWidths: { [key: string]: number }) {
  const [columnWidths, setColumnWidths] = useState(initialWidths);
  const [resizing, setResizing] = useState<{ column: string; startX: number } | null>(null);

  const handleResizeStart = useCallback((column: string, startX: number) => {
    setResizing({ column, startX });
  }, []);

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!resizing) return;

    const diff = e.clientX - resizing.startX;
    setColumnWidths(prev => ({
      ...prev,
      [resizing.column]: Math.max(100, prev[resizing.column] + diff)
    }));
  }, [resizing]);

  const handleResizeEnd = useCallback(() => {
    setResizing(null);
  }, []);

  return {
    columnWidths,
    handleResizeStart,
    handleResizeMove,
    handleResizeEnd,
    isResizing: !!resizing
  };
}