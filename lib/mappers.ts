import type { Prisma } from "@prisma/client";

export function parseJson<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function mapLessonStep(step: {
  title: string;
  type: string;
  content: string;
  question: string | null;
  options: string | null;
  correctAnswer: string | null;
}) {
  const base = { title: step.title, type: step.type as "vocab" | "quiz" | "listening" | "text" };

  if (step.type === "vocab") {
    const data = parseJson<{ vocabItems?: unknown[] }>(step.content, {});
    return { ...base, type: "vocab" as const, vocabItems: data.vocabItems ?? [] };
  }
  if (step.type === "quiz") {
    return {
      ...base,
      type: "quiz" as const,
      quizQuestion: step.question ?? "",
      quizOptions: parseJson<string[]>(step.options, []),
      quizAnswer: step.correctAnswer ?? "",
    };
  }
  if (step.type === "listening") {
    const data = parseJson<{ listeningAudioText?: string }>(step.content, {});
    return {
      ...base,
      type: "listening" as const,
      listeningAudioText: data.listeningAudioText ?? step.correctAnswer ?? "",
    };
  }
  const data = parseJson<{ body?: string }>(step.content, {});
  return { ...base, type: "text" as const, body: data.body ?? step.content };
}

export function mapCommunicationScenario(
  scenario: {
    slug: string;
    title: string;
    description: string | null;
    icon: string;
    gradient: string;
    startNodeId: string;
    xpReward: number;
    dialogues: Array<{
      nodeId: string;
      speaker: string;
      speakerRole: string | null;
      text: string;
      translation: string | null;
      isEnd: boolean;
      choices: string | null;
    }>;
  }
) {
  const nodes: Record<string, unknown> = {};
  for (const d of scenario.dialogues) {
    nodes[d.nodeId] = {
      id: d.nodeId,
      speaker: d.speaker,
      speakerRole: d.speakerRole ?? "",
      text: d.text,
      translation: d.translation ?? undefined,
      isEnd: d.isEnd,
      choices: parseJson(d.choices, undefined),
    };
  }
  return {
    slug: scenario.slug,
    title: scenario.title,
    description: scenario.description ?? "",
    icon: scenario.icon,
    gradient: scenario.gradient,
    xpReward: scenario.xpReward,
    startId: scenario.startNodeId,
    nodes,
  };
}

export function formatRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}
