import React from 'react';
import { TimePeriodTabsProps } from './types';
import './style.scss';

const TimePeriodTabs: React.FC<TimePeriodTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = '',
}) => {
  return (
    <div className={`time-period-tabs ${className}`}>
      {tabs.map(tab => (
        <div
          key={tab.id}
          className={`time-period-tabs__tab ${activeTab === tab.id ? 'time-period-tabs__tab--active' : ''}`}
          onClick={() => onTabChange(tab.id)}
          data-testid={`tab-${tab.id}`}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
};

export default TimePeriodTabs;
