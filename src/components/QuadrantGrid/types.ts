export enum TaskPriority {
  IMPORTANT_URGENT = 'important_urgent',
  IMPORTANT_NOT_URGENT = 'important_not_urgent',
  NOT_IMPORTANT_URGENT = 'not_important_urgent',
  NOT_IMPORTANT_NOT_URGENT = 'not_important_not_urgent'
}

export interface Task {
  id: string;
  title: string;
  priority: TaskPriority;
  completed?: boolean;
}

export interface QuadrantGridProps {
  tasks: Task[];
  onAddTask?: (priority: TaskPriority) => void;
  onTaskClick?: (taskId: string) => void;
  onTaskComplete?: (taskId: string, completed: boolean) => void;
  className?: string;
} 