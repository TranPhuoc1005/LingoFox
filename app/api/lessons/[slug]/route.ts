import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapLessonStep } from "@/lib/mappers";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug || slug === "undefined") {
    return NextResponse.json({ error: "Lesson slug required" }, { status: 400 });
  }

  try {
    const lesson = await prisma.lesson.findUnique({
      where: { slug },
      include: { steps: { orderBy: { order: "asc" } } },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    return NextResponse.json({
      lesson: {
        id: lesson.id,
        slug: lesson.slug,
        title: lesson.title,
        description: lesson.description,
        category: lesson.category,
        difficulty: lesson.difficulty,
        xpReward: lesson.xpReward,
        isLocked: lesson.isLocked,
        steps: lesson.steps.map(mapLessonStep),
      },
    });
  } catch (e) {
    console.error("[GET /api/lessons/[slug]]", slug, e);
    return NextResponse.json({ error: "Failed to load lesson" }, { status: 500 });
  }
}
