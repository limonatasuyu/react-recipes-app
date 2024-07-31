import React from "react";
import { createRoot } from "react-dom/client";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, duration = 3000 }) => {
  return (
    <div
      className={`toast ${type} max-w-xs w-full bg-white shadow-lg rounded-lg p-4 flex items-center justify-between transition-opacity duration-500 ease-in-out opacity-100`}
    >
      <div className="flex items-center justify-between">
        <span>{message}</span>
      </div>
    </div>
  );
};

const createToastContainer = () => {
  const container = document.createElement("div");
  container.id = "toast-container";
  container.style.position = "fixed";
  container.style.bottom = "10px";
  container.style.right = "10px";
  container.style.zIndex = "9999";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.gap = "1rem";
  document.body.appendChild(container);
  return container;
};

export const showToast = (
  message: string,
  type: "success" | "error" | "info" | "warning",
  duration?: number
) => {
  const container =
    document.getElementById("toast-container") || createToastContainer();
  const toastId = Date.now();
  const toastElement = document.createElement("div");
  toastElement.id = String(toastId);
  container.appendChild(toastElement);

  const root = createRoot(toastElement);

  root.render(<Toast message={message} type={type} duration={duration} />);

  setTimeout(() => {
    root.unmount();
    container.removeChild(toastElement);
    if (!container.hasChildNodes()) {
      document.body.removeChild(container);
    }
  }, duration || 5000);
};
