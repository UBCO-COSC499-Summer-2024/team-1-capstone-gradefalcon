"use client"

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const checkboxStyles = cva([
  "peer h-4 w-4 shrink-0 rounded-sm border ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      color: {
        primary: "border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        red: "border-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:text-white",
      },
    },
    defaultVariants: {
      color: "primary",
    },
  },
]);

const Checkbox = React.forwardRef(({ className, color = "primary", ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(checkboxStyles({ color }), className)}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

// Export the red variant directly
const CheckboxRed = React.forwardRef((props, ref) => (
  <Checkbox {...props} ref={ref} color="red" />
));
CheckboxRed.displayName = "CheckboxRed";

export { Checkbox, CheckboxRed };
