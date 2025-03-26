import { invoke } from '@tauri-apps/api/core';

export interface GitLabConfig {
  baseUrl: string;
  privateToken: string;
}

export interface GitLabIssue {
  id: number;
  iid: number;
  title: string;
  description: string;
  state: string;
  created_at: string;
  updated_at: string;
  labels: string[];
  milestone: {
    id: number;
    title: string;
  } | null;
  web_url: string;
}

// 保存GitLab配置
export async function saveGitLabConfig(config: GitLabConfig): Promise<boolean> {
  try {
    return await invoke<boolean>('save_gitlab_config', { config });
  } catch (error) {
    console.error('保存GitLab配置失败:', error);
    throw error;
  }
}

// 获取GitLab配置
export async function getGitLabConfig(): Promise<GitLabConfig | null> {
  try {
    return await invoke<GitLabConfig | null>('get_gitlab_config');
  } catch (error) {
    console.error('获取GitLab配置失败:', error);
    throw error;
  }
}

// 从GitLab获取任务
export async function fetchGitLabIssues(
  projectId: number,
  state: 'opened' | 'closed' | 'all' = 'opened'
): Promise<GitLabIssue[]> {
  try {
    return await invoke<GitLabIssue[]>('fetch_gitlab_issues', { projectId, state });
  } catch (error) {
    console.error('获取GitLab issues失败:', error);
    throw error;
  }
}

// 将GitLab issue转换为Todo
export async function convertIssueToTodo(
  issue: GitLabIssue,
  priority: string
): Promise<boolean> {
  try {
    return await invoke<boolean>('convert_issue_to_todo', { issue, priority });
  } catch (error) {
    console.error('转换GitLab issue失败:', error);
    throw error;
  }
} 