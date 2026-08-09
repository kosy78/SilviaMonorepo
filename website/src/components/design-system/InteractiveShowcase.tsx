import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formatProgress = {
  cabinet: 34,
  online: 67,
  flexibil: 100,
} as const;
const formatOptions = [
  ["cabinet", "În cabinet"],
  ["online", "Online"],
  ["flexibil", "Flexibil"],
] as const;

export default function InteractiveShowcase() {
  const [format, setFormat] = useState<keyof typeof formatProgress>("online");

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="rounded-xl bg-card p-5 ring-1 ring-foreground/10 sm:p-6">
        <p className="mb-4 text-sm font-medium">Accordion</p>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger headingLevel={3}>
              Ce păstrează sistemul consecvent?
            </AccordionTrigger>
            <AccordionContent>
              Tokenurile comune, variantele explicite și verificarea în paginile
              reale ale site-ului.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger headingLevel={3}>
              Când se adaugă o variantă nouă?
            </AccordionTrigger>
            <AccordionContent>
              Numai când o nevoie repetată nu poate fi exprimată clar prin
              variantele existente.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="rounded-xl bg-card p-5 ring-1 ring-foreground/10 sm:p-6">
        <p className="mb-4 text-sm font-medium">Radio group + progress</p>
        <RadioGroup
          value={format}
          onValueChange={(value) =>
            setFormat(value as keyof typeof formatProgress)
          }
          aria-label="Exemplu de alegere a formatului"
          className="gap-3"
        >
          {formatOptions.map(([value, label]) => (
            <div className="flex min-h-11 items-center gap-3" key={value}>
              <RadioGroupItem id={`format-${value}`} value={value} />
              <Label htmlFor={`format-${value}`}>{label}</Label>
            </div>
          ))}
        </RadioGroup>
        <div className="mt-5">
          <div className="mb-2 flex justify-between gap-4 text-sm">
            <span className="text-muted-foreground">Stare demonstrativă</span>
            <span className="tabular-nums">{formatProgress[format]}%</span>
          </div>
          <Progress
            value={formatProgress[format]}
            aria-label={`Progres demonstrativ: ${formatProgress[format]}%`}
          />
        </div>
      </div>
    </div>
  );
}
