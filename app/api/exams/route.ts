import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const exams = await prisma.exam.findMany({
      orderBy: { createdAt: "asc" },
      include: { _count: { select: { questions: true } } },
    });

    return NextResponse.json({
      exams: exams.map((e) => ({
        id: e.slug,
        slug: e.slug,
        title: e.title,
        type: e.type,
        duration: e.duration,
        questionsCount: e._count.questions,
        xpReward: e.totalXp,
        difficulty: e.type === "TOEIC" ? "Intermediate" : "Advanced",
        description: `${e.type} practice test with ${e._count.questions} questions.`,
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load exams" }, { status: 500 });
  }
}
