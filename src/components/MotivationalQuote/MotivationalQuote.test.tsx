import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ReactNode, CSSProperties } from 'react';

// 在文件顶部进行模拟，而不是在测试内部
vi.mock('../Card', () => ({
  default: (props: {
    children?: ReactNode;
    className?: string;
    variant?: string;
    padding?: string;
    customStyle?: CSSProperties;
    [key: string]: unknown;
  }) => {
    return (
      <div
        data-testid="mocked-card"
        data-class-name={props.className || ''}
        data-variant={props.variant || ''}
        data-padding={props.padding || ''}
        className={props.className || ''}
      >
        {props.children}
      </div>
    );
  },
}));

import MotivationalQuote from './index';

describe('MotivationalQuote组件', () => {
  test('正确渲染引言文本', () => {
    const text = '行动是治愈恐惧的良药';
    render(<MotivationalQuote text={text} />);

    expect(screen.getByText(text)).toBeInTheDocument();
  });

  test('渲染作者（如果提供）', () => {
    const author = '威廉·詹姆斯';
    render(<MotivationalQuote text="行动是治愈恐惧的良药" author={author} />);

    expect(screen.getByText(author, { exact: false })).toBeInTheDocument();
  });

  test('不会崩溃（如果未提供作者）', () => {
    render(<MotivationalQuote text="行动是治愈恐惧的良药" />);
    // 如果测试通过，说明组件没有因为缺少author而崩溃
  });

  test('应用额外的className', () => {
    const { container } = render(
      <MotivationalQuote text="行动是治愈恐惧的良药" className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('motivational-quote');
    expect(container.firstChild).toHaveClass('custom-class');
  });

  test('Card组件接收正确的props', () => {
    const text = '行动是治愈恐惧的良药';
    const author = '威廉·詹姆斯';
    const className = 'custom-class';

    render(<MotivationalQuote text={text} author={author} className={className} />);

    const card = screen.getByTestId('mocked-card');

    expect(card.getAttribute('data-class-name')).toContain('motivational-quote');
    expect(card.getAttribute('data-class-name')).toContain(className);
    expect(card.getAttribute('data-variant')).toBe('glass');
    expect(card.getAttribute('data-padding')).toBe('lg');
    // 无法直接检查customStyle，但我们可以通过渲染结果看到效果
  });

  test('处理长文本和长作者名', () => {
    const longText =
      '这是一段非常长的励志名言引用，用于测试组件在处理长文本时的表现，确保文本不会溢出容器，并且保持良好的排版和可读性。';
    const longAuthor = '这是一个非常长的作者名称，用于测试组件在处理长名称时的表现';

    render(<MotivationalQuote text={longText} author={longAuthor} />);

    expect(screen.getByText(longText)).toBeInTheDocument();
    expect(screen.getByText(longAuthor, { exact: false })).toBeInTheDocument();
  });
});
