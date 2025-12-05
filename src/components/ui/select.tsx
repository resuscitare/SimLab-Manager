import * as React from "react";
import * as SelectPrimitive from '@radix-ui/react-select';

const Select = SelectPrimitive.Root;
const SelectTrigger = SelectPrimitive.Trigger;
const SelectValue = SelectPrimitive.Value;
const SelectContent = SelectPrimitive.Content;
const SelectItem = SelectPrimitive.Item;
const SelectGroup = SelectPrimitive.Group;
const SelectLabel = SelectPrimitive.Label;
const SelectSeparator = SelectPrimitive.Separator;

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel, SelectSeparator };
export type { SelectProps } from '@radix-ui/react-select';

// Resto do código do componente...