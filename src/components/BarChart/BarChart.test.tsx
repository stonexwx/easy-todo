import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/react';
import BarChart from './index';
import { DataPoint } from './types';
import '@testing-library/jest-dom';

describe('BarChart组件', () => {
  const mockData: DataPoint[] = [
    { name: '星期一', value: 10 },
    { name: '星期二', value: 15 },
    { name: '星期三', value: 8 },
    { name: '星期四', value: 12 },
  ];

  test('正确渲染图表', () => {
    const { container } = render(<BarChart data={mockData} />);

    // 检查是否渲染了图表容器
    expect(container.querySelector('.bar-chart__container')).toBeInTheDocument();
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
  });

  test('渲染标题（如果提供）', () => {
    const title = '每周任务完成情况';
    const { container } = render(<BarChart data={mockData} title={title} />);

    // 通过实际内容检查标题是否正确渲染
    const titleElement = container.querySelector('.card__title');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement?.textContent).toBe(title);
  });

  test('不渲染标题（如果未提供）', () => {
    const { container } = render(<BarChart data={mockData} />);

    // 确认没有渲染标题元素
    expect(container.querySelector('.card__title')).not.toBeInTheDocument();
  });

  test('应用自定义高度', () => {
    const customHeight = 500;
    const { container } = render(<BarChart data={mockData} height={customHeight} />);

    const chartContainer = container.querySelector('.bar-chart__container');
    expect(chartContainer).toHaveStyle(`height: ${customHeight}px`);
  });

  test('应用额外的className', () => {
    const { container } = render(<BarChart data={mockData} className="custom-class" />);

    expect(container.firstChild).toHaveClass('bar-chart');
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
