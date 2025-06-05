import { Category } from '../../shared/types';
import { BaseRepository } from './base-repository';

/**
 * Category数据仓库，负责Category数据的持久化存储和操作
 */
export class CategoryRepository extends BaseRepository<Category> {
  constructor() {
    super('categories');
  }

  /**
   * 根据ID获取Category
   * @param id Category的ID
   * @returns Category对象，如果未找到则返回undefined
   */
  async getById(id: string): Promise<Category | undefined> {
    const categories = await this.getAll();
    return categories.find(category => category.id === id);
  }

  /**
   * 获取所有Category
   * @returns Category数组
   */
  async getAll(): Promise<Category[]> {
    return await this.load() || [];
  }

  /**
   * 创建新的Category
   * @param category 要创建的Category对象
   * @returns 创建后的Category对象
   */
  async create(category: Category): Promise<Category> {
    const categories = await this.getAll();
    categories.push(category);
    await this.save(categories);
    return category;
  }

  /**
   * 更新Category
   * @param category 要更新的Category对象
   * @returns 更新后的Category对象
   */
  async update(category: Category): Promise<Category> {
    const categories = await this.getAll();
    const index = categories.findIndex(c => c.id === category.id);

    if (index === -1) {
      throw new Error(`Category with id ${category.id} not found`);
    }

    categories[index] = category;
    await this.save(categories);
    return category;
  }

  /**
   * 删除Category
   * @param id 要删除的Category的ID
   */
  async delete(id: string): Promise<void> {
    const categories = await this.getAll();
    const filteredCategories = categories.filter(category => category.id !== id);

    if (filteredCategories.length === categories.length) {
      throw new Error(`Category with id ${id} not found`);
    }

    await this.save(filteredCategories);
  }

  /**
   * 根据名称查找Category
   * @param name Category的名称
   * @returns 匹配的Category对象，如果未找到则返回undefined
   */
  async getByName(name: string): Promise<Category | undefined> {
    const categories = await this.getAll();
    return categories.find(category => category.name === name);
  }
}