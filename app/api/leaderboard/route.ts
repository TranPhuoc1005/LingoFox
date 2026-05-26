import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEMO_LEADERBOARD = [
  { id: "1", name: "Alex The Fox", xp: 4520, level: 12, streak: 45, avatar: "🦊" },
  { id: "2", name: "Sarah M.", xp: 3890, level: 10, streak: 32, avatar: "⭐" },
  { id: "3", name: "Carlos R.", xp: 3210, level: 9, streak: 28, avatar: "🎓" },
  { id: "4", name: "Jennie_Learn", xp: 2840, level: 8, streak: 21, avatar: "📚" },
  { id: "5", name: "You (Fox Cadet)", xp: 120, level: 1, streak: 3, avatar: "🌱" },
];

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { xp: "desc" },
      take: 50,
      select: { id: true, name: true, xp: true, level: true, streak: true, image: true },
    });
    return NextResponse.json({ leaderboard: users });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load leaderboard" }, { status: 500 });
  }
}
