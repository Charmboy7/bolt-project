import { useState, useCallback } from 'react';

export function useExpandedRows() {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleExpand = useCallback((id: string) => {
    setExpandedRows(current => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const isExpanded = useCallback((id: string) => {
    return expandedRows.has(id);
  }, [expandedRows]);

  return {
    isExpanded,
    toggleExpand
  };
}