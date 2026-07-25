import * as React from "react";
import { IconPlus } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

function Disclosure({ className, ...props }: React.ComponentProps<"details">) {
  return (
    <details
      data-slot="disclosure"
      className={cn("group/disclosure border-y border-border", className)}
      {...props}
    />
  );
}

function DisclosureTrigger({
  className,
  ...props
}: React.ComponentProps<"summary">) {
  return (
    <summary
      data-slot="disclosure-trigger"
      className={cn(
        "ui-control flex min-h-12 cursor-pointer list-none items-center justify-between gap-6 rounded-lg py-4 font-medium hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
      {...props}
    />
  );
}

function DisclosureIcon({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <IconPlus
      data-slot="disclosure-icon"
      aria-hidden="true"
      className={cn(
        "shrink-0 transition-transform duration-(--duration-state) ease-(--ease-state) group-open/disclosure:rotate-45 motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}

function DisclosureContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="disclosure-content"
      className={cn("pb-6", className)}
      {...props}
    />
  );
}

export { Disclosure, DisclosureContent, DisclosureIcon, DisclosureTrigger };
