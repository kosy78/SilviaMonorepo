import { useEffect, useMemo, useRef, useState } from "react";

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
  chartLabel: string;
  description: string;
}

interface ReflectionResult {
  title: string;
  lead: string;
  paragraphs: readonly string[];
  focusPoints: readonly string[];
  scienceNote: string;
  contactPrompt: string;
}

interface ReflectionScores {
  counts: Record<Dimension, number>;
  uncertainCount: number;
  resultKey: ResultKey;
  secondaryDimension: Dimension | null;
}

const dimensions: readonly DimensionMeta[] = [
  {
    key: "body",
    label: "Corp și semnale fizice",
    chartLabel: "Corp",
    description:
      "Răspunsuri care indică tensiune, somn, energie, senzații sau alte semnale corporale.",
  },
  {
    key: "emotion",
    label: "Stări emoționale",
    chartLabel: "Stări",
    description:
      "Răspunsuri care indică neliniște, tristețe, iritare, gol sau emoții greu de formulat.",
  },
  {
    key: "relationships",
    label: "Relații și tipare repetitive",
    chartLabel: "Relații",
    description:
      "Răspunsuri care indică apropiere, retragere, limite, încredere sau situații relaționale care revin.",
  },
];

const dimensionKeys = dimensions.map(({ key }) => key);

const uncertainAnswer: AnswerOption = {
  label: "Nu sunt sigur(ă) sau niciuna nu se potrivește suficient",
  dimension: "uncertain",
};

const questions: readonly ReflectionQuestion[] = [
  {
    prompt:
      "Când vă gândiți la ce vă preocupă, unde pare să se simtă prima dată?",
    answers: [
      {
        label:
          "În corp, prin tensiune, oboseală, somn schimbat sau alte semnale",
        dimension: "body",
      },
      {
        label: "În stări emoționale greu de ținut sau de numit",
        dimension: "emotion",
      },
      {
        label: "În relații, prin distanțe, conflicte sau tipare care revin",
        dimension: "relationships",
      },
    ],
  },
  {
    prompt: "Ce pare să revină mai des în ultima perioadă?",
    answers: [
      {
        label: "Un corp care cere pauză, atenție sau verificare",
        dimension: "body",
      },
      {
        label: "Neliniște, tristețe, iritare sau o stare de gol",
        dimension: "emotion",
      },
      {
        label: "Aceleași dificultăți cu apropierea, limitele sau încrederea",
        dimension: "relationships",
      },
    ],
  },
  {
    prompt:
      "Dacă ar fi să începeți cu o singură întrebare, care ar fi mai aproape?",
    answers: [
      {
        label: "Ce încearcă să spună corpul meu în acest moment?",
        dimension: "body",
      },
      {
        label: "Ce se întâmplă cu stările mele și de ce acum?",
        dimension: "emotion",
      },
      {
        label: "Ce se repetă în felul în care mă apropii sau mă retrag?",
        dimension: "relationships",
      },
    ],
  },
  {
    prompt: "Ce este cel mai greu de pus în cuvinte?",
    answers: [
      {
        label: "Senzațiile, ritmul corpului sau o neliniște simțită fizic",
        dimension: "body",
      },
      {
        label:
          "Intensitatea unei emoții sau trecerea rapidă de la o stare la alta",
        dimension: "emotion",
      },
      {
        label: "Felul în care o relație ajunge iar în același punct",
        dimension: "relationships",
      },
    ],
  },
  {
    prompt: "Unde ați dori să apară mai întâi puțină claritate?",
    answers: [
      {
        label: "În legătură cu semnalele corpului și cu momentele în care apar",
        dimension: "body",
      },
      {
        label: "În legătură cu ce se află în spatele unei stări persistente",
        dimension: "emotion",
      },
      {
        label: "În legătură cu un tipar relațional care pare cunoscut",
        dimension: "relationships",
      },
    ],
  },
  {
    prompt: "Când încercați să mergeți mai departe, ce pare să vă oprească?",
    answers: [
      {
        label: "O limită resimțită în corp, în energie sau în somn",
        dimension: "body",
      },
      {
        label: "O stare care devine greu de dus singur(ă)",
        dimension: "emotion",
      },
      {
        label: "Felul în care reacționați sau sunteți prins(ă) într-o relație",
        dimension: "relationships",
      },
    ],
  },
  {
    prompt: "Ce formulare pare cea mai apropiată de prezent?",
    answers: [
      {
        label: "Ceva se exprimă prin corp înainte să poată fi înțeles",
        dimension: "body",
      },
      {
        label: "Ceva din interior cere atenție prin stări care revin",
        dimension: "emotion",
      },
      {
        label: "Ceva devine vizibil în felul în care se repetă relațiile",
        dimension: "relationships",
      },
    ],
  },
];

const resultContent: Record<ResultKey, ReflectionResult> = {
  body: {
    title:
      "Răspunsurile selectate s-au concentrat mai ales asupra semnalelor corporale.",
    lead: "Somnul, tensiunea, energia sau alte senzații au apărut mai des în alegerile dumneavoastră.",
    paragraphs: [
      "Somnul, tensiunea, oboseala, ritmul respirației sau alte senzații pot deveni uneori felul în care o dificultate se face simțită înainte să poată fi spusă clar în cuvinte.",
      "Aceasta nu înseamnă că explicația este psihologică. Dacă există simptome fizice, evaluarea medicală rămâne importantă. În psihoterapie poate fi explorat și contextul emoțional în care aceste semnale apar, se repetă sau devin mai greu de dus.",
    ],
    focusPoints: [
      "Când apar mai des semnalele corpului?",
      "Ce se întâmplă în jurul lor: emoțional, relațional sau practic?",
      "Ce devine greu de formulat atunci când corpul vorbește primul?",
    ],
    scienceNote:
      "Literatura clinică descrie o legătură bidirecțională între sănătatea mintală și cea fizică și discută felul în care stresul sau distresul pot avea expresii corporale. Această observație nu înlocuiește o evaluare medicală.",
    contactPrompt:
      "Dacă doriți, puteți scrie un mesaj scurt pentru a clarifica posibilitatea unei prime întâlniri.",
  },
  emotion: {
    title:
      "Răspunsurile selectate s-au concentrat mai ales asupra stărilor emoționale.",
    lead: "Neliniștea, tristețea, iritarea sau alte stări interioare au apărut mai des în alegerile dumneavoastră.",
    paragraphs: [
      "Neliniștea, tristețea, iritarea, golul sau trecerile rapide între stări pot indica o nevoie de a înțelege ce a devenit greu de dus și de numit.",
      "Cercetarea clinică discută reglarea emoțiilor ca proces relevant în multe forme de suferință psihică, fără ca acest lucru să transforme rezultatul de aici într-o măsurare clinică.",
    ],
    focusPoints: [
      "Care stare revine cel mai des?",
      "Ce pare să o declanșeze, să o intensifice sau să o calmeze?",
      "Ce ar avea nevoie de un spațiu în care să fie spus mai atent?",
    ],
    scienceNote:
      "Reglarea emoțiilor este discutată în cercetarea clinică drept proces transdiagnostic, adică un proces care poate fi relevant în mai multe tipuri de dificultăți, nu o etichetă diagnostică în sine.",
    contactPrompt:
      "Dacă această direcție vi se pare importantă, contactul poate rămâne simplu și fără detalii sensibile în primul mesaj.",
  },
  relationships: {
    title:
      "Răspunsurile selectate s-au concentrat mai ales asupra relațiilor și tiparelor care se repetă.",
    lead: "Apropierea, limitele, încrederea sau situațiile relaționale recurente au apărut mai des în alegerile dumneavoastră.",
    paragraphs: [
      "Apropierea, retragerea, conflictele, limitele sau încrederea pot face vizibil ceva ce revine în moduri diferite, dar cu o familiaritate greu de ignorat.",
      "Aceasta nu reduce o relație sau o persoană la o explicație simplă. Poate fi doar un punct de pornire pentru a observa ce se repetă și ce devine greu de schimbat fără a fi înțeles.",
    ],
    focusPoints: [
      "Ce scenă relațională pare să se repete?",
      "Ce rol ajungeți să ocupați, chiar dacă nu îl doriți?",
      "Ce ar fi important să fie înțeles înainte de a încerca o schimbare?",
    ],
    scienceNote:
      "Modelele psihodinamice acordă atenție felului în care emoțiile, apărarea psihică și tiparele relaționale se pot repeta în prezent. Aceasta este o direcție de explorare, nu o concluzie despre o persoană sau o relație.",
    contactPrompt:
      "Dacă doriți să discutați această întrebare într-un cadru profesional, puteți începe cu un email scurt.",
  },
  mixed: {
    title: "Răspunsurile selectate s-au distribuit între mai multe planuri.",
    lead: "Alegerile dumneavoastră nu s-au concentrat într-o singură direcție sau au inclus răspunsuri nesigure.",
    paragraphs: [
      "Corpul, stările emoționale și relațiile pot fi legate între ele. Uneori, ceea ce cere atenție nu se lasă separat clar de la început.",
      "Poate fi util să porniți de la locul în care lucrurile se simt cel mai prezente acum, fără să forțați o concluzie. O reflecție mai atentă poate arăta treptat cum se leagă aceste planuri.",
    ],
    focusPoints: [
      "Care dintre planuri se simte cel mai prezent astăzi?",
      "Ce legătură observați între corp, stare și relații?",
      "Ce întrebare rămâne deschisă după acest parcurs?",
    ],
    scienceNote:
      "Cercetarea și practica clinică descriu sănătatea mintală ca fiind legată de corp, emoții, relații și context. Un rezultat mixt poate fi o invitație de a privi legăturile dintre aceste planuri, nu de a alege o singură cauză.",
    contactPrompt:
      "Dacă vă este util, puteți scrie pentru a clarifica dacă o primă întâlnire ar fi potrivită.",
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
    label:
      "PubMed: reglarea emoțiilor este discutată ca proces transdiagnostic",
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

function calculateScores(
  answers: readonly (AnswerValue | null)[],
): ReflectionScores | null {
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

function AnswerMap({
  scores,
  totalQuestions,
}: {
  scores: ReflectionScores;
  totalQuestions: number;
}) {
  return (
    <figure className="border-line bg-soft mt-8 border p-5 md:p-6">
      <figcaption>
        <p className="text-muted text-sm">Distribuția alegerilor</p>
        <p className="mt-2 max-w-2xl leading-7">
          Aceasta este o numărare a opțiunilor selectate, nu un scor despre
          dumneavoastră sau despre severitatea unei dificultăți.
        </p>
      </figcaption>

      <dl className="mt-6 grid gap-5">
        {dimensions.map((dimension) => {
          const count = scores.counts[dimension.key];
          const percent = Math.round((count / totalQuestions) * 100);

          return (
            <div className="border-line border-t pt-4" key={dimension.key}>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="font-medium">{dimension.label}</dt>
                <dd className="text-muted text-sm">
                  {count} {count === 1 ? "alegere" : "alegeri"}
                </dd>
              </div>
              <div className="bg-paper mt-3 h-1.5" aria-hidden="true">
                <div
                  className="bg-ink h-full"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="text-muted mt-2 text-sm leading-6">
                {dimension.description}
              </p>
            </div>
          );
        })}
        {scores.uncertainCount > 0 ? (
          <div className="border-line border-t pt-4">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="font-medium">Răspunsuri nesigure</dt>
              <dd className="text-muted text-sm">
                {scores.uncertainCount}{" "}
                {scores.uncertainCount === 1 ? "alegere" : "alegeri"}
              </dd>
            </div>
            <p className="text-muted mt-2 text-sm leading-6">
              Momente în care nicio variantă nu s-a potrivit suficient.
            </p>
          </div>
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

  const scores = useMemo(() => calculateScores(answers), [answers]);
  const result = scores ? resultContent[scores.resultKey] : null;
  const secondaryDimension = scores?.secondaryDimension
    ? getDimensionMeta(scores.secondaryDimension)
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
              <p className="text-muted text-sm">
                {showResult
                  ? "Rezultat orientativ"
                  : `Întrebarea ${currentIndex + 1} din ${questions.length}`}
              </p>
              <div
                className="bg-soft mt-3 h-2 overflow-hidden"
                role="progressbar"
                aria-label="Progresul reflecției"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progressPercent}
              >
                <div
                  className="bg-ink h-full transition-[width] duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-muted mt-3 text-sm">
                {answeredCount === 1
                  ? "1 răspuns selectat"
                  : `${answeredCount} răspunsuri selectate`}
              </p>
            </div>
          </div>

          {showResult && result && scores ? (
            <div
              className="border-line border-t pt-8"
              data-reflection-result={scores.resultKey}
            >
              <p className="text-muted text-sm">
                O posibilă direcție de privit
              </p>
              <h2
                className="font-display mt-4 max-w-3xl text-4xl leading-tight tracking-[-0.035em] md:text-5xl"
                ref={resultHeadingRef}
                tabIndex={-1}
              >
                {result.title}
              </h2>
              <p className="mt-6 max-w-2xl text-xl leading-8">{result.lead}</p>

              <p className="border-line text-muted mt-6 max-w-2xl border-y py-4 leading-7">
                Această reflecție nu este un diagnostic, nu măsoară severitatea
                unei dificultăți și nu înlocuiește o evaluare psihologică
                profesională.
              </p>

              <AnswerMap scores={scores} totalQuestions={questions.length} />

              {secondaryDimension ? (
                <div className="border-line mt-8 border-y py-5">
                  <p className="text-muted text-sm">Nuanță posibilă</p>
                  <p className="mt-2 max-w-2xl leading-7">
                    Și planul „{secondaryDimension.label.toLowerCase()}” apare
                    aproape de direcția principală. Poate fi util să îl păstrați
                    în vedere, fără a încerca să reduceți totul la o singură
                    explicație.
                  </p>
                </div>
              ) : null}

              <div className="mt-8 max-w-2xl text-lg leading-8">
                {result.paragraphs.map((paragraph) => (
                  <p className="mt-5 first:mt-0" key={paragraph}>
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="border-line mt-10 border-t pt-6">
                <p className="text-muted text-sm">
                  Întrebări de dus mai departe
                </p>
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

              <details className="border-line mt-10 border-y">
                <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-6 py-4 font-medium">
                  <span>Despre formularea rezultatului</span>
                  <span aria-hidden="true">+</span>
                </summary>
                <div className="pb-6">
                  <p className="max-w-2xl leading-7">{result.scienceNote}</p>
                  <p className="text-muted mt-4 max-w-2xl text-sm leading-6">
                    Surse consultate pentru formulare, accesate la 8 iulie 2026:
                  </p>
                  <ul className="mt-3 grid gap-2 p-0 text-sm leading-6">
                    {researchSources.map((source) => (
                      <li className="list-none" key={source.href}>
                        <a
                          className="inline-flex min-h-11 items-center underline decoration-[0.06em] underline-offset-4 transition-opacity hover:opacity-70"
                          href={source.href}
                          rel="noreferrer"
                          target="_blank"
                        >
                          {source.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>

              <div className="border-line mt-10 border-t pt-6">
                <p className="mt-5 max-w-2xl leading-7">
                  {result.contactPrompt}
                </p>
              </div>

              <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <a
                  className="border-ink bg-ink text-paper hover:bg-paper hover:text-ink inline-flex min-h-12 items-center justify-center border px-5 py-3 text-sm font-medium tracking-wide transition-colors"
                  href="/contact/"
                >
                  Trimiteți un mesaj
                </a>
                <button
                  className="border-line bg-paper text-ink hover:border-ink inline-flex min-h-12 items-center justify-center border px-5 py-3 text-sm font-medium tracking-wide transition-colors"
                  type="button"
                  onClick={resetReflection}
                  data-reflection-reset
                >
                  Reluați reflecția
                </button>
              </div>
            </div>
          ) : (
            <div className="border-line border-t pt-8">
              <fieldset>
                <legend
                  className="font-display max-w-3xl text-4xl leading-tight tracking-[-0.035em] md:text-5xl"
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
                        <label
                          className={[
                            "flex cursor-pointer gap-4 border p-5 text-lg leading-7 transition-colors",
                            isSelected
                              ? "border-ink bg-ink text-paper"
                              : "border-line bg-paper text-ink hover:border-ink",
                          ].join(" ")}
                          key={answer.label}
                        >
                          <input
                            className="mt-1 h-4 w-4 shrink-0 accent-black"
                            type="radio"
                            name={`reflection-question-${currentIndex}`}
                            checked={isSelected}
                            onChange={() => selectAnswer(answer.dimension)}
                          />
                          <span>{answer.label}</span>
                        </label>
                      );
                    },
                  )}
                </div>
              </fieldset>

              <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  className="border-line bg-paper text-ink hover:border-ink inline-flex min-h-12 items-center justify-center border px-5 py-3 text-sm font-medium tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-45"
                  type="button"
                  onClick={goBack}
                  disabled={currentIndex === 0}
                >
                  Înapoi
                </button>
                <button
                  className="border-ink bg-ink text-paper hover:bg-paper hover:text-ink inline-flex min-h-12 items-center justify-center border px-5 py-3 text-sm font-medium tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-45"
                  type="button"
                  onClick={continueReflection}
                  disabled={!selectedAnswer}
                >
                  {currentIndex === questions.length - 1
                    ? "Vedeți reflecția"
                    : "Continuați"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
