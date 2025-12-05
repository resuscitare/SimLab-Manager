import * as React from "react";
import * as MenubarPrimitive from '@radix-ui/react-menubar';

const Menubar = MenubarPrimitive.Root;
const MenubarMenu = MenubarPrimitive.Menu;
const MenubarTrigger = MenubarPrimitive.Trigger;
const MenubarContent = MenubarPrimitive.Content;
const MenubarItem = MenubarPrimitive.Item;
const MenubarLabel = MenubarPrimitive.Label;
const MenubarSeparator = MenubarPrimitive.Separator;

export { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarLabel, MenubarSeparator };
export type { MenubarProps } from '@radix-ui/react-menubar';

// Resto do código do componente...