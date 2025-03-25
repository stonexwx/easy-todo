export interface TaskCategory {
  id: string;
  label: string;
  count: number;
  color?: string;
}

export interface TaskStatisticsProps {
  totalCompleted: number;
  categories: TaskCategory[];
  className?: string;
} 