import React, { useState } from 'react';
import { FiHome, FiCalendar, FiSettings, FiList, FiActivity } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import TimePeriodTabs from '../components/TimePeriodTabs';
import QuadrantGrid from '../components/QuadrantGrid';
import ProgressCircle from '../components/ProgressCircle';
import TaskStatistics from '../components/TaskStatistics';
import MotivationalQuote from '../components/MotivationalQuote';
import BarChart from '../components/BarChart';
import Card from '../components/Card';
import TauriTodoList from '../components/TauriTodoList';

import { TimePeriod } from '../components/TimePeriodTabs/types';
import { TaskPriority } from '../components/QuadrantGrid/types';

const Dashboard: React.FC = () => {
  // 添加导航功能
  const navigate = useNavigate();

  // 状态
  const [activeNavItem, setActiveNavItem] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTimePeriod, setActiveTimePeriod] = useState<TimePeriod>('day');
  const [showTauriTodo, setShowTauriTodo] = useState(false);

  // 模拟数据
  const sidebarItems = [
    { id: 'home', label: '首页', icon: <FiHome /> },
    { id: 'tasks', label: '任务', icon: <FiList />, badge: 5 },
    { id: 'tauri', label: 'Tauri任务', icon: <FiList /> },
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
    {
      id: 'important-urgent',
      name: '重要且紧急',
      count: 1,
      type: 'important-urgent' as const,
    },
    {
      id: 'important-not-urgent',
      name: '重要不紧急',
      count: 2,
      type: 'important-not-urgent' as const,
    },
    {
      id: 'not-important-urgent',
      name: '不重要但紧急',
      count: 3,
      type: 'not-important-urgent' as const,
    },
    {
      id: 'not-important-not-urgent',
      name: '不重要不紧急',
      count: 4,
      type: 'not-important-not-urgent' as const,
    },
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

  // 处理导航变化
  const handleNavItemClick = (itemId: string) => {
    setActiveNavItem(itemId);

    // 根据ID导航到相应页面
    switch (itemId) {
      case 'home':
      case 'tasks':
        setShowTauriTodo(false);
        break;
      case 'tauri':
        setShowTauriTodo(true);
        break;
      case 'gitlab':
        navigate('/gitlab');
        break;
      case 'ai':
      case 'analytics':
        navigate('/ai');
        break;
      case 'settings':
        // 暂时不导航
        break;
    }
  };

  return (
    <Layout>
      <Sidebar
        items={sidebarItems}
        activeItemId={activeNavItem}
        onItemClick={handleNavItemClick}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className={`layout__main ${sidebarCollapsed ? 'layout__main--collapsed' : ''}`}>
        <div className="layout__content">
          {/* 时间周期选择器 */}
          {!showTauriTodo && (
            <TimePeriodTabs
              tabs={timePeriodTabs}
              activeTab={activeTimePeriod}
              onTabChange={setActiveTimePeriod}
            />
          )}

          {/* 主要内容区 */}
          {showTauriTodo ? (
            <div className="mt-6">
              <TauriTodoList />
            </div>
          ) : (
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
                <div className="h-[160px]">
                  <Card variant="elevated" padding="md" hover={false}>
                    <div className="flex-center h-full">
                      <ProgressCircle percentage={75} size={120} strokeWidth={8} />
                    </div>
                  </Card>
                </div>

                {/* 任务统计 */}
                <div className="h-[300px]">
                  <TaskStatistics totalCompleted={19} categories={taskCategories} />
                </div>

                {/* 励志名言 */}
                <div className="h-[160px]">
                  <MotivationalQuote text="行动是治愈恐惧的良药。" author="威廉·詹姆斯" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
