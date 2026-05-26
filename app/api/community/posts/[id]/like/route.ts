import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getApiUser } from "@/lib/get-user";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: postId } = await params;

  try {
    const user = await getApiUser();
    const existing = await prisma.postReaction.findUnique({
      where: { postId_userId_type: { postId, userId: user.id, type: "like" } },
    });

    if (existing) {
      await prisma.postReaction.delete({ where: { id: existing.id } });
      return NextResponse.json({ liked: false });
    }

    await prisma.postReaction.create({
      data: { postId, userId: user.id, type: "like" },
    });
    return NextResponse.json({ liked: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
  }
}
