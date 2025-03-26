import React, { useState, useEffect } from 'react';
import { saveAIConfig, getAIConfig, generateWorkReport, AIReport } from '../services/ai-service';
import Card from '../components/Card';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import { FiHome, FiList, FiSettings, FiGitlab, FiActivity } from 'react-icons/fi';

import '../styles/AIReport.scss';

const AIReportPage: React.FC = () => {
  const [activeNavItem, setActiveNavItem] = useState('ai');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // AI配置
  const [apiKey, setApiKey] = useState('');
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [configLoaded, setConfigLoaded] = useState(false);

  // 报告配置
  const [reportPeriod, setReportPeriod] = useState('本周');
  const [customPrompt, setCustomPrompt] = useState('');

  // 生成的报告
  const [report, setReport] = useState<AIReport | null>(null);

  // 加载AI配置
  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        const config = await getAIConfig();
        if (config) {
          setApiKey(config.apiKey);
          setApiEndpoint(config.apiEndpoint);
          setConfigLoaded(true);
        }
      } catch (err) {
        console.error('加载AI配置失败:', err);
        setError('无法加载AI配置。');
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  // 保存AI配置
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await saveAIConfig({ apiKey, apiEndpoint });
      setConfigLoaded(true);
      setSuccess('AI配置已保存。');
    } catch (err) {
      console.error('保存AI配置失败:', err);
      setError('保存AI配置失败。');
    } finally {
      setLoading(false);
    }
  };

  // 生成工作报告
  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      setReport(null);

      const generatedReport = await generateWorkReport(
        reportPeriod,
        customPrompt.trim() || undefined
      );

      setReport(generatedReport);
      setSuccess('工作报告生成成功。');
    } catch (err) {
      console.error('生成工作报告失败:', err);
      setError('生成工作报告失败。请检查API配置和网络连接。');
    } finally {
      setLoading(false);
    }
  };

  // 复制报告到剪贴板
  const handleCopyReport = () => {
    if (!report) return;

    navigator.clipboard
      .writeText(report.content)
      .then(() => {
        setSuccess('报告已复制到剪贴板。');
      })
      .catch(() => {
        setError('复制报告失败。');
      });
  };

  // 侧边栏配置
  const sidebarItems = [
    { id: 'home', label: '首页', icon: <FiHome /> },
    { id: 'tasks', label: '任务', icon: <FiList /> },
    { id: 'gitlab', label: 'GitLab', icon: <FiGitlab /> },
    { id: 'ai', label: 'AI报告', icon: <FiActivity /> },
    { id: 'settings', label: '设置', icon: <FiSettings /> },
  ];

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
          <h1 className="page-title">AI 工作报告生成</h1>

          {/* 错误和成功提示 */}
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {/* AI配置 */}
          <Card title="AI 配置" className="ai-config-card">
            <form onSubmit={handleSaveConfig}>
              <div className="form-group">
                <label htmlFor="api-key">API Key</label>
                <input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="您的 AI API Key"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="api-endpoint">API Endpoint</label>
                <input
                  id="api-endpoint"
                  type="text"
                  value={apiEndpoint}
                  onChange={e => setApiEndpoint(e.target.value)}
                  placeholder="例如: https://api.deepseek.com/v1/chat/completions"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? '保存中...' : '保存配置'}
              </button>
            </form>
          </Card>

          {/* 生成报告 */}
          {configLoaded && (
            <Card title="生成工作报告" className="report-generator-card">
              <form onSubmit={handleGenerateReport}>
                <div className="form-group">
                  <label htmlFor="report-period">报告时间段</label>
                  <select
                    id="report-period"
                    value={reportPeriod}
                    onChange={e => setReportPeriod(e.target.value)}
                  >
                    <option value="本日">本日</option>
                    <option value="本周">本周</option>
                    <option value="本月">本月</option>
                    <option value="本季度">本季度</option>
                    <option value="本年">本年</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="custom-prompt">自定义提示（可选，例如特定格式要求）</label>
                  <textarea
                    id="custom-prompt"
                    value={customPrompt}
                    onChange={e => setCustomPrompt(e.target.value)}
                    placeholder="请使用表格形式总结每项任务的完成情况..."
                    rows={4}
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? '生成中...' : '生成报告'}
                </button>
              </form>

              {/* 显示生成的报告 */}
              {report && (
                <div className="report-result">
                  <div className="report-header">
                    <h3>工作报告 - {report.period}</h3>
                    <button
                      onClick={handleCopyReport}
                      className="btn btn-sm btn-secondary"
                      title="复制到剪贴板"
                    >
                      复制
                    </button>
                  </div>
                  <div className="report-content">
                    {report.content.split('\n').map((line, index) => (
                      <p key={index}>{line || <br />}</p>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AIReportPage;
