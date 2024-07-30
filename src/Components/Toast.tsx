// Toast.tsx
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number; // Duration in milliseconds
}

const Toast: React.FC<ToastProps> = ({ message, type, duration = 3000 }) => {
  const container = document.createElement('div');

  useEffect(() => {
    document.body.appendChild(container);
    const timer = setTimeout(() => {
      document.body.removeChild(container);
    }, duration);

    return () => {
      clearTimeout(timer);
      document.body.removeChild(container);
    };
  }, [duration, container]);

  return ReactDOM.createPortal(
    <div className={`toast ${type}`}>
      <div className="flex items-center justify-between">
        <span>{message}</span>
      </div>
    </div>,
    container
  );
};

export const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning', duration?: number) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  
  const root = createRoot(container);

  root.render(
    <Toast message={message} type={type} duration={duration} />
  );

  setTimeout(() => {
    root.unmount();
    document.body.removeChild(container);
  }, duration || 3000);
};
