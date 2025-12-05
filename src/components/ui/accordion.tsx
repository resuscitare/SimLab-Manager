import * as React from "react";
import * as AccordionPrimitive from '@radix-ui/react-accordion';

const Accordion = AccordionPrimitive.Root;
const AccordionItem = AccordionPrimitive.Item;
const AccordionTrigger = AccordionPrimitive.Header;
const AccordionContent = AccordionPrimitive.Content;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
export type { AccordionProps } from '@radix-ui/react-accordion';

// Resto do código do componente...