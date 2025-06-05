import React, { useContext } from 'react';
import { Todo, Priority } from '../../../shared/types';
import { Checkbox } from '../ui/checkbox';
import { ThemeContext } from '../../contexts/ThemeContext';
import { THEME_COLOR } from '../../App';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSelectTodo: (todo: Todo) => void;
  selectedTodoId?: string;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggle,
  onDelete,
  onSelectTodo,
  selectedTodoId
}) => {
  const { isDarkMode, themeColor } = useContext(ThemeContext)!;

  if (todos.length === 0) {
    return (
      <div className={`p-4 text-center ${isDarkMode ? `text-${THEME_COLOR.neutral}-400` : `text-${THEME_COLOR.neutral}-500`}`}>
        暂无待办事项
      </div>
    );
  }

  const handleItemClick = (todo: Todo) => {
    onSelectTodo(todo);
  };

  const priorityClasses = {
    low: `bg-${THEME_COLOR.success}-100 text-${THEME_COLOR.success}-800`,
    medium: `bg-${THEME_COLOR.warning}-100 text-${THEME_COLOR.warning}-800`,
    high: `bg-${THEME_COLOR.danger}-100 text-${THEME_COLOR.danger}-800`,
  };

  const borderClass = isDarkMode
    ? `border-${THEME_COLOR.neutral}-700`
    : `border-${THEME_COLOR.neutral}-200`;
  const hoverClass = isDarkMode
    ? `hover:bg-${THEME_COLOR.neutral}-700`
    : `hover:bg-${THEME_COLOR.neutral}-100`;
  const selectedClass = isDarkMode
    ? `border-${themeColor}-600 bg-${themeColor}-900/50`
    : `border-${themeColor}-500 bg-${themeColor}-50`;
  const textClass = isDarkMode
    ? `text-${THEME_COLOR.neutral}-300`
    : `text-${THEME_COLOR.neutral}-800`;
  const mutedTextClass = isDarkMode
    ? `text-${THEME_COLOR.neutral}-400`
    : `text-${THEME_COLOR.neutral}-500`;
  const lineThrough = isDarkMode
    ? `line-through text-${THEME_COLOR.neutral}-500`
    : `line-through text-${THEME_COLOR.neutral}-400`;

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className={`p-3 border rounded-md cursor-pointer transition-colors ${borderClass} ${hoverClass} ${
            selectedTodoId === todo.id ? selectedClass : ''
          }`}
          onClick={() => handleItemClick(todo)}
        >
          <div className="flex items-center">
            <Checkbox
              checked={todo.completed}
              onChange={(e) => {
                e.stopPropagation();
                onToggle(todo.id);
              }}
              onClick={(e) => e.stopPropagation()}
              className="mr-3"
            />
            <div className="flex-1">
              <h3 className={`font-medium ${todo.completed ? lineThrough : textClass}`}>
                {todo.title}
              </h3>
              {todo.content && (
                <p className={`text-sm mt-1 truncate ${todo.completed ? lineThrough : mutedTextClass}`}>
                  {todo.content}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end">
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                priorityClasses[todo.priority.toLowerCase() as keyof typeof priorityClasses]
              }`}>
                {todo.priority}
              </span>
              {todo.dueDate && (
                <span className={`text-xs mt-1 ${mutedTextClass}`}>
                  {new Date(todo.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TodoList;