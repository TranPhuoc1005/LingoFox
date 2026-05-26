import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/mappers";

export async function GET() {
  try {
    const exercises = await prisma.listeningExercise.findMany({
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      exercises: exercises.map((e) => ({
        id: e.id,
        title: e.title,
        type: e.type,
        difficulty: e.difficulty,
        accent: e.accent,
        imagePrompt: e.imageUrl,
        audioText: e.transcript,
        question: e.question,
        options: parseJson<string[] | null>(e.options, null),
        correctAnswer: e.correctAnswer,
        xpReward: e.xpReward,
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load listening" }, { status: 500 });
  }
}
