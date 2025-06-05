import Store from 'electron-store';

/**
 * 基础数据仓库类，提供通用的数据持久化操作
 */
export class BaseRepository<T> {
  private store: Store;
  private key: string;

  /**
   * 构造函数
   * @param key 存储键名
   */
  constructor(key: string) {
    this.store = new Store();
    this.key = key;
  }

  /**
   * 从存储中加载数据
   * @returns 加载的数据
   */
  protected async load(): Promise<T[]> {
    return this.store.get(this.key, []) as T[];
  }

  /**
   * 保存数据到存储
   * @param data 要保存的数据
   */
  protected async save(data: T[]): Promise<void> {
    this.store.set(this.key, data);
  }
}