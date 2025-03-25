import React, { useState } from 'react';
import { FiHome, FiCalendar, FiSettings, FiList, FiActivity } from 'react-icons/fi';

import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import TimePeriodTabs from '../components/TimePeriodTabs';
import QuadrantGrid from '../components/QuadrantGrid';
import ProgressCircle from '../components/ProgressCircle';
import TaskStatistics from '../components/TaskStatistics';
import MotivationalQuote from '../components/MotivationalQuote';
import BarChart from '../components/BarChart';

import { TimePeriod } from '../components/TimePeriodTabs/types';
import { TaskPriority } from '../components/QuadrantGrid/types';

const Dashboard: React.FC = () => {
  // 状态
  const [activeNavItem, setActiveNavItem] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTimePeriod, setActiveTimePeriod] = useState<TimePeriod>('day');

  // 模拟数据
  const sidebarItems = [
    { id: 'home', label: '首页', icon: <FiHome /> },
    { id: 'tasks', label: '任务', icon: <FiList />, badge: 5 },
    { id: 'calendar', label: '日历', icon: <FiCalendar /> },
    { id: 'analytics', label: '分析', icon: <FiActivity /> },
    { id: 'settings', label: '设置', icon: <FiSettings /> },
  ];

  const timePeriodTabs = [
    { id: 'day' as TimePeriod, label: '日' },
    { id: 'month' as TimePeriod, label: '月' },
    { id: 'year' as TimePeriod, label: '年' },
  ];

  const tasks = [
    { id: '1', title: '完成项目报告', priority: TaskPriority.IMPORTANT_URGENT },
    { id: '2', title: '健身锻炼', priority: TaskPriority.IMPORTANT_NOT_URGENT },
    { id: '3', title: '回复邮件', priority: TaskPriority.NOT_IMPORTANT_URGENT },
    { id: '4', title: '整理文件', priority: TaskPriority.NOT_IMPORTANT_NOT_URGENT },
    { id: '5', title: '团队会议', priority: TaskPriority.IMPORTANT_URGENT, completed: true },
  ];

  const taskCategories = [
    { id: 'important-urgent', label: '重要且紧急', count: 1 },
    { id: 'important-not-urgent', label: '重要不紧急', count: 2 },
    { id: 'not-important-urgent', label: '不重要但紧急', count: 3 },
    { id: 'not-important-not-urgent', label: '不重要不紧急', count: 4 },
  ];

  const barChartData = [
    { name: '周一', value: 4 },
    { name: '周二', value: 7 },
    { name: '周三', value: 5 },
    { name: '周四', value: 8 },
    { name: '周五', value: 6 },
    { name: '周六', value: 3 },
    { name: '周日', value: 2 },
  ];

  // 处理函数
  const handleTaskClick = (taskId: string) => {
    console.log(`Task clicked: ${taskId}`);
  };

  const handleTaskComplete = (taskId: string, completed: boolean) => {
    console.log(`Task ${taskId} marked as ${completed ? 'completed' : 'not completed'}`);
  };

  const handleAddTask = (priority: TaskPriority) => {
    console.log(`Add task in priority: ${priority}`);
  };

  return (
    <Layout>
      <Sidebar
        items={sidebarItems}
        activeItemId={activeNavItem}
        onItemClick={setActiveNavItem}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className={`layout__main ${sidebarCollapsed ? 'layout__main--collapsed' : ''}`}>
        <div className="layout__content">
          {/* 时间周期选择器 */}
          <TimePeriodTabs
            tabs={timePeriodTabs}
            activeTab={activeTimePeriod}
            onTabChange={setActiveTimePeriod}
          />

          {/* 主要内容区 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2">
              {/* 四象限表格 */}
              <div className="h-[500px] mb-6">
                <QuadrantGrid
                  tasks={tasks}
                  onTaskClick={handleTaskClick}
                  onTaskComplete={handleTaskComplete}
                  onAddTask={handleAddTask}
                />
              </div>

              {/* 图表区域 */}
              <div className="mb-6">
                <BarChart
                  data={barChartData}
                  title="每日完成任务数"
                  xAxisLabel="星期"
                  yAxisLabel="任务数"
                  height={250}
                />
              </div>
            </div>

            <div className="col-span-1 space-y-6">
              {/* 进度环 */}
              <div className="card flex-center py-8">
                <ProgressCircle percentage={75} size={150} strokeWidth={10} />
              </div>

              {/* 任务统计 */}
              <div className="h-[250px]">
                <TaskStatistics totalCompleted={19} categories={taskCategories} />
              </div>

              {/* 励志名言 */}
              <div className="h-[200px]">
                <MotivationalQuote quote="行动是治愈恐惧的良药。" author="威廉·詹姆斯" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
