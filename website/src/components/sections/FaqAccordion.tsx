import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LineRevealText } from "@/components/ui/line-reveal-text";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: readonly FaqItem[];
}

export default function FaqAccordion({ items }: FaqAccordionProps) {
  return (
    <Accordion type="single" collapsible className="border-y border-border">
      {items.map((item, index) => (
        <AccordionItem key={item.question} value={`faq-${index + 1}`}>
          <AccordionTrigger className="py-6">
            <span className="text-lg">{item.question}</span>
          </AccordionTrigger>
          <AccordionContent className="pr-12 pb-7">
            <LineRevealText
              className="max-w-3xl text-lg leading-8 text-muted-foreground"
              text={item.answer}
            />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
