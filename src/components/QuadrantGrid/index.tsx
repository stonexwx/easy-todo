import React from 'react';
import { FiPlus, FiCheck } from 'react-icons/fi';
import { QuadrantGridProps, TaskPriority } from './types';
import './style.scss';

const QuadrantGrid: React.FC<QuadrantGridProps> = ({
  tasks,
  onAddTask,
  onTaskClick,
  onTaskComplete,
  className = '',
}) => {
  const getQuadrantTasks = (priority: TaskPriority) => {
    return tasks.filter(task => task.priority === priority);
  };

  const handleTaskClick = (taskId: string) => {
    if (onTaskClick) {
      onTaskClick(taskId);
    }
  };

  const handleTaskCompleteToggle = (e: React.MouseEvent, taskId: string, completed?: boolean) => {
    e.stopPropagation();
    if (onTaskComplete) {
      onTaskComplete(taskId, !completed);
    }
  };

  return (
    <div className={`quadrant-grid ${className}`}>
      <div
        className="quadrant-grid__quadrant quadrant-grid__quadrant--important-urgent"
        data-testid="quadrant-important-urgent"
      >
        <div className="quadrant-grid__quadrant-header">
          重要且紧急
          {onAddTask && (
            <button
              className="quadrant-grid__quadrant-add"
              onClick={() => onAddTask(TaskPriority.IMPORTANT_URGENT)}
              data-testid="add-important-urgent"
              aria-label="添加重要且紧急任务"
              title="添加重要且紧急任务"
            >
              <FiPlus size={16} />
            </button>
          )}
        </div>
        <div className="quadrant-grid__quadrant-content">
          {getQuadrantTasks(TaskPriority.IMPORTANT_URGENT).map(task => (
            <div
              key={task.id}
              className="quadrant-grid__task"
              onClick={() => handleTaskClick(task.id)}
              data-testid={`task-${task.id}`}
            >
              <div
                className={`quadrant-grid__task-checkbox ${task.completed ? 'quadrant-grid__task-checkbox--checked' : ''}`}
                onClick={e => handleTaskCompleteToggle(e, task.id, task.completed)}
                data-testid={`task-checkbox-${task.id}`}
                role="checkbox"
                aria-checked={task.completed || false}
                aria-label={`标记任务 ${task.title} 为${task.completed ? '未完成' : '已完成'}`}
              >
                {task.completed && <FiCheck size={12} />}
              </div>
              <div
                className={`quadrant-grid__task-title ${task.completed ? 'quadrant-grid__task-title--completed' : ''}`}
              >
                {task.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="quadrant-grid__quadrant quadrant-grid__quadrant--important-not-urgent"
        data-testid="quadrant-important-not-urgent"
      >
        <div className="quadrant-grid__quadrant-header">
          重要不紧急
          {onAddTask && (
            <button
              className="quadrant-grid__quadrant-add"
              onClick={() => onAddTask(TaskPriority.IMPORTANT_NOT_URGENT)}
              data-testid="add-important-not-urgent"
              aria-label="添加重要不紧急任务"
              title="添加重要不紧急任务"
            >
              <FiPlus size={16} />
            </button>
          )}
        </div>
        <div className="quadrant-grid__quadrant-content">
          {getQuadrantTasks(TaskPriority.IMPORTANT_NOT_URGENT).map(task => (
            <div
              key={task.id}
              className="quadrant-grid__task"
              onClick={() => handleTaskClick(task.id)}
              data-testid={`task-${task.id}`}
            >
              <div
                className={`quadrant-grid__task-checkbox ${task.completed ? 'quadrant-grid__task-checkbox--checked' : ''}`}
                onClick={e => handleTaskCompleteToggle(e, task.id, task.completed)}
                data-testid={`task-checkbox-${task.id}`}
                role="checkbox"
                aria-checked={task.completed || false}
                aria-label={`标记任务 ${task.title} 为${task.completed ? '未完成' : '已完成'}`}
              >
                {task.completed && <FiCheck size={12} />}
              </div>
              <div
                className={`quadrant-grid__task-title ${task.completed ? 'quadrant-grid__task-title--completed' : ''}`}
              >
                {task.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="quadrant-grid__quadrant quadrant-grid__quadrant--not-important-urgent"
        data-testid="quadrant-not-important-urgent"
      >
        <div className="quadrant-grid__quadrant-header">
          不重要但紧急
          {onAddTask && (
            <button
              className="quadrant-grid__quadrant-add"
              onClick={() => onAddTask(TaskPriority.NOT_IMPORTANT_URGENT)}
              data-testid="add-not-important-urgent"
              aria-label="添加不重要但紧急任务"
              title="添加不重要但紧急任务"
            >
              <FiPlus size={16} />
            </button>
          )}
        </div>
        <div className="quadrant-grid__quadrant-content">
          {getQuadrantTasks(TaskPriority.NOT_IMPORTANT_URGENT).map(task => (
            <div
              key={task.id}
              className="quadrant-grid__task"
              onClick={() => handleTaskClick(task.id)}
              data-testid={`task-${task.id}`}
            >
              <div
                className={`quadrant-grid__task-checkbox ${task.completed ? 'quadrant-grid__task-checkbox--checked' : ''}`}
                onClick={e => handleTaskCompleteToggle(e, task.id, task.completed)}
                data-testid={`task-checkbox-${task.id}`}
                role="checkbox"
                aria-checked={task.completed || false}
                aria-label={`标记任务 ${task.title} 为${task.completed ? '未完成' : '已完成'}`}
              >
                {task.completed && <FiCheck size={12} />}
              </div>
              <div
                className={`quadrant-grid__task-title ${task.completed ? 'quadrant-grid__task-title--completed' : ''}`}
              >
                {task.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="quadrant-grid__quadrant quadrant-grid__quadrant--not-important-not-urgent"
        data-testid="quadrant-not-important-not-urgent"
      >
        <div className="quadrant-grid__quadrant-header">
          不重要不紧急
          {onAddTask && (
            <button
              className="quadrant-grid__quadrant-add"
              onClick={() => onAddTask(TaskPriority.NOT_IMPORTANT_NOT_URGENT)}
              data-testid="add-not-important-not-urgent"
              aria-label="添加不重要不紧急任务"
              title="添加不重要不紧急任务"
            >
              <FiPlus size={16} />
            </button>
          )}
        </div>
        <div className="quadrant-grid__quadrant-content">
          {getQuadrantTasks(TaskPriority.NOT_IMPORTANT_NOT_URGENT).map(task => (
            <div
              key={task.id}
              className="quadrant-grid__task"
              onClick={() => handleTaskClick(task.id)}
              data-testid={`task-${task.id}`}
            >
              <div
                className={`quadrant-grid__task-checkbox ${task.completed ? 'quadrant-grid__task-checkbox--checked' : ''}`}
                onClick={e => handleTaskCompleteToggle(e, task.id, task.completed)}
                data-testid={`task-checkbox-${task.id}`}
                role="checkbox"
                aria-checked={task.completed || false}
                aria-label={`标记任务 ${task.title} 为${task.completed ? '未完成' : '已完成'}`}
              >
                {task.completed && <FiCheck size={12} />}
              </div>
              <div
                className={`quadrant-grid__task-title ${task.completed ? 'quadrant-grid__task-title--completed' : ''}`}
              >
                {task.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuadrantGrid;
