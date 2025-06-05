/**
 * 存储工具函数
 */

/**
 * 将数据保存到localStorage
 * @param key 存储键
 * @param data 要存储的数据
 */
export function saveToLocalStorage<T>(key: string, data: T): void {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (error) {
    console.error('保存到localStorage失败:', error);
  }
}

/**
 * 从localStorage获取数据
 * @param key 存储键
 * @param defaultValue 默认值（如果未找到数据）
 * @returns 存储的数据或默认值
 */
export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return defaultValue;
    }
    return JSON.parse(serializedData) as T;
  } catch (error) {
    console.error('从localStorage获取数据失败:', error);
    return defaultValue;
  }
}

/**
 * 从localStorage删除数据
 * @param key 存储键
 */
export function removeFromLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('从localStorage删除数据失败:', error);
  }
}

/**
 * 清空localStorage中的所有数据
 */
export function clearLocalStorage(): void {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('清空localStorage失败:', error);
  }
}