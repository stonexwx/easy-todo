import React, { useState, useEffect } from 'react';
import {
  saveGitLabConfig,
  getGitLabConfig,
  fetchGitLabIssues,
  convertIssueToTodo,
  GitLabIssue,
} from '../services/gitlab-api';
import Card from '../components/Card';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import { FiHome, FiList, FiSettings, FiGitlab, FiActivity } from 'react-icons/fi';

import '../styles/GitLabIntegration.scss';

const GitLabIntegration: React.FC = () => {
  const [activeNavItem, setActiveNavItem] = useState('gitlab');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // GitLab配置
  const [baseUrl, setBaseUrl] = useState('');
  const [privateToken, setPrivateToken] = useState('');
  const [configLoaded, setConfigLoaded] = useState(false);

  // 项目ID和状态
  const [projectId, setProjectId] = useState('');
  const [issueState, setIssueState] = useState('opened');

  // 获取到的issues
  const [issues, setIssues] = useState<GitLabIssue[]>([]);

  // 加载GitLab配置
  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        const config = await getGitLabConfig();
        if (config) {
          setBaseUrl(config.baseUrl);
          setPrivateToken(config.privateToken);
          setConfigLoaded(true);
        }
      } catch (err) {
        console.error('加载GitLab配置失败:', err);
        setError('无法加载GitLab配置。');
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  // 保存GitLab配置
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await saveGitLabConfig({ baseUrl, privateToken });
      setConfigLoaded(true);
      setSuccess('GitLab配置已保存。');
    } catch (err) {
      console.error('保存GitLab配置失败:', err);
      setError('保存GitLab配置失败。');
    } finally {
      setLoading(false);
    }
  };

  // 获取GitLab issues
  const handleFetchIssues = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectId || isNaN(parseInt(projectId))) {
      setError('请输入有效的项目ID。');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const fetchedIssues = await fetchGitLabIssues(
        parseInt(projectId),
        issueState as 'opened' | 'closed' | 'all'
      );
      setIssues(fetchedIssues);

      if (fetchedIssues.length === 0) {
        setSuccess('未找到匹配的任务。');
      } else {
        setSuccess(`成功获取${fetchedIssues.length}个任务。`);
      }
    } catch (err) {
      console.error('获取GitLab issues失败:', err);
      setError('获取GitLab issues失败。');
    } finally {
      setLoading(false);
    }
  };

  // 将issue转为Todo
  const handleConvertToTodo = async (issue: GitLabIssue, priority: string) => {
    try {
      setLoading(true);
      setError(null);

      await convertIssueToTodo(issue, priority);

      // 从列表中移除
      setIssues(prevIssues => prevIssues.filter(i => i.id !== issue.id));

      setSuccess(`已将"${issue.title}"添加到Todo列表。`);
    } catch (err) {
      console.error('转换为Todo失败:', err);
      setError('转换为Todo失败。');
    } finally {
      setLoading(false);
    }
  };

  // 侧边栏配置
  const sidebarItems = [
    { id: 'home', label: '首页', icon: <FiHome /> },
    { id: 'tasks', label: '任务', icon: <FiList /> },
    {
      id: 'gitlab',
      label: 'GitLab',
      icon: <FiGitlab />,
      badge: issues.length > 0 ? issues.length : undefined,
    },
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
          <h1 className="page-title">GitLab 集成</h1>

          {/* 错误和成功提示 */}
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {/* GitLab配置 */}
          <Card title="GitLab 配置" className="gitlab-config-card">
            <form onSubmit={handleSaveConfig}>
              <div className="form-group">
                <label htmlFor="base-url">GitLab URL</label>
                <input
                  id="base-url"
                  type="text"
                  value={baseUrl}
                  onChange={e => setBaseUrl(e.target.value)}
                  placeholder="例如: https://gitlab.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="private-token">Private Token</label>
                <input
                  id="private-token"
                  type="password"
                  value={privateToken}
                  onChange={e => setPrivateToken(e.target.value)}
                  placeholder="您的 GitLab API Token"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? '保存中...' : '保存配置'}
              </button>
            </form>
          </Card>

          {/* 获取Issues */}
          {configLoaded && (
            <Card title="获取 GitLab Issues" className="gitlab-issues-card">
              <form onSubmit={handleFetchIssues}>
                <div className="form-group">
                  <label htmlFor="project-id">项目ID</label>
                  <input
                    id="project-id"
                    type="number"
                    value={projectId}
                    onChange={e => setProjectId(e.target.value)}
                    placeholder="GitLab 项目ID"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="issue-state">Issue 状态</label>
                  <select
                    id="issue-state"
                    value={issueState}
                    onChange={e => setIssueState(e.target.value)}
                  >
                    <option value="opened">开放的</option>
                    <option value="closed">已关闭的</option>
                    <option value="all">全部</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? '获取中...' : '获取 Issues'}
                </button>
              </form>

              {/* 显示Issues列表 */}
              {issues.length > 0 && (
                <div className="issues-list">
                  <h3>Issues 列表</h3>
                  <ul>
                    {issues.map(issue => (
                      <li key={issue.id} className="issue-item">
                        <div className="issue-details">
                          <h4>{issue.title}</h4>
                          <div className="issue-meta">
                            <span className="issue-id">#{issue.iid}</span>
                            <span className={`issue-state issue-state-${issue.state}`}>
                              {issue.state}
                            </span>
                          </div>
                          <p className="issue-description">
                            {issue.description.length > 100
                              ? `${issue.description.substring(0, 100)}...`
                              : issue.description}
                          </p>
                        </div>
                        <div className="issue-actions">
                          <div className="priority-buttons">
                            <button
                              onClick={() => handleConvertToTodo(issue, 'important-urgent')}
                              className="btn btn-sm btn-priority priority-important-urgent"
                              title="添加为重要且紧急"
                              disabled={loading}
                            >
                              重要且紧急
                            </button>
                            <button
                              onClick={() => handleConvertToTodo(issue, 'important-not-urgent')}
                              className="btn btn-sm btn-priority priority-important-not-urgent"
                              title="添加为重要不紧急"
                              disabled={loading}
                            >
                              重要不紧急
                            </button>
                            <button
                              onClick={() => handleConvertToTodo(issue, 'not-important-urgent')}
                              className="btn btn-sm btn-priority priority-not-important-urgent"
                              title="添加为不重要但紧急"
                              disabled={loading}
                            >
                              不重要但紧急
                            </button>
                            <button
                              onClick={() => handleConvertToTodo(issue, 'not-important-not-urgent')}
                              className="btn btn-sm btn-priority priority-not-important-not-urgent"
                              title="添加为不重要不紧急"
                              disabled={loading}
                            >
                              不重要不紧急
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default GitLabIntegration;
