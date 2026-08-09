import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SupportArea {
  title: string;
  description: string;
}

interface SupportAreasAccordionProps {
  items: readonly SupportArea[];
}

export default function SupportAreasAccordion({
  items,
}: SupportAreasAccordionProps) {
  return (
    <Accordion type="multiple" asChild>
      <ul
        className="mt-[clamp(3rem,6vw,5rem)] grid list-none grid-cols-1 gap-0 p-0 sm:grid-cols-2 sm:gap-x-[clamp(2.5rem,6vw,5rem)]"
        data-therapy-help-list
      >
        {items.map((item, index) => (
          <AccordionItem
            asChild
            className="border-border border-t !border-b-0"
            key={item.title}
            value={`support-area-${index + 1}`}
          >
            <li>
              <AccordionTrigger className="min-h-20 rounded-none py-7 hover:no-underline **:data-[slot=accordion-trigger-icon]:size-5">
                <span className="pr-4 text-[clamp(1.375rem,2vw,1.75rem)] leading-[1.15] font-normal tracking-[-0.02em]">
                  {item.title}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pr-10 pb-8 text-base leading-7 text-muted-foreground">
                <p className="max-w-[60ch]">{item.description}</p>
              </AccordionContent>
            </li>
          </AccordionItem>
        ))}
      </ul>
    </Accordion>
  );
}
