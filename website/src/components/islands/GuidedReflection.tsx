import {
  IconAlertCircle,
  IconCircleCheck,
  IconShare3,
} from "@tabler/icons-react";
import {
  Component,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import reflectionAccent from "@/assets/homepage/reflection-accent.jpg";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Disclosure,
  DisclosureContent,
  DisclosureIcon,
  DisclosureTrigger,
} from "@/components/ui/disclosure";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ReflectionAnswerDistribution, {
  type AnswerDistributionDatum,
} from "./ReflectionAnswerDistribution";

type Dimension = "body" | "emotion" | "relationships";
type AnswerValue = Dimension | "uncertain";
type ResultKey = Dimension | "balanced" | "unclear";
type ResultShareStatus =
  "idle" | "working" | "shared" | "copied" | "downloaded" | "error";

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
  statementLabel: string;
}

interface ReflectionResult {
  prompt: string;
  scienceNote: string;
}

interface ReflectionSummary {
  counts: Record<Dimension, number>;
  uncertainCount: number;
  resultKey: ResultKey;
  leadingDimensions: readonly Dimension[];
  nearDimensions: readonly Dimension[];
}

const dimensions: readonly DimensionMeta[] = [
  {
    key: "body",
    label: "Corp și semnale fizice",
    statementLabel: "semnalele corpului",
  },
  {
    key: "emotion",
    label: "Stări emoționale",
    statementLabel: "stările emoționale",
  },
  {
    key: "relationships",
    label: "Relații și tipare repetitive",
    statementLabel: "tiparele relaționale",
  },
];

const dimensionKeys = dimensions.map(({ key }) => key);
const canonicalReflectionUrl = "https://despresine.ro/reflectie-ghidata/";
const resultDisclaimer =
  "Distribuția arată doar frecvența alegerilor. Nu este un diagnostic, nu măsoară severitatea și nu înlocuiește o evaluare psihologică profesională.";
const medicalReminder =
  "Dacă vă preocupă simptome fizice, evaluarea medicală rămâne importantă.";

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
    prompt: "În ce momente apar sau se intensifică aceste semnale?",
    scienceNote:
      "Sursele consultate descriu relații între sănătatea fizică și cea mintală, fără a explica un simptom individual.",
  },
  emotion: {
    prompt: "În ce contexte revine această stare și ce îi schimbă ritmul?",
    scienceNote:
      "Cercetarea clinică discută reglarea emoțiilor în dificultăți diferite, fără ca aceasta să ofere o etichetă sau o concluzie diagnostică.",
  },
  relationships: {
    prompt: "Ce scenă relațională pare să se repete?",
    scienceNote:
      "Modelele psihodinamice acordă atenție felului în care emoțiile, modurile de protecție și tiparele relaționale se pot repeta. Aceasta este o direcție de explorare, nu o concluzie.",
  },
  balanced: {
    prompt: "Care dintre aceste direcții se simte mai prezentă astăzi?",
    scienceNote:
      "Sursele consultate descriu sănătatea mintală în legătură cu sănătatea fizică, relațiile și contextul. Această perspectivă susține o privire de ansamblu, nu validează reflecția ca instrument clinic.",
  },
  unclear: {
    prompt: "Ce observație mică ați vrea să păstrați din acest parcurs?",
    scienceNote:
      "Uneori o direcție nu este clară de la început. Reflecția păstrează această incertitudine fără să o transforme într-o concluzie.",
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
  const strongestCount = counts[strongest];
  const leadingDimensions =
    strongestCount > 0
      ? dimensionKeys.filter(
          (dimension) => counts[dimension] === strongestCount,
        )
      : [];
  const resultKey: ResultKey =
    uncertainCount >= strongestCount
      ? "unclear"
      : leadingDimensions.length > 1
        ? "balanced"
        : strongest;
  const nearDimensions =
    resultKey === strongest
      ? dimensionKeys.filter(
          (dimension) =>
            dimension !== strongest &&
            counts[dimension] > 0 &&
            counts[dimension] === strongestCount - 1,
        )
      : [];

  return {
    counts,
    uncertainCount,
    resultKey,
    leadingDimensions,
    nearDimensions,
  };
}

function getDimensionMeta(dimension: Dimension) {
  return dimensions.find(({ key }) => key === dimension) ?? dimensions[0]!;
}

function formatList(items: readonly string[]) {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} și ${items[1]}`;

  return `${items.slice(0, -1).join(", ")} și ${items.at(-1)}`;
}

function capitalizeFirst(value: string) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

function getResultStatement(summary: ReflectionSummary) {
  if (summary.resultKey === "unclear") {
    return "Răspunsurile nu conturează încă o direcție clară.";
  }

  const leadingLabels = summary.leadingDimensions.map(
    (dimension) => getDimensionMeta(dimension).statementLabel,
  );

  if (summary.resultKey === "balanced") {
    return `${capitalizeFirst(formatList(leadingLabels))} au apărut la fel de des.`;
  }

  const primaryLabel = getDimensionMeta(summary.resultKey).statementLabel;
  const nearLabels = summary.nearDimensions.map(
    (dimension) => getDimensionMeta(dimension).statementLabel,
  );

  if (nearLabels.length > 0) {
    return `${capitalizeFirst(primaryLabel)} au apărut cel mai des, iar ${formatList(nearLabels)} aproape la fel de des.`;
  }

  return `${capitalizeFirst(primaryLabel)} au apărut cel mai des.`;
}

function buildResultShareText({
  needsMedicalNote,
  prompt,
  statement,
  summary,
  totalQuestions,
}: {
  needsMedicalNote: boolean;
  prompt: string;
  statement: string;
  summary: ReflectionSummary;
  totalQuestions: number;
}) {
  const distribution = dimensions.map(
    (dimension) =>
      `${dimension.label}: ${summary.counts[dimension.key]} din ${totalQuestions}`,
  );

  if (summary.uncertainCount > 0) {
    distribution.push(
      `Fără o potrivire clară: ${summary.uncertainCount} din ${totalQuestions}`,
    );
  }

  return [
    "Reflecție ghidată — DespreSine",
    "",
    statement,
    "",
    "Distribuția alegerilor",
    ...distribution,
    "",
    "O întrebare de păstrat",
    prompt,
    "",
    resultDisclaimer,
    ...(needsMedicalNote ? [medicalReminder] : []),
  ].join("\n");
}

function downloadResultText(text: string) {
  const file = new Blob([text], { type: "text/plain;charset=utf-8" });
  const fileUrl = URL.createObjectURL(file);
  const link = document.createElement("a");

  link.download = "reflectie-ghidata-despresine.txt";
  link.href = fileUrl;
  link.hidden = true;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(fileUrl), 0);
}

function isShareCancellation(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "AbortError"
  );
}

function getShareStatusMessage(status: ResultShareStatus) {
  switch (status) {
    case "working":
      return "Se pregătește rezultatul…";
    case "shared":
      return "Rezultatul a fost trimis către opțiunea aleasă.";
    case "copied":
      return "Rezultatul a fost copiat. Îl puteți lipi într-o notiță sau într-un mesaj.";
    case "downloaded":
      return "Rezultatul a fost salvat ca fișier text.";
    case "error":
      return "Rezultatul nu a putut fi pregătit. Încercați din nou.";
    default:
      return "";
  }
}

class ReflectionDistributionBoundary extends Component<
  { children: ReactNode; onRecover: () => void },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert className="mt-8" role="status">
          <IconAlertCircle />
          <AlertTitle>Distribuția nu a putut fi afișată.</AlertTitle>
          <AlertDescription className="flex flex-col items-start gap-4">
            <span>
              Interpretarea de mai sus rămâne disponibilă, iar răspunsurile nu
              au fost trimise sau stocate. Puteți reveni la ultima întrebare și
              încerca din nou.
            </span>
            <Button
              variant="outline"
              type="button"
              onClick={this.props.onRecover}
            >
              Reveniți la ultima întrebare
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

function AnswerMap({
  summary,
  totalQuestions,
}: {
  summary: ReflectionSummary;
  totalQuestions: number;
}) {
  const distribution: AnswerDistributionDatum[] = dimensions.map(
    (dimension) => ({
      count: summary.counts[dimension.key],
      dimension: dimension.key,
      displayCount: `${summary.counts[dimension.key]} din ${totalQuestions}`,
      label: dimension.label,
    }),
  );

  if (summary.uncertainCount > 0) {
    distribution.push({
      count: summary.uncertainCount,
      dimension: "uncertain",
      displayCount: `${summary.uncertainCount} din ${totalQuestions}`,
      label: "Fără o potrivire clară",
    });
  }

  return (
    <ReflectionAnswerDistribution
      distribution={distribution}
      totalQuestions={totalQuestions}
    />
  );
}

export default function GuidedReflection() {
  // V1 keeps answers in component state only. There is no localStorage, server
  // request, analytics event, or email capture tied to this flow.
  const [answers, setAnswers] = useState<(AnswerValue | null)[]>(() =>
    Array.from({ length: questions.length }, () => null),
  );
  const [isHydrated, setIsHydrated] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [shareStatus, setShareStatus] = useState<ResultShareStatus>("idle");
  const reflectionSectionRef = useRef<HTMLElement>(null);
  const questionHeadingRef = useRef<HTMLLegendElement>(null);
  const resultSectionRef = useRef<HTMLDivElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const hasNavigatedRef = useRef(false);

  const currentQuestion = questions[currentIndex];
  const currentOptions = currentQuestion
    ? [...currentQuestion.answers, uncertainAnswer]
    : [];
  const selectedAnswer = answers[currentIndex] ?? null;

  const summary = useMemo(() => calculateSummary(answers), [answers]);
  const result = summary ? resultContent[summary.resultKey] : null;
  const resultStatement = summary ? getResultStatement(summary) : "";
  const needsMedicalNote = Boolean(
    summary &&
    summary.counts.body > 0 &&
    summary.leadingDimensions.includes("body"),
  );
  const shareStatusMessage = getShareStatusMessage(shareStatus);
  const progressPercent = showResult
    ? 100
    : Math.round((currentIndex / questions.length) * 100);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasNavigatedRef.current || !hasStarted) return;

    const focusTarget = showResult
      ? resultHeadingRef.current
      : questionHeadingRef.current;
    if (!focusTarget) return;

    focusTarget.focus({ preventScroll: true });
    const scrollTarget = showResult
      ? resultSectionRef.current
      : reflectionSectionRef.current;
    scrollTarget?.scrollIntoView({ block: "start" });
  }, [currentIndex, hasStarted, showResult]);

  if (!currentQuestion) {
    return null;
  }

  const selectAnswer = (dimension: AnswerValue) => {
    setShareStatus("idle");
    setAnswers((currentAnswers) =>
      currentAnswers.map((answer, index) =>
        index === currentIndex ? dimension : answer,
      ),
    );
  };

  const selectAnswerFromArrowKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (
      !["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(event.key)
    ) {
      return;
    }

    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) return;

    const optionIndex = currentOptions.findIndex(
      (option) => option.dimension === target.value,
    );
    if (optionIndex < 0) return;

    const direction = ["ArrowDown", "ArrowRight"].includes(event.key) ? 1 : -1;
    const nextIndex =
      (optionIndex + direction + currentOptions.length) % currentOptions.length;
    const nextOption = currentOptions[nextIndex];

    if (nextOption) selectAnswer(nextOption.dimension);
  };

  const startReflection = () => {
    hasNavigatedRef.current = true;
    setHasStarted(true);
  };

  const goBack = () => {
    hasNavigatedRef.current = true;

    if (showResult) {
      setShareStatus("idle");
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
      setShareStatus("idle");
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
    setShareStatus("idle");
  };

  const saveOrShareResult = async () => {
    if (!summary || !result || shareStatus === "working") return;

    const shareText = buildResultShareText({
      needsMedicalNote,
      prompt: result.prompt,
      statement: resultStatement,
      summary,
      totalQuestions: questions.length,
    });
    const localText = `${shareText}\n\n${canonicalReflectionUrl}`;

    setShareStatus("working");

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: "Reflecție ghidată — DespreSine",
          text: shareText,
          url: canonicalReflectionUrl,
        });
        setShareStatus("shared");
        return;
      } catch (error) {
        if (isShareCancellation(error)) {
          setShareStatus("idle");
          return;
        }
      }
    }

    try {
      if (typeof navigator.clipboard?.writeText === "function") {
        await navigator.clipboard.writeText(localText);
        setShareStatus("copied");
        return;
      }
    } catch {
      // A local file remains available when clipboard permission is denied.
    }

    try {
      downloadResultText(localText);
      setShareStatus("downloaded");
    } catch {
      setShareStatus("error");
    }
  };

  if (!hasStarted) {
    return (
      <section
        className="border-line border-b py-12 md:py-16 lg:py-20"
        aria-labelledby="reflection-intro-title"
        id="reflectie"
        data-guided-reflection
        data-reflection-preflight
      >
        <div className="mx-auto grid w-full max-w-(--content-width) items-center gap-10 px-(--page-gutter) lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)] lg:gap-16">
          <div className="flex min-w-0 flex-col items-start">
            <h1 className="display-page" id="reflection-intro-title">
              <span className="block">Despre sine:</span>
              <span className="block">O primă explorare</span>
            </h1>
            <p className="text-muted-foreground mt-7 max-w-2xl text-lg leading-8 md:text-xl">
              Uneori simțim că avem nevoie de o schimbare înainte să înțelegem
              exact ce ne apasă. Câteva întrebări pot ajuta la conturarea unui
              început.
            </p>

            <div className="mt-8 flex flex-col items-start gap-4">
              <Button
                className="disabled:opacity-70"
                size="lg"
                type="button"
                onClick={startReflection}
                disabled={!isHydrated}
                data-reflection-start
              >
                Începeți reflecția
              </Button>

              <p className="text-muted-foreground max-w-xl text-sm leading-6">
                Rezultatele sunt orientative, iar răspunsurile nu sunt trimise
                sau stocate.
              </p>
            </div>
          </div>

          <figure
            className="border-line aspect-[16/10] overflow-hidden rounded-lg border lg:aspect-[4/5] lg:min-h-80"
            data-reflection-intro-visual
          >
            <img
              className="size-full object-cover"
              src={reflectionAccent.src}
              width={reflectionAccent.width}
              height={reflectionAccent.height}
              alt=""
              decoding="async"
            />
          </figure>
        </div>
      </section>
    );
  }

  return (
    <section
      className="reflection-focus-target reflection-shell border-line border-y py-12 md:py-16"
      aria-label="Reflecție ghidată"
      id="reflectie"
      data-guided-reflection
      ref={reflectionSectionRef}
    >
      <div className="mx-auto w-full max-w-(--content-width) px-(--page-gutter)">
        <div className="grid min-w-0 gap-12 md:grid-cols-[0.72fr_1.28fr]">
          {!showResult ? (
            <div className="min-w-0 md:self-start">
              <div
                className="reflection-progress border-line border-t pt-5"
                aria-live="polite"
              >
                <Badge variant="default">
                  Întrebarea {currentIndex + 1} din {questions.length}
                </Badge>
                <Progress
                  className="mt-3"
                  value={progressPercent}
                  aria-label="Progresul reflecției"
                  aria-valuetext={`${currentIndex} din ${questions.length} întrebări finalizate`}
                />
              </div>
            </div>
          ) : null}

          {showResult && result && summary ? (
            <div
              className="reflection-focus-target min-w-0 md:col-span-2"
              data-reflection-result={summary.resultKey}
              ref={resultSectionRef}
            >
              <div className="mx-auto max-w-4xl">
                <div
                  className="reflection-complete relative inline-flex items-center gap-2 text-sm font-medium"
                  data-reflection-complete
                  role="status"
                >
                  <IconCircleCheck aria-hidden="true" className="size-5" />
                  <span>Reflecție finalizată</span>
                  <span
                    aria-hidden="true"
                    className="reflection-complete__spark"
                  />
                </div>

                <div
                  className="border-line mt-6 border-t pt-7"
                  data-reflection-result-content
                >
                  <h2
                    className="reflection-focus-target font-display max-w-[27ch] text-4xl leading-tight tracking-[-0.035em] outline-none focus-visible:shadow-none md:text-5xl"
                    ref={resultHeadingRef}
                    tabIndex={-1}
                  >
                    {resultStatement}
                  </h2>

                  <div className="mt-8">
                    <ReflectionDistributionBoundary onRecover={goBack}>
                      <AnswerMap
                        summary={summary}
                        totalQuestions={questions.length}
                      />
                    </ReflectionDistributionBoundary>
                  </div>

                  <div
                    className="border-line text-muted-foreground mt-6 max-w-3xl border-t pt-5 text-sm leading-6"
                    data-reflection-disclaimer
                    role="note"
                  >
                    <p>{resultDisclaimer}</p>
                    {needsMedicalNote ? (
                      <p className="mt-3">{medicalReminder}</p>
                    ) : null}
                  </div>

                  <div className="mt-8 max-w-3xl" data-reflection-prompt>
                    <h3 className="text-sm font-medium">
                      O întrebare de păstrat
                    </h3>
                    <p className="font-display mt-3 text-2xl leading-snug tracking-[-0.02em] md:text-3xl">
                      {result.prompt}
                    </p>
                  </div>

                  <div className="mt-6 max-w-3xl" data-reflection-share>
                    <Button
                      className="disabled:opacity-60"
                      variant="outline"
                      type="button"
                      onClick={saveOrShareResult}
                      disabled={shareStatus === "working"}
                      aria-busy={shareStatus === "working"}
                    >
                      <IconShare3 aria-hidden="true" data-icon="inline-start" />
                      Păstrați rezultatul
                    </Button>
                    {shareStatusMessage ? (
                      <p
                        className="text-muted-foreground mt-3 max-w-2xl text-sm leading-6"
                        data-reflection-share-status={shareStatus}
                        role="status"
                      >
                        {shareStatusMessage}
                      </p>
                    ) : null}
                  </div>

                  <Disclosure className="mt-8 max-w-3xl">
                    <DisclosureTrigger>
                      <span>Despre această reflecție și surse</span>
                      <DisclosureIcon />
                    </DisclosureTrigger>
                    <DisclosureContent>
                      <p className="max-w-2xl leading-7">
                        {result.scienceNote}
                      </p>
                      <p className="text-muted-foreground mt-4 max-w-2xl text-sm leading-6">
                        Surse consultate pentru formulare, accesate la 8 iulie
                        2026:
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

                  <div
                    className="border-line mt-8 flex flex-col items-start gap-2 border-t pt-6 sm:flex-row sm:items-center sm:gap-5"
                    data-reflection-actions
                  >
                    <a
                      className={buttonVariants({ variant: "default" })}
                      href="/contact/"
                    >
                      Întrebați despre disponibilitate
                    </a>
                    <Button
                      variant="link"
                      size="inline"
                      type="button"
                      onClick={resetReflection}
                      data-reflection-reset
                    >
                      Reluați reflecția
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="border-line min-w-0 border-t pt-8"
              data-reflection-question
            >
              <FieldSet>
                <FieldLegend
                  className="reflection-focus-target max-w-3xl outline-none focus-visible:shadow-none"
                  ref={questionHeadingRef}
                  tabIndex={-1}
                  variant="display"
                >
                  {currentQuestion.prompt}
                </FieldLegend>

                <RadioGroup
                  className="mt-6 gap-3"
                  name={`reflection-question-${currentIndex}`}
                  onKeyDown={selectAnswerFromArrowKey}
                  onValueChange={(value) => selectAnswer(value as AnswerValue)}
                  value={selectedAnswer ?? ""}
                >
                  {currentOptions.map((answer) => {
                    const optionId = `reflection-question-${currentIndex}-${answer.dimension}`;

                    return (
                      <FieldLabel
                        className="cursor-pointer"
                        htmlFor={optionId}
                        key={answer.label}
                        selectionTone="inverse"
                      >
                        <Field orientation="horizontal">
                          <RadioGroupItem
                            aria-label={answer.label}
                            id={optionId}
                            value={answer.dimension}
                          />
                          <FieldContent>
                            <FieldTitle className="text-base leading-7 font-normal">
                              {answer.label}
                            </FieldTitle>
                          </FieldContent>
                        </Field>
                      </FieldLabel>
                    );
                  })}
                </RadioGroup>
              </FieldSet>

              <div className="mt-8 flex w-full items-center justify-between gap-3">
                <Button
                  className="disabled:opacity-60"
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
                    ? "Vedeți rezultatul"
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
