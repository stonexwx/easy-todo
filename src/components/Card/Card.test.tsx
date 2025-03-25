import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from './index';
import '@testing-library/jest-dom';

describe('Card组件', () => {
  test('正确渲染子元素', () => {
    const childText = '测试内容';
    render(<Card>{childText}</Card>);

    expect(screen.getByText(childText)).toBeInTheDocument();
  });

  test('正确渲染标题（如果提供）', () => {
    const title = '卡片标题';
    render(<Card title={title}>内容</Card>);

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(title).className).toContain('card__title');
  });

  test('正确应用默认类名', () => {
    const { container } = render(<Card>内容</Card>);

    expect(container.firstChild).toHaveClass('card');
    expect(container.firstChild).toHaveClass('card--default');
    expect(container.firstChild).toHaveClass('card--padding-md');
  });

  test('正确应用自定义类名', () => {
    const customClass = 'custom-class';
    const { container } = render(<Card className={customClass}>内容</Card>);

    expect(container.firstChild).toHaveClass('card');
    expect(container.firstChild).toHaveClass(customClass);
  });

  test('正确应用变体样式', () => {
    const variants = ['default', 'elevated', 'bordered', 'glass'] as const;

    variants.forEach(variant => {
      const { container } = render(<Card variant={variant}>内容</Card>);
      expect(container.firstChild).toHaveClass(`card--${variant}`);
    });
  });

  test('正确应用内边距变体', () => {
    const paddings = ['none', 'sm', 'md', 'lg'] as const;

    paddings.forEach(padding => {
      const { container } = render(<Card padding={padding}>内容</Card>);
      expect(container.firstChild).toHaveClass(`card--padding-${padding}`);
    });
  });

  test('正确应用自定义样式', () => {
    const customStyle = { backgroundColor: 'rgb(255, 0, 0)', color: 'rgb(255, 255, 255)' };
    const { container } = render(<Card customStyle={customStyle}>内容</Card>);

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveStyle('background-color: rgb(255, 0, 0)');
    expect(card).toHaveStyle('color: rgb(255, 255, 255)');
  });

  test('内容被包裹在正确的容器中', () => {
    const content = '卡片内容';
    render(<Card>{content}</Card>);

    // 查找包含内容的元素
    const contentElement = screen.getByText(content);
    // 检查内容元素是否在card__content类的容器内
    const contentContainer = contentElement.closest('.card__content');
    expect(contentContainer).not.toBeNull();
    expect(contentContainer).toHaveClass('card__content');
  });

  test('呈现复杂的子组件', () => {
    render(
      <Card>
        <div data-testid="complex-child">
          <p>段落1</p>
          <p>段落2</p>
        </div>
      </Card>
    );

    expect(screen.getByTestId('complex-child')).toBeInTheDocument();
    expect(screen.getByText('段落1')).toBeInTheDocument();
    expect(screen.getByText('段落2')).toBeInTheDocument();
  });

  test('呈现复杂的标题', () => {
    render(
      <Card
        title={
          <div data-testid="complex-title">
            <span>复杂标题</span>
          </div>
        }
      >
        内容
      </Card>
    );

    expect(screen.getByTestId('complex-title')).toBeInTheDocument();
    expect(screen.getByText('复杂标题')).toBeInTheDocument();
  });
});
