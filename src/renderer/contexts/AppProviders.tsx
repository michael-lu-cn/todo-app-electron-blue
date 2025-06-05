import React, { ReactNode } from 'react';
import { ThemeProvider } from './ThemeContext';
import { CategoryProvider } from './CategoryContext';
import { TodoProvider } from './TodoContext';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <CategoryProvider>
        <TodoProvider>
          {children}
        </TodoProvider>
      </CategoryProvider>
    </ThemeProvider>
  );
};

export default AppProviders;