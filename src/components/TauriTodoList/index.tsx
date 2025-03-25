import React, { useState, useEffect } from 'react';
import {
  TodoItem,
  getAllTodos,
  createTodo,
  toggleTodo,
  updatePriority,
  deleteTodo,
} from '../../tauri/todo-bridge';
import Card from '../Card';
import './style.scss';

const TauriTodoList: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState('important-urgent');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载所有Todo
  useEffect(() => {
    const loadTodos = async () => {
      try {
        setLoading(true);
        const todoItems = await getAllTodos();
        setTodos(todoItems);
        setError(null);
      } catch (err) {
        console.error('加载Todo失败:', err);
        setError('无法加载Todo项目。请检查Tauri后端是否正常运行。');
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, []);

  // 添加新Todo
  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    try {
      const updatedTodos = await createTodo(newTodoTitle, newTodoPriority);
      setTodos(updatedTodos);
      setNewTodoTitle('');
      setError(null);
    } catch (err) {
      console.error('添加Todo失败:', err);
      setError('添加Todo项目失败。');
    }
  };

  // 切换Todo完成状态
  const handleToggleTodo = async (id: string) => {
    try {
      const updatedTodos = await toggleTodo(id);
      setTodos(updatedTodos);
      setError(null);
    } catch (err) {
      console.error('切换Todo状态失败:', err);
      setError('更新Todo状态失败。');
    }
  };

  // 更新Todo优先级
  const handleUpdatePriority = async (id: string, priority: string) => {
    try {
      const updatedTodos = await updatePriority(id, priority);
      setTodos(updatedTodos);
      setError(null);
    } catch (err) {
      console.error('更新优先级失败:', err);
      setError('更新Todo优先级失败。');
    }
  };

  // 删除Todo
  const handleDeleteTodo = async (id: string) => {
    try {
      const updatedTodos = await deleteTodo(id);
      setTodos(updatedTodos);
      setError(null);
    } catch (err) {
      console.error('删除Todo失败:', err);
      setError('删除Todo项目失败。');
    }
  };

  const getPriorityLabel = (priority: string): string => {
    switch (priority) {
      case 'important-urgent':
        return '重要且紧急';
      case 'important-not-urgent':
        return '重要不紧急';
      case 'not-important-urgent':
        return '不重要但紧急';
      case 'not-important-not-urgent':
        return '不重要不紧急';
      default:
        return '未知优先级';
    }
  };

  return (
    <Card className="tauri-todo-list" title="Tauri Todo 列表">
      <div className="tauri-todo-list__container">
        {error && <div className="tauri-todo-list__error">{error}</div>}

        <form className="tauri-todo-list__form" onSubmit={handleAddTodo}>
          <input
            type="text"
            value={newTodoTitle}
            onChange={e => setNewTodoTitle(e.target.value)}
            placeholder="添加新的Todo..."
            className="tauri-todo-list__input"
            aria-label="新Todo的标题"
          />

          <select
            value={newTodoPriority}
            onChange={e => setNewTodoPriority(e.target.value)}
            className="tauri-todo-list__select"
            aria-label="新Todo的优先级"
          >
            <option value="important-urgent">重要且紧急</option>
            <option value="important-not-urgent">重要不紧急</option>
            <option value="not-important-urgent">不重要但紧急</option>
            <option value="not-important-not-urgent">不重要不紧急</option>
          </select>

          <button type="submit" className="tauri-todo-list__button">
            添加
          </button>
        </form>

        {loading ? (
          <div className="tauri-todo-list__loading">加载中...</div>
        ) : todos.length === 0 ? (
          <div className="tauri-todo-list__empty">暂无Todo项目</div>
        ) : (
          <ul className="tauri-todo-list__items">
            {todos.map(todo => (
              <li
                key={todo.id}
                className={`tauri-todo-list__item tauri-todo-list__item--${todo.priority} ${
                  todo.completed ? 'tauri-todo-list__item--completed' : ''
                }`}
              >
                <div className="tauri-todo-list__item-content">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo.id)}
                    className="tauri-todo-list__checkbox"
                    aria-label={`标记"${todo.title}"为${todo.completed ? '未完成' : '已完成'}`}
                  />

                  <span className="tauri-todo-list__title">{todo.title}</span>

                  <span className="tauri-todo-list__priority">
                    {getPriorityLabel(todo.priority)}
                  </span>

                  <div className="tauri-todo-list__actions">
                    <select
                      value={todo.priority}
                      onChange={e => handleUpdatePriority(todo.id, e.target.value)}
                      className="tauri-todo-list__priority-select"
                      aria-label={`修改"${todo.title}"的优先级`}
                    >
                      <option value="important-urgent">重要且紧急</option>
                      <option value="important-not-urgent">重要不紧急</option>
                      <option value="not-important-urgent">不重要但紧急</option>
                      <option value="not-important-not-urgent">不重要不紧急</option>
                    </select>

                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="tauri-todo-list__delete-button"
                      aria-label={`删除"${todo.title}"`}
                    >
                      删除
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
};

export default TauriTodoList;
