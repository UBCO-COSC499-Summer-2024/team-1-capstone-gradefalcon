import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "../../lib/utils";

const Tabs = React.forwardRef(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Root
      ref={ref}
      className={cn("flex flex-col", className)}
      {...props}
    />
  )
);
Tabs.displayName = TabsPrimitive.Root.displayName;

const TabsList = React.forwardRef(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.List
      ref={ref}
      className={cn("flex border-b border-gray-200", className)}
      {...props}
    />
  )
);
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex-1 px-4 py-2 text-center cursor-pointer transition-colors duration-200 focus:outline-none focus-visible:ring-2 ring-offset-2 ring-offset-gray-50 ring-green-500",
        "data-[state=active]:text-green-600 data-[state=active]:border-b-2 data-[state=active]:border-green-600",
        className
      )}
      {...props}
    />
  )
);
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Content
      ref={ref}
      className={cn("p-4", className)}
      {...props}
    />
  )
);
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
