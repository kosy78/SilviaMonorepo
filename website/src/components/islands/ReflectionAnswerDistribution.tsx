import { Progress } from "@/components/ui/progress";

export interface AnswerDistributionDatum {
  count: number;
  dimension: string;
  displayCount: string;
  label: string;
}

interface Props {
  distribution: readonly AnswerDistributionDatum[];
  totalQuestions: number;
}

export default function ReflectionAnswerDistribution({
  distribution,
  totalQuestions,
}: Props) {
  return (
    <figure
      aria-label="Cum s-au împărțit răspunsurile"
      data-reflection-distribution
    >
      <dl className="grid gap-5">
        {distribution.map((item) => (
          <div
            className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-2"
            data-reflection-dimension={item.dimension}
            key={item.dimension}
          >
            <dt className="font-normal leading-6">{item.label}</dt>
            <dd
              className="shrink-0 text-sm [font-variant-numeric:tabular-nums]"
              data-reflection-count={item.count}
            >
              {item.displayCount}
            </dd>
            <dd className="text-muted-foreground col-span-2 grid gap-3 text-sm leading-6">
              <Progress
                aria-hidden="true"
                className={
                  item.dimension === "uncertain"
                    ? "h-1.5 [&_[data-slot=progress-indicator]]:bg-muted-foreground/65"
                    : "h-1.5"
                }
                data-reflection-frequency={item.count}
                tabIndex={-1}
                value={(item.count / totalQuestions) * 100}
              />
            </dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}
