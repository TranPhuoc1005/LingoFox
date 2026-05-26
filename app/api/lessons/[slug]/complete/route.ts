import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getApiUser } from "@/lib/get-user";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const user = await getApiUser();
    const lesson = await prisma.lesson.findUnique({ where: { slug } });
    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    await prisma.userProgress.upsert({
      where: { userId_lessonId: { userId: user.id, lessonId: lesson.id } },
      update: { completed: true, completedAt: new Date(), score: 100 },
      create: {
        userId: user.id,
        lessonId: lesson.id,
        completed: true,
        completedAt: new Date(),
        score: 100,
      },
    });

    const xpGain = lesson.xpReward;
    let newXp = user.xp + xpGain;
    let newLevel = user.level;
    while (newXp >= newLevel * 150) {
      newXp -= newLevel * 150;
      newLevel += 1;
    }

    const today = new Date();
    let streak = user.streak;
    const last = user.lastStudyDate;
    if (!last || last.toDateString() !== today.toDateString()) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      streak = !last || last.toDateString() === yesterday.toDateString() ? streak + 1 : 1;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { xp: newXp, level: newLevel, streak, lastStudyDate: today },
    });

    return NextResponse.json({
      ok: true,
      xpGained: xpGain,
      leveledUp: newLevel > user.level,
      stats: { xp: newXp, level: newLevel, streak },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to complete lesson" }, { status: 500 });
  }
}
