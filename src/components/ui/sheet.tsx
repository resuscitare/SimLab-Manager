import * as React from "react";
import * as SheetPrimitive from '@radix-ui/react-dialog';

interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'right' | 'bottom' | 'left';
  children?: React.ReactNode;
}

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetContent = SheetPrimitive.Content;
const SheetClose = SheetPrimitive.Close;
const SheetTitle = SheetPrimitive.Title;
const SheetDescription = SheetPrimitive.Description;

export { Sheet, SheetTrigger, SheetContent, SheetClose, SheetTitle, SheetDescription };
export type { SheetProps, SheetContentProps };

// Resto do código do componente...