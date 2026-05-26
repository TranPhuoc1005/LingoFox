import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/mappers";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const exercise = await prisma.listeningExercise.findUnique({
      where: { id },
    });

    if (!exercise) {
      // Allow fallback search by UUID or Title
      const fallbackExercise = await prisma.listeningExercise.findFirst({
        where: {
          OR: [
            { id },
            { title: { contains: id } }
          ]
        }
      });
      if (!fallbackExercise) {
        return NextResponse.json({ error: "Exercise not found" }, { status: 404 });
      }
      return NextResponse.json({ exercise: mapExercise(fallbackExercise) });
    }

    return NextResponse.json({ exercise: mapExercise(exercise) });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load listening exercise" }, { status: 500 });
  }
}

function mapExercise(exercise: any) {
  const type = exercise.type;
  const isMultipleChoice = type === "multiple_choice";
  
  return {
    id: exercise.id,
    title: exercise.title,
    topic: type === "dictation" ? "Daily Dictation" : type === "multiple_choice" ? "Travel & Announcements" : "Leisure & Outdoors",
    level: exercise.difficulty,
    defaultAccent: exercise.accent === "US" ? "US (New York)" : exercise.accent === "UK" ? "UK (London)" : exercise.accent === "AU" ? "Australian (Sydney)" : "Indian (Mumbai)",
    duration: type === "dictation" ? 60 : type === "multiple_choice" ? 120 : 90,
    audioText: exercise.transcript || "",
    description: exercise.question || "Listen closely and complete the interactive exercises.",
    speaker: exercise.accent === "US" ? "Marcus" : exercise.accent === "UK" ? "Clara" : exercise.accent === "AU" ? "Liam" : "Amit",
    imageTheme: type === "dictation" ? "cafe" : type === "multiple_choice" ? "tech" : "nature",
    questions: isMultipleChoice
      ? [
          {
            id: `${exercise.id}_q1`,
            questionText: exercise.question || "Select the correct option:",
            options: parseJson<string[]>(exercise.options, []),
            correctAnswer: exercise.correctAnswer || "",
          }
        ]
      : [
          {
            id: `${exercise.id}_q1`,
            questionText: "Listen and answer: Does this statement describe the recording correctly?",
            options: ["(A) Yes, it matches perfectly.", "(B) No, it describes something else."],
            correctAnswer: exercise.correctAnswer || "(A) Yes, it matches perfectly.",
          }
        ],
    vocab: [
      {
        word: "Transcription",
        translation: "Bản phiên âm",
        definition: "A written or printed representation of something spoken.",
        example: "Use the scratch notepad to refine your transcription.",
        ipa: "/ˌtrænˈskrɪp.ʃən/"
      },
      {
        word: "Accent",
        translation: "Giọng điệu",
        definition: "A distinctive mode of pronunciation of a language, especially one associated with a particular nation, locality, or social class.",
        example: "The speaker has a clear British accent.",
        ipa: "/ˈæk.sənt/"
      }
    ]
  };
}
