import * as React from "react";
import * as DialogPrimitive from '@radix-ui/react-dialog';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogContent = DialogPrimitive.Content;
const DialogTitle = DialogPrimitive.Title;
const DialogDescription = DialogPrimitive.Description;
const DialogClose = DialogPrimitive.Close;

export { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose };
export type { DialogProps } from '@radix-ui/react-dialog';

// Resto do código do componente...