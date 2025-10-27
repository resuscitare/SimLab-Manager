"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Local } from "@/types"

interface LocationComboboxProps {
  locais: Local[];
  value: string;
  onValueChange: (value: string) => void;
}

export function LocationCombobox({ locais, value, onValueChange }: LocationComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const options = locais.map(local => {
    const localString = `${local.laboratorio} > ${local.sala} > ${local.armario} > ${local.gaveta}`;
    return {
      value: localString.toLowerCase(),
      label: localString,
    };
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-8 text-xs"
        >
          <span className="truncate">
            {value
              ? options.find((option) => option.label === value)?.label
              : "Selecione um local..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] p-0">
        <Command>
          <CommandInput placeholder="Buscar local..." />
          <CommandList>
            <CommandEmpty>Nenhum local encontrado.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    const selectedOption = options.find(opt => opt.value === currentValue);
                    onValueChange(selectedOption ? selectedOption.label : "")
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.label ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}