import React from 'react';
import { TaskStatisticsProps } from './types';
import './style.scss';

const TaskStatistics: React.FC<TaskStatisticsProps> = ({
  totalCompleted,
  categories,
  className = '',
}) => {
  const getCategoryClassName = (categoryId: string) => {
    switch (categoryId) {
      case 'important-urgent':
        return 'task-statistics__category--important-urgent';
      case 'important-not-urgent':
        return 'task-statistics__category--important-not-urgent';
      case 'not-important-urgent':
        return 'task-statistics__category--not-important-urgent';
      case 'not-important-not-urgent':
        return 'task-statistics__category--not-important-not-urgent';
      default:
        return '';
    }
  };

  return (
    <div className={`task-statistics ${className}`} data-testid="task-statistics">
      <div className="task-statistics__header">
        <h2 className="task-statistics__header-title">已完成</h2>
        <div className="task-statistics__header-count">
          <span className="task-statistics__header-count-number" data-testid="total-completed">
            {totalCompleted}
          </span>
          <span className="task-statistics__header-count-label">任务</span>
        </div>
      </div>

      <div className="task-statistics__categories">
        {categories.map(category => (
          <div
            key={category.id}
            className={`task-statistics__category ${getCategoryClassName(category.id)}`}
            data-testid={`category-${category.id}`}
          >
            <div
              className="task-statistics__category-color"
              style={category.color ? { backgroundColor: category.color } : undefined}
            />
            <div className="task-statistics__category-label">{category.label}</div>
            <div className="task-statistics__category-count">{category.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskStatistics;
