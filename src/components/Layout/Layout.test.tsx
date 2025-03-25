import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/react';
import Layout from './index';

describe('Layout组件', () => {
  test('正确渲染子元素', () => {
    const { getByText } = render(
      <Layout>
        <div>测试内容</div>
      </Layout>
    );

    expect(getByText('测试内容')).toBeInTheDocument();
  });

  test('应用额外的className', () => {
    const { container } = render(
      <Layout className="custom-class">
        <div>测试内容</div>
      </Layout>
    );

    expect(container.firstChild).toHaveClass('layout');
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
