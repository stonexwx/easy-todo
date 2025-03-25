export type TimePeriod = 'day' | 'month' | 'year';

export interface TimePeriodTab {
  id: TimePeriod;
  label: string;
}

export interface TimePeriodTabsProps {
  tabs: TimePeriodTab[];
  activeTab: TimePeriod;
  onTabChange: (tab: TimePeriod) => void;
  className?: string;
} 