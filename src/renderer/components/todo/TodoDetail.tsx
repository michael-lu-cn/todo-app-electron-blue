import React, { useState, useContext } from 'react';
import { Todo, Priority } from '../../../shared/types';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { CategoryContext } from '../../contexts/CategoryContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import { THEME_COLOR } from '../../App';

interface TodoDetailProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onUpdate: (id: string, data: Partial<Todo>) => void;
}

export const TodoDetail: React.FC<TodoDetailProps> = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
  onUpdate
}) => {
  const { categories } = useContext(CategoryContext)!;
  const { isDarkMode, themeColor } = useContext(ThemeContext)!;
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Todo>>({
    title: todo.title,
    content: todo.content,
    priority: todo.priority,
    categoryId: todo.categoryId
  });

  const handleToggle = () => {
    onToggle(todo.id);
  };

  const handleDelete = () => {
    if (window.confirm('确定要删除这个待办事项吗？')) {
      onDelete(todo.id);
    }
  };

  const handleStartEdit = () => {
    setEditData({
      title: todo.title,
      content: todo.content,
      priority: todo.priority,
      categoryId: todo.categoryId
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editData.title || editData.title.trim() === '') {
      alert('标题不能为空');
      return;
    }

    onUpdate(todo.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const priorityLabels: Record<Priority, string> = {
    [Priority.Low]: '低',
    [Priority.Medium]: '中',
    [Priority.High]: '高'
  };

  const priorityClasses: Record<Priority, string> = {
    [Priority.Low]: `bg-${THEME_COLOR.success}-100 text-${THEME_COLOR.success}-800`,
    [Priority.Medium]: `bg-${THEME_COLOR.warning}-100 text-${THEME_COLOR.warning}-800`,
    [Priority.High]: `bg-${THEME_COLOR.danger}-100 text-${THEME_COLOR.danger}-800`,
  };

  // 获取当前分类名称
  const getCurrentCategoryName = () => {
    if (!todo.categoryId) return '无分类';
    const category = categories.find(c => c.id === todo.categoryId);
    return category ? category.name : '无分类';
  };

  // 主题相关样式
  const cardClass = isDarkMode ? `bg-${THEME_COLOR.neutral}-800` : 'bg-white';
  const textClass = isDarkMode ? `text-${THEME_COLOR.neutral}-100` : `text-${THEME_COLOR.neutral}-800`;
  const mutedTextClass = isDarkMode ? `text-${THEME_COLOR.neutral}-400` : `text-${THEME_COLOR.neutral}-500`;
  const borderClass = isDarkMode ? `border-${THEME_COLOR.neutral}-700` : `border-${THEME_COLOR.neutral}-200`;
  const inputBgClass = isDarkMode ? `bg-${THEME_COLOR.neutral}-700` : 'bg-white';
  const lineThrough = isDarkMode
    ? `line-through text-${THEME_COLOR.neutral}-500`
    : `line-through text-${THEME_COLOR.neutral}-400`;

  const primaryButtonClass = isDarkMode
    ? `bg-${themeColor}-600 hover:bg-${themeColor}-700 text-white`
    : `bg-${themeColor}-500 hover:bg-${themeColor}-600 text-white`;
  const outlineButtonClass = isDarkMode
    ? `border-${THEME_COLOR.neutral}-600 text-${THEME_COLOR.neutral}-300 hover:bg-${THEME_COLOR.neutral}-700`
    : `border-${THEME_COLOR.neutral}-300 text-${THEME_COLOR.neutral}-700 hover:bg-${THEME_COLOR.neutral}-100`;
  const dangerButtonClass = isDarkMode
    ? `bg-rose-700 hover:bg-rose-800 text-white`
    : `bg-rose-500 hover:bg-rose-600 text-white`;

  return (
    <Card className={cardClass}>
      <CardContent className="p-6">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${textClass}`}>标题</label>
              <Input
                value={editData.title || ''}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                placeholder="待办事项标题"
                className={`${inputBgClass} ${borderClass}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${textClass}`}>内容</label>
              <Textarea
                value={editData.content || ''}
                onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                placeholder="详细内容"
                className={`w-full p-2 border rounded-md resize-none h-32 ${inputBgClass} ${borderClass}`}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${textClass}`}>优先级</label>
                <Select
                  value={editData.priority}
                  onChange={(e) => setEditData({ ...editData, priority: e.target.value as Priority })}
                  className={`w-full p-2 border rounded-md ${inputBgClass} ${borderClass}`}
                >
                  <option value={Priority.Low}>低</option>
                  <option value={Priority.Medium}>中</option>
                  <option value={Priority.High}>高</option>
                </Select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${textClass}`}>分类</label>
                <Select
                  value={editData.categoryId || ''}
                  onChange={(e) => setEditData({ ...editData, categoryId: e.target.value || undefined })}
                  className={`w-full p-2 border rounded-md ${inputBgClass} ${borderClass}`}
                >
                  <option value="">无分类</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${textClass}`}>截止日期</label>
              <Input
                type="date"
                value={editData.dueDate ? new Date(editData.dueDate).toISOString().split('T')[0] : ''}
                onChange={(e) => setEditData({ ...editData, dueDate: e.target.value ? new Date(e.target.value).getTime() : undefined })}
                className={`w-full ${inputBgClass} ${borderClass}`}
              />
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center mb-4">
              <Checkbox
                checked={todo.completed}
                onChange={handleToggle}
                className="mr-3"
              />
              <h3 className={`text-xl font-bold ${todo.completed ? lineThrough : textClass}`}>
                {todo.title}
              </h3>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              <span className={`text-xs px-2 py-1 rounded-full ${priorityClasses[todo.priority]}`}>
                {priorityLabels[todo.priority]}
              </span>

              {todo.categoryId && (
                <span className={`text-xs px-2 py-1 rounded-full bg-${THEME_COLOR.neutral}-100 text-${THEME_COLOR.neutral}-800`}>
                  {getCurrentCategoryName()}
                </span>
              )}

              {todo.dueDate && (
                <span className={`text-xs px-2 py-1 rounded-full bg-${THEME_COLOR.neutral}-100 text-${THEME_COLOR.neutral}-800`}>
                  截止日期: {new Date(todo.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>

            {todo.content && (
              <div className={`mt-4 whitespace-pre-wrap ${mutedTextClass}`}>
                {todo.content}
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 flex justify-end gap-2">
        {isEditing ? (
          <>
            <Button variant="outline" onClick={handleCancel} className={outlineButtonClass}>
              取消
            </Button>
            <Button onClick={handleSave} className={primaryButtonClass}>
              保存
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={handleStartEdit} className={outlineButtonClass}>
              编辑
            </Button>
            <Button variant="destructive" onClick={handleDelete} className={dangerButtonClass}>
              删除
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default TodoDetail;