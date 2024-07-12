import * as React from "react"
import { cn } from "../../lib/utils"

const Button = React.forwardRef(({ className, variant, ...props }, ref) => {
  const baseStyles = "py-2 px-4 rounded"
  const variants = {
    solid: "bg-green-700 text-white hover:bg-green-800",
    outline: "bg-green-500 text-white border border-green-700 hover:bg-green-600",
  }

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    />
  )
})

Button.displayName = "Button"

export { Button }
