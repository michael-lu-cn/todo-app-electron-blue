import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Category } from '../../shared/types';

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  error: string | null;
  addCategory: (name: string, color?: string) => Promise<Category>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
  refreshCategories: () => Promise<void>;
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string | null) => void;
}

// 导出CategoryContext以便其他组件可以直接使用
export const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

interface CategoryProviderProps {
  children: ReactNode;
}

export const CategoryProvider: React.FC<CategoryProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const refreshCategories = async () => {
    try {
      setLoading(true);
      const fetchedCategories = await window.electronAPI.categories.getAll();
      setCategories(fetchedCategories);
      setError(null);
    } catch (err) {
      console.error('加载分类失败:', err);
      setError('加载分类失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCategories();
  }, []);

  const addCategory = async (name: string, color: string = '#3b82f6'): Promise<Category> => {
    try {
      const newCategory = await window.electronAPI.categories.create({ name, color });
      setCategories([...categories, newCategory]);
      return newCategory;
    } catch (err) {
      console.error('添加分类失败:', err);
      setError('添加分类失败，请稍后再试');
      throw err;
    }
  };

  const updateCategory = async (id: string, data: Partial<Category>): Promise<Category> => {
    try {
      const currentCategory = categories.find(cat => cat.id === id);
      if (!currentCategory) {
        throw new Error(`分类ID ${id} 不存在`);
      }

      const updatedData = {
        ...currentCategory,
        ...data,
      };

      const updatedCategory = await window.electronAPI.categories.update(updatedData);
      setCategories(categories.map(cat => cat.id === id ? updatedCategory : cat));
      return updatedCategory;
    } catch (err) {
      console.error('更新分类失败:', err);
      setError('更新分类失败，请稍后再试');
      throw err;
    }
  };

  const deleteCategory = async (id: string): Promise<void> => {
    try {
      await window.electronAPI.categories.delete(id);
      setCategories(categories.filter(cat => cat.id !== id));
      if (selectedCategoryId === id) {
        setSelectedCategoryId(null);
      }
    } catch (err) {
      console.error('删除分类失败:', err);
      setError('删除分类失败，请稍后再试');
      throw err;
    }
  };

  const value = {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    refreshCategories,
    selectedCategoryId,
    setSelectedCategoryId
  };

  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
};

export const useCategories = (): CategoryContextType => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};