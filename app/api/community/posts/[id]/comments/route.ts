import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getApiUser } from "@/lib/get-user";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: postId } = await params;

  try {
    const user = await getApiUser();
    const { content } = await request.json();
    if (!content?.trim()) {
      return NextResponse.json({ error: "content required" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: { postId, userId: user.id, content },
      include: { user: { select: { name: true } } },
    });

    return NextResponse.json({
      comment: {
        id: comment.id,
        authorName: comment.user.name ?? "You",
        authorAvatar: "U",
        content: comment.content,
        createdAt: "Just now",
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}
