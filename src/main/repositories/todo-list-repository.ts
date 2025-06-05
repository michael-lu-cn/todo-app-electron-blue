import { TodoList } from '../../shared/types';
import { BaseRepository } from './base-repository';

/**
 * TodoList数据仓库，负责TodoList数据的持久化存储和操作
 */
export class TodoListRepository extends BaseRepository<TodoList> {
  constructor() {
    super('todoLists');
  }

  /**
   * 根据ID获取TodoList
   * @param id TodoList的ID
   * @returns TodoList对象，如果未找到则返回undefined
   */
  async getById(id: string): Promise<TodoList | undefined> {
    const lists = await this.getAll();
    return lists.find(list => list.id === id);
  }

  /**
   * 获取所有TodoList
   * @returns TodoList数组
   */
  async getAll(): Promise<TodoList[]> {
    return await this.load() || [];
  }

  /**
   * 创建新的TodoList
   * @param list 要创建的TodoList对象
   * @returns 创建后的TodoList对象
   */
  async create(list: TodoList): Promise<TodoList> {
    const lists = await this.getAll();
    lists.push(list);
    await this.save(lists);
    return list;
  }

  /**
   * 更新TodoList
   * @param list 要更新的TodoList对象
   * @returns 更新后的TodoList对象
   */
  async update(list: TodoList): Promise<TodoList> {
    const lists = await this.getAll();
    const index = lists.findIndex(l => l.id === list.id);

    if (index === -1) {
      throw new Error(`TodoList with id ${list.id} not found`);
    }

    lists[index] = list;
    await this.save(lists);
    return list;
  }

  /**
   * 删除TodoList
   * @param id 要删除的TodoList的ID
   */
  async delete(id: string): Promise<void> {
    const lists = await this.getAll();
    const filteredLists = lists.filter(list => list.id !== id);

    if (filteredLists.length === lists.length) {
      throw new Error(`TodoList with id ${id} not found`);
    }

    await this.save(filteredLists);
  }

  /**
   * 根据用户ID获取TodoList列表
   * @param userId 用户的ID
   * @returns 属于该用户的TodoList数组
   */
  async getByUserId(userId: string): Promise<TodoList[]> {
    const lists = await this.getAll();
    return lists.filter(list => list.userId === userId);
  }
}