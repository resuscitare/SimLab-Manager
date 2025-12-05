import * as React from "react";
import * as CommandPrimitive from 'cmdk';

const Command = CommandPrimitive.Root;
const CommandDialog = CommandPrimitive.Dialog;
const CommandInput = CommandPrimitive.Input;
const CommandList = CommandPrimitive.List;
const CommandEmpty = CommandPrimitive.Empty;
const CommandGroup = CommandPrimitive.Group;
const CommandItem = CommandPrimitive.Item;

export { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem };
export type { CommandProps } from 'cmdk';

// Resto do código do componente...