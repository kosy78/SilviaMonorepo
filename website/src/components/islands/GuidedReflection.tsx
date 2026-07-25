import { useEffect, useMemo, useRef, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Choice } from "@/components/ui/choice";
import {
  Disclosure,
  DisclosureContent,
  DisclosureIcon,
  DisclosureTrigger,
} from "@/components/ui/disclosure";
import { Progress } from "@/components/ui/progress";

type Dimension = "body" | "emotion" | "relationships";
type AnswerValue = Dimension | "uncertain";
type ResultKey = Dimension | "mixed";

interface AnswerOption {
  label: string;
  dimension: AnswerValue;
}

interface ReflectionQuestion {
  prompt: string;
  answers: readonly AnswerOption[];
}

interface DimensionMeta {
  key: Dimension;
  label: string;
  description: string;
}

interface DistributionStyle {
  label: string;
  filledSegment: string;
  emptySegment: string;
}

interface ReflectionResult {
  title: string;
  lead: string;
  context: string;
  focusPoints: readonly string[];
  scienceNote: string;
}

interface ReflectionSummary {
  counts: Record<Dimension, number>;
  uncertainCount: number;
  resultKey: ResultKey;
  secondaryDimension: Dimension | null;
}

const dimensions: readonly DimensionMeta[] = [
  {
    key: "body",
    label: "Corp și semnale fizice",
    description: "Somn, energie, tensiune și alte senzații corporale.",
  },
  {
    key: "emotion",
    label: "Stări emoționale",
    description: "Stări care revin, se intensifică sau sunt greu de numit.",
  },
  {
    key: "relationships",
    label: "Relații și tipare repetitive",
    description: "Apropiere, retragere, limite și situații care se repetă.",
  },
];

const dimensionKeys = dimensions.map(({ key }) => key);

const dimensionStyles: Record<Dimension, DistributionStyle> = {
  body: {
    label: "text-reflection-body",
    filledSegment: "border-reflection-body bg-reflection-body",
    emptySegment: "border-reflection-body bg-reflection-body-soft",
  },
  emotion: {
    label: "text-reflection-emotion",
    filledSegment: "border-reflection-emotion bg-reflection-emotion",
    emptySegment: "border-reflection-emotion bg-reflection-emotion-soft",
  },
  relationships: {
    label: "text-reflection-relationships",
    filledSegment:
      "border-reflection-relationships bg-reflection-relationships",
    emptySegment:
      "border-reflection-relationships bg-reflection-relationships-soft",
  },
};

const uncertainStyle: DistributionStyle = {
  label: "text-reflection-uncertain",
  filledSegment: "border-reflection-uncertain bg-reflection-uncertain",
  emptySegment: "border-reflection-uncertain bg-reflection-uncertain-soft",
};

const uncertainAnswer: AnswerOption = {
  label: "Încă nu este clar sau nicio variantă nu se potrivește suficient",
  dimension: "uncertain",
};

const questions: readonly ReflectionQuestion[] = [
  {
    prompt: "Prin ce observați cel mai repede că ceva cere atenție?",
    answers: [
      {
        label: "Prin somn, energie, tensiune sau alte senzații ale corpului",
        dimension: "body",
      },
      {
        label: "Printr-o stare care revine sau devine greu de numit",
        dimension: "emotion",
      },
      {
        label: "Prin apropiere, retragere, conflicte sau limite în relații",
        dimension: "relationships",
      },
    ],
  },
  {
    prompt: "Ce ajunge să vă influențeze mai mult viața de zi cu zi?",
    answers: [
      {
        label: "Un disconfort corporal, somnul sau lipsa de energie",
        dimension: "body",
      },
      {
        label: "O stare care persistă, se schimbă repede sau se intensifică",
        dimension: "emotion",
      },
      {
        label: "O relație sau o situație care continuă să vă preocupe",
        dimension: "relationships",
      },
    ],
  },
  {
    prompt: "Ce pare să revină chiar și atunci când contextul se schimbă?",
    answers: [
      {
        label: "O reacție a corpului sau o scădere a energiei",
        dimension: "body",
      },
      {
        label: "Aceeași neliniște, tristețe, iritare sau stare de gol",
        dimension: "emotion",
      },
      {
        label: "O situație relațională familiară, chiar cu persoane diferite",
        dimension: "relationships",
      },
    ],
  },
  {
    prompt: "Ce este cel mai greu de înțeles atunci când apare?",
    answers: [
      {
        label: "De ce corpul reacționează astfel în anumite momente",
        dimension: "body",
      },
      {
        label: "De unde vine o stare sau ce o face să persiste",
        dimension: "emotion",
      },
      {
        label: "De ce o relație ajunge din nou într-un punct cunoscut",
        dimension: "relationships",
      },
    ],
  },
  {
    prompt: "Când aveți puțin răgaz, unde se întoarce mai des atenția?",
    answers: [
      {
        label: "La o senzație corporală, la somn sau la nivelul de energie",
        dimension: "body",
      },
      {
        label: "La starea interioară și la felul în care se schimbă",
        dimension: "emotion",
      },
      {
        label: "La o conversație, o distanță sau o relație",
        dimension: "relationships",
      },
    ],
  },
  {
    prompt: "Ce ați vrea să puteți observa mai devreme?",
    answers: [
      {
        label:
          "Momentul în care corpul începe să se tensioneze sau să obosească",
        dimension: "body",
      },
      {
        label: "Momentul în care o stare începe să se intensifice",
        dimension: "emotion",
      },
      {
        label: "Momentul în care un tipar relațional începe să se repete",
        dimension: "relationships",
      },
    ],
  },
  {
    prompt:
      "Dacă ați continua cu o singură întrebare, care v-ar fi mai utilă acum?",
    answers: [
      {
        label: "În ce contexte apar semnalele corpului și ce le schimbă?",
        dimension: "body",
      },
      {
        label:
          "În ce contexte revine această stare și ce îi schimbă intensitatea?",
        dimension: "emotion",
      },
      {
        label:
          "Ce se repetă în felul în care vă apropiați, vă protejați sau vă retrageți?",
        dimension: "relationships",
      },
    ],
  },
];

const resultContent: Record<ResultKey, ReflectionResult> = {
  body: {
    title: "Alegerile legate de corp au apărut mai des.",
    lead: "Poate fi util să observați când apar aceste semnale și ce se întâmplă în jurul lor, fără a presupune că au o singură cauză.",
    context:
      "Simptomele fizice pot avea multe cauze. Dacă vă preocupă, evaluarea medicală rămâne importantă; reflecția de aici nu o înlocuiește. Psihoterapia poate oferi un spațiu separat pentru contextul emoțional și relațional în care apar.",
    focusPoints: [
      "În ce momente apar sau se intensifică aceste semnale?",
      "Ce se întâmplă înainte, în timpul și după ele?",
      "Ce este greu de spus atunci când corpul atrage primul atenția?",
    ],
    scienceNote:
      "Sursele consultate descriu legături în ambele sensuri între sănătatea mintală și cea fizică și discută felul în care stresul poate avea expresii corporale. Aceste observații nu explică un simptom individual și nu înlocuiesc evaluarea medicală.",
  },
  emotion: {
    title: "Alegerile legate de stările emoționale au apărut mai des.",
    lead: "Poate fi util să observați în ce contexte revine o stare, ce o intensifică și ce îi schimbă ritmul.",
    context:
      "A observa o stare nu înseamnă a o transforma într-o etichetă. Neliniștea, tristețea, iritarea, golul sau schimbările de stare pot fi mai ușor de recunoscut decât de înțeles în contextul propriei vieți.",
    focusPoints: [
      "Ce stare revine și în ce momente devine mai prezentă?",
      "Ce pare să o intensifice sau să îi schimbe ritmul?",
      "Ce rămâne greu de numit atunci când apare?",
    ],
    scienceNote:
      "Cercetarea clinică discută reglarea emoțiilor ca un proces relevant în dificultăți diferite, fără ca acest lucru să ofere o etichetă sau o concluzie diagnostică.",
  },
  relationships: {
    title: "Alegerile legate de relații au apărut mai des.",
    lead: "Poate fi util să priviți situațiile care capătă o formă familiară, chiar atunci când oamenii sau împrejurările sunt diferite.",
    context:
      "A observa o repetiție nu spune cine are dreptate și nu reduce o relație sau o persoană la o singură explicație. Poate deschide o întrebare despre rolurile, așteptările și modurile de protecție care reapar.",
    focusPoints: [
      "Ce scenă relațională pare să se repete?",
      "Cum vă apropiați, vă protejați sau vă retrageți în acel moment?",
      "Ce ar merita înțeles înainte de a încerca o schimbare?",
    ],
    scienceNote:
      "Modelele psihodinamice acordă atenție felului în care emoțiile, modurile de protecție și tiparele relaționale se pot repeta în prezent. Aceasta este o direcție de explorare, nu o concluzie despre o persoană sau o relație.",
  },
  mixed: {
    title: "Alegerile dumneavoastră s-au împărțit între mai multe planuri.",
    lead: "Nu este nevoie să alegeți o singură explicație. Puteți începe cu planul care se simte mai prezent astăzi.",
    context:
      "Corpul, stările emoționale și relațiile se pot influența reciproc, iar uneori nimic nu este suficient de clar de la început. Distribuția de aici nu stabilește cauze între aceste planuri.",
    focusPoints: [
      "Ce se simte mai prezent astăzi: corpul, starea sau o relație?",
      "Ce legătură observați între aceste planuri?",
      "Ce întrebare rămâne deschisă după acest parcurs?",
    ],
    scienceNote:
      "Sursele consultate descriu sănătatea mintală în legătură cu sănătatea fizică, relațiile și contextul. Această perspectivă susține o privire de ansamblu, nu validează reflecția ca instrument clinic.",
  },
};

const researchSources = [
  {
    label:
      "CDC: sănătatea mintală este legată de sănătatea fizică, relații și context",
    href: "https://www.cdc.gov/mental-health/about/index.html",
  },
  {
    label:
      "APA: stresul poate avea efecte asupra corpului, emoțiilor și comportamentului",
    href: "https://www.apa.org/topics/stress/body",
  },
  {
    label: "PubMed: rolul reglării emoțiilor în dificultăți diferite",
    href: "https://pubmed.ncbi.nlm.nih.gov/27524846/",
  },
  {
    label:
      "PubMed: cercetare despre asocierea dintre reglarea emoțiilor și simptome somatice",
    href: "https://pubmed.ncbi.nlm.nih.gov/38598412/",
  },
  {
    label:
      "NCBI Bookshelf: terapia psihodinamică lucrează cu emoții, relații și tipare repetitive",
    href: "https://www.ncbi.nlm.nih.gov/books/NBK606117/",
  },
] as const;

const emptyCounts: Record<Dimension, number> = {
  body: 0,
  emotion: 0,
  relationships: 0,
};

function calculateSummary(
  answers: readonly (AnswerValue | null)[],
): ReflectionSummary | null {
  if (answers.some((answer) => answer === null)) {
    return null;
  }

  const counts = { ...emptyCounts };
  let uncertainCount = 0;

  for (const answer of answers) {
    if (answer === "uncertain") {
      uncertainCount += 1;
    } else if (answer) {
      counts[answer] += 1;
    }
  }

  const orderedDimensions = [...dimensionKeys].sort(
    (first, second) => counts[second] - counts[first],
  );
  const strongest = orderedDimensions[0] ?? "body";
  const nextStrongest = orderedDimensions[1] ?? "emotion";
  const resultKey =
    counts[strongest] === counts[nextStrongest] ? "mixed" : strongest;
  const secondaryDimension =
    resultKey !== "mixed" && counts[nextStrongest] >= counts[strongest] - 1
      ? nextStrongest
      : null;

  return {
    counts,
    uncertainCount,
    resultKey,
    secondaryDimension,
  };
}

function getDimensionMeta(dimension: Dimension) {
  return dimensions.find(({ key }) => key === dimension) ?? dimensions[0];
}

function DistributionRow({
  count,
  description,
  dimension,
  label,
  style,
  totalQuestions,
}: {
  count: number;
  description: string;
  dimension: string;
  label: string;
  style: DistributionStyle;
  totalQuestions: number;
}) {
  return (
    <div
      className="border-line grid gap-4 border-t py-5 md:grid-cols-[minmax(0,1fr)_14rem] md:items-center md:gap-8"
      data-reflection-dimension={dimension}
    >
      <div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className={`font-medium ${style.label}`}>{label}</dt>
          <dd
            className="text-ink shrink-0 text-sm [font-variant-numeric:tabular-nums]"
            data-reflection-count={count}
          >
            {count} din {totalQuestions}
          </dd>
        </div>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          {description}
        </p>
      </div>

      <div
        className="grid grid-cols-7 gap-1.5"
        aria-hidden="true"
        data-reflection-segments
      >
        {Array.from({ length: totalQuestions }, (_, index) => {
          const isFilled = index < count;

          return (
            <span
              className={`h-3 border ${
                isFilled ? style.filledSegment : style.emptySegment
              }`}
              data-reflection-segment={isFilled ? "filled" : "empty"}
              key={index}
            />
          );
        })}
      </div>
    </div>
  );
}

function AnswerMap({
  summary,
  totalQuestions,
}: {
  summary: ReflectionSummary;
  totalQuestions: number;
}) {
  return (
    <figure className="border-line mt-8 border-y">
      <figcaption className="py-5">
        <p className="font-display text-2xl leading-tight">
          Cum s-au distribuit alegerile
        </p>
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-6">
          Fiecare segment reprezintă o întrebare. Segmentele arată frecvența
          alegerilor, nu intensitatea unei dificultăți.
        </p>
      </figcaption>

      <dl>
        {dimensions.map((dimension) => {
          const count = summary.counts[dimension.key];

          return (
            <DistributionRow
              count={count}
              description={dimension.description}
              dimension={dimension.key}
              label={dimension.label}
              style={dimensionStyles[dimension.key]}
              totalQuestions={totalQuestions}
              key={dimension.key}
            />
          );
        })}
        {summary.uncertainCount > 0 ? (
          <DistributionRow
            count={summary.uncertainCount}
            description="Momente în care nimic nu a fost încă destul de clar."
            dimension="uncertain"
            label="Fără o potrivire clară"
            style={uncertainStyle}
            totalQuestions={totalQuestions}
          />
        ) : null}
      </dl>
    </figure>
  );
}

export default function GuidedReflection() {
  // V1 keeps answers in component state only. There is no localStorage, server
  // request, analytics event, or email capture tied to this flow.
  const [answers, setAnswers] = useState<(AnswerValue | null)[]>(() =>
    Array.from({ length: questions.length }, () => null),
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const questionHeadingRef = useRef<HTMLLegendElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const hasNavigatedRef = useRef(false);

  const currentQuestion = questions[currentIndex];
  const selectedAnswer = answers[currentIndex] ?? null;
  const answeredCount = answers.filter(Boolean).length;

  const summary = useMemo(() => calculateSummary(answers), [answers]);
  const result = summary ? resultContent[summary.resultKey] : null;
  const secondaryDimension = summary?.secondaryDimension
    ? getDimensionMeta(summary.secondaryDimension)
    : null;
  const progressPercent = showResult
    ? 100
    : Math.round((answeredCount / questions.length) * 100);

  useEffect(() => {
    if (!hasNavigatedRef.current) return;

    const target = showResult
      ? resultHeadingRef.current
      : questionHeadingRef.current;
    target?.focus();
  }, [currentIndex, showResult]);

  if (!currentQuestion) {
    return null;
  }

  const selectAnswer = (dimension: AnswerValue) => {
    setAnswers((currentAnswers) =>
      currentAnswers.map((answer, index) =>
        index === currentIndex ? dimension : answer,
      ),
    );
  };

  const goBack = () => {
    hasNavigatedRef.current = true;

    if (showResult) {
      setShowResult(false);
      setCurrentIndex(questions.length - 1);
      return;
    }

    setCurrentIndex((index) => Math.max(index - 1, 0));
  };

  const continueReflection = () => {
    if (!selectedAnswer) {
      return;
    }

    hasNavigatedRef.current = true;

    if (currentIndex === questions.length - 1) {
      setShowResult(true);
      return;
    }

    setCurrentIndex((index) => Math.min(index + 1, questions.length - 1));
  };

  const resetReflection = () => {
    hasNavigatedRef.current = true;
    setAnswers(Array.from({ length: questions.length }, () => null));
    setCurrentIndex(0);
    setShowResult(false);
  };

  return (
    <section
      className="border-line border-y py-12 md:py-16"
      aria-label="Reflecție ghidată"
      id="reflectie"
    >
      <div className="mx-auto w-full max-w-(--content-width) px-(--page-gutter)">
        <div className="grid gap-12 md:grid-cols-[0.72fr_1.28fr]">
          <div>
            <div className="border-line border-t pt-5" aria-live="polite">
              <Badge variant={showResult ? "secondary" : "default"}>
                {showResult
                  ? "Rezultat orientativ"
                  : `Întrebarea ${currentIndex + 1} din ${questions.length}`}
              </Badge>
              <Progress
                className="mt-3"
                value={progressPercent}
                aria-label="Progresul reflecției"
              />
              <p className="text-muted-foreground mt-3 text-sm">
                {answeredCount === 1
                  ? "1 răspuns selectat"
                  : `${answeredCount} răspunsuri selectate`}
              </p>
            </div>
          </div>

          {showResult && result && summary ? (
            <div
              className="border-line border-t pt-8"
              data-reflection-result={summary.resultKey}
            >
              <h2
                className="font-display max-w-3xl text-4xl leading-tight tracking-[-0.035em] outline-none focus-visible:shadow-none md:text-5xl"
                ref={resultHeadingRef}
                tabIndex={-1}
              >
                {result.title}
              </h2>
              <p className="mt-6 max-w-2xl text-xl leading-8">{result.lead}</p>

              <Alert variant="default" className="mt-6 max-w-2xl">
                <AlertDescription>
                  Rezultatul descrie doar alegerile făcute aici. Nu este un
                  diagnostic, nu măsoară severitatea și nu înlocuiește o
                  evaluare psihologică profesională.
                </AlertDescription>
              </Alert>

              <AnswerMap summary={summary} totalQuestions={questions.length} />

              {secondaryDimension ? (
                <div className="border-line mt-8 border-y py-5">
                  <h3 className="font-display text-2xl leading-tight">
                    O direcție apropiată
                  </h3>
                  <p className="mt-3 max-w-2xl leading-7">
                    Și planul „{secondaryDimension.label.toLowerCase()}” a
                    apărut aproape la fel de des. Îl puteți păstra alături, fără
                    a reduce experiența la o singură explicație.
                  </p>
                </div>
              ) : null}

              <p className="mt-8 max-w-2xl text-lg leading-8">
                {result.context}
              </p>

              <div className="border-line mt-10 border-t pt-6">
                <h3 className="font-display text-2xl leading-tight">
                  Întrebări de dus mai departe
                </h3>
                <ul className="mt-4 grid gap-3 p-0">
                  {result.focusPoints.map((point) => (
                    <li
                      className="border-line list-none border-t pt-3 leading-7"
                      key={point}
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <Disclosure className="mt-10">
                <DisclosureTrigger>
                  <span>Cum să citiți această reflecție</span>
                  <DisclosureIcon />
                </DisclosureTrigger>
                <DisclosureContent>
                  <p className="max-w-2xl leading-7">{result.scienceNote}</p>
                  <p className="text-muted-foreground mt-4 max-w-2xl text-sm leading-6">
                    Surse consultate pentru formulare, accesate la 8 iulie 2026:
                  </p>
                  <ul className="mt-3 grid gap-2 p-0 text-sm leading-6">
                    {researchSources.map((source) => (
                      <li className="list-none" key={source.href}>
                        <a
                          className={buttonVariants({
                            variant: "link",
                            size: "inline",
                          })}
                          href={source.href}
                          rel="noreferrer"
                          target="_blank"
                        >
                          {source.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </DisclosureContent>
              </Disclosure>

              <div className="border-line mt-10 border-t pt-6">
                <p className="mt-5 max-w-2xl leading-7">
                  Dacă doriți să continuați această reflecție într-un cadru
                  profesional, primul mesaj poate fi scurt și fără detalii
                  sensibile.
                </p>
              </div>

              <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <a
                  className={buttonVariants({ variant: "default" })}
                  href="/contact/"
                >
                  Întrebați despre disponibilitate
                </a>
                <Button
                  variant="outline"
                  type="button"
                  onClick={resetReflection}
                  data-reflection-reset
                >
                  Reluați reflecția
                </Button>
              </div>
            </div>
          ) : (
            <div className="border-line border-t pt-8">
              <fieldset>
                <legend
                  className="font-display max-w-3xl text-4xl leading-tight tracking-[-0.035em] outline-none focus-visible:shadow-none md:text-5xl"
                  ref={questionHeadingRef}
                  tabIndex={-1}
                >
                  {currentQuestion.prompt}
                </legend>
                <div className="mt-8 grid gap-4">
                  {[...currentQuestion.answers, uncertainAnswer].map(
                    (answer) => {
                      const isSelected = selectedAnswer === answer.dimension;

                      return (
                        <Choice
                          className="p-5 text-lg"
                          tone="solid"
                          key={answer.label}
                        >
                          <input
                            className="mt-1 size-4 shrink-0 accent-current focus-visible:shadow-none"
                            type="radio"
                            name={`reflection-question-${currentIndex}`}
                            checked={isSelected}
                            onChange={() => selectAnswer(answer.dimension)}
                          />
                          <span>{answer.label}</span>
                        </Choice>
                      );
                    },
                  )}
                </div>
              </fieldset>

              <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  variant="outline"
                  type="button"
                  onClick={goBack}
                  disabled={currentIndex === 0}
                >
                  Înapoi
                </Button>
                <Button
                  type="button"
                  onClick={continueReflection}
                  disabled={!selectedAnswer}
                >
                  {currentIndex === questions.length - 1
                    ? "Vedeți distribuția alegerilor"
                    : "Continuați"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
