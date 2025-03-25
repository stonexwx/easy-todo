import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/react';
import MotivationalQuote from './index';

describe('MotivationalQuote组件', () => {
  test('正确渲染引言文本', () => {
    const quote = '行动是治愈恐惧的良药';
    const { getByTestId } = render(<MotivationalQuote quote={quote} />);

    expect(getByTestId('quote-text').textContent).toBe(quote);
  });

  test('渲染作者（如果提供）', () => {
    const author = '威廉·詹姆斯';
    const { getByTestId } = render(
      <MotivationalQuote quote="行动是治愈恐惧的良药" author={author} />
    );

    expect(getByTestId('quote-author').textContent).toBe(author);
  });

  test('不渲染作者（如果未提供）', () => {
    const { queryByTestId } = render(<MotivationalQuote quote="行动是治愈恐惧的良药" />);

    expect(queryByTestId('quote-author')).toBeNull();
  });

  test('应用额外的className', () => {
    const { container } = render(
      <MotivationalQuote quote="行动是治愈恐惧的良药" className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('motivational-quote');
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
