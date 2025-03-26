import { invoke } from '@tauri-apps/api/core';

export interface AIConfig {
  apiKey: string;
  apiEndpoint: string;
}

export interface AIReport {
  period: string;
  content: string;
  createdAt: number;
}

/**
 * 保存AI配置
 */
export async function saveAIConfig(config: AIConfig): Promise<boolean> {
  try {
    // 转换成后端期望的格式
    const backendConfig = {
      api_key: config.apiKey,
      api_endpoint: config.apiEndpoint,
    };
    return await invoke<boolean>('save_ai_config', { config: backendConfig });
  } catch (error) {
    console.error('保存AI配置失败:', error);
    throw error;
  }
}

/**
 * 获取AI配置
 */
export async function getAIConfig(): Promise<AIConfig | null> {
  try {
    const config = await invoke<{ api_key: string; api_endpoint: string } | null>('get_ai_config');
    if (!config) return null;
    
    // 转换成前端格式
    return {
      apiKey: config.api_key,
      apiEndpoint: config.api_endpoint,
    };
  } catch (error) {
    console.error('获取AI配置失败:', error);
    throw error;
  }
}

/**
 * 生成工作报告
 */
export async function generateWorkReport(
  period: string,
  customPrompt?: string
): Promise<AIReport> {
  try {
    const report = await invoke<{
      period: string;
      content: string;
      created_at: number;
    }>('generate_work_report', {
      period,
      customPrompt,
    });
    
    // 转换成前端格式
    return {
      period: report.period,
      content: report.content,
      createdAt: report.created_at,
    };
  } catch (error) {
    console.error('生成工作报告失败:', error);
    throw error;
  }
} 