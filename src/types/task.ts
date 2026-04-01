export type Priority = 'A1' | 'A2' | 'B1' | 'B2';

export interface Task {
  id: string;
  number: number;
  name: string;
  due_date: string | null;
  area: string | null;
  priority: Priority;
  is_completed: boolean;
  is_archived: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}