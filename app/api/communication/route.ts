import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const scenarios = await prisma.communicationScenario.findMany({
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      scenarios: scenarios.map((s) => ({
        slug: s.slug,
        title: s.title,
        description: s.description,
        icon: s.icon,
        color: s.gradient,
        xpReward: s.xpReward,
        difficulty: s.difficulty,
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load scenarios" }, { status: 500 });
  }
}
