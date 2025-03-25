import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/react';
import TaskStatistics from './index';
import { TaskCategory } from './types';

describe('TaskStatistics组件', () => {
  const mockCategories: TaskCategory[] = [
    { id: 'important-urgent', label: '重要且紧急', count: 1 },
    { id: 'important-not-urgent', label: '重要不紧急', count: 2 },
    { id: 'not-important-urgent', label: '不重要但紧急', count: 3 },
    { id: 'not-important-not-urgent', label: '不重要不紧急', count: 4 },
  ];

  test('正确渲染总完成数', () => {
    const { getByTestId } = render(
      <TaskStatistics totalCompleted={19} categories={mockCategories} />
    );

    expect(getByTestId('total-completed').textContent).toBe('19');
  });

  test('渲染所有分类', () => {
    const { getByTestId, getByText } = render(
      <TaskStatistics totalCompleted={10} categories={mockCategories} />
    );

    mockCategories.forEach(category => {
      expect(getByTestId(`category-${category.id}`)).toBeInTheDocument();
      expect(getByText(category.label)).toBeInTheDocument();
      expect(getByText(category.count.toString())).toBeInTheDocument();
    });
  });

  test('应用自定义颜色', () => {
    const customColor = '#00ff00';
    const categoriesWithCustomColor = [
      ...mockCategories,
      { id: 'custom', label: '自定义颜色', count: 5, color: customColor },
    ];

    const { getByTestId } = render(
      <TaskStatistics totalCompleted={10} categories={categoriesWithCustomColor} />
    );

    const customCategory = getByTestId('category-custom');
    const colorDiv = customCategory.querySelector('.task-statistics__category-color');

    expect(colorDiv).toHaveStyle(`background-color: ${customColor}`);
  });

  test('应用额外的className', () => {
    const { container } = render(
      <TaskStatistics totalCompleted={10} categories={mockCategories} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('task-statistics');
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
