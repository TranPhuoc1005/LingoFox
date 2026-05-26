import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapCommunicationScenario } from "@/lib/mappers";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const scenario = await prisma.communicationScenario.findUnique({
      where: { slug },
      include: { dialogues: { orderBy: { order: "asc" } } },
    });

    if (!scenario) {
      return NextResponse.json({ error: "Scenario not found" }, { status: 404 });
    }

    return NextResponse.json({ scenario: mapCommunicationScenario(scenario) });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load scenario" }, { status: 500 });
  }
}
