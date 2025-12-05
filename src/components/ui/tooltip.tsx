import * as React from "react";
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = TooltipPrimitive.Content;
const TooltipProvider = TooltipPrimitive.Provider;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
export type { TooltipProps } from '@radix-ui/react-tooltip';

// Resto do código do componente...