import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function PsychotherapyBibliography() {
  return (
    <Accordion
      type="single"
      collapsible
      className="border-y border-border"
      data-bibliography
    >
      <AccordionItem value="bibliography">
        <AccordionTrigger className="min-h-12 py-3" headingLevel={2}>
          <span className="font-display text-xl font-normal tracking-[-0.015em]">
            Bibliografie
          </span>
        </AccordionTrigger>
        <AccordionContent className="pr-10 pb-6">
          <ol className="grid gap-4 pl-5 text-sm leading-6 text-muted-foreground">
            <li>
              American Psychoanalytic Association. (n.d.).{" "}
              <em>About psychoanalysis</em>. Retrieved July 29, 2026, from{" "}
              <a
                className="break-words text-foreground"
                href="https://apsa.org/about-psychoanalysis/"
              >
                apsa.org/about-psychoanalysis/
              </a>
            </li>
            <li>
              Gabbard, G. O. (2017).{" "}
              <em>Long-term psychodynamic psychotherapy: A basic text</em> (3rd
              ed.). American Psychiatric Association Publishing.{" "}
              <a
                className="break-words text-foreground"
                href="https://doi.org/10.1176/appi.books.9781615371471"
              >
                https://doi.org/10.1176/appi.books.9781615371471
              </a>
            </li>
            <li>
              McWilliams, N. (2004).{" "}
              <em>Psychoanalytic psychotherapy: A practitioner’s guide</em>.
              Guilford Press.
            </li>
            <li>
              Shedler, J. (2010). The efficacy of psychodynamic psychotherapy.{" "}
              <em>American Psychologist, 65</em>(2), 98–109.{" "}
              <a
                className="break-words text-foreground"
                href="https://doi.org/10.1037/a0018378"
              >
                https://doi.org/10.1037/a0018378
              </a>
            </li>
          </ol>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
