import { IconAlertCircle, IconCircleCheck } from "@tabler/icons-react";
import {
  Component,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Disclosure,
  DisclosureContent,
  DisclosureIcon,
  DisclosureTrigger,
} from "@/components/ui/disclosure";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Tag } from "@/components/ui/tag";
import ReflectionAnswerDistribution, {
  type AnswerDistributionDatum,
} from "./ReflectionAnswerDistribution";

type Dimension = "body" | "emotion" | "relationships";
type AnswerValue = Dimension | "uncertain";
type ResultKey = Dimension | "mixed";
type MixedVariant = "distributed" | "unclear";
type ResultContentKey = Dimension | MixedVariant;

interface AnswerOption {
  id: string;
  label: string;
  dimension: AnswerValue;
}

interface ReflectionQuestion {
  id: string;
  prompt: string;
  answers: readonly AnswerOption[];
}

interface DimensionMeta {
  key: Dimension;
  label: string;
  statementLabel: string;
}

interface ReflectionResult {
  title: string;
  introduction: string;
  context: string;
  focusPoints: readonly string[];
}

interface ReflectionSummary {
  counts: Record<Dimension, number>;
  uncertainCount: number;
  resultKey: ResultKey;
  mixedVariant: MixedVariant | null;
  leadingDimensions: readonly Dimension[];
  secondaryDimension: Dimension | null;
}

const dimensions: readonly DimensionMeta[] = [
  {
    key: "body",
    label: "Corp, somn și energie",
    statementLabel: "corpul, somnul și energia",
  },
  {
    key: "emotion",
    label: "Stări emoționale",
    statementLabel: "stările emoționale",
  },
  {
    key: "relationships",
    label: "Relații și tipare care se repetă",
    statementLabel: "relațiile și tiparele care se repetă",
  },
];

const dimensionKeys = dimensions.map(({ key }) => key);
const resultDisclaimer =
  "Rezultatul descrie doar alegerile făcute în această reflecție. Nu este un diagnostic, nu măsoară severitatea, nu indică o cauză și nu înlocuiește o evaluare psihologică sau medicală.";
const medicalReminder =
  "Dacă vă preocupă simptome fizice, evaluarea medicală rămâne importantă.";

const questions: readonly ReflectionQuestion[] = [
  {
    id: "q01",
    prompt:
      "Ce v-a făcut să vă gândiți că ați vrea să începeți o psihoterapie?",
    answers: [
      {
        id: "q01-body",
        label:
          "Mă simt mai obosit(ă), dorm mai prost sau am diferite stări neplăcute în corp.",
        dimension: "body",
      },
      {
        id: "q01-emotion",
        label:
          "Mă simt mai neliniștit(ă), trist(ă), iritabil(ă) sau copleșit(ă) decât de obicei.",
        dimension: "emotion",
      },
      {
        id: "q01-relationships",
        label:
          "O relație sau anumite situații cu ceilalți au devenit greu de dus.",
        dimension: "relationships",
      },
      {
        id: "q01-uncertain",
        label: "Nu știu exact. Simt doar că ceva nu este în regulă.",
        dimension: "uncertain",
      },
    ],
  },
  {
    id: "q02",
    prompt:
      "Când treceți printr-o perioadă dificilă, ce vi se întâmplă cel mai des?",
    answers: [
      {
        id: "q02-body",
        label:
          "Simt tensiune, oboseală, durere, disconfort sau alte senzații neplăcute în corp.",
        dimension: "body",
      },
      {
        id: "q02-emotion",
        label:
          "Mă gândesc foarte mult la ce se întâmplă și îmi este greu să mă opresc.",
        dimension: "emotion",
      },
      {
        id: "q02-relationships",
        label: "Mă retrag sau îmi este greu să vorbesc despre ceea ce simt.",
        dimension: "relationships",
      },
      {
        id: "q02-uncertain",
        label:
          "Încerc să merg mai departe și să nu mă gândesc prea mult la ce se întâmplă.",
        dimension: "uncertain",
      },
    ],
  },
  {
    id: "q03",
    prompt:
      "Când cineva important pentru dumneavoastră pare supărat sau mai distant, ce se întâmplă de obicei?",
    answers: [
      {
        id: "q03-body",
        label: "Încep să mă întreb dacă am făcut ceva greșit.",
        dimension: "body",
      },
      {
        id: "q03-emotion",
        label:
          "Simt că trebuie să fac ceva pentru ca lucrurile să fie din nou bine.",
        dimension: "emotion",
      },
      {
        id: "q03-relationships",
        label: "Mă retrag și eu sau simt nevoia să păstrez distanța.",
        dimension: "relationships",
      },
      {
        id: "q03-uncertain",
        label:
          "Pot să îi las celuilalt puțin spațiu și să vorbim mai târziu despre ce s-a întâmplat.",
        dimension: "uncertain",
      },
    ],
  },
  {
    id: "q04",
    prompt:
      "Cât de ușor vă este să vă dați seama ce simțiți și de ce aveți nevoie?",
    answers: [
      {
        id: "q04-body",
        label: "De obicei îmi este destul de clar.",
        dimension: "body",
      },
      {
        id: "q04-emotion",
        label: "Îmi dau seama ce simt, dar îmi este greu să spun celorlalți.",
        dimension: "emotion",
      },
      {
        id: "q04-relationships",
        label:
          "De multe ori îmi dau seama abia mai târziu, după ce m-am supărat sau m-am simțit copleșit(ă).",
        dimension: "relationships",
      },
      {
        id: "q04-uncertain",
        label: "Adesea nu îmi este clar nici mie ce simt sau ce îmi doresc.",
        dimension: "uncertain",
      },
    ],
  },
  {
    id: "q05",
    prompt:
      "Vi se întâmplă să ajungeți din nou în situații care vă par familiare?",
    answers: [
      {
        id: "q05-body",
        label:
          "Ajung în conflicte asemănătoare, chiar dacă oamenii sau situațiile sunt diferite.",
        dimension: "body",
      },
      {
        id: "q05-emotion",
        label:
          "Ajung deseori să pun nevoile celorlalți înaintea nevoilor mele.",
        dimension: "emotion",
      },
      {
        id: "q05-relationships",
        label:
          "Sunt perioade în care lucrurile merg bine, apoi mă trezesc din nou în același punct.",
        dimension: "relationships",
      },
      {
        id: "q05-uncertain",
        label:
          "Nu știu exact dacă se repetă ceva, dar unele situații îmi dau senzația că le-am mai trăit.",
        dimension: "uncertain",
      },
    ],
  },
  {
    id: "q06",
    prompt:
      "Când ceva nu vă iese așa cum v-ați dorit, cum reacționați față de dumneavoastră?",
    answers: [
      {
        id: "q06-body",
        label:
          "Pot să accept că nu a ieșit cum îmi doream și să merg mai departe.",
        dimension: "body",
      },
      {
        id: "q06-emotion",
        label:
          "Încep să mă critic și să simt că nu am făcut suficient sau că nu sunt suficient de bun(ă).",
        dimension: "emotion",
      },
      {
        id: "q06-relationships",
        label: "Mă preocupă mult ce vor crede ceilalți despre mine.",
        dimension: "relationships",
      },
      {
        id: "q06-uncertain",
        label:
          "Încerc să nu mă gândesc la ce s-a întâmplat și să îmi ocup mintea cu altceva.",
        dimension: "uncertain",
      },
    ],
  },
  {
    id: "q07",
    prompt: "Ce v-ați dori să fie diferit pentru dumneavoastră?",
    answers: [
      {
        id: "q07-body",
        label:
          "Să mă simt mai bine fizic, să dorm mai bine și să am mai multă energie.",
        dimension: "body",
      },
      {
        id: "q07-emotion",
        label:
          "Să mă simt mai liniștit(ă) și mai puțin copleșit(ă) de ceea ce simt.",
        dimension: "emotion",
      },
      {
        id: "q07-relationships",
        label: "Să îmi fie mai ușor în relațiile cu oamenii apropiați.",
        dimension: "relationships",
      },
      {
        id: "q07-uncertain",
        label:
          "Să mă înțeleg mai bine și să îmi fie mai clar ce simt, ce vreau sau de ce am nevoie.",
        dimension: "uncertain",
      },
    ],
  },
  {
    id: "q08",
    prompt: "Ce simțiți că v-ar ajuta cel mai mult în acest moment?",
    answers: [
      {
        id: "q08-body",
        label:
          "Să înțeleg mai bine de ce mă simt sau reacționez în anumite feluri.",
        dimension: "body",
      },
      {
        id: "q08-emotion",
        label:
          "Să găsesc o cale prin care perioada aceasta să fie mai ușor de dus.",
        dimension: "emotion",
      },
      {
        id: "q08-relationships",
        label:
          "Să înțeleg de ce anumite situații sau relații par să se repete.",
        dimension: "relationships",
      },
      {
        id: "q08-uncertain",
        label:
          "Nu știu încă exact. Simt doar că mi-ar prinde bine să vorbesc cu cineva.",
        dimension: "uncertain",
      },
    ],
  },
];

// Keep the descriptive result proportions stable when the question count
// changes. These are routing thresholds for supportive copy, not clinical
// cutoffs or severity scores.
const unclearResponseThreshold = Math.ceil(questions.length * 0.4);
const nearbyDirectionThreshold = Math.ceil(questions.length * 0.3);

const resultContent: Record<ResultContentKey, ReflectionResult> = {
  body: {
    title: "Dificultățile legate de corp au apărut mai des.",
    introduction:
      "Somnul, energia, apetitul sau senzațiile din corp par să fie acum partea cea mai vizibilă a dificultății.",
    context:
      "Semnalele corpului pot avea cauze diferite. Dacă sunt noi, persistă sau vă îngrijorează, evaluarea medicală rămâne importantă. Psihoterapia poate explora în paralel contextul emoțional și relațional în care apar sau se intensifică.",
    focusPoints: [
      "Când au început aceste dificultăți și în ce perioade se agravează?",
      "Ce se întâmplă în viața dumneavoastră înainte să apară sau să se intensifice?",
      "Ce devine greu de spus sau de simțit atunci când corpul atrage primul atenția?",
    ],
  },
  emotion: {
    title: "Stările emoționale au apărut mai des.",
    introduction:
      "Neliniștea, tristețea, iritarea, golul sau schimbările de stare par să fie acum în prim-plan.",
    context:
      "O stare poate fi ușor de recunoscut și totuși greu de înțeles. În psihoterapie, punctul de plecare poate fi felul în care apare, ce o intensifică și ce legătură are cu experiențele și relațiile dumneavoastră.",
    focusPoints: [
      "Ce stare revine și în ce momente devine mai puternică?",
      "Ce pare să o intensifice sau să o facă mai greu de dus?",
      "Ce rămâne greu de înțeles sau de pus în cuvinte când apare?",
    ],
  },
  relationships: {
    title: "Dificultățile din relații au apărut mai des.",
    introduction:
      "Conflictele, distanța, nevoia de confirmare sau dificultatea de a pune limite par să vă preocupe mai mult în această perioadă.",
    context:
      "Nu este vorba de a stabili cine are dreptate, ci de a observa ce se repetă, cum vă apropiați sau vă retrageți și ce ajunge să fie greu de spus în relațiile importante.",
    focusPoints: [
      "Ce situație sau conflict pare să se repete?",
      "Ce faceți de obicei când vă simțiți respins, neînțeles sau prea aproape de cineva?",
      "Ce ați vrea să puteți spune sau face diferit într-o astfel de situație?",
    ],
  },
  distributed: {
    title: "Răspunsurile s-au împărțit între mai multe direcții.",
    introduction:
      "Corpul, stările emoționale și relațiile par să fie prezente în același timp sau să se influențeze reciproc.",
    context:
      "Nu este nevoie să alegeți o singură explicație. Putem începe cu ceea ce vă afectează cel mai mult acum și să înțelegem treptat legăturile dintre celelalte planuri.",
    focusPoints: [
      "Ce se simte mai prezent astăzi: corpul, o stare sau o relație?",
      "Ce legătură observați între aceste planuri?",
      "Ce ar fi cel mai util să se schimbe mai întâi?",
    ],
  },
  unclear: {
    title: "Punctul de plecare nu este încă foarte clar.",
    introduction:
      "Poate că treceți prin ceva greu de numit sau nu v-ați regăsit suficient în variantele propuse.",
    context:
      "Nu trebuie să aveți o explicație pregătită înainte de a începe psihoterapia. Uneori, primul pas este chiar să existe un loc în care lucrurile să poată fi puse în cuvinte, puțin câte puțin.",
    focusPoints: [
      "Ce v-a făcut să deschideți această reflecție astăzi?",
      "Ce parte a vieții dumneavoastră se simte mai greu de dus acum?",
      "Ce ați vrea să poată înțelege un psihoterapeut despre situația dumneavoastră?",
    ],
  },
};

const researchSources = [
  {
    label: "OPD-3: manualul de diagnostic și planificare terapeutică",
    href: "https://www.hogrefe.com/de/shop/opd-3-operationalisierte-psychodynamische-diagnostik-99053.html",
  },
  {
    label: "OPD Online: introducere în axele OPD",
    href: "https://www.opd-online.net/willkommen/opd_eine_einfuehrung",
  },
  {
    label: "Actualizarea OPD-3 și accentul dimensional",
    href: "https://doi.org/10.21706/aep-19-3-140",
  },
  {
    label:
      "OPD-SQS: exemplu de instrument validat pentru funcționarea personalității",
    href: "https://doi.org/10.3389/fpsyg.2023.1248992",
  },
  {
    label:
      "PHQ-9: reper pentru perioada de referință și impactul asupra funcționării",
    href: "https://pubmed.ncbi.nlm.nih.gov/11556941/",
  },
  {
    label: "GAD-7: reper pentru formulări despre îngrijorare și neliniște",
    href: "https://pubmed.ncbi.nlm.nih.gov/16717171/",
  },
  {
    label: "BDI-II: reper general pentru conținut somatic-afectiv și cognitiv",
    href: "https://pubmed.ncbi.nlm.nih.gov/11315728/",
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
  let resultKey: ResultKey;
  let mixedVariant: MixedVariant | null = null;
  let secondaryDimension: Dimension | null = null;

  if (
    uncertainCount >= unclearResponseThreshold ||
    strongestCount < unclearResponseThreshold
  ) {
    resultKey = "mixed";
    mixedVariant = "unclear";
  } else if (leadingDimensions.length > 1) {
    resultKey = "mixed";
    mixedVariant = "distributed";
  } else {
    resultKey = strongest;
    secondaryDimension =
      dimensionKeys.find(
        (dimension) =>
          dimension !== strongest &&
          counts[dimension] === strongestCount - 1 &&
          counts[dimension] >= nearbyDirectionThreshold,
      ) ?? null;
  }

  return {
    counts,
    uncertainCount,
    resultKey,
    mixedVariant,
    leadingDimensions,
    secondaryDimension,
  };
}

function getDimensionMeta(dimension: Dimension) {
  return dimensions.find(({ key }) => key === dimension) ?? dimensions[0]!;
}

function buildContactResultText({
  needsMedicalNote,
  result,
  summary,
  totalQuestions,
}: {
  needsMedicalNote: boolean;
  result: ReflectionResult;
  summary: ReflectionSummary;
  totalQuestions: number;
}) {
  const distribution = dimensions.map(
    (dimension) =>
      `${dimension.label}: ${summary.counts[dimension.key]} din ${totalQuestions}`,
  );

  if (summary.uncertainCount > 0) {
    distribution.push(
      `Altceva sau încă neclar: ${summary.uncertainCount} din ${totalQuestions}`,
    );
  }

  return [
    "Rezultat al reflecției ghidate — DespreSine",
    "",
    result.title,
    result.introduction,
    "",
    "Distribuția răspunsurilor",
    ...distribution,
    "",
    resultDisclaimer,
    ...(needsMedicalNote ? [medicalReminder] : []),
  ].join("\n");
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
      label: "Altceva sau încă neclar",
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
  // V1 keeps individual answers in component state only. There is no Web
  // Storage or analytics event tied to this flow. After explicit opt-in, only
  // the derived result summary can continue to the contact form.
  const [answers, setAnswers] = useState<(AnswerValue | null)[]>(() =>
    Array.from({ length: questions.length }, () => null),
  );
  const [isHydrated, setIsHydrated] = useState(false);
  const [showSelectionError, setShowSelectionError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [includeResultInMessage, setIncludeResultInMessage] = useState(false);
  const reflectionSectionRef = useRef<HTMLElement>(null);
  const questionHeadingRef = useRef<HTMLLegendElement>(null);
  const firstAnswerRef = useRef<HTMLButtonElement>(null);
  const resultSectionRef = useRef<HTMLDivElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const hasNavigatedRef = useRef(false);

  const currentQuestion = questions[currentIndex];
  const currentOptions = currentQuestion ? currentQuestion.answers : [];
  const selectedAnswer = answers[currentIndex] ?? null;

  const summary = useMemo(() => calculateSummary(answers), [answers]);
  const resultContentKey: ResultContentKey | null = summary
    ? summary.resultKey === "mixed"
      ? (summary.mixedVariant ?? "unclear")
      : summary.resultKey
    : null;
  const result = resultContentKey ? resultContent[resultContentKey] : null;
  const secondaryDimensionMeta = summary?.secondaryDimension
    ? getDimensionMeta(summary.secondaryDimension)
    : null;
  const needsMedicalNote = summary?.resultKey === "body";
  const progressPercent = showResult
    ? 100
    : Math.round(((currentIndex + 1) / questions.length) * 100);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasNavigatedRef.current) return;

    const focusTarget = showResult
      ? resultHeadingRef.current
      : questionHeadingRef.current;
    if (!focusTarget) return;

    focusTarget.focus({ preventScroll: true });
    const scrollTarget = showResult
      ? resultSectionRef.current
      : reflectionSectionRef.current;
    scrollTarget?.scrollIntoView({ block: "start" });
  }, [currentIndex, showResult]);

  if (!currentQuestion) {
    return null;
  }

  const selectAnswer = (dimension: AnswerValue) => {
    setShowSelectionError(false);
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

  const goBack = () => {
    hasNavigatedRef.current = true;
    setShowSelectionError(false);

    if (showResult) {
      setIncludeResultInMessage(false);
      setShowResult(false);
      setCurrentIndex(questions.length - 1);
      return;
    }

    setCurrentIndex((index) => Math.max(index - 1, 0));
  };

  const continueReflection = () => {
    if (!selectedAnswer) {
      setShowSelectionError(true);
      firstAnswerRef.current?.focus();
      return;
    }

    hasNavigatedRef.current = true;
    setShowSelectionError(false);

    if (currentIndex === questions.length - 1) {
      setIncludeResultInMessage(false);
      setShowResult(true);
      return;
    }

    setCurrentIndex((index) => Math.min(index + 1, questions.length - 1));
  };

  const resetReflection = () => {
    hasNavigatedRef.current = true;
    setShowSelectionError(false);
    setAnswers(Array.from({ length: questions.length }, () => null));
    setCurrentIndex(0);
    setShowResult(false);
    setIncludeResultInMessage(false);
  };

  const continueToContact = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!includeResultInMessage || !summary || !result) return;

    event.preventDefault();

    const text = buildContactResultText({
      needsMedicalNote,
      result,
      summary,
      totalQuestions: questions.length,
    });
    const destination = new URL(event.currentTarget.href, window.location.href);

    if (destination.origin !== window.location.origin) return;

    // sessionStorage is scoped to this origin and tab. The contact page removes
    // the summary immediately, before validating or displaying it.
    try {
      window.sessionStorage.setItem(
        "despresine.reflectionResult",
        JSON.stringify({ text, version: 1 }),
      );
    } catch {
      // If storage is unavailable, preserve the contact path without attaching
      // sensitive data that cannot be transferred safely.
    }

    window.location.assign(destination.href);
  };

  return (
    <section
      className="reflection-focus-target reflection-shell border-line border-y py-12 md:py-16"
      aria-label="Reflecție ghidată"
      id="reflectie"
      data-guided-reflection
      ref={reflectionSectionRef}
    >
      <h1 className="sr-only">O primă explorare</h1>
      <div className="mx-auto w-full max-w-(--content-width) px-(--page-gutter)">
        <div
          className={
            showResult ? "w-full min-w-0" : "mx-auto w-full max-w-5xl min-w-0"
          }
        >
          {!showResult ? (
            <div
              className="reflection-progress bg-background mb-6 w-full py-2"
              data-reflection-steps
            >
              <div className="mx-auto w-full max-w-2xl">
                <p
                  className="text-muted-foreground mb-3 text-sm font-medium tabular-nums"
                  data-reflection-step-label
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  Întrebarea{" "}
                  <span className="text-foreground">{currentIndex + 1}</span>{" "}
                  din {questions.length}
                </p>
                <Progress
                  value={progressPercent}
                  aria-label="Progresul reflecției"
                  aria-valuetext={`Întrebarea ${currentIndex + 1} din ${questions.length}`}
                />
              </div>
            </div>
          ) : null}

          {showResult && result && summary ? (
            <div
              className="reflection-focus-target ui-panel-enter min-w-0 md:col-span-2"
              data-reflection-result={summary.resultKey}
              data-reflection-variant={summary.mixedVariant ?? undefined}
              ref={resultSectionRef}
            >
              <div className="w-full">
                <Tag
                  className="reflection-complete"
                  data-reflection-complete
                  data-tone="success"
                  role="status"
                  variant="success"
                >
                  <IconCircleCheck
                    aria-hidden="true"
                    data-icon="inline-start"
                  />
                  <span>Reflecție finalizată</span>
                </Tag>

                <Card
                  className="mt-6 gap-0 py-0"
                  data-reflection-result-content
                >
                  <CardHeader className="p-6 md:p-10 lg:p-12">
                    <CardTitle asChild>
                      <h2
                        className="reflection-focus-target max-w-[21ch] text-balance font-display text-4xl leading-[1.03] tracking-[-0.035em] outline-none focus-visible:shadow-none md:text-5xl lg:text-6xl"
                        ref={resultHeadingRef}
                        tabIndex={-1}
                      >
                        {result.title}
                      </h2>
                    </CardTitle>
                    <p className="text-muted-foreground mt-6 max-w-3xl text-lg leading-8 md:text-xl">
                      {result.introduction}
                    </p>
                  </CardHeader>

                  <Separator />

                  <CardContent className="grid p-0 lg:grid-cols-[minmax(0,1.05fr)_auto_minmax(0,0.95fr)]">
                    <div className="min-w-0 p-6 md:p-10 lg:p-12">
                      <ReflectionDistributionBoundary onRecover={goBack}>
                        <AnswerMap
                          summary={summary}
                          totalQuestions={questions.length}
                        />
                      </ReflectionDistributionBoundary>

                      {secondaryDimensionMeta ? (
                        <div
                          className="border-line mt-8 border-t pt-8"
                          data-reflection-secondary
                        >
                          <Tag asChild>
                            <h3>O direcție apropiată</h3>
                          </Tag>
                          <p className="text-muted-foreground mt-4 max-w-2xl leading-7">
                            Și direcția „
                            {secondaryDimensionMeta.label.toLocaleLowerCase(
                              "ro-RO",
                            )}
                            ” a apărut aproape la fel de des. O puteți păstra
                            alături, fără să reduceți ceea ce trăiți la o
                            singură explicație.
                          </p>
                        </div>
                      ) : null}

                      <Separator className="my-8" />

                      <div
                        className="text-muted-foreground max-w-3xl text-sm leading-6 text-pretty"
                        data-reflection-disclaimer
                        role="note"
                      >
                        <p>{resultDisclaimer}</p>
                        {needsMedicalNote ? (
                          <p className="mt-3">{medicalReminder}</p>
                        ) : null}

                        <Disclosure
                          className="mt-3 border-0"
                          data-reflection-sources
                        >
                          <DisclosureTrigger className="min-h-11 py-2 pr-1 text-sm">
                            <span>Surse și limite</span>
                            <DisclosureIcon className="size-4" />
                          </DisclosureTrigger>
                          <DisclosureContent className="pb-0 pt-2">
                            <p className="max-w-2xl leading-7">
                              Sursele de mai jos susțin cadrul conceptual și
                              principiile de redactare. Niciuna nu validează
                              acest set personalizat de 8 întrebări și nu
                              transformă rezultatul într-un instrument
                              diagnostic.
                            </p>
                            <p className="mt-4 max-w-2xl text-sm leading-6">
                              Surse consultate pentru formulare, accesate la 3
                              august 2026:
                            </p>
                            <ul className="mt-3 grid gap-2 p-0 text-sm leading-6">
                              {researchSources.map((source) => (
                                <li className="list-none" key={source.href}>
                                  <a
                                    className={buttonVariants({
                                      variant: "link",
                                      size: "inline",
                                      className:
                                        "min-w-0 max-w-full justify-start text-left leading-6 whitespace-normal!",
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
                      </div>
                    </div>

                    <Separator className="lg:hidden" />
                    <Separator
                      className="hidden lg:block"
                      orientation="vertical"
                    />

                    <div className="bg-muted/50 min-w-0 p-6 md:p-10 lg:p-12">
                      <div data-reflection-prompt>
                        <Tag asChild>
                          <h3>Cum să citiți această reflecție</h3>
                        </Tag>
                        <p className="mt-5 max-w-xl text-pretty text-lg leading-8">
                          {result.context}
                        </p>
                        <h4 className="mt-8 font-medium">
                          Întrebări de dus mai departe
                        </h4>
                        <ul className="mt-4 grid max-w-xl gap-3 pl-5 leading-7">
                          {result.focusPoints.map((point) => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter
                    className="flex-col items-stretch gap-5 p-6 sm:flex-row sm:items-center sm:justify-between md:px-10 lg:px-12"
                    data-reflection-actions
                  >
                    <div className="flex flex-col items-start gap-4">
                      <p className="text-muted-foreground max-w-xl text-sm leading-6">
                        Primul mesaj poate fi scurt și nu trebuie să includă
                        detalii sensibile.
                      </p>
                      <label
                        className="ui-control flex min-h-11 max-w-xl cursor-pointer items-start gap-3 py-1"
                        data-reflection-contact-option
                      >
                        <input
                          className="mt-1 size-4 shrink-0 accent-primary"
                          type="checkbox"
                          checked={includeResultInMessage}
                          onChange={(event) =>
                            setIncludeResultInMessage(event.target.checked)
                          }
                        />
                        <span>
                          <span className="text-foreground block font-medium leading-6">
                            Includeți rezultatul reflecției în mesaj
                          </span>
                          <span className="text-muted-foreground mt-1 block text-sm leading-6">
                            Vor fi incluse doar rezumatul și distribuția, nu
                            răspunsurile individuale.
                          </span>
                        </span>
                      </label>
                      <Button asChild className="w-full sm:w-auto">
                        <a href="/contact/" onClick={continueToContact}>
                          Scrieți un prim mesaj
                        </a>
                      </Button>
                    </div>
                    <Button
                      className="w-full sm:w-auto"
                      variant="link"
                      size="inline"
                      type="button"
                      onClick={resetReflection}
                      data-reflection-reset
                    >
                      Reluați reflecția
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          ) : (
            <Card
              aria-busy={!isHydrated}
              className="reflection-question-enter gap-0 py-0 shadow-sm"
              data-reflection-question
              key={currentQuestion.id}
            >
              <CardContent className="p-6 md:p-10 lg:p-12">
                <div className="mx-auto w-full max-w-3xl">
                  {currentIndex === 0 ? (
                    <p
                      className="text-muted-foreground mb-8 max-w-2xl leading-7"
                      data-reflection-instructions
                    >
                      Gândiți-vă la ultimele câteva săptămâni. La fiecare
                      întrebare, alegeți varianta care seamănă cel mai mult cu
                      ceea ce trăiți. Nu este nevoie să vi se potrivească
                      perfect și nu există răspunsuri corecte. Acest parcurs nu
                      oferă un diagnostic, ci vă poate ajuta să conturați un
                      punct de plecare.
                    </p>
                  ) : null}
                  <noscript className="text-muted-foreground mb-8 block max-w-2xl text-sm leading-6">
                    Pentru a parcurge reflecția ghidată, activați JavaScript.
                    Răspunsurile nu sunt trimise sau salvate, iar rezultatul nu
                    reprezintă un diagnostic.
                  </noscript>

                  <FieldSet>
                    <FieldLegend
                      className="reflection-focus-target text-3xl leading-[1.4] outline-none focus-visible:shadow-none md:text-balance md:text-4xl md:leading-[1.2]"
                      ref={questionHeadingRef}
                      tabIndex={-1}
                      variant="display"
                    >
                      {currentQuestion.prompt}
                    </FieldLegend>

                    <RadioGroup
                      aria-describedby={
                        showSelectionError
                          ? "reflection-answer-error"
                          : undefined
                      }
                      aria-invalid={showSelectionError}
                      className="mt-6 gap-3"
                      disabled={!isHydrated}
                      name={currentQuestion.id}
                      onKeyDown={selectAnswerFromArrowKey}
                      onValueChange={(value) =>
                        selectAnswer(value as AnswerValue)
                      }
                      value={selectedAnswer ?? ""}
                    >
                      {currentOptions.map((answer, answerIndex) => {
                        const optionId = answer.id;

                        return (
                          <FieldLabel
                            className="cursor-pointer hover:border-foreground/25 hover:bg-muted/50 has-data-checked:hover:border-primary has-data-checked:hover:bg-primary"
                            htmlFor={optionId}
                            key={answer.label}
                            selectionTone="inverse"
                          >
                            <Field
                              className="has-[>[data-slot=field-content]]:items-center has-[>[data-slot=field-content]]:[&>[role=radio]]:mt-0"
                              orientation="horizontal"
                            >
                              <RadioGroupItem
                                aria-label={answer.label}
                                id={optionId}
                                ref={
                                  answerIndex === 0 ? firstAnswerRef : undefined
                                }
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

                    {showSelectionError ? (
                      <FieldError id="reflection-answer-error">
                        Selectați un răspuns pentru a continua.
                      </FieldError>
                    ) : null}
                  </FieldSet>

                  <div
                    className={`mt-8 flex w-full items-center gap-3 pt-6 ${
                      currentIndex === 0 ? "justify-end" : "justify-between"
                    }`}
                  >
                    {currentIndex > 0 ? (
                      <Button variant="outline" type="button" onClick={goBack}>
                        Înapoi
                      </Button>
                    ) : null}
                    <Button
                      type="button"
                      onClick={continueReflection}
                      disabled={!isHydrated}
                    >
                      {currentIndex === questions.length - 1
                        ? "Vedeți rezultatul"
                        : "Continuați"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
