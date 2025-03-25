export interface TaskCategory {
  id: string;
  type: 'important-urgent' | 'important-not-urgent' | 'not-important-urgent' | 'not-important-not-urgent';
  name: string;
  count: number;
}

export interface TaskStatisticsProps {
  totalCompleted: number;
  categories: TaskCategory[];
  className?: string;
} 