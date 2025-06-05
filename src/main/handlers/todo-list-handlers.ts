import { ipcMain } from 'electron';
import { v4 as uuidv4 } from 'uuid';
import { IPC_CHANNELS } from '../../shared/constants/ipc-channels';
import { TodoList } from '../../shared/types';
import { TodoListRepository } from '../repositories/todo-list-repository';

// TodoList数据仓库实例
const todoListRepository = new TodoListRepository();

/**
 * 设置TodoList相关的IPC处理程序
 */
export function setupTodoListHandlers(): void {
  // 获取所有TodoList
  ipcMain.handle(IPC_CHANNELS.GET_ALL_LISTS, async () => {
    return await todoListRepository.getAll();
  });

  // 创建新的TodoList
  ipcMain.handle(
    IPC_CHANNELS.CREATE_LIST,
    async (_, listData: Omit<TodoList, 'id' | 'createdAt' | 'updatedAt' | 'todos'>) => {
      const now = Date.now();
      const newList: TodoList = {
        ...listData,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now,
        todos: []
      };

      return await todoListRepository.create(newList);
    }
  );

  // 更新TodoList
  ipcMain.handle(IPC_CHANNELS.UPDATE_LIST, async (_, list: TodoList) => {
    const updatedList: TodoList = {
      ...list,
      updatedAt: Date.now()
    };

    return await todoListRepository.update(updatedList);
  });

  // 删除TodoList
  ipcMain.handle(IPC_CHANNELS.DELETE_LIST, async (_, id: string) => {
    await todoListRepository.delete(id);
  });
}