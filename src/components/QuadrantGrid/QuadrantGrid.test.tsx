import { describe, test, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import QuadrantGrid from './index';
import { Task, TaskPriority } from './types';

describe('QuadrantGrid组件', () => {
  const mockTasks: Task[] = [
    { id: '1', title: '紧急重要任务', priority: TaskPriority.IMPORTANT_URGENT },
    { id: '2', title: '不紧急但重要任务', priority: TaskPriority.IMPORTANT_NOT_URGENT },
    { id: '3', title: '紧急不重要任务', priority: TaskPriority.NOT_IMPORTANT_URGENT },
    { id: '4', title: '不紧急不重要任务', priority: TaskPriority.NOT_IMPORTANT_NOT_URGENT },
    { id: '5', title: '已完成任务', priority: TaskPriority.IMPORTANT_URGENT, completed: true },
  ];

  test('渲染所有象限', () => {
    const { getByTestId } = render(<QuadrantGrid tasks={mockTasks} />);

    expect(getByTestId('quadrant-important-urgent')).toBeInTheDocument();
    expect(getByTestId('quadrant-important-not-urgent')).toBeInTheDocument();
    expect(getByTestId('quadrant-not-important-urgent')).toBeInTheDocument();
    expect(getByTestId('quadrant-not-important-not-urgent')).toBeInTheDocument();
  });

  test('渲染任务到对应象限', () => {
    const { getByText } = render(<QuadrantGrid tasks={mockTasks} />);

    expect(getByText('紧急重要任务')).toBeInTheDocument();
    expect(getByText('不紧急但重要任务')).toBeInTheDocument();
    expect(getByText('紧急不重要任务')).toBeInTheDocument();
    expect(getByText('不紧急不重要任务')).toBeInTheDocument();
    expect(getByText('已完成任务')).toBeInTheDocument();
  });

  test('点击添加按钮触发回调', () => {
    const onAddTask = vi.fn();
    const { getByTestId } = render(<QuadrantGrid tasks={mockTasks} onAddTask={onAddTask} />);

    fireEvent.click(getByTestId('add-important-urgent'));
    expect(onAddTask).toHaveBeenCalledWith(TaskPriority.IMPORTANT_URGENT);

    fireEvent.click(getByTestId('add-not-important-not-urgent'));
    expect(onAddTask).toHaveBeenCalledWith(TaskPriority.NOT_IMPORTANT_NOT_URGENT);
  });

  test('点击任务触发回调', () => {
    const onTaskClick = vi.fn();
    const { getByTestId } = render(<QuadrantGrid tasks={mockTasks} onTaskClick={onTaskClick} />);

    fireEvent.click(getByTestId('task-1'));
    expect(onTaskClick).toHaveBeenCalledWith('1');
  });

  test('切换任务完成状态', () => {
    const onTaskComplete = vi.fn();
    const { getByTestId } = render(
      <QuadrantGrid tasks={mockTasks} onTaskComplete={onTaskComplete} />
    );

    fireEvent.click(getByTestId('task-checkbox-1'));
    expect(onTaskComplete).toHaveBeenCalledWith('1', true);

    fireEvent.click(getByTestId('task-checkbox-5'));
    expect(onTaskComplete).toHaveBeenCalledWith('5', false);
  });
});
