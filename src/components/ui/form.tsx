import * as React from "react";
import { useFormContext } from 'react-hook-form';

const Form = React.forwardRef(({ className, ...props }, ref) => (
  <form className={cn("space-y-2", className)} {...props} ref={ref} />
));
Form.displayName = "Form";

export { Form, useFormContext };
export type { FormProps } from 'react-hook-form';

// Resto do código do componente...