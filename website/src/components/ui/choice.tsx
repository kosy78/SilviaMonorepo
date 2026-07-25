import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const choiceVariants = cva(
  "ui-control flex min-h-12 cursor-pointer gap-4 rounded-lg border border-border bg-background p-4 text-base leading-7 text-foreground focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-50",
  {
    variants: {
      tone: {
        soft: "hover:border-ring hover:bg-muted/50 has-[input:checked]:border-primary has-[input:checked]:bg-muted",
        solid:
          "hover:border-ring hover:bg-muted/50 has-[input:checked]:border-primary has-[input:checked]:bg-primary has-[input:checked]:text-primary-foreground",
      },
    },
    defaultVariants: {
      tone: "soft",
    },
  },
);

function Choice({
  className,
  tone = "soft",
  ...props
}: React.ComponentProps<"label"> & VariantProps<typeof choiceVariants>) {
  return (
    <label
      data-slot="choice"
      data-tone={tone}
      className={cn(choiceVariants({ tone }), className)}
      {...props}
    />
  );
}

export { Choice, choiceVariants };
