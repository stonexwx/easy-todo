import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ReactNode } from 'react';

// 在文件顶部进行模拟
vi.mock('../Card', () => ({
  default: (props: {
    children: ReactNode;
    className?: string;
    title?: string;
    variant?: string;
    padding?: string;
    customStyle?: Record<string, unknown>;
  }) => (
    <div data-testid="mocked-card" className={props.className || ''} data-title={props.title}>
      {props.title && <div className="card__title">{props.title}</div>}
      <div className="card__content">{props.children}</div>
    </div>
  ),
}));

import TaskStatistics from './index';
import { TaskCategory } from './types';

describe('TaskStatistics组件', () => {
  const mockCategories: TaskCategory[] = [
    { id: '1', name: '重要且紧急', count: 5, type: 'important-urgent' },
    { id: '2', name: '重要不紧急', count: 3, type: 'important-not-urgent' },
    { id: '3', name: '不重要但紧急', count: 2, type: 'not-important-urgent' },
    { id: '4', name: '不重要不紧急', count: 1, type: 'not-important-not-urgent' },
  ];

  test('正确渲染总完成任务数', () => {
    const totalCompleted = 10;
    render(<TaskStatistics totalCompleted={totalCompleted} categories={mockCategories} />);

    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('已完成任务')).toBeInTheDocument();
  });

  test('正确渲染所有类别', () => {
    render(<TaskStatistics totalCompleted={10} categories={mockCategories} />);

    mockCategories.forEach(category => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
      expect(screen.getByText(category.count.toString())).toBeInTheDocument();
    });
  });

  test('类别使用正确的CSS类名', () => {
    render(<TaskStatistics totalCompleted={10} categories={mockCategories} />);

    mockCategories.forEach(category => {
      const categoryElement = screen.getByText(category.name).closest('.task-statistics__category');
      expect(categoryElement).toHaveClass(`task-statistics__category--${category.type}`);
    });
  });

  test('应用额外的className', () => {
    const customClass = 'custom-class';
    const { container } = render(
      <TaskStatistics totalCompleted={10} categories={mockCategories} className={customClass} />
    );

    expect(container.firstChild).toHaveClass('task-statistics');
    expect(container.firstChild).toHaveClass(customClass);
  });

  test('使用Card组件渲染', () => {
    render(<TaskStatistics totalCompleted={10} categories={mockCategories} />);

    expect(screen.getByTestId('mocked-card')).toHaveClass('task-statistics');
    expect(screen.getByTestId('mocked-card').getAttribute('data-title')).toBe('任务统计');
  });

  test('处理空类别列表', () => {
    render(<TaskStatistics totalCompleted={10} categories={[]} />);

    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('已完成任务')).toBeInTheDocument();
    // 不应该有类别元素
    expect(screen.queryAllByTestId(/task-statistics__category/)).toHaveLength(0);
  });

  test('处理零完成任务', () => {
    render(<TaskStatistics totalCompleted={0} categories={mockCategories} />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  test('处理大量完成任务和类别', () => {
    const largeNumber = 9999;
    const manyCategories: TaskCategory[] = [
      { id: '1', name: '重要且紧急', count: 100, type: 'important-urgent' },
      { id: '2', name: '重要不紧急', count: 200, type: 'important-not-urgent' },
      { id: '3', name: '不重要但紧急', count: 300, type: 'not-important-urgent' },
      { id: '4', name: '不重要不紧急', count: 400, type: 'not-important-not-urgent' },
      { id: '5', name: '重要且紧急2', count: 500, type: 'important-urgent' },
      { id: '6', name: '重要不紧急2', count: 600, type: 'important-not-urgent' },
      { id: '7', name: '不重要但紧急2', count: 700, type: 'not-important-urgent' },
      { id: '8', name: '不重要不紧急2', count: 800, type: 'not-important-not-urgent' },
    ];

    render(<TaskStatistics totalCompleted={largeNumber} categories={manyCategories} />);

    expect(screen.getByText(largeNumber.toString())).toBeInTheDocument();
    manyCategories.forEach(category => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
    });
  });
});
