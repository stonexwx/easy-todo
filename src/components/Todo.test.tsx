import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Todo from './Todo';
import * as matchers from '@testing-library/jest-dom/matchers';

// 扩展expect
expect.extend(matchers);

describe('Todo 组件', () => {
  test('应该渲染空状态', () => {
    const { getByTestId } = render(<Todo />);
    expect(getByTestId('empty-message')).toBeInTheDocument();
    expect(getByTestId('empty-message').textContent).toContain('没有待办事项');
  });

  test('应该能添加待办事项', async () => {
    const user = userEvent.setup();
    const { getByTestId, getByText, queryByTestId } = render(<Todo />);

    // 查找输入框和按钮
    const input = getByTestId('todo-input');
    const addButton = getByTestId('add-button');

    // 输入文本并点击添加
    await user.type(input, '测试待办事项');
    await user.click(addButton);

    // 验证待办事项已添加
    const todoItem = getByText('测试待办事项');
    expect(todoItem).toBeInTheDocument();

    // 验证输入框已清空
    expect(input).toHaveValue('');

    // 验证空消息不再显示
    expect(queryByTestId('empty-message')).not.toBeInTheDocument();
  });

  test('应该能标记待办事项为已完成', async () => {
    const user = userEvent.setup();
    const { getByTestId, getByText, queryByTestId } = render(<Todo />);

    // 添加待办事项
    await user.type(getByTestId('todo-input'), '待完成项目');
    await user.click(getByTestId('add-button'));

    // 找到新添加的待办事项并获取复选框
    const todoText = getByText('待完成项目');

    // 使用data-testid找到匹配的复选框
    const checkbox = queryByTestId(new RegExp(`todo-checkbox-\\d+`));

    // 点击复选框
    if (checkbox) {
      await user.click(checkbox);

      // 验证文本样式更改
      expect(todoText).toHaveClass('line-through');
    } else {
      throw new Error('找不到复选框元素');
    }
  });
});
