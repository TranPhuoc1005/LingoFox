import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getApiUser } from "@/lib/get-user";
import { formatRelativeTime } from "@/lib/mappers";

export async function GET() {
  try {
    const user = await getApiUser();
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, level: true, image: true } },
        comments: {
          include: { user: { select: { name: true, image: true } } },
          orderBy: { createdAt: "asc" },
        },
        reactions: true,
      },
    });

    return NextResponse.json({
      posts: posts.map((p) => ({
        id: p.id,
        authorName: p.user.name ?? "Anonymous",
        authorAvatar: p.user.image ?? p.user.name?.[0] ?? "?",
        authorLevel: p.user.level,
        title: p.title,
        content: p.content,
        createdAt: formatRelativeTime(p.createdAt),
        likes: p.reactions.filter((r) => r.type === "like").length,
        likedByUser: p.reactions.some((r) => r.userId === user.id && r.type === "like"),
        comments: p.comments.map((c) => ({
          id: c.id,
          authorName: c.user.name ?? "Anonymous",
          authorAvatar: c.user.image ?? "?",
          content: c.content,
          createdAt: formatRelativeTime(c.createdAt),
        })),
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load posts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getApiUser();
    const { title, content } = await request.json();
    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ error: "title and content required" }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: { userId: user.id, title, content },
      include: { user: { select: { name: true, level: true } } },
    });

    return NextResponse.json({
      post: {
        id: post.id,
        authorName: post.user.name ?? "You",
        authorLevel: post.user.level,
        title: post.title,
        content: post.content,
        createdAt: "Just now",
        likes: 0,
        likedByUser: false,
        comments: [],
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
