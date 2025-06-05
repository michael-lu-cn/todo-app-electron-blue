import React from 'react';
import { Todo, Priority } from '../../../shared/types';
import { Checkbox } from '../ui/checkbox';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

const priorityClasses = {
  [Priority.Low]: 'bg-blue-100 text-blue-800',
  [Priority.Medium]: 'bg-yellow-100 text-yellow-800',
  [Priority.High]: 'bg-red-100 text-red-800',
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onEdit
}) => {
  return (
    <Card className={`mb-3 ${todo.completed ? 'opacity-70' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={todo.completed || false}
            onChange={() => onToggle(todo.id)}
            className="mt-1"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className={`text-lg font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                {todo.title}
              </h3>
              <span className={`text-xs px-2 py-1 rounded-full ${priorityClasses[todo.priority]}`}>
                {todo.priority}
              </span>
            </div>
            {todo.content && (
              <p className={`mt-1 text-sm text-gray-600 ${todo.completed ? 'line-through' : ''}`}>
                {todo.content}
              </p>
            )}
            {todo.dueDate && (
              <p className="mt-2 text-xs text-gray-500">
                截止日期: {new Date(todo.dueDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-2 px-4 justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(todo)}
        >
          编辑
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-700"
          onClick={() => onDelete(todo.id)}
        >
          删除
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TodoItem;