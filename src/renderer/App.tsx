import React, { useState, useContext, useEffect } from 'react';
import { TodoProvider, TodoContext } from './contexts/TodoContext';
import { CategoryProvider, CategoryContext } from './contexts/CategoryContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import TodoDetail from './components/todo/TodoDetail';
import TodoForm from './components/todo/TodoForm';
import TodoList from './components/todo/TodoList';
import CategoryList from './components/category/CategoryList';
import ThemeToggle from './components/ThemeToggle';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { PlusIcon, SearchIcon } from './components/ui/icons';
import { Todo, ThemeColor } from '../shared/types';

// 定义应用的主题色常量
export const THEME_COLOR = {
  primary: 'sky', // 主色调：淡蓝色
  accent: 'indigo', // 强调色
  neutral: 'slate', // 中性色
  success: 'emerald', // 成功色
  warning: 'amber', // 警告色
  danger: 'rose', // 危险色
};

const AppContent: React.FC = () => {
  const {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    loading,
    error
  } = useContext(TodoContext)!;

  const {
    categories,
    selectedCategoryId,
    setSelectedCategoryId
  } = useContext(CategoryContext)!;

  const { isDarkMode, themeColor } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isAddingTodo, setIsAddingTodo] = useState(false);

  // 当删除选中的待办事项时，清除选择
  useEffect(() => {
    if (selectedTodo && !todos.some(todo => todo.id === selectedTodo.id)) {
      setSelectedTodo(null);
    }
  }, [todos, selectedTodo]);

  // 过滤待办事项
  const filteredTodos = todos.filter(todo => {
    const matchesCategory = !selectedCategoryId || todo.categoryId === selectedCategoryId;
    const matchesSearch = !searchQuery ||
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (todo.content && todo.content.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleToggleTodo = (id: string) => {
    toggleTodo(id);
    // 如果当前选中的是被切换的待办事项，更新它
    if (selectedTodo && selectedTodo.id === id) {
      const updatedTodo = todos.find(todo => todo.id === id);
      if (updatedTodo) {
        setSelectedTodo(updatedTodo);
      }
    }
  };

  const handleDeleteTodo = (id: string) => {
    deleteTodo(id);
    // 如果删除的是当前选中的待办事项，清除选择
    if (selectedTodo && selectedTodo.id === id) {
      setSelectedTodo(null);
    }
  };

  const handleSelectTodo = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsAddingTodo(false);
  };

  const handleUpdateTodo = (id: string, data: Partial<Todo>) => {
    updateTodo(id, data);
    // 更新选中的待办事项
    const updatedTodo = {...selectedTodo!, ...data};
    setSelectedTodo(updatedTodo);
  };

  const handleAddTodo = (todoData: Omit<Todo, 'id' | 'createdAt' | 'completed'>) => {
    addTodo(todoData);
    setIsAddingTodo(false);
  };

  const handleAddClick = () => {
    setSelectedTodo(null);
    setIsAddingTodo(true);
  };

  // 动态主题色
  const themeClasses = {
    bg: isDarkMode ? `bg-${THEME_COLOR.neutral}-900` : `bg-${THEME_COLOR.neutral}-50`,
    sidebar: isDarkMode
      ? `bg-${THEME_COLOR.neutral}-800 border-${THEME_COLOR.neutral}-700`
      : `bg-white border-${THEME_COLOR.neutral}-200`,
    card: isDarkMode ? `bg-${THEME_COLOR.neutral}-800` : 'bg-white',
    text: isDarkMode ? `text-${THEME_COLOR.neutral}-100` : `text-${THEME_COLOR.neutral}-800`,
    textMuted: isDarkMode ? `text-${THEME_COLOR.neutral}-400` : `text-${THEME_COLOR.neutral}-500`,
    border: isDarkMode ? `border-${THEME_COLOR.neutral}-700` : `border-${THEME_COLOR.neutral}-200`,
    hover: isDarkMode
      ? `hover:bg-${THEME_COLOR.neutral}-700`
      : `hover:bg-${THEME_COLOR.neutral}-100`,
    selected: isDarkMode
      ? `bg-${themeColor}-900 border-${themeColor}-600`
      : `bg-${themeColor}-50 border-${themeColor}-500`,
    primary: isDarkMode
      ? `bg-${themeColor}-600 hover:bg-${themeColor}-700 text-white`
      : `bg-${themeColor}-500 hover:bg-${themeColor}-600 text-white`,
  };

  return (
    <div className={`flex h-screen ${themeClasses.bg}`}>
      {/* 左侧面板 */}
      <div className={`w-1/3 border-r ${themeClasses.sidebar} p-4 flex flex-col h-full`}>
        <div className="flex justify-between items-center mb-4">
          <h1 className={`text-xl font-bold ${themeClasses.text}`}>待办事项管理</h1>
          <ThemeToggle />
        </div>

        <div className="mb-4">
          <div className="relative">
            <SearchIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.textMuted}`} />
            <Input
              placeholder="搜索待办事项..."
              value={searchQuery}
              onChange={handleSearch}
              className={`pl-10 ${themeClasses.bg} ${themeClasses.border}`}
            />
          </div>
        </div>

        {/* 待办事项列表 */}
        <div className="flex-1 overflow-auto mb-4">
          <h2 className={`text-lg font-bold mb-2 ${themeClasses.text}`}>待办事项</h2>
          <TodoList
            todos={filteredTodos}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
            onSelectTodo={handleSelectTodo}
            selectedTodoId={selectedTodo?.id}
          />
        </div>

        {/* 分类列表 */}
        <div>
          <h2 className={`text-lg font-bold mb-2 ${themeClasses.text}`}>分类</h2>
          <CategoryList
            onSelectCategory={setSelectedCategoryId}
            selectedCategoryId={selectedCategoryId}
          />
        </div>
      </div>

      {/* 右侧详情面板 */}
      <div className={`w-2/3 p-6 overflow-auto ${themeClasses.bg}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-2xl font-bold ${themeClasses.text}`}>
            {isAddingTodo ? "添加新待办事项" : selectedTodo ? "待办事项详情" : "待办事项管理"}
          </h1>
          <Button onClick={handleAddClick} className={themeClasses.primary}>
            <PlusIcon className="mr-2" />
            添加新待办事项
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className={themeClasses.text}>加载中...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-500">{error}</p>
          </div>
        ) : isAddingTodo ? (
          <TodoForm
            onAdd={handleAddTodo}
            onCancel={() => setIsAddingTodo(false)}
          />
        ) : selectedTodo ? (
          <TodoDetail
            todo={selectedTodo}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
            onEdit={setSelectedTodo}
            onUpdate={handleUpdateTodo}
          />
        ) : (
          <div className={`flex flex-col items-center justify-center h-64 ${themeClasses.textMuted}`}>
            <p className="mb-4">选择一个待办事项查看详情或添加新的待办事项</p>
          </div>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <CategoryProvider>
        <TodoProvider>
          <AppContent />
        </TodoProvider>
      </CategoryProvider>
    </ThemeProvider>
  );
};

export default App;
