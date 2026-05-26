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

function getLocalResponse(message: string, topic: string) {
  const lower = message.toLowerCase();
  let reply = KIKO_RESPONSES.default;
  let grammarFeedback: string | null = null;

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

  return { reply, grammarFeedback };
}

export async function POST(request: Request) {
  const { message, topic } = await request.json();

  if (!message) {
    return NextResponse.json({ error: "message required" }, { status: 400 });
  }

  const openaiApiKey = process.env.OPENAI_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;
  let reply = KIKO_RESPONSES.default;
  let grammarFeedback: string | null = null;
  const chatTopic = topic ?? "kiko_general";

  const systemPrompt = `You are Kiko, a cute, encouraging AI English Teacher.
Your job is to chat with the user in English, help them practice, and gently correct their grammar if they make mistakes.

You MUST format your response as a valid JSON object with the following fields:
1. "reply": A friendly, conversational response to the user's message. Keep it relatively short (2-3 sentences), encouraging, cute, and use a study or fox emoji occasionally (e.g. 🦊, ☕, 🎓).
2. "grammarFeedback": If the user made a grammar, spelling, or phrasing mistake in their message, provide a correction. If their message is perfect, set this to null.
If not null, "grammarFeedback" must be a JSON object containing:
   - "isCorrect": false
   - "corrected": "The fully corrected version of the user's message."
   - "tip": "A short, encouraging tip explaining the correction."

Example of expected output JSON when user's message is correct:
{
  "reply": "Hello! I would love to help you study English today! What topic should we practice?",
  "grammarFeedback": null
}

Example when user's message has a mistake (e.g. "he go to school"):
{
  "reply": "Going to school is very exciting! 🦊",
  "grammarFeedback": {
    "isCorrect": false,
    "corrected": "He goes to school",
    "tip": "Remember to add '-s' or '-es' to the verb when using the third-person singular (he, she, it)."
  }
}`;

  if (geminiApiKey) {
    try {
      const user = await getApiUser();
      const previousMessages = await prisma.aIConversation.findMany({
        where: { userId: user.id, topic: chatTopic },
        orderBy: { createdAt: "asc" },
        take: 10,
      });

      const contents: any[] = [];
      previousMessages.forEach((m) => {
        contents.push({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.message }]
        });
      });
      contents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents,
            systemInstruction: {
              parts: [{ text: systemPrompt }]
            },
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.7,
            }
          }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        const rawText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const contentJson = JSON.parse(rawText.trim());
          reply = contentJson.reply || KIKO_RESPONSES.default;
          if (contentJson.grammarFeedback) {
            grammarFeedback = JSON.stringify(contentJson.grammarFeedback);
          }
        }
      } else {
        console.warn("Gemini API call failed, falling back to local engine:", await response.text());
        const localResult = getLocalResponse(message, chatTopic);
        reply = localResult.reply;
        grammarFeedback = localResult.grammarFeedback;
      }
    } catch (apiError) {
      console.error("Error during Gemini request:", apiError);
      const localResult = getLocalResponse(message, chatTopic);
      reply = localResult.reply;
      grammarFeedback = localResult.grammarFeedback;
    }
  } else if (openaiApiKey) {
    try {
      const user = await getApiUser();
      const previousMessages = await prisma.aIConversation.findMany({
        where: { userId: user.id, topic: chatTopic },
        orderBy: { createdAt: "asc" },
        take: 10,
      });

      const messagesPayload = [
        { role: "system", content: systemPrompt },
        ...previousMessages.map((m) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.message,
        })),
        { role: "user", content: message },
      ];

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: messagesPayload,
          response_format: { type: "json_object" },
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        const contentJson = JSON.parse(responseData.choices[0].message.content);
        reply = contentJson.reply || KIKO_RESPONSES.default;
        
        if (contentJson.grammarFeedback) {
          grammarFeedback = JSON.stringify(contentJson.grammarFeedback);
        }
      } else {
        console.warn("OpenAI API call failed, falling back to local engine:", await response.text());
        const localResult = getLocalResponse(message, chatTopic);
        reply = localResult.reply;
        grammarFeedback = localResult.grammarFeedback;
      }
    } catch (apiError) {
      console.error("Error during OpenAI request:", apiError);
      const localResult = getLocalResponse(message, chatTopic);
      reply = localResult.reply;
      grammarFeedback = localResult.grammarFeedback;
    }
  } else {
    const localResult = getLocalResponse(message, chatTopic);
    reply = localResult.reply;
    grammarFeedback = localResult.grammarFeedback;
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
