import * as React from "react";
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';

const NavigationMenu = NavigationMenuPrimitive.Root;
const NavigationMenuList = NavigationMenuPrimitive.List;
const NavigationMenuTrigger = NavigationMenuPrimitive.Trigger;
const NavigationMenuContent = NavigationMenuPrimitive.Content;
const NavigationMenuItem = NavigationMenuPrimitive.Item;
const NavigationMenuLink = NavigationMenuPrimitive.Link;
const NavigationMenuIndicator = NavigationMenuPrimitive.Indicator;
const NavigationMenuViewport = NavigationMenuPrimitive.Viewport;

export { NavigationMenu, NavigationMenuList, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuIndicator, NavigationMenuViewport };
export type { NavigationMenuProps } from '@radix-ui/react-navigation-menu';

// Resto do código do componente...