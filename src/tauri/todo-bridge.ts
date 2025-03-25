import { invoke } from '@tauri-apps/api/core';

export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  priority: string; // "important-urgent" | "important-not-urgent" | "not-important-urgent" | "not-important-not-urgent"
  created_at: string;
}

/**
 * 获取所有Todo项
 */
export async function getAllTodos(): Promise<TodoItem[]> {
  try {
    return await invoke<TodoItem[]>('get_todos');
  } catch (error) {
    console.error('获取Todo项失败:', error);
    throw error;
  }
}

/**
 * 创建新的Todo项
 */
export async function createTodo(title: string, priority: string): Promise<TodoItem[]> {
  try {
    return await invoke<TodoItem[]>('create_todo', { title, priority });
  } catch (error) {
    console.error('创建Todo项失败:', error);
    throw error;
  }
}

/**
 * 切换Todo项的完成状态
 */
export async function toggleTodo(id: string): Promise<TodoItem[]> {
  try {
    return await invoke<TodoItem[]>('toggle_todo', { id });
  } catch (error) {
    console.error('切换Todo状态失败:', error);
    throw error;
  }
}

/**
 * 更新Todo项的优先级
 */
export async function updatePriority(id: string, priority: string): Promise<TodoItem[]> {
  try {
    return await invoke<TodoItem[]>('update_priority', { id, priority });
  } catch (error) {
    console.error('更新优先级失败:', error);
    throw error;
  }
}

/**
 * 删除Todo项
 */
export async function deleteTodo(id: string): Promise<TodoItem[]> {
  try {
    return await invoke<TodoItem[]>('delete_todo', { id });
  } catch (error) {
    console.error('删除Todo项失败:', error);
    throw error;
  }
} 