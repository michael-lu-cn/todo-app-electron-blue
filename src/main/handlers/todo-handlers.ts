import { ipcMain } from 'electron';
import { v4 as uuidv4 } from 'uuid';
import { IPC_CHANNELS } from '../../shared/constants/ipc-channels';
import { Todo } from '../../shared/types';
import { TodoRepository } from '../repositories/todo-repository';

// Todo数据仓库实例
const todoRepository = new TodoRepository();

/**
 * 设置Todo相关的IPC处理程序
 */
export function setupTodoHandlers(): void {
  // 获取所有Todo
  ipcMain.handle(IPC_CHANNELS.GET_ALL_TODOS, async () => {
    return await todoRepository.getAll();
  });

  // 创建新的Todo
  ipcMain.handle(IPC_CHANNELS.CREATE_TODO, async (_, todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = Date.now();
    const newTodo: Todo = {
      ...todoData,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now
    };

    return await todoRepository.create(newTodo);
  });

  // 更新Todo
  ipcMain.handle(IPC_CHANNELS.UPDATE_TODO, async (_, todo: Todo) => {
    const updatedTodo: Todo = {
      ...todo,
      updatedAt: Date.now()
    };

    return await todoRepository.update(updatedTodo);
  });

  // 切换Todo的完成状态
  ipcMain.handle(IPC_CHANNELS.TOGGLE_TODO, async (_, id: string) => {
    const todo = await todoRepository.getById(id);
    if (!todo) {
      throw new Error(`Todo with id ${id} not found`);
    }

    const updatedTodo: Todo = {
      ...todo,
      completed: !todo.completed,
      updatedAt: Date.now()
    };

    return await todoRepository.update(updatedTodo);
  });

  // 删除Todo
  ipcMain.handle(IPC_CHANNELS.DELETE_TODO, async (_, id: string) => {
    await todoRepository.delete(id);
  });
}