import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/mappers";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const exam = await prisma.exam.findUnique({
      where: { slug },
      include: { questions: { orderBy: { questionNumber: "asc" } } },
    });

    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    return NextResponse.json({
      exam: {
        slug: exam.slug,
        title: exam.title,
        type: exam.type,
        duration: exam.duration,
        questions: exam.questions.map((q) => ({
          id: q.id,
          type: q.section.toLowerCase() === "listening" ? "listening" : "reading",
          questionText: q.questionText,
          passage: q.passage,
          audioText: q.section === "Listening" ? q.passage : undefined,
          options: parseJson<string[]>(q.options, []),
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          imageUrl: q.imageUrl,
        })),
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load exam" }, { status: 500 });
  }
}
