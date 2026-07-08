import { useMemo, useState } from "react";

type Dimension = "body" | "emotion" | "relationships";
type ResultKey = Dimension | "mixed";

interface AnswerOption {
  label: string;
  dimension: Dimension;
}

interface ReflectionQuestion {
  prompt: string;
  answers: readonly AnswerOption[];
}

const dimensions = ["body", "emotion", "relationships"] as const;

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

const resultContent: Record<
  ResultKey,
  { title: string; paragraphs: readonly string[]; contactPrompt: string }
> = {
  body: {
    title: "Dificultatea pare să se facă vizibilă mai ales prin corp.",
    paragraphs: [
      "Răspunsurile dumneavoastră indică o direcție în care corpul, somnul, tensiunea sau energia par să ceară atenție. Aceasta nu înseamnă că explicația este psihologică.",
      "Dacă există simptome fizice, evaluarea medicală rămâne importantă. Într-un cadru psihoterapeutic, poate fi explorat și contextul emoțional în care aceste semnale apar, se repetă sau devin mai greu de dus.",
    ],
    contactPrompt:
      "Dacă doriți, puteți scrie un mesaj scurt pentru a clarifica posibilitatea unei prime întâlniri.",
  },
  emotion: {
    title:
      "Dificultatea pare să se facă vizibilă mai ales prin stări emoționale.",
    paragraphs: [
      "Răspunsurile dumneavoastră indică o direcție în care neliniștea, tristețea, iritarea, golul sau alte stări par să revină și să ceară înțelegere.",
      "O astfel de reflecție nu stabilește un diagnostic. Poate doar să deschidă o întrebare despre ce se întâmplă acum, ce a devenit greu de purtat și ce ar putea avea nevoie de un spațiu în care să fie formulat.",
    ],
    contactPrompt:
      "Dacă această direcție vi se pare importantă, contactul poate rămâne simplu și fără detalii sensibile în primul mesaj.",
  },
  relationships: {
    title:
      "Dificultatea pare să se facă vizibilă mai ales în relații sau tipare care se repetă.",
    paragraphs: [
      "Răspunsurile dumneavoastră indică o direcție în care apropierea, retragerea, conflictele, limitele sau încrederea par să aducă aceeași întrebare înapoi.",
      "Aceasta nu înseamnă că o relație sau o persoană este redusă la o explicație simplă. Poate fi, mai degrabă, un punct de pornire pentru a observa ce se repetă și ce devine greu de schimbat fără a fi înțeles.",
    ],
    contactPrompt:
      "Dacă doriți să discutați această întrebare într-un cadru profesional, puteți începe cu un email scurt.",
  },
  mixed: {
    title: "Dificultatea nu pare să apară într-un singur loc.",
    paragraphs: [
      "Răspunsurile dumneavoastră ating mai multe direcții: corpul, stările emoționale și relațiile pot fi legate între ele. Uneori, ceea ce cere atenție nu se lasă separat clar de la început.",
      "Poate fi util să porniți de la locul în care lucrurile se simt cel mai prezente acum, fără să forțați o concluzie. O reflecție mai atentă poate arăta treptat cum se leagă aceste planuri.",
    ],
    contactPrompt:
      "Dacă vă este util, puteți scrie pentru a clarifica dacă o primă întâlnire ar fi potrivită.",
  },
};

export default function GuidedReflection() {
  // V1 keeps answers in component state only. There is no localStorage, server
  // request, analytics event, or email capture tied to this flow.
  const [answers, setAnswers] = useState<(Dimension | null)[]>(() =>
    Array.from({ length: questions.length }, () => null),
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = questions[currentIndex];
  const selectedAnswer = answers[currentIndex] ?? null;
  const answeredCount = answers.filter(Boolean).length;

  const resultKey = useMemo<ResultKey | null>(() => {
    if (answers.some((answer) => answer === null)) {
      return null;
    }

    const counts: Record<Dimension, number> = {
      body: 0,
      emotion: 0,
      relationships: 0,
    };

    for (const answer of answers) {
      if (answer) {
        counts[answer] += 1;
      }
    }

    const ordered = [...dimensions].sort(
      (first, second) => counts[second] - counts[first],
    );
    const strongest = ordered[0] ?? "body";
    const nextStrongest = ordered[1] ?? "emotion";

    return counts[strongest] === counts[nextStrongest] ? "mixed" : strongest;
  }, [answers]);

  const result = resultKey ? resultContent[resultKey] : null;
  const progressPercent = showResult
    ? 100
    : Math.round(((currentIndex + 1) / questions.length) * 100);

  if (!currentQuestion) {
    return null;
  }

  const selectAnswer = (dimension: Dimension) => {
    setAnswers((currentAnswers) =>
      currentAnswers.map((answer, index) =>
        index === currentIndex ? dimension : answer,
      ),
    );
  };

  const goBack = () => {
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

    if (currentIndex === questions.length - 1) {
      setShowResult(true);
      return;
    }

    setCurrentIndex((index) => Math.min(index + 1, questions.length - 1));
  };

  const resetReflection = () => {
    setAnswers(Array.from({ length: questions.length }, () => null));
    setCurrentIndex(0);
    setShowResult(false);
  };

  return (
    <section
      className="border-line border-y py-12 md:py-16"
      aria-labelledby="reflectie-ghidata"
    >
      <div className="mx-auto w-full max-w-(--content-width) px-(--page-gutter)">
        <div className="grid gap-12 md:grid-cols-[0.72fr_1.28fr]">
          <div>
            <h2
              id="reflectie-ghidata"
              className="font-display text-4xl leading-none tracking-[-0.035em] md:text-5xl"
            >
              Despre sine: Reflecție ghidată
            </h2>
            <p className="text-muted mt-6 max-w-md leading-7">
              Răspunsurile rămân în browser pe durata acestei vizite. Nu este
              necesar un cont, un email sau o explicație completă a situației.
            </p>
            <div className="border-line mt-8 border-t pt-5" aria-live="polite">
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
                {answeredCount} răspunsuri selectate
              </p>
            </div>
          </div>

          {showResult && result ? (
            <div className="border-line border-t pt-8">
              <p className="text-muted text-sm">
                O posibilă direcție de privit
              </p>
              <h3 className="font-display mt-4 max-w-3xl text-4xl leading-tight tracking-[-0.035em] md:text-5xl">
                {result.title}
              </h3>
              <div className="mt-8 max-w-2xl text-lg leading-8">
                {result.paragraphs.map((paragraph) => (
                  <p className="mt-5 first:mt-0" key={paragraph}>
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="border-line mt-10 border-t pt-6">
                <p className="text-muted max-w-2xl leading-7">
                  Această reflecție nu este un diagnostic, nu măsoară
                  severitatea unei dificultăți și nu înlocuiește o evaluare
                  psihologică profesională.
                </p>
                <p className="mt-5 max-w-2xl leading-7">
                  {result.contactPrompt}
                </p>
              </div>

              <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <a
                  className="border-ink bg-ink text-paper hover:bg-paper hover:text-ink inline-flex min-h-12 items-center justify-center border px-5 py-3 text-sm font-medium tracking-wide transition-colors"
                  href="/contact/"
                >
                  Mergeți la contact
                </a>
                <button
                  className="border-line bg-paper text-ink hover:border-ink inline-flex min-h-12 items-center justify-center border px-5 py-3 text-sm font-medium tracking-wide transition-colors"
                  type="button"
                  onClick={resetReflection}
                >
                  Reluați reflecția
                </button>
              </div>
            </div>
          ) : (
            <div className="border-line border-t pt-8">
              <fieldset>
                <legend className="font-display max-w-3xl text-4xl leading-tight tracking-[-0.035em] md:text-5xl">
                  {currentQuestion.prompt}
                </legend>
                <div className="mt-8 grid gap-4">
                  {currentQuestion.answers.map((answer) => {
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
                  })}
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
