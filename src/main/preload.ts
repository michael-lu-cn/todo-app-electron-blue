import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../shared/constants/ipc-channels';
import { Todo, TodoList, Category, UserPreferences } from '../shared/types';

// 暴露给渲染进程的API
const api = {
  // Todo相关API
  todos: {
    getAll: (): Promise<Todo[]> => ipcRenderer.invoke(IPC_CHANNELS.GET_ALL_TODOS),
    create: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Promise<Todo> =>
      ipcRenderer.invoke(IPC_CHANNELS.CREATE_TODO, todo),
    update: (todo: Todo): Promise<Todo> =>
      ipcRenderer.invoke(IPC_CHANNELS.UPDATE_TODO, todo),
    toggle: (id: string): Promise<Todo> =>
      ipcRenderer.invoke(IPC_CHANNELS.TOGGLE_TODO, id),
    delete: (id: string): Promise<void> =>
      ipcRenderer.invoke(IPC_CHANNELS.DELETE_TODO, id),
  },

  // TodoList相关API
  lists: {
    getAll: (): Promise<TodoList[]> =>
      ipcRenderer.invoke(IPC_CHANNELS.GET_ALL_LISTS),
    create: (list: Omit<TodoList, 'id' | 'createdAt' | 'updatedAt' | 'todos'>): Promise<TodoList> =>
      ipcRenderer.invoke(IPC_CHANNELS.CREATE_LIST, list),
    update: (list: TodoList): Promise<TodoList> =>
      ipcRenderer.invoke(IPC_CHANNELS.UPDATE_LIST, list),
    delete: (id: string): Promise<void> =>
      ipcRenderer.invoke(IPC_CHANNELS.DELETE_LIST, id),
  },

  // Category相关API
  categories: {
    getAll: (): Promise<Category[]> =>
      ipcRenderer.invoke(IPC_CHANNELS.GET_ALL_CATEGORIES),
    create: (category: Omit<Category, 'id'>): Promise<Category> =>
      ipcRenderer.invoke(IPC_CHANNELS.CREATE_CATEGORY, category),
    update: (category: Category): Promise<Category> =>
      ipcRenderer.invoke(IPC_CHANNELS.UPDATE_CATEGORY, category),
    delete: (id: string): Promise<void> =>
      ipcRenderer.invoke(IPC_CHANNELS.DELETE_CATEGORY, id),
  },

  // 用户设置相关API
  userPreferences: {
    get: (): Promise<UserPreferences> =>
      ipcRenderer.invoke(IPC_CHANNELS.GET_USER_PREFERENCES),
    update: (preferences: UserPreferences): Promise<UserPreferences> =>
      ipcRenderer.invoke(IPC_CHANNELS.UPDATE_USER_PREFERENCES, preferences),
  },
};

// 使用contextBridge将API暴露给渲染进程
// 这样可以在保持安全的情况下允许渲染进程访问主进程功能
contextBridge.exposeInMainWorld('electronAPI', api);