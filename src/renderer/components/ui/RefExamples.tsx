import React, { useRef, useImperativeHandle } from 'react';

// 方法1：使用forwardRef（推荐用于UI库）
const ForwardRefButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, ...props }, ref) => {
  return (
    <button ref={ref} {...props}>
      {children}
    </button>
  );
});

ForwardRefButton.displayName = 'ForwardRefButton';

// 方法2：使用ref回调属性（替代方案，但不如forwardRef清晰）
interface CallbackRefButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  buttonRef?: React.RefCallback<HTMLButtonElement> | React.RefObject<HTMLButtonElement>;
}

const CallbackRefButton: React.FC<CallbackRefButtonProps> = ({
  children,
  buttonRef,
  ...props
}) => {
  return (
    <button
      ref={buttonRef as React.RefCallback<HTMLButtonElement>}
      {...props}
    >
      {children}
    </button>
  );
};

// 方法3：使用useImperativeHandle暴露自定义API（高级用法）
interface CustomButtonRef {
  focus: () => void;
  getBoundingBox: () => DOMRect | null;
}

interface ImperativeHandleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const ImperativeHandleButton = React.forwardRef<
  CustomButtonRef,
  ImperativeHandleButtonProps
>(({ children, ...props }, ref) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => buttonRef.current?.focus(),
    getBoundingBox: () => buttonRef.current?.getBoundingClientRect() || null
  }));

  return (
    <button ref={buttonRef} {...props}>
      {children}
    </button>
  );
});

ImperativeHandleButton.displayName = 'ImperativeHandleButton';

// 使用示例
const RefExamples: React.FC = () => {
  // 方法1的使用
  const buttonRef1 = useRef<HTMLButtonElement>(null);

  // 方法2的使用
  const buttonRef2 = useRef<HTMLButtonElement>(null);

  // 方法3的使用
  const buttonRef3 = useRef<CustomButtonRef>(null);

  const handleClick = () => {
    // 方法1：直接访问DOM元素
    console.log('Button 1 width:', buttonRef1.current?.offsetWidth);

    // 方法2：同样可以访问DOM元素
    console.log('Button 2 width:', buttonRef2.current?.offsetWidth);

    // 方法3：使用自定义API
    buttonRef3.current?.focus();
    console.log('Button 3 bounding box:', buttonRef3.current?.getBoundingBox());
  };

  return (
    <div className="space-y-4">
      <h2>Ref 示例</h2>

      <div>
        <ForwardRefButton ref={buttonRef1} onClick={handleClick}>
          使用forwardRef的按钮
        </ForwardRefButton>
      </div>

      <div>
        <CallbackRefButton buttonRef={buttonRef2} onClick={handleClick}>
          使用ref回调的按钮
        </CallbackRefButton>
      </div>

      <div>
        <ImperativeHandleButton ref={buttonRef3} onClick={handleClick}>
          使用useImperativeHandle的按钮
        </ImperativeHandleButton>
      </div>

      <p className="text-sm text-gray-500">
        <strong>注意：</strong> React 18仍然需要使用forwardRef来正确地转发refs。
        对于UI组件库，使用forwardRef是最佳实践，它提供了更好的类型安全性和API一致性。
      </p>
    </div>
  );
};

export default RefExamples;