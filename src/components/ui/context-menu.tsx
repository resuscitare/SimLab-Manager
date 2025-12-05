import * as React from "react";
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';

const ContextMenu = ContextMenuPrimitive.Root;
const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
const ContextMenuContent = ContextMenuPrimitive.Content;
const ContextMenuItem = ContextMenuPrimitive.Item;
const ContextMenuLabel = ContextMenuPrimitive.Label;
const ContextMenuSeparator = ContextMenuPrimitive.Separator;

export { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuSeparator };
export type { ContextMenuProps } from '@radix-ui/react-context-menu';

// Resto do código do componente...