import React, { useState, useContext } from 'react';
import { useCategories } from '../../contexts/CategoryContext';
import { Button } from '../ui/button';
import { PlusIcon } from '../ui/icons';
import { Input } from '../ui/input';
import { ThemeContext } from '../../contexts/ThemeContext';
import { THEME_COLOR } from '../../App';

interface CategoryFormData {
  name: string;
  color: string;
}

interface CategoryListProps {
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  selectedCategoryId,
  onSelectCategory
}) => {
  const {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory
  } = useCategories();

  const { isDarkMode, themeColor } = useContext(ThemeContext)!;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({ name: '', color: '#3b82f6' });

  const handleSelectCategory = (categoryId: string | null) => {
    onSelectCategory(categoryId);
  };

  const handleAddClick = () => {
    setFormData({ name: '', color: '#3b82f6' });
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (id: string) => {
    const category = categories.find(c => c.id === id);
    if (category) {
      setFormData({ name: category.name, color: category.color });
      setEditingCategory(id);
      setIsFormOpen(true);
    }
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm('确定要删除这个分类吗？')) {
      await deleteCategory(id);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory, formData);
      } else {
        await addCategory(formData.name, formData.color);
      }
      setIsFormOpen(false);
      setEditingCategory(null);
      setFormData({ name: '', color: '#3b82f6' });
    } catch (err) {
      console.error('保存分类失败:', err);
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', color: '#3b82f6' });
  };

  // 主题相关样式
  const textClass = isDarkMode ? `text-${THEME_COLOR.neutral}-100` : `text-${THEME_COLOR.neutral}-800`;
  const mutedTextClass = isDarkMode ? `text-${THEME_COLOR.neutral}-400` : `text-${THEME_COLOR.neutral}-500`;
  const borderClass = isDarkMode ? `border-${THEME_COLOR.neutral}-700` : `border-${THEME_COLOR.neutral}-200`;
  const inputBgClass = isDarkMode ? `bg-${THEME_COLOR.neutral}-700` : 'bg-white';
  const hoverClass = isDarkMode ? `hover:bg-${THEME_COLOR.neutral}-700` : `hover:bg-${THEME_COLOR.neutral}-100`;
  const selectedClass = isDarkMode
    ? `bg-${themeColor}-900/50`
    : `bg-${themeColor}-50`;
  const formBgClass = isDarkMode ? `bg-${THEME_COLOR.neutral}-800` : 'bg-white';

  const primaryButtonClass = isDarkMode
    ? `bg-${themeColor}-600 hover:bg-${themeColor}-700 text-white`
    : `bg-${themeColor}-500 hover:bg-${themeColor}-600 text-white`;
  const outlineButtonClass = isDarkMode
    ? `border-${THEME_COLOR.neutral}-600 text-${THEME_COLOR.neutral}-300 hover:bg-${THEME_COLOR.neutral}-700`
    : `border-${THEME_COLOR.neutral}-300 text-${THEME_COLOR.neutral}-700 hover:bg-${THEME_COLOR.neutral}-100`;

  if (loading) {
    return <div className={`p-4 text-center ${mutedTextClass}`}>加载中...</div>;
  }

  if (error) {
    return <div className={`p-4 text-center text-${THEME_COLOR.danger}-500`}>{error}</div>;
  }

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-lg font-medium ${textClass}`}>分类</h3>
        <Button size="sm" onClick={handleAddClick} className={primaryButtonClass}>
          <PlusIcon className="h-4 w-4 mr-1" />
          添加
        </Button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleFormSubmit} className={`mb-4 p-3 border rounded-md ${borderClass} ${formBgClass}`}>
          <div className="mb-3">
            <label className={`block text-sm mb-1 ${textClass}`}>名称</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="分类名称"
              required
              className={`${inputBgClass} ${borderClass}`}
            />
          </div>
          <div className="mb-3">
            <label className={`block text-sm mb-1 ${textClass}`}>颜色</label>
            <div className="flex items-center">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-10 h-10 rounded-md mr-2 cursor-pointer"
              />
              <Input
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="#HEX颜色"
                className={`flex-1 ${inputBgClass} ${borderClass}`}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleFormCancel} className={outlineButtonClass}>
              取消
            </Button>
            <Button type="submit" className={primaryButtonClass}>
              {editingCategory ? '更新' : '添加'}
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-1">
        <div
          className={`flex items-center p-2 rounded-md cursor-pointer ${hoverClass} ${
            selectedCategoryId === null ? selectedClass : ''
          }`}
          onClick={() => handleSelectCategory(null)}
        >
          <span className={`flex-1 ${textClass}`}>全部</span>
        </div>

        {categories.map((category) => (
          <div
            key={category.id}
            className={`flex items-center p-2 rounded-md cursor-pointer ${hoverClass} ${
              selectedCategoryId === category.id ? selectedClass : ''
            }`}
            onClick={() => handleSelectCategory(category.id)}
          >
            <span
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: category.color }}
            />
            <span className={`flex-1 ${textClass}`}>{category.name}</span>
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                handleEditClick(category.id);
              }}
              className={`h-8 w-8 ${outlineButtonClass}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-pencil"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(category.id);
              }}
              className={`h-8 w-8 text-${THEME_COLOR.danger}-500 hover:text-${THEME_COLOR.danger}-700`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-trash-2"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" x2="10" y1="11" y2="17" />
                <line x1="14" x2="14" y1="11" y2="17" />
              </svg>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;