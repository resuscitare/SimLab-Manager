import * as React from "react";
import * as OTPInputPrimitive from 'input-otp';

const OTPInput = OTPInputPrimitive.Root;
const OTPInputContainer = OTPInputPrimitive.Container;
const OTPInputField = OTPInputPrimitive.InputField;
const OTPInputLabel = OTPInputPrimitive.Label;
const OTPInputSeparator = OTPInputPrimitive.Separator;

export { OTPInput, OTPInputContainer, OTPInputField, OTPInputLabel, OTPInputSeparator };
export type { OTPInputProps } from 'input-otp';

// Resto do código do componente...