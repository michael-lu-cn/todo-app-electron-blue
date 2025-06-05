// 定义Todo实体类型
export interface Todo {
  id: string;
  title: string;
  content: string;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
  categoryId?: string;
  priority: Priority;
  dueDate?: number;
}

// 定义TodoList实体类型
export interface TodoList {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  userId: string;
  todos: Todo[];
}

// 定义Category实体类型
export interface Category {
  id: string;
  name: string;
  color: string;
}

// 定义User实体类型
export interface User {
  id: string;
  name: string;
  preferences: UserPreferences;
}

// 定义UserPreferences值对象
export interface UserPreferences {
  theme: Theme;
  themeColor: ThemeColor;
  sortOrder: SortOrder;
  viewMode: ViewMode;
}

// 枚举定义
export enum Priority {
  Low = 'low',
  Medium = 'medium',
  High = 'high'
}

export enum Theme {
  Light = 'light',
  Dark = 'dark',
  System = 'system'
}

export enum ThemeColor {
  Sky = 'sky',
  Blue = 'blue',
  Indigo = 'indigo',
  Violet = 'violet',
  Rose = 'rose',
  Emerald = 'emerald',
  Amber = 'amber',
  Slate = 'slate'
}

export enum SortOrder {
  CreatedAsc = 'created_asc',
  CreatedDesc = 'created_desc',
  DueAsc = 'due_asc',
  DueDesc = 'due_desc',
  PriorityAsc = 'priority_asc',
  PriorityDesc = 'priority_desc'
}

export enum ViewMode {
  List = 'list',
  Grid = 'grid'
}

// IPC通信类型
export interface IPCChannels {
  // Todo相关
  GET_ALL_TODOS: string;
  CREATE_TODO: string;
  UPDATE_TODO: string;
  TOGGLE_TODO: string;
  DELETE_TODO: string;

  // TodoList相关
  GET_ALL_LISTS: string;
  CREATE_LIST: string;
  UPDATE_LIST: string;
  DELETE_LIST: string;

  // Category相关
  GET_ALL_CATEGORIES: string;
  CREATE_CATEGORY: string;
  UPDATE_CATEGORY: string;
  DELETE_CATEGORY: string;

  // 用户设置相关
  GET_USER_PREFERENCES: string;
  UPDATE_USER_PREFERENCES: string;
}