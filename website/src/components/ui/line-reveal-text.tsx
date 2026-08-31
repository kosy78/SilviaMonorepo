import {
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
} from "react";

import { cn } from "@/lib/utils";

interface LineStyle extends CSSProperties {
  "--line-reveal-index": number;
}

interface LineRevealTextProps extends Omit<ComponentProps<"p">, "children"> {
  text: string;
}

function getRevealHost(element: HTMLElement) {
  return element.closest<HTMLElement>(
    '[data-slot="accordion-content"], [data-slot="disclosure"]',
  );
}

function isRevealHostOpen(host: HTMLElement | null) {
  if (!host) {
    return true;
  }

  if (host instanceof HTMLDetailsElement) {
    return host.open;
  }

  return host.dataset.state === "open";
}

function LineRevealText({ className, text, ...props }: LineRevealTextProps) {
  const words = text.trim().split(/\s+/);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const measureLinesRef = useRef<() => void>(() => undefined);
  const hasMeasuredOpenHostRef = useRef(false);
  const [lines, setLines] = useState(() => [text]);
  const [isMeasured, setIsMeasured] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const paragraph = paragraphRef.current;

    if (!paragraph) {
      return;
    }

    let animationFrame = 0;
    let isDisposed = false;
    hasMeasuredOpenHostRef.current = false;

    const measureLines = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        if (isDisposed) {
          return;
        }

        if (!isRevealHostOpen(getRevealHost(paragraph))) {
          hasMeasuredOpenHostRef.current = false;
          setIsMeasured(true);
          return;
        }

        const measurer = document.createElement("span");
        measurer.className = "line-reveal-text__measurer";
        measurer.setAttribute("aria-hidden", "true");

        for (const [index, word] of words.entries()) {
          const wordElement = document.createElement("span");
          wordElement.className = "line-reveal-text__measure-word";
          wordElement.textContent = word;
          measurer.append(wordElement);

          if (index < words.length - 1) {
            measurer.append(document.createTextNode(" "));
          }
        }

        paragraph.append(measurer);

        const wordElements = Array.from(
          measurer.querySelectorAll<HTMLElement>(
            ".line-reveal-text__measure-word",
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
        hasMeasuredOpenHostRef.current = true;

        setLines((currentLines) =>
          currentLines.length === nextLines.length &&
          currentLines.every((line, index) => line === nextLines[index])
            ? currentLines
            : nextLines,
        );
        setIsMeasured(true);
      });
    };

    measureLinesRef.current = measureLines;

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
      measureLinesRef.current = () => undefined;
    };
  }, [text]);

  useEffect(() => {
    const paragraph = paragraphRef.current;

    if (!paragraph || !isMeasured) {
      return;
    }

    const host = getRevealHost(paragraph);
    let revealFrame = 0;

    const syncRevealState = () => {
      cancelAnimationFrame(revealFrame);

      if (!isRevealHostOpen(host)) {
        hasMeasuredOpenHostRef.current = false;
        setIsRevealed(false);
        return;
      }

      const needsOpenHostMeasurement = !hasMeasuredOpenHostRef.current;

      if (needsOpenHostMeasurement) {
        measureLinesRef.current();
      }

      revealFrame = requestAnimationFrame(() => {
        if (needsOpenHostMeasurement) {
          revealFrame = requestAnimationFrame(() => setIsRevealed(true));
          return;
        }

        setIsRevealed(true);
      });
    };

    syncRevealState();

    if (!host) {
      return () => cancelAnimationFrame(revealFrame);
    }

    const observer = new MutationObserver(syncRevealState);
    observer.observe(host, {
      attributeFilter:
        host instanceof HTMLDetailsElement ? ["open"] : ["data-state"],
      attributes: true,
    });

    return () => {
      cancelAnimationFrame(revealFrame);
      observer.disconnect();
    };
  }, [isMeasured]);

  return (
    <p
      className={cn("line-reveal-text", className)}
      data-line-reveal-text
      data-revealed={isRevealed}
      ref={paragraphRef}
      {...props}
    >
      {lines.map((line, index) => {
        const style: LineStyle = {
          "--line-reveal-index": index,
        };

        return (
          <span
            className="line-reveal-text__line"
            data-line-reveal-line={index}
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

export { LineRevealText };
