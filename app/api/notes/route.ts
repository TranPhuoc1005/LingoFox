import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getApiUser } from "@/lib/get-user";
import { parseJson } from "@/lib/mappers";

export async function GET(request: Request) {
  const lessonSlug = new URL(request.url).searchParams.get("lessonSlug");

  if (!lessonSlug) {
    return NextResponse.json({ error: "lessonSlug required" }, { status: 400 });
  }

  try {
    const user = await getApiUser();
    const lesson = await prisma.lesson.findUnique({ where: { slug: lessonSlug } });
    if (!lesson) return NextResponse.json({ note: null });

    const note = await prisma.note.findUnique({
      where: { userId_lessonId: { userId: user.id, lessonId: lesson.id } },
    });
    return NextResponse.json({
      note: note
        ? {
            content: note.content,
            bookmarks: parseJson<string[]>(note.bookmarks, []),
          }
        : null,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load note" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { lessonSlug, content, bookmarks } = body;

  if (!lessonSlug) {
    return NextResponse.json({ error: "lessonSlug required" }, { status: 400 });
  }

  try {
    const user = await getApiUser();
    const lesson = await prisma.lesson.findUnique({ where: { slug: lessonSlug } });
    if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

    const note = await prisma.note.upsert({
      where: { userId_lessonId: { userId: user.id, lessonId: lesson.id } },
      update: {
        content: content ?? "",
        bookmarks: bookmarks ? JSON.stringify(bookmarks) : undefined,
      },
      create: {
        userId: user.id,
        lessonId: lesson.id,
        content: content ?? "",
        bookmarks: bookmarks ? JSON.stringify(bookmarks) : "[]",
      },
    });
    return NextResponse.json({ note });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to save note" }, { status: 500 });
  }
}
