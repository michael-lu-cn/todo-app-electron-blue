import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../../shared/types';
import { Button } from './ui/button';
import { MoonIcon, SunIcon, LaptopIcon } from './ui/icons';
import ThemeColorPicker from './ThemeColorPicker';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme, isDarkMode } = useTheme();
  const [showColorPicker, setShowColorPicker] = useState(false);

  const toggleColorPicker = () => {
    setShowColorPicker(!showColorPicker);
  };

  const buttonClass = isDarkMode
    ? 'bg-slate-700 border-slate-600'
    : 'bg-white border-slate-200';

  return (
    <div className="relative">
      <div className="flex space-x-2">
        <Button
          variant={theme === Theme.Light ? 'default' : 'outline'}
          size="icon"
          onClick={() => setTheme(Theme.Light)}
          title="浅色模式"
          className="h-8 w-8"
        >
          <SunIcon className="h-4 w-4" />
        </Button>
        <Button
          variant={theme === Theme.Dark ? 'default' : 'outline'}
          size="icon"
          onClick={() => setTheme(Theme.Dark)}
          title="深色模式"
          className="h-8 w-8"
        >
          <MoonIcon className="h-4 w-4" />
        </Button>
        <Button
          variant={theme === Theme.System ? 'default' : 'outline'}
          size="icon"
          onClick={() => setTheme(Theme.System)}
          title="系统设置"
          className="h-8 w-8"
        >
          <LaptopIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleColorPicker}
          title="主题颜色"
          className="h-8 w-8 relative"
        >
          <div className="absolute inset-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500" />
        </Button>
      </div>

      {showColorPicker && (
        <div className={`absolute right-0 mt-2 p-3 rounded-md shadow-lg border ${buttonClass} z-10`}>
          <h3 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            选择主题颜色
          </h3>
          <ThemeColorPicker />
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;