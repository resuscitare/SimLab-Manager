import * as React from "react";
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuContent = DropdownMenuPrimitive.Portal;
const DropdownMenuItem = DropdownMenuPrimitive.Item;
const DropdownMenuLabel = DropdownMenuPrimitive.Label;
const DropdownMenuSeparator = DropdownMenuPrimitive.Separator;

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator };
export type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

// Resto do código do componente...