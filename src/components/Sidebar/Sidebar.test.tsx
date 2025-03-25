import { describe, test, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { FiHome, FiCalendar, FiSettings } from 'react-icons/fi';
import Sidebar from './index';

describe('Sidebar组件', () => {
  const mockItems = [
    { id: 'home', label: '首页', icon: <FiHome /> },
    { id: 'calendar', label: '日历', icon: <FiCalendar /> },
    { id: 'settings', label: '设置', icon: <FiSettings /> },
  ];

  test('渲染所有项目', () => {
    const { getByText } = render(<Sidebar items={mockItems} />);

    expect(getByText('首页')).toBeInTheDocument();
    expect(getByText('日历')).toBeInTheDocument();
    expect(getByText('设置')).toBeInTheDocument();
  });

  test('点击项目时触发回调', () => {
    const onItemClick = vi.fn();
    const { getByTestId } = render(<Sidebar items={mockItems} onItemClick={onItemClick} />);

    fireEvent.click(getByTestId('sidebar-item-calendar'));
    expect(onItemClick).toHaveBeenCalledWith('calendar');
  });

  test('点击折叠按钮时触发回调', () => {
    const onToggleCollapse = vi.fn();
    const { getByTestId } = render(
      <Sidebar items={mockItems} onToggleCollapse={onToggleCollapse} />
    );

    fireEvent.click(getByTestId('sidebar-toggle-button'));
    expect(onToggleCollapse).toHaveBeenCalled();
  });

  test('折叠状态下显示正确的样式', () => {
    const { container } = render(<Sidebar items={mockItems} collapsed={true} />);

    expect(container.firstChild).toHaveClass('sidebar--collapsed');
  });
});
