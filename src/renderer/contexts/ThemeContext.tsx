import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme, ThemeColor, UserPreferences } from '../../shared/types';

interface ThemeContextType {
  theme: Theme;
  themeColor: ThemeColor;
  setTheme: (theme: Theme) => Promise<void>;
  setThemeColor: (color: ThemeColor) => Promise<void>;
  isDarkMode: boolean;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(Theme.System);
  const [themeColor, setThemeColorState] = useState<ThemeColor>(ThemeColor.Sky);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);

  // 检测系统主题
  const detectSystemTheme = (): boolean => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  // 应用主题到DOM
  const applyTheme = (theme: Theme) => {
    const isDark =
      theme === Theme.Dark ||
      (theme === Theme.System && detectSystemTheme());

    setIsDarkMode(isDark);

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // 更改主题
  const setTheme = async (newTheme: Theme): Promise<void> => {
    try {
      if (!userPreferences) {
        throw new Error('用户偏好设置未初始化');
      }

      const updatedPreferences: UserPreferences = {
        ...userPreferences,
        theme: newTheme
      };

      await window.electronAPI.userPreferences.update(updatedPreferences);
      setThemeState(newTheme);
      setUserPreferences(updatedPreferences);
      applyTheme(newTheme);
    } catch (err) {
      console.error('更新主题失败:', err);
    }
  };

  // 更改主题颜色
  const setThemeColor = async (newColor: ThemeColor): Promise<void> => {
    try {
      if (!userPreferences) {
        throw new Error('用户偏好设置未初始化');
      }

      const updatedPreferences: UserPreferences = {
        ...userPreferences,
        themeColor: newColor
      };

      await window.electronAPI.userPreferences.update(updatedPreferences);
      setThemeColorState(newColor);
      setUserPreferences(updatedPreferences);
    } catch (err) {
      console.error('更新主题颜色失败:', err);
    }
  };

  // 初始化主题
  useEffect(() => {
    const initTheme = async () => {
      try {
        const preferences = await window.electronAPI.userPreferences.get();
        setThemeState(preferences.theme);
        setThemeColorState(preferences.themeColor || ThemeColor.Sky);
        setUserPreferences(preferences);
        applyTheme(preferences.theme);
      } catch (err) {
        console.error('获取主题设置失败:', err);
        // 默认使用系统主题
        setThemeState(Theme.System);
        setThemeColorState(ThemeColor.Sky);
        applyTheme(Theme.System);
      }
    };

    initTheme();

    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === Theme.System) {
        applyTheme(Theme.System);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const value = {
    theme,
    themeColor,
    setTheme,
    setThemeColor,
    isDarkMode
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};