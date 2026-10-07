import * as React from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";

function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  );
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("not-last:border-b", className)}
      {...props}
    />
  );
}

interface AccordionTriggerProps extends React.ComponentProps<
  typeof AccordionPrimitive.Trigger
> {
  animatedIcon?: boolean;
  headingLevel?: 2 | 3;
}

function AccordionTrigger({
  animatedIcon = false,
  className,
  children,
  headingLevel = 3,
  ...props
}: AccordionTriggerProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <AccordionPrimitive.Header asChild>
      <Heading className="flex">
        <AccordionPrimitive.Trigger
          data-slot="accordion-trigger"
          className={cn(
            "group/accordion-trigger relative flex flex-1 items-start justify-between rounded-lg border border-transparent py-2.5 text-left text-sm font-normal transition-colors outline-none hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:after:border-ring disabled:pointer-events-none disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground",
            className,
          )}
          {...props}
        >
          {children}
          {animatedIcon ? (
            <IconChevronDown
              aria-hidden="true"
              data-slot="accordion-trigger-icon"
              className="pointer-events-none shrink-0 transition-transform duration-(--duration-exit) ease-(--ease-out) group-aria-expanded/accordion-trigger:rotate-180 group-focus-visible/accordion-trigger:transition-none motion-reduce:transition-none"
            />
          ) : (
            <>
              <IconChevronDown
                aria-hidden="true"
                data-slot="accordion-trigger-icon"
                className="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden"
              />
              <IconChevronUp
                aria-hidden="true"
                data-slot="accordion-trigger-icon"
                className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline"
              />
            </>
          )}
        </AccordionPrimitive.Trigger>
      </Heading>
    </AccordionPrimitive.Header>
  );
}

interface AccordionContentProps extends React.ComponentProps<
  typeof AccordionPrimitive.Content
> {
  contentClassName?: string;
}

function AccordionContent({
  className,
  contentClassName,
  children,
  ...props
}: AccordionContentProps) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={cn("overflow-hidden text-sm", contentClassName)}
      {...props}
    >
      <div
        className={cn(
          "pt-0 pb-2.5 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
          className,
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
