import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

// Approved direction: one quiet editorial primitive for section labels,
// publication states, and numeric indices across the public site.
const tagVariants = cva(
  "group/tag inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2.5 py-1 text-xs leading-none font-medium tracking-[0.01em] whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        section:
          "border-border bg-background text-muted-foreground [a]:hover:bg-muted [a]:hover:text-foreground",
        status:
          "border-transparent bg-foreground text-background [a]:hover:bg-foreground/85",
        index:
          "min-w-6 border-border bg-transparent px-2 text-muted-foreground tabular-nums",
      },
    },
    defaultVariants: {
      variant: "section",
    },
  },
);

type TagProps = React.ComponentProps<"span"> &
  VariantProps<typeof tagVariants> & { asChild?: boolean };

function Tag({
  className,
  variant = "section",
  asChild = false,
  ...props
}: TagProps) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="tag"
      data-variant={variant}
      className={cn(tagVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Tag, tagVariants, type TagProps };
