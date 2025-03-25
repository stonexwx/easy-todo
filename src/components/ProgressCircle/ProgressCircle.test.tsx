import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProgressCircle from './index';
import '@testing-library/jest-dom';

describe('ProgressCircle组件', () => {
  test('正确渲染百分比值', () => {
    render(<ProgressCircle percentage={75} />);

    expect(screen.getByTestId('progress-value').textContent).toBe('75');
  });

  test('限制百分比值在0-100之间', () => {
    // 使用不同的container渲染两个实例，避免data-testid冲突
    const { container: container1 } = render(<ProgressCircle percentage={-10} />);
    const { container: container2 } = render(<ProgressCircle percentage={150} />);

    // 使用container查询而不是screen全局查询
    expect(container1.querySelector('[data-testid="progress-value"]')?.textContent).toBe('0');
    expect(container2.querySelector('[data-testid="progress-value"]')?.textContent).toBe('100');
  });

  test('应用额外的className', () => {
    const { container } = render(<ProgressCircle percentage={50} className="custom-class" />);

    expect(container.firstChild).toHaveClass('progress-circle');
    expect(container.firstChild).toHaveClass('custom-class');
  });

  test('应用自定义尺寸', () => {
    const customSize = 200;
    const { container } = render(<ProgressCircle percentage={50} size={customSize} />);

    const circle = container.firstChild as HTMLElement;
    expect(circle).toHaveStyle(`width: ${customSize}px`);
    expect(circle).toHaveStyle(`height: ${customSize}px`);
  });

  test('应用自定义颜色', () => {
    const customColor = '#ff0000';
    render(<ProgressCircle percentage={50} progressColor={customColor} />);

    const progressElement = document.querySelector('.progress-circle__progress');
    expect(progressElement).toHaveStyle(`stroke: ${customColor}`);
  });
});
