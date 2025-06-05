import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeColor } from '../../shared/types';
import { Button } from './ui/button';

const colorNames: Record<ThemeColor, string> = {
  [ThemeColor.Sky]: '天蓝',
  [ThemeColor.Blue]: '蓝色',
  [ThemeColor.Indigo]: '靛蓝',
  [ThemeColor.Violet]: '紫色',
  [ThemeColor.Rose]: '玫瑰',
  [ThemeColor.Emerald]: '翠绿',
  [ThemeColor.Amber]: '琥珀',
  [ThemeColor.Slate]: '石板灰'
};

const colorClasses: Record<ThemeColor, string> = {
  [ThemeColor.Sky]: 'bg-sky-500',
  [ThemeColor.Blue]: 'bg-blue-500',
  [ThemeColor.Indigo]: 'bg-indigo-500',
  [ThemeColor.Violet]: 'bg-violet-500',
  [ThemeColor.Rose]: 'bg-rose-500',
  [ThemeColor.Emerald]: 'bg-emerald-500',
  [ThemeColor.Amber]: 'bg-amber-500',
  [ThemeColor.Slate]: 'bg-slate-500'
};

export const ThemeColorPicker: React.FC = () => {
  const { themeColor, setThemeColor, isDarkMode } = useTheme();

  const handleColorChange = (color: ThemeColor) => {
    setThemeColor(color);
  };

  const borderClass = isDarkMode ? 'border-white' : 'border-black';

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {Object.values(ThemeColor).map((color) => (
        <Button
          key={color}
          variant="ghost"
          size="icon"
          onClick={() => handleColorChange(color)}
          className={`p-0 h-6 w-6 rounded-full ${colorClasses[color]} ${
            themeColor === color ? `border-2 ${borderClass}` : ''
          }`}
          title={colorNames[color]}
        />
      ))}
    </div>
  );
};

export default ThemeColorPicker;