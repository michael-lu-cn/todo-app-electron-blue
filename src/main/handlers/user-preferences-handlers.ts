import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../shared/constants/ipc-channels';
import { UserPreferences, Theme, SortOrder, ViewMode } from '../../shared/types';
import { UserPreferencesRepository } from '../repositories/user-preferences-repository';

// 用户设置数据仓库实例
const userPreferencesRepository = new UserPreferencesRepository();

// 默认用户设置
const defaultPreferences: UserPreferences = {
  theme: Theme.System,
  sortOrder: SortOrder.CreatedDesc,
  viewMode: ViewMode.List
};

/**
 * 设置用户设置相关的IPC处理程序
 */
export function setupUserPreferencesHandlers(): void {
  // 获取用户设置
  ipcMain.handle(IPC_CHANNELS.GET_USER_PREFERENCES, async () => {
    const preferences = await userPreferencesRepository.get();
    return preferences || defaultPreferences;
  });

  // 更新用户设置
  ipcMain.handle(IPC_CHANNELS.UPDATE_USER_PREFERENCES, async (_, preferences: UserPreferences) => {
    return await userPreferencesRepository.update(preferences);
  });
}