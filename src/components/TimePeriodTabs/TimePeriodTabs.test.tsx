import { describe, test, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import TimePeriodTabs from './index';
import { TimePeriod } from './types';

describe('TimePeriodTabs组件', () => {
  const tabs = [
    { id: 'day' as TimePeriod, label: '日' },
    { id: 'month' as TimePeriod, label: '月' },
    { id: 'year' as TimePeriod, label: '年' },
  ];

  test('渲染所有标签', () => {
    const { getByText } = render(
      <TimePeriodTabs tabs={tabs} activeTab="day" onTabChange={() => {}} />
    );

    expect(getByText('日')).toBeInTheDocument();
    expect(getByText('月')).toBeInTheDocument();
    expect(getByText('年')).toBeInTheDocument();
  });

  test('高亮活动标签', () => {
    const { getByTestId } = render(
      <TimePeriodTabs tabs={tabs} activeTab="month" onTabChange={() => {}} />
    );

    expect(getByTestId('tab-month')).toHaveClass('time-period-tabs__tab--active');
    expect(getByTestId('tab-day')).not.toHaveClass('time-period-tabs__tab--active');
    expect(getByTestId('tab-year')).not.toHaveClass('time-period-tabs__tab--active');
  });

  test('点击标签时触发回调', () => {
    const onTabChange = vi.fn();
    const { getByTestId } = render(
      <TimePeriodTabs tabs={tabs} activeTab="day" onTabChange={onTabChange} />
    );

    fireEvent.click(getByTestId('tab-year'));
    expect(onTabChange).toHaveBeenCalledWith('year');
  });
});
