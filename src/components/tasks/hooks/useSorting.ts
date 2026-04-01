import { useState, useCallback } from 'react';
import { Task, SortDirection } from '../types';

export function useSorting(initialData: Task[]) {
  const [sortField, setSortField] = useState<keyof Task>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const sortData = useCallback((data: Task[]) => {
    return [...data].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const direction = sortDirection === 'asc' ? 1 : -1;

      // Handle null values
      if (aValue === null && bValue === null) return 0;
      if (aValue === null) return 1;
      if (bValue === null) return -1;

      // Compare dates
      if (sortField === 'due_date' || sortField === 'created_at' || sortField === 'updated_at') {
        return (new Date(aValue as string).getTime() - new Date(bValue as string).getTime()) * direction;
      }

      // Compare strings and other values
      return String(aValue).localeCompare(String(bValue)) * direction;
    });
  }, [sortField, sortDirection]);

  const handleSort = useCallback((field: keyof Task) => {
    setSortDirection(current => {
      if (field === sortField) {
        return current === 'asc' ? 'desc' : 'asc';
      }
      return 'asc';
    });
    setSortField(field);
  }, [sortField]);

  return {
    sortedData: sortData(initialData),
    sortField,
    sortDirection,
    handleSort
  };
}