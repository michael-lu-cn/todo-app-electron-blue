import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import App from './App';
import { Todo, TodoList, Category, UserPreferences } from '../shared/types';
import AppProviders from './contexts/AppProviders';

// 声明全局类型
declare global {
  interface Window {
    electronAPI: {
      todos: {
        getAll: () => Promise<Todo[]>;
        create: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Todo>;
        update: (todo: Todo) => Promise<Todo>;
        toggle: (id: string) => Promise<Todo>;
        delete: (id: string) => Promise<void>;
      };
      lists: {
        getAll: () => Promise<TodoList[]>;
        create: (list: Omit<TodoList, 'id' | 'createdAt' | 'updatedAt' | 'todos'>) => Promise<TodoList>;
        update: (list: TodoList) => Promise<TodoList>;
        delete: (id: string) => Promise<void>;
      };
      categories: {
        getAll: () => Promise<Category[]>;
        create: (category: Omit<Category, 'id'>) => Promise<Category>;
        update: (category: Category) => Promise<Category>;
        delete: (id: string) => Promise<void>;
      };
      userPreferences: {
        get: () => Promise<UserPreferences>;
        update: (preferences: UserPreferences) => Promise<UserPreferences>;
      };
    };
  }
}

// 渲染React应用
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <AppProviders>
        <App />
      </AppProviders>
    </React.StrictMode>
  );
}