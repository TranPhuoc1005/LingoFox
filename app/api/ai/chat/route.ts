import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getApiUser } from "@/lib/get-user";

const KIKO_RESPONSES: Record<string, string> = {
  grammar: "Great question! Remember: subject-verb agreement is key. Third person singular takes -s (he goes, she reads). 🦊",
  pronunciation: "Try slowing down on consonant clusters. Shadow native speakers for 10 minutes daily!",
  writing: "Your structure is solid. Consider varying sentence openings and using linking words (however, furthermore).",
  default: "I'm Kiko, your AI English teacher! Ask me about grammar, pronunciation, writing, or let's roleplay. ☕🦊",
};

export async function GET(request: Request) {
  const topic = new URL(request.url).searchParams.get("topic") ?? "kiko_general";

  try {
    const user = await getApiUser();
    const messages = await prisma.aIConversation.findMany({
      where: { userId: user.id, topic },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

    return NextResponse.json({
      messages: messages.map((m) => ({
        id: m.id,
        role: m.role as "user" | "assistant",
        message: m.message,
        timestamp: m.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        grammarFeedback: m.grammarFeedback ?? undefined,
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ messages: [] });
  }
}

export async function POST(request: Request) {
  const { message, topic } = await request.json();

  if (!message) {
    return NextResponse.json({ error: "message required" }, { status: 400 });
  }

  const lower = (message as string).toLowerCase();
  let reply = KIKO_RESPONSES.default;
  let grammarFeedback: string | null = null;
  const chatTopic = topic ?? "kiko_general";

  if (lower.includes("grammar") || /\b(he|she|it)\s+\w+[^s]\b/.test(lower)) {
    reply = KIKO_RESPONSES.grammar;
    if (/\b(he|she)\s+go\b/.test(lower)) {
      grammarFeedback = JSON.stringify({
        isCorrect: false,
        corrected: lower.replace(/\bgo\b/, "goes"),
        tip: "Third-person singular needs -s on the verb.",
      });
    }
  } else if (lower.includes("pronunciation") || lower.includes("accent")) {
    reply = KIKO_RESPONSES.pronunciation;
  } else if (lower.includes("write") || lower.includes("essay")) {
    reply = KIKO_RESPONSES.writing;
  } else if (topic === "cafe") {
    reply = "Welcome to Kiko's Café! ☕ What would you like to order today?";
  }

  try {
    const user = await getApiUser();
    await prisma.aIConversation.create({
      data: { userId: user.id, role: "user", message, topic: chatTopic },
    });
    const assistant = await prisma.aIConversation.create({
      data: {
        userId: user.id,
        role: "assistant",
        message: reply,
        topic: chatTopic,
        grammarFeedback,
      },
    });

    return NextResponse.json({
      reply,
      grammarFeedback,
      topic: chatTopic,
      message: {
        id: assistant.id,
        role: "assistant",
        message: reply,
        timestamp: assistant.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        grammarFeedback: grammarFeedback ?? undefined,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ reply, grammarFeedback, topic: chatTopic });
  }
}
