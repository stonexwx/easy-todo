import React from 'react';
import Card from '../Card';
import { TaskStatisticsProps } from './types';
import './style.scss';

const TaskStatistics: React.FC<TaskStatisticsProps> = ({
  totalCompleted,
  categories,
  className = '',
}) => {
  return (
    <Card
      title="任务统计"
      className={`task-statistics ${className}`}
      variant="elevated"
      padding="md"
      customStyle={{
        background: 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(8px) saturate(150%)',
        WebkitBackdropFilter: 'blur(8px) saturate(150%)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform var(--transition-normal), box-shadow var(--transition-normal)',
      }}
    >
      <div className="task-statistics__header">
        <div className="task-statistics__header-count">
          <span className="task-statistics__header-count-number">{totalCompleted}</span>
          <span className="task-statistics__header-count-label">已完成任务</span>
        </div>
      </div>

      <div className="task-statistics__categories">
        {categories.map(category => (
          <div
            key={category.id}
            className={`task-statistics__category task-statistics__category--${category.type}`}
          >
            <div className="task-statistics__category-color" />
            <span className="task-statistics__category-label">{category.name}</span>
            <span className="task-statistics__category-count">{category.count}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TaskStatistics;
