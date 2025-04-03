// components/ui/use-toast.ts
"use client";

import * as React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { Toast, ToastTitle, ToastDescription, ToastClose } from "./toast";
import { Portal } from "@radix-ui/react-portal";

type Toast = {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  duration?: number;
};

type ToastContextType = {
  toast: (toast: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = ({ title, description, variant = "default", duration = 5000 }: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, title, description, variant, duration }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <Portal>
        <div className="fixed top-0 right-0 z-50 flex flex-col gap-2 p-4">
          {toasts.map(({ id, title, description, variant, duration }) => (
            <Toast key={id} variant={variant} onClick={() => dismissToast(id)}>
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
              <ToastClose onClick={() => dismissToast(id)} />
            </Toast>
          ))}
        </div>
      </Portal>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}