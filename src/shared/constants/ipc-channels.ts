import { IPCChannels } from '../types';

// 定义IPC通信通道
export const IPC_CHANNELS: IPCChannels = {
  // Todo相关
  GET_ALL_TODOS: 'get-all-todos',
  CREATE_TODO: 'create-todo',
  UPDATE_TODO: 'update-todo',
  TOGGLE_TODO: 'toggle-todo',
  DELETE_TODO: 'delete-todo',

  // TodoList相关
  GET_ALL_LISTS: 'get-all-lists',
  CREATE_LIST: 'create-list',
  UPDATE_LIST: 'update-list',
  DELETE_LIST: 'delete-list',

  // Category相关
  GET_ALL_CATEGORIES: 'get-all-categories',
  CREATE_CATEGORY: 'create-category',
  UPDATE_CATEGORY: 'update-category',
  DELETE_CATEGORY: 'delete-category',

  // 用户设置相关
  GET_USER_PREFERENCES: 'get-user-preferences',
  UPDATE_USER_PREFERENCES: 'update-user-preferences'
};