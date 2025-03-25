import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/react';
import ProgressCircle from './index';

describe('ProgressCircle组件', () => {
  test('正确渲染百分比值', () => {
    const { getByTestId } = render(<ProgressCircle percentage={75} />);

    expect(getByTestId('progress-value').textContent).toBe('75');
  });

  test('限制百分比值在0-100之间', () => {
    const { getByTestId: getByTestIdNegative } = render(<ProgressCircle percentage={-25} />);
    expect(getByTestIdNegative('progress-value').textContent).toBe('0');

    const { getByTestId: getByTestIdOver } = render(<ProgressCircle percentage={150} />);
    expect(getByTestIdOver('progress-value').textContent).toBe('100');
  });

  test('应用额外的className', () => {
    const { container } = render(<ProgressCircle percentage={50} className="custom-class" />);
    expect(container.firstChild).toHaveClass('progress-circle');
    expect(container.firstChild).toHaveClass('custom-class');
  });

  test('应用自定义尺寸', () => {
    const customSize = 200;
    const { container } = render(<ProgressCircle percentage={50} size={customSize} />);
    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('width', customSize.toString());
    expect(svg).toHaveAttribute('height', customSize.toString());
  });

  test('应用自定义颜色', () => {
    const circleColor = '#cccccc';
    const progressColor = '#ff0000';
    const { container } = render(
      <ProgressCircle percentage={50} circleColor={circleColor} progressColor={progressColor} />
    );

    const circles = container.querySelectorAll('circle');
    expect(circles[0]).toHaveStyle(`stroke: ${circleColor}`);
    expect(circles[1]).toHaveStyle(`stroke: ${progressColor}`);
  });
});
