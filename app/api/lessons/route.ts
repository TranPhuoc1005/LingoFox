import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getApiUser } from "@/lib/get-user";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const difficulty = searchParams.get("difficulty");
  const category = searchParams.get("category");
  const grouped = searchParams.get("grouped") === "true";

  try {
    const user = await getApiUser();
    const lessons = await prisma.lesson.findMany({
      where: {
        ...(difficulty ? { difficulty } : {}),
        ...(category ? { category } : {}),
      },
      orderBy: { order: "asc" },
      include: {
        progress: { where: { userId: user.id } },
      },
    });

    const mapped = lessons.map((l) => ({
      id: l.id,
      slug: l.slug,
      title: l.title,
      description: l.description,
      category: l.category,
      difficulty: l.difficulty,
      xpReward: l.xpReward,
      order: l.order,
      isLocked: l.isLocked,
      completed: l.progress[0]?.completed ?? false,
    }));

    if (!grouped) {
      return NextResponse.json({ lessons: mapped });
    }

    const courses: Record<
      string,
      { title: string; desc: string; difficulty: string; lessons: typeof mapped }
    > = {};

    for (const lesson of mapped) {
      const key = `${lesson.difficulty}-${lesson.category}`;
      if (!courses[key]) {
        courses[key] = {
          title: lesson.category,
          desc: lesson.description ?? "",
          difficulty: lesson.difficulty,
          lessons: [],
        };
      }
      courses[key].lessons.push(lesson);
    }

    return NextResponse.json({
      lessons: mapped,
      courses: Object.values(courses).map((c) => ({
        ...c,
        lessonsCount: c.lessons.length,
        xpValue: c.lessons.reduce((s, l) => s + l.xpReward, 0),
        lessons: c.lessons.map((l) => ({
          id: l.slug,
          name: l.title,
          isLocked: l.isLocked,
          completed: l.completed,
        })),
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load lessons" }, { status: 500 });
  }
}
