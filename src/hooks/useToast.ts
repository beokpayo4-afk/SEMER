import { useContext } from "react";
import { ToastContext } from "../context/toast-context.ts";

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return value;
}
