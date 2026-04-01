import { useMemo } from 'react';
import { Column, Task } from './types';
import { getColumns } from './columnDefinitions';

interface UseColumnsProps {
  onCompleteTask: (id: string) => void;
  onArchiveTask: (id: string) => void;
  onScheduleTask: (id: string) => void;
  onUpdateTask?: (id: string, updates: Partial<Task>) => void;
}

export function useColumns(props: UseColumnsProps): Column<Task>[] {
  return useMemo(() => getColumns(props), [
    props.onCompleteTask,
    props.onArchiveTask,
    props.onScheduleTask,
    props.onUpdateTask
  ]);
}