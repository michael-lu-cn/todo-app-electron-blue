import React, { useState, useContext } from 'react';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select } from '../ui/select';
import { Priority, Todo } from '../../../shared/types';
import { CategoryContext } from '../../contexts/CategoryContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import { THEME_COLOR } from '../../App';

// 定义不包含id、createdAt和completed的Todo类型
type TodoFormData = Omit<Todo, 'id' | 'createdAt' | 'completed'>;

interface TodoFormProps {
  onAdd: (todo: TodoFormData) => void;
  onCancel: () => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({ onAdd, onCancel }) => {
  const { categories } = useContext(CategoryContext)!;
  const { isDarkMode, themeColor } = useContext(ThemeContext)!;
  const [formData, setFormData] = useState<TodoFormData>({
    title: '',
    content: '',
    priority: Priority.Medium,
    categoryId: categories.length > 0 ? categories[0].id : '',
    dueDate: undefined,
    updatedAt: Date.now()
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || formData.title.trim() === '') {
      alert('标题不能为空');
      return;
    }

    onAdd({
      ...formData,
      title: formData.title.trim(),
      content: formData.content?.trim(),
      updatedAt: Date.now()
    });

    // 重置表单
    setFormData({
      title: '',
      content: '',
      priority: Priority.Medium,
      categoryId: categories.length > 0 ? categories[0].id : '',
      dueDate: undefined,
      updatedAt: Date.now()
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 主题相关样式
  const cardClass = isDarkMode ? `bg-${THEME_COLOR.neutral}-800` : 'bg-white';
  const textClass = isDarkMode ? `text-${THEME_COLOR.neutral}-100` : `text-${THEME_COLOR.neutral}-800`;
  const borderClass = isDarkMode ? `border-${THEME_COLOR.neutral}-700` : `border-${THEME_COLOR.neutral}-200`;
  const inputBgClass = isDarkMode ? `bg-${THEME_COLOR.neutral}-700` : 'bg-white';

  const primaryButtonClass = isDarkMode
    ? `bg-${themeColor}-600 hover:bg-${themeColor}-700 text-white`
    : `bg-${themeColor}-500 hover:bg-${themeColor}-600 text-white`;
  const outlineButtonClass = isDarkMode
    ? `border-${THEME_COLOR.neutral}-600 text-${THEME_COLOR.neutral}-300 hover:bg-${THEME_COLOR.neutral}-700`
    : `border-${THEME_COLOR.neutral}-300 text-${THEME_COLOR.neutral}-700 hover:bg-${THEME_COLOR.neutral}-100`;

  return (
    <Card className={cardClass}>
      <form onSubmit={handleSubmit}>
        <CardContent className="p-6 space-y-4">
          <h2 className={`text-xl font-bold mb-4 ${textClass}`}>添加新待办事项</h2>

          <div>
            <label className={`block text-sm font-medium mb-1 ${textClass}`}>标题</label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="待办事项标题"
              required
              className={`${inputBgClass} ${borderClass}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${textClass}`}>内容</label>
            <Textarea
              name="content"
              value={formData.content || ''}
              onChange={handleChange}
              placeholder="详细内容"
              className={`w-full p-2 border rounded-md resize-none h-32 ${inputBgClass} ${borderClass}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${textClass}`}>优先级</label>
            <Select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${inputBgClass} ${borderClass}`}
            >
              <option value={Priority.Low}>低</option>
              <option value={Priority.Medium}>中</option>
              <option value={Priority.High}>高</option>
            </Select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${textClass}`}>类别</label>
            <Select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${inputBgClass} ${borderClass}`}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${textClass}`}>截止日期</label>
            <Input
              type="date"
              name="dueDate"
              value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ''}
              onChange={handleChange}
              className={`w-full ${inputBgClass} ${borderClass}`}
            />
          </div>
        </CardContent>

        <CardFooter className="p-4 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} className={outlineButtonClass}>
            取消
          </Button>
          <Button type="submit" className={primaryButtonClass}>
            添加
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default TodoForm;