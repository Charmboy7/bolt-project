import { useState, useMemo } from 'react';
import { Task } from '../../types/task';
import { SortDirection } from './types';

export function useTableSort(data: Task[]) {
  const [sortField, setSortField] = useState<keyof Task>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: keyof Task) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const direction = sortDirection === 'asc' ? 1 : -1;
      
      if (aValue === null) return 1;
      if (bValue === null) return -1;
      return aValue < bValue ? -direction : direction;
    });
  }, [data, sortField, sortDirection]);

  return {
    sortedData,
    sortField,
    sortDirection,
    handleSort
  };
}