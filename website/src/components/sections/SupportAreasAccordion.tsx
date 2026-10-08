import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useRef, useState, type TransitionEvent } from "react";
import { LineRevealText } from "@/components/ui/line-reveal-text";

interface SupportArea {
  title: string;
  description: string;
  illustrationSrc: string;
  illustrationWidth: number;
  illustrationHeight: number;
  illustrationCrop?: boolean;
  illustrationWrap?: boolean;
}

interface SupportAreasAccordionProps {
  items: readonly SupportArea[];
  headingLevel?: 2 | 3;
}

function scrollOverflowingAreaIntoView(
  item: HTMLElement,
  behavior: ScrollBehavior,
) {
  if (item.getBoundingClientRect().bottom <= window.innerHeight) {
    return;
  }

  item.scrollIntoView({
    behavior,
    block: "nearest",
    inline: "nearest",
  });
}

function keepExpandedAreaInView(event: TransitionEvent<HTMLDivElement>) {
  const content = event.currentTarget;
  const transitionTarget = event.target;

  if (
    event.propertyName !== "transform" ||
    !(transitionTarget instanceof HTMLElement) ||
    !transitionTarget.classList.contains("support-area-content-inner") ||
    content.dataset.state !== "open"
  ) {
    return;
  }

  const item = content.closest<HTMLElement>('[data-slot="accordion-item"]');

  if (!item) {
    return;
  }

  scrollOverflowingAreaIntoView(item, "smooth");
}

export default function SupportAreasAccordion({
  items,
  headingLevel = 3,
}: SupportAreasAccordionProps) {
  const [openValue, setOpenValue] = useState("");
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (
      !openValue ||
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const animationFrame = requestAnimationFrame(() => {
      const openItem = listRef.current?.querySelector<HTMLElement>(
        '[data-slot="accordion-item"][data-state="open"]',
      );

      if (openItem) {
        scrollOverflowingAreaIntoView(openItem, "auto");
      }
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [openValue]);

  return (
    <Accordion
      type="single"
      collapsible
      value={openValue}
      onValueChange={setOpenValue}
      asChild
    >
      <ul
        className="mt-[clamp(3rem,6vw,5rem)] grid list-none grid-cols-1 gap-0 p-0 sm:grid-cols-2 sm:gap-x-[clamp(2.5rem,6vw,5rem)]"
        data-therapy-help-list
        ref={listRef}
      >
        {items.map((item, index) => {
          const value = `support-area-${index + 1}`;
          const isOpen = openValue === value;

          return (
            <AccordionItem
              asChild
              className="support-area-item border-border border-t !border-b-0"
              key={item.title}
              value={value}
            >
              <li>
                <AccordionTrigger
                  animatedIcon
                  headingLevel={headingLevel}
                  className="min-h-20 rounded-none py-7 hover:no-underline **:data-[slot=accordion-trigger-icon]:size-5 **:data-[slot=accordion-trigger-icon]:stroke-[1.5]"
                >
                  <span className="pr-4 text-[clamp(1.375rem,2vw,1.75rem)] leading-[1.15] font-normal tracking-[-0.02em]">
                    {item.title}
                  </span>
                </AccordionTrigger>
                <AccordionContent
                  aria-hidden={!isOpen}
                  className="support-area-content-inner pb-0"
                  contentClassName="support-area-content"
                  forceMount
                  inert={!isOpen ? true : undefined}
                  onTransitionEnd={keepExpandedAreaInView}
                >
                  <div
                    className={`support-area-answer pb-8 text-base leading-7 text-pretty text-muted-foreground ${item.illustrationWrap ? "pr-0" : "pr-10"}`}
                    data-illustration-crop={item.illustrationCrop || undefined}
                    data-illustration-wrap={item.illustrationWrap || undefined}
                  >
                    {item.illustrationWrap ? (
                      <>
                        <span className="support-area-illustration-crop">
                          <img
                            alt=""
                            aria-hidden="true"
                            className="support-area-illustration"
                            decoding="async"
                            height={item.illustrationHeight}
                            loading="lazy"
                            src={item.illustrationSrc}
                            width={item.illustrationWidth}
                          />
                        </span>
                        <p className="support-area-answer-copy">
                          {item.description}
                        </p>
                      </>
                    ) : (
                      <>
                        <img
                          alt=""
                          aria-hidden="true"
                          className="support-area-illustration"
                          decoding="async"
                          height={item.illustrationHeight}
                          loading="lazy"
                          src={item.illustrationSrc}
                          width={item.illustrationWidth}
                        />
                        <LineRevealText
                          className="support-area-answer-copy max-w-[60ch]"
                          text={item.description}
                        />
                      </>
                    )}
                  </div>
                </AccordionContent>
              </li>
            </AccordionItem>
          );
        })}
      </ul>
    </Accordion>
  );
}
