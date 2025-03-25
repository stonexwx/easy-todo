import { useState } from 'react';

export interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

export default function Todo() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (input.trim() === '') return;
    
    const newTodo: TodoItem = {
      id: Date.now(),
      text: input,
      completed: false,
    };
    
    setTodos([...todos, newTodo]);
    setInput('');
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="card max-w-md mx-auto my-8">
      <h1 className="text-2xl font-bold mb-4">待办事项列表</h1>
      
      <div className="flex mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="添加新的待办事项..."
          className="flex-1 px-3 py-2 border rounded-l focus:outline-none"
          data-testid="todo-input"
        />
        <button 
          onClick={addTodo}
          className="btn-primary rounded-l-none"
          data-testid="add-button"
        >
          添加
        </button>
      </div>
      
      <ul className="space-y-2">
        {todos.map(todo => (
          <li 
            key={todo.id} 
            className="flex items-center p-2 border rounded group hover:bg-gray-50"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="mr-2"
              data-testid={`todo-checkbox-${todo.id}`}
              aria-label={`标记 ${todo.text} 为${todo.completed ? '未完成' : '已完成'}`}
            />
            <span 
              className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : ''}`}
              data-testid={`todo-text-${todo.id}`}
            >
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              data-testid={`delete-button-${todo.id}`}
            >
              删除
            </button>
          </li>
        ))}
      </ul>
      {todos.length === 0 && (
        <p className="text-gray-500 text-center py-4" data-testid="empty-message">
          没有待办事项，请添加一个！
        </p>
      )}
    </div>
  );
} 