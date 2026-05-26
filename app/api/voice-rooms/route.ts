import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rooms = await prisma.voiceStudyRoom.findMany({
      where: { isActive: true },
      include: {
        participants: {
          include: { user: { select: { name: true, image: true } } },
        },
      },
    });

    return NextResponse.json({
      rooms: rooms.map((r) => ({
        id: r.id,
        name: r.name,
        activeCount: r.participants.length,
        participants: r.participants.map((p) => ({
          name: p.user.name ?? "Guest",
          avatar: p.user.name?.[0] ?? "G",
          speaking: false,
        })),
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load rooms" }, { status: 500 });
  }
}
