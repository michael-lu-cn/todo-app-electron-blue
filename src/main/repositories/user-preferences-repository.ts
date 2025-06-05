import Store from 'electron-store';
import { UserPreferences, Theme, SortOrder, ViewMode } from '../../shared/types';

/**
 * 用户设置数据仓库，负责用户设置数据的持久化存储和操作
 */
export class UserPreferencesRepository {
  private store: Store;
  private readonly PREFERENCES_KEY = 'userPreferences';

  // 默认用户设置
  private readonly DEFAULT_PREFERENCES: UserPreferences = {
    theme: Theme.System,
    sortOrder: SortOrder.CreatedDesc,
    viewMode: ViewMode.List
  };

  constructor() {
    this.store = new Store();
  }

  /**
   * 获取用户设置
   * @returns 用户设置对象
   */
  async get(): Promise<UserPreferences> {
    return this.store.get(this.PREFERENCES_KEY, this.DEFAULT_PREFERENCES) as UserPreferences;
  }

  /**
   * 更新用户设置
   * @param preferences 要更新的用户设置对象
   * @returns 更新后的用户设置对象
   */
  async update(preferences: UserPreferences): Promise<UserPreferences> {
    this.store.set(this.PREFERENCES_KEY, preferences);
    return preferences;
  }

  /**
   * 重置用户设置为默认值
   * @returns 默认的用户设置对象
   */
  async reset(): Promise<UserPreferences> {
    this.store.set(this.PREFERENCES_KEY, this.DEFAULT_PREFERENCES);
    return this.DEFAULT_PREFERENCES;
  }
}