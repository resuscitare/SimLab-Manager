import * as React from "react";
import * as ToastPrimitives from '@radix-ui/react-toast';

const Toast = ToastPrimitives.Root;
const ToastAction = ToastPrimitives.Action;
const ToastClose = ToastPrimitives.Close;
const ToastDescription = ToastPrimitives.Description;
const ToastTitle = ToastPrimitives.Title;
const ToastProvider = ToastPrimitives.Provider;
const Toaster = ToastPrimitives.Viewport;

export { Toast, ToastAction, ToastClose, ToastDescription, ToastTitle, ToastProvider, Toaster };
export type { ToastProps } from '@radix-ui/react-toast';

// Resto do código do componente...