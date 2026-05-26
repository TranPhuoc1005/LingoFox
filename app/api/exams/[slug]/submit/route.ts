import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getApiUser } from "@/lib/get-user";
import { parseJson } from "@/lib/mappers";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const user = await getApiUser();
    const { answers, timeSpent } = await request.json();

    const exam = await prisma.exam.findUnique({
      where: { slug },
      include: { questions: true },
    });
    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    let correct = 0;
    for (const q of exam.questions) {
      const userAns = answers[q.id] ?? answers[q.questionNumber];
      if (userAns === q.correctAnswer) correct++;
    }

    const total = exam.questions.length;
    const score =
      exam.type === "TOEIC"
        ? Math.round((correct / total) * 990)
        : Math.round((correct / total) * 9 * 10) / 10;

    const analytics = {
      strength: correct >= total * 0.7 ? "Strong comprehension" : "Good effort",
      weakness: correct < total * 0.5 ? "Review grammar and listening" : "Minor gaps",
      aiFeedback: `You scored ${correct}/${total}. Keep practicing ${exam.type} format questions daily! 🦊`,
    };

    const submission = await prisma.examSubmission.create({
      data: {
        userId: user.id,
        examId: exam.id,
        score,
        answers: JSON.stringify(answers),
        analytics: JSON.stringify(analytics),
        timeSpent: timeSpent ?? 0,
      },
    });

    const xpGain = Math.round((score / (exam.type === "TOEIC" ? 990 : 9)) * exam.totalXp);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        xp: user.xp + xpGain,
        lastStudyDate: new Date(),
      },
    });

    return NextResponse.json({
      submission: {
        id: submission.id,
        score,
        correct,
        total,
        analytics,
        xpGained: xpGain,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Submit failed" }, { status: 500 });
  }
}
