import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Todo } from '../../shared/types';

// 定义添加Todo时的数据类型
type AddTodoData = Omit<Todo, 'id' | 'createdAt' | 'completed'>;

interface TodoContextType {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  addTodo: (todoData: AddTodoData) => Promise<Todo>;
  updateTodo: (id: string, data: Partial<Todo>) => Promise<Todo>;
  toggleTodo: (id: string) => Promise<Todo>;
  deleteTodo: (id: string) => Promise<void>;
  refreshTodos: () => Promise<void>;
  filteredTodos: Todo[];
  categoryFilter: string | null;
  setCategoryFilter: (categoryId: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

// 导出TodoContext以便其他组件可以直接使用
export const TodoContext = createContext<TodoContextType | undefined>(undefined);

interface TodoProviderProps {
  children: ReactNode;
}

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const refreshTodos = async () => {
    try {
      setLoading(true);
      const fetchedTodos = await window.electronAPI.todos.getAll();
      setTodos(fetchedTodos);
      setError(null);
    } catch (err) {
      console.error('加载待办事项失败:', err);
      setError('加载待办事项失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshTodos();
  }, []);

  const addTodo = async (todoData: AddTodoData): Promise<Todo> => {
    try {
      const newTodo = await window.electronAPI.todos.create(todoData);
      setTodos([...todos, newTodo]);
      return newTodo;
    } catch (err) {
      console.error('添加待办事项失败:', err);
      setError('添加待办事项失败，请稍后再试');
      throw err;
    }
  };

  const updateTodo = async (id: string, data: Partial<Todo>): Promise<Todo> => {
    try {
      const currentTodo = todos.find(todo => todo.id === id);
      if (!currentTodo) {
        throw new Error(`待办事项ID ${id} 不存在`);
      }

      const updatedData = {
        ...currentTodo,
        ...data,
      };

      const updatedTodo = await window.electronAPI.todos.update(updatedData);
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
      return updatedTodo;
    } catch (err) {
      console.error('更新待办事项失败:', err);
      setError('更新待办事项失败，请稍后再试');
      throw err;
    }
  };

  const toggleTodo = async (id: string): Promise<Todo> => {
    try {
      const updatedTodo = await window.electronAPI.todos.toggle(id);
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
      return updatedTodo;
    } catch (err) {
      console.error('切换待办事项状态失败:', err);
      setError('操作失败，请稍后再试');
      throw err;
    }
  };

  const deleteTodo = async (id: string): Promise<void> => {
    try {
      await window.electronAPI.todos.delete(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      console.error('删除待办事项失败:', err);
      setError('删除失败，请稍后再试');
      throw err;
    }
  };

  // 过滤待办事项
  const filteredTodos = todos.filter(todo => {
    // 分类过滤
    const categoryMatch = categoryFilter ? todo.categoryId === categoryFilter : true;

    // 搜索过滤
    const searchMatch = searchQuery
      ? todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        todo.content.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return categoryMatch && searchMatch;
  });

  const value = {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    refreshTodos,
    filteredTodos,
    categoryFilter,
    setCategoryFilter,
    searchQuery,
    setSearchQuery
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};

export const useTodos = (): TodoContextType => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};