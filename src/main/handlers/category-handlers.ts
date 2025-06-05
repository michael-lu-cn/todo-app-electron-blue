import { ipcMain } from 'electron';
import { v4 as uuidv4 } from 'uuid';
import { IPC_CHANNELS } from '../../shared/constants/ipc-channels';
import { Category } from '../../shared/types';
import { CategoryRepository } from '../repositories/category-repository';

// Category数据仓库实例
const categoryRepository = new CategoryRepository();

/**
 * 设置Category相关的IPC处理程序
 */
export function setupCategoryHandlers(): void {
  // 获取所有Category
  ipcMain.handle(IPC_CHANNELS.GET_ALL_CATEGORIES, async () => {
    return await categoryRepository.getAll();
  });

  // 创建新的Category
  ipcMain.handle(
    IPC_CHANNELS.CREATE_CATEGORY,
    async (_, categoryData: Omit<Category, 'id'>) => {
      const newCategory: Category = {
        ...categoryData,
        id: uuidv4()
      };

      return await categoryRepository.create(newCategory);
    }
  );

  // 更新Category
  ipcMain.handle(IPC_CHANNELS.UPDATE_CATEGORY, async (_, category: Category) => {
    return await categoryRepository.update(category);
  });

  // 删除Category
  ipcMain.handle(IPC_CHANNELS.DELETE_CATEGORY, async (_, id: string) => {
    await categoryRepository.delete(id);
  });
}