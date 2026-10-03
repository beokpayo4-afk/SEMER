import { createContext } from "react";

export type ToastMessage = {
  id: number;
  text: string;
};

export type ToastContextValue = {
  toasts: ToastMessage[];
  showToast: (text: string) => void;
  dismissToast: (id: number) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);
