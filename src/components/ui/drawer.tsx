import * as React from "react";
import * as DrawerPrimitive from 'vaul';

const Drawer = DrawerPrimitive.Root;
const DrawerTrigger = DrawerPrimitive.Trigger;
const DrawerContent = DrawerPrimitive.Content;
const DrawerTitle = DrawerPrimitive.Title;
const DrawerDescription = DrawerPrimitive.Description;
const DrawerClose = DrawerPrimitive.Close;

export { Drawer, DrawerTrigger, DrawerContent, DrawerTitle, DrawerDescription, DrawerClose };
export type { DrawerProps } from 'vaul';

// Resto do código do componente...