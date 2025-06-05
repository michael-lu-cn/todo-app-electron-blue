import { Todo } from '../../shared/types';
import { BaseRepository } from './base-repository';

/**
 * Todo数据仓库，负责Todo数据的持久化存储和操作
 */
export class TodoRepository extends BaseRepository<Todo> {
  constructor() {
    super('todos');
  }

  /**
   * 根据ID获取Todo
   * @param id Todo的ID
   * @returns Todo对象，如果未找到则返回undefined
   */
  async getById(id: string): Promise<Todo | undefined> {
    const todos = await this.getAll();
    return todos.find(todo => todo.id === id);
  }

  /**
   * 获取所有Todo
   * @returns Todo数组
   */
  async getAll(): Promise<Todo[]> {
    return await this.load() || [];
  }

  /**
   * 创建新的Todo
   * @param todo 要创建的Todo对象
   * @returns 创建后的Todo对象
   */
  async create(todo: Todo): Promise<Todo> {
    const todos = await this.getAll();
    todos.push(todo);
    await this.save(todos);
    return todo;
  }

  /**
   * 更新Todo
   * @param todo 要更新的Todo对象
   * @returns 更新后的Todo对象
   */
  async update(todo: Todo): Promise<Todo> {
    const todos = await this.getAll();
    const index = todos.findIndex(t => t.id === todo.id);

    if (index === -1) {
      throw new Error(`Todo with id ${todo.id} not found`);
    }

    todos[index] = todo;
    await this.save(todos);
    return todo;
  }

  /**
   * 删除Todo
   * @param id 要删除的Todo的ID
   */
  async delete(id: string): Promise<void> {
    const todos = await this.getAll();
    const filteredTodos = todos.filter(todo => todo.id !== id);

    if (filteredTodos.length === todos.length) {
      throw new Error(`Todo with id ${id} not found`);
    }

    await this.save(filteredTodos);
  }

  /**
   * 根据TodoList ID获取Todo列表
   * @param listId TodoList的ID
   * @returns 属于该TodoList的Todo数组
   */
  async getByListId(listId: string): Promise<Todo[]> {
    const todos = await this.getAll();
    return todos.filter(todo => (todo as any).listId === listId);
  }

  /**
   * 根据分类ID获取Todo列表
   * @param categoryId 分类的ID
   * @returns 属于该分类的Todo数组
   */
  async getByCategoryId(categoryId: string): Promise<Todo[]> {
    const todos = await this.getAll();
    return todos.filter(todo => todo.categoryId === categoryId);
  }
}