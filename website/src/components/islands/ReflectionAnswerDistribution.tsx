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
      className="border-line max-w-3xl border-y py-5"
      data-reflection-distribution
    >
      <figcaption>
        <h3 className="text-sm font-medium">Distribuția alegerilor</h3>
      </figcaption>

      <dl className="mt-3">
        {distribution.map((item) => (
          <div
            className="border-line grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-2 border-t py-3 first:border-t-0"
            data-reflection-dimension={item.dimension}
            key={item.dimension}
          >
            <dt className="font-medium leading-6">{item.label}</dt>
            <dd
              className="shrink-0 text-sm [font-variant-numeric:tabular-nums]"
              data-reflection-count={item.count}
            >
              {item.displayCount}
            </dd>
            <dd className="text-muted-foreground col-span-2 grid max-w-xl gap-3 text-sm leading-6">
              <Progress
                aria-hidden="true"
                className="h-1"
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
