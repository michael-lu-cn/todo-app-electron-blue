import { Todo, TodoList, Category, UserPreferences } from '../../shared/types';

declare global {
  interface Window {
    electronAPI: {
      // Todo相关API
      todos: {
        getAll: () => Promise<Todo[]>;
        create: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Todo>;
        update: (todo: Todo) => Promise<Todo>;
        toggle: (id: string) => Promise<Todo>;
        delete: (id: string) => Promise<void>;
      };

      // TodoList相关API
      lists: {
        getAll: () => Promise<TodoList[]>;
        create: (list: Omit<TodoList, 'id' | 'createdAt' | 'updatedAt' | 'todos'>) => Promise<TodoList>;
        update: (list: TodoList) => Promise<TodoList>;
        delete: (id: string) => Promise<void>;
      };

      // Category相关API
      categories: {
        getAll: () => Promise<Category[]>;
        create: (category: Omit<Category, 'id'>) => Promise<Category>;
        update: (category: Category) => Promise<Category>;
        delete: (id: string) => Promise<void>;
      };

      // 用户设置相关API
      userPreferences: {
        get: () => Promise<UserPreferences>;
        update: (preferences: UserPreferences) => Promise<UserPreferences>;
      };
    };
  }
}

// 导出一个空对象，使这个文件成为一个模块
export {};