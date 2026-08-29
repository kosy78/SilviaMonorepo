import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type TransitionEvent,
} from "react";

interface SupportArea {
  title: string;
  description: string;
}

interface SupportAreasAccordionProps {
  items: readonly SupportArea[];
}

interface SupportAreaLineStyle extends CSSProperties {
  "--support-area-line-index": number;
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

function SupportAreaDescription({ text }: { text: string }) {
  const words = text.trim().split(/\s+/);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const [lines, setLines] = useState(() => [text]);

  useEffect(() => {
    const paragraph = paragraphRef.current;

    if (!paragraph) {
      return;
    }

    let animationFrame = 0;
    let isDisposed = false;

    const measureLines = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        if (isDisposed) {
          return;
        }

        const measurer = document.createElement("span");
        measurer.className = "support-area-copy-measurer";
        measurer.setAttribute("aria-hidden", "true");

        for (const [index, word] of words.entries()) {
          const wordElement = document.createElement("span");
          wordElement.className = "support-area-copy-measure-word";
          wordElement.textContent = word;
          measurer.append(wordElement);

          if (index < words.length - 1) {
            measurer.append(document.createTextNode(" "));
          }
        }

        paragraph.append(measurer);

        const wordElements = Array.from(
          measurer.querySelectorAll<HTMLElement>(
            ".support-area-copy-measure-word",
          ),
        );
        const nextLines: string[] = [];
        let currentTop: number | undefined;

        for (const wordElement of wordElements) {
          const wordTop = Math.round(wordElement.getBoundingClientRect().top);

          if (currentTop === undefined || Math.abs(wordTop - currentTop) > 1) {
            currentTop = wordTop;
            nextLines.push(wordElement.textContent ?? "");
          } else {
            const currentLine = nextLines.length - 1;
            nextLines[currentLine] =
              `${nextLines[currentLine]} ${wordElement.textContent ?? ""}`;
          }
        }

        measurer.remove();

        setLines((currentLines) =>
          currentLines.length === nextLines.length &&
          currentLines.every((line, index) => line === nextLines[index])
            ? currentLines
            : nextLines,
        );
      });
    };

    const resizeObserver = new ResizeObserver(measureLines);
    resizeObserver.observe(paragraph);
    measureLines();

    void document.fonts.ready.then(() => {
      if (!isDisposed) {
        measureLines();
      }
    });

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
    };
  }, [text]);

  return (
    <p
      className="support-area-copy max-w-[60ch]"
      data-support-area-copy
      ref={paragraphRef}
    >
      {lines.map((line, index) => {
        const style: SupportAreaLineStyle = {
          "--support-area-line-index": index,
        };

        return (
          <span
            className="support-area-copy-line"
            data-support-area-copy-line={index}
            key={`${line}-${index}`}
            style={style}
          >
            {line}
            {index < lines.length - 1 ? " " : null}
          </span>
        );
      })}
    </p>
  );
}

export default function SupportAreasAccordion({
  items,
}: SupportAreasAccordionProps) {
  const [pinnedValue, setPinnedValue] = useState("");
  const [hoverValue, setHoverValue] = useState("");
  const [focusValue, setFocusValue] = useState("");
  const listRef = useRef<HTMLUListElement>(null);
  const openValue = focusValue || hoverValue || pinnedValue;

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
    <Accordion type="single" collapsible value={openValue} asChild>
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
              className="border-border border-t !border-b-0"
              key={item.title}
              value={value}
            >
              <li
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") {
                    setHoverValue(value);
                  }
                }}
                onPointerLeave={(event) => {
                  if (event.pointerType === "mouse") {
                    setHoverValue((currentValue) =>
                      currentValue === value ? "" : currentValue,
                    );
                  }
                }}
              >
                <AccordionTrigger
                  animatedIcon
                  className="min-h-20 rounded-none py-7 hover:no-underline **:data-[slot=accordion-trigger-icon]:size-5"
                  onBlur={() => {
                    setFocusValue((currentValue) =>
                      currentValue === value ? "" : currentValue,
                    );
                  }}
                  onClick={() => {
                    setHoverValue("");
                    setFocusValue("");
                    setPinnedValue((currentValue) =>
                      currentValue === value ? "" : value,
                    );
                  }}
                  onFocus={() => setFocusValue(value)}
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
                  <div className="pr-10 pb-8 text-base leading-7 text-pretty text-muted-foreground">
                    <SupportAreaDescription text={item.description} />
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
