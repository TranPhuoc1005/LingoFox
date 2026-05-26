import { NextResponse } from "next/server";
import { getApiUser } from "@/lib/get-user";
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/mappers";

export async function GET() {
  try {
    const user = await getApiUser();

    const [progress, achievements, submissions] = await Promise.all([
      prisma.userProgress.findMany({
        where: { userId: user.id, completed: true },
        include: { lesson: { select: { slug: true } } },
      }),
      prisma.userAchievement.findMany({
        where: { userId: user.id },
        include: { achievement: true },
      }),
      prisma.examSubmission.findMany({
        where: { userId: user.id },
        orderBy: { submittedAt: "desc" },
        take: 10,
        include: { exam: true },
      }),
    ]);

    const today = new Date().toDateString();
    const lastStudy = user.lastStudyDate?.toDateString() ?? null;
    let dailyXpEarned = 0;
    if (lastStudy === today) {
      dailyXpEarned = Math.min(user.xp, user.dailyGoal);
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
      stats: {
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        dailyGoal: user.dailyGoal,
        dailyXpEarned,
        lastStudyDate: lastStudy,
        avatar: parseJson(user.avatarConfig, {
          hat: "none",
          outfit: "none",
          accessory: "none",
          backgroundColor: "#ff8f3d",
        }),
        badges: achievements.map((a) => a.achievement.slug),
      },
      completedLessons: progress.map((p) => p.lesson.slug),
      examAttempts: submissions.map((s) => {
        const answers = parseJson<Record<string, string>>(s.answers, {});
        return {
          id: s.id,
          examId: s.exam.slug,
          examTitle: s.exam.title,
          type: s.exam.type as "TOEIC" | "IELTS",
          score: s.score,
          totalQuestions: Object.keys(answers).length,
          submittedAt: s.submittedAt.toLocaleString(),
          answers,
          analysis: parseJson(s.analytics, {
            strength: "",
            weakness: "",
            aiFeedback: "",
          }),
        };
      }),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load user" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getApiUser();
    const body = await request.json();
    const { avatarConfig, dailyGoal, xp, level, streak } = body;

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(avatarConfig !== undefined && { avatarConfig: JSON.stringify(avatarConfig) }),
        ...(dailyGoal !== undefined && { dailyGoal }),
        ...(xp !== undefined && { xp }),
        ...(level !== undefined && { level }),
        ...(streak !== undefined && { streak }),
        lastStudyDate: new Date(),
      },
    });

    return NextResponse.json({ ok: true, user: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
