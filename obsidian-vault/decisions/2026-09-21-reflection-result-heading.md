# Guided reflection result heading

Date: 2026-09-21
Status: approved direction; implemented locally, not published

Replace the result-specific headline and introductory paragraph with the main H1 “Cum s-au împărțit răspunsurile” and the existing explanation beginning “Fiecare segment reprezintă un răspuns.” Move both above the distribution, removing their former duplicate caption. Show only one H1 in each flow state and preserve focus on the result heading after completion.

Keep the completion status, answer counts, contact opt-in, sources, and restart behavior. This changes the visible result layout, not the calculation or optional contact summary.

Implementation: `website/src/components/islands/GuidedReflection.tsx` and `website/src/components/islands/ReflectionAnswerDistribution.tsx`.
