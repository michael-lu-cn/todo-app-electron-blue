import * as React from "react";
import { cn } from "../../lib/utils";
import { useTheme } from "../../contexts/ThemeContext";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked = false, ...props }, ref) => {
    const { themeColor } = useTheme();

    return (
      <input
        type="checkbox"
        className={cn(
          `h-4 w-4 rounded border border-input bg-background text-${themeColor}-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-${themeColor}-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`,
          className
        )}
        ref={ref}
        checked={checked}
        {...props}
      />
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };