"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAppStore } from "@/store/useAppStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/mascot/Mascot";
import { Progress } from "@/components/ui/progress";
import {
  Volume2,
  Bookmark,
  CheckCircle,
  HelpCircle,
  ChevronRight,
  ArrowLeft,
  BookmarkCheck,
  Save,
  Info,
  ExternalLink,
  ChevronLeft
} from "lucide-react";
import confetti from "canvas-confetti";

interface LessonStepData {
  title: string;
  type: "vocab" | "quiz" | "listening" | "text";
  vocabItems?: { word: string; translation: string; definition: string; example: string }[];
  quizQuestion?: string;
  quizOptions?: string[];
  quizAnswer?: string;
  listeningAudioText?: string;
  body?: string;
}


export default function LessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.id as string | undefined;
  const lessonId =
    rawId && rawId !== "undefined" ? rawId : "beginner_vocab_1";

  // Zustand Store hooks
  const { saveNote, completeLesson } = useAppStore();

  const [lessonData, setLessonData] = useState<{
    title: string;
    category: string;
    steps: LessonStepData[];
    xpReward: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const totalSteps = lessonData?.steps.length ?? 0;

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizChecked, setQuizChecked] = useState(false);
  const [quizCorrect, setQuizCorrect] = useState<boolean | null>(null);

  const [typedInput, setTypedInput] = useState("");
  const [listeningChecked, setListeningChecked] = useState(false);
  const [listeningCorrect, setListeningCorrect] = useState<boolean | null>(null);

  const [mascotBubble, setMascotBubble] = useState("Let's tackle this step together! 🦊");
  const [mascotExpr, setMascotExpr] = useState<"idle" | "happy" | "sad" | "thinking" | "talking">("idle");

  // Notepad State
  const [noteContent, setNoteContent] = useState("");
  const [noteBookmarks, setNoteBookmarks] = useState<string[]>([]);
  const [activeStickyTab, setActiveStickyTab] = useState<"notes" | "vocabulary" | "guide">("notes");
  const noteTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    import("@/lib/api-client").then(({ apiGet }) => {
      apiGet<{ lesson: { title: string; category: string; xpReward: number; steps: LessonStepData[] } }>(`/api/lessons/${lessonId}`)
        .then((res) => setLessonData(res.lesson))
        .catch(console.error)
        .finally(() => setLoading(false));
      apiGet<{ note: { content: string; bookmarks: string[] } | null }>(`/api/notes?lessonSlug=${lessonId}`)
        .then((res) => {
          if (res.note) {
            setNoteContent(res.note.content);
            setNoteBookmarks(res.note.bookmarks);
          }
        })
        .catch(() => {});
    });
  }, [lessonId]);

  const stepData = lessonData?.steps[currentStep];

  if (loading || !lessonData || !stepData) {
    return (
      <AppLayout>
        <div className="p-12 text-center font-bold text-muted-foreground">Loading lesson...</div>
      </AppLayout>
    );
  }

  // Auto save notes
  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setNoteContent(content);

    if (noteTimeoutRef.current) clearTimeout(noteTimeoutRef.current);
    noteTimeoutRef.current = setTimeout(() => {
      saveNote(lessonId, content, noteBookmarks);
      import("@/lib/api-client").then(({ apiPost }) => {
        apiPost("/api/notes", { lessonSlug: lessonId, content, bookmarks: noteBookmarks }).catch(() => {});
      });
    }, 800);
  };

  // Speak word
  const speakText = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
      setMascotExpr("talking");
      setMascotBubble(`Playing audio for "${text}"...`);
      setTimeout(() => setMascotExpr("idle"), 1200);
    }
  };

  // Toggle Vocabulary Bookmarks
  const toggleBookmark = (word: string) => {
    let updated: string[];
    if (noteBookmarks.includes(word)) {
      updated = noteBookmarks.filter((w) => w !== word);
      setMascotBubble(`Removed "${word}" from notes bookmarks!`);
    } else {
      updated = [...noteBookmarks, word];
      setMascotBubble(`Added "${word}" to bookmarks. Check your notepad! 📚`);
    }
    setNoteBookmarks(updated);
    saveNote(lessonId, noteContent, updated);
  };

  // Append word helper to notes
  const appendWordToNotes = (item: { word: string; definition: string }) => {
    const addedText = `\n- **${item.word}**: ${item.definition}\n`;
    const newContent = noteContent + addedText;
    setNoteContent(newContent);
    saveNote(lessonId, newContent, noteBookmarks);
    setMascotBubble(`Appended "${item.word}" definition to notes!`);
  };

  // Check Quiz Answer
  const checkQuizAnswer = () => {
    if (!selectedOption) return;
    setQuizChecked(true);
    const isCorrect = selectedOption === stepData.quizAnswer;
    setQuizCorrect(isCorrect);
    
    if (isCorrect) {
      setMascotExpr("happy");
      setMascotBubble("Correct! Amazing job! 🎉🦊");
    } else {
      setMascotExpr("sad");
      setMascotBubble(`Oops! The correct answer is: ${stepData.quizAnswer}`);
    }
  };

  // Check Listening Transcription
  const checkListeningAnswer = () => {
    if (!typedInput.trim()) return;
    setListeningChecked(true);

    const cleanInput = typedInput.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();
    const cleanCorrect = (stepData.listeningAudioText || "").toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();

    const isCorrect = cleanInput === cleanCorrect;
    setListeningCorrect(isCorrect);

    if (isCorrect) {
      setMascotExpr("happy");
      setMascotBubble("Perfect spelling! You've got a sharp ear. 🦊👂");
    } else {
      setMascotExpr("sad");
      setMascotBubble(`Close! The correct transcription was: "${stepData.listeningAudioText}"`);
    }
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedOption(null);
      setQuizChecked(false);
      setQuizCorrect(null);
      setTypedInput("");
      setListeningChecked(false);
      setListeningCorrect(null);
      setMascotBubble("Let's keep pushing! Almost done. 🦊💪");
      setMascotExpr("idle");
    } else {
      // Lesson complete
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
      import("@/lib/api-client").then(({ apiPost }) => {
        apiPost(`/api/lessons/${lessonId}/complete`, {}).then(() => {
          completeLesson(lessonId, lessonData.xpReward);
          router.push("/dashboard");
        });
      });
    }
  };

  return (
    <AppLayout>
      {/* Header toolbar */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/lessons">
          <Button variant="ghost" size="sm" className="flex items-center gap-1.5 pl-2 font-black">
            <ArrowLeft className="w-4 h-4" /> Back to Courses
          </Button>
        </Link>
        <div className="flex items-center gap-4 flex-1 max-w-lg mx-6">
          <span className="text-xs font-extrabold text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
            Step {currentStep + 1} of {totalSteps}
          </span>
          <Progress value={((currentStep + 1) / totalSteps) * 100} color="success" />
        </div>
        <div className="w-20" /> {/* Spacer */}
      </div>

      {/* Main Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 items-stretch min-h-[500px]">
        
        {/* LEFT COLUMN: Lesson Content */}
        <div className="flex flex-col gap-6">
          <Card className="flex-1 p-8 flex flex-col justify-between dark:border-dark-border relative">
            <div>
              {/* Category label */}
              <span className="text-[10px] font-black text-primary bg-primary-light uppercase tracking-wider px-3 py-1 rounded-full">
                {lessonData.category}
              </span>
              <h2 className="text-2xl font-black mt-4 text-slate-800 dark:text-white border-b border-border dark:border-dark-border pb-3 mb-6">
                {stepData.title}
              </h2>

              {/* 1. Vocab UI */}
              {stepData.type === "vocab" && stepData.vocabItems && (
                <div className="space-y-6">
                  {stepData.vocabItems.map((item) => (
                    <div
                      key={item.word}
                      className="p-5 rounded-2xl bg-zinc-50 dark:bg-dark-card border border-border dark:border-dark-border hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">
                            {item.word}
                          </h3>
                          <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                            ({item.translation})
                          </span>
                          <button
                            onClick={() => speakText(item.word)}
                            className="p-2 rounded-xl bg-primary-light text-primary hover:scale-105 active:scale-95 transition-transform"
                          >
                            <Volume2 className="w-4 h-4 fill-current" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleBookmark(item.word)}
                            className="p-2 rounded-xl text-zinc-400 hover:text-primary dark:text-zinc-500"
                            title="Bookmark vocabulary"
                          >
                            {noteBookmarks.includes(item.word) ? (
                              <BookmarkCheck className="w-4 h-4 text-primary fill-primary/10" />
                            ) : (
                              <Bookmark className="w-4 h-4" />
                            )}
                          </button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => appendWordToNotes(item)}
                            className="text-xs text-primary font-black hover:bg-primary-light"
                          >
                            Add to Notes
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400 mb-2 leading-relaxed">
                        {item.definition}
                      </p>
                      <p className="text-sm font-extrabold text-zinc-600 dark:text-zinc-300 italic">
                        Example: "{item.example}"
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* 2. Quiz UI */}
              {stepData.type === "quiz" && (
                <div className="space-y-6">
                  <p className="text-lg font-black text-slate-700 dark:text-white leading-relaxed">
                    {stepData.quizQuestion}
                  </p>

                  <div className="grid grid-cols-1 gap-3">
                    {stepData.quizOptions?.map((opt) => {
                      const isSelected = selectedOption === opt;
                      return (
                        <button
                          key={opt}
                          disabled={quizChecked}
                          onClick={() => {
                            setSelectedOption(opt);
                            setMascotBubble("Press Check to see if you got it right! 🦊");
                            setMascotExpr("thinking");
                          }}
                          className={`lf-choice flex justify-between items-center ${
                            isSelected ? "lf-choice-selected" : ""
                          }`}
                        >
                          <span>{opt}</span>
                          {quizChecked && opt === stepData.quizAnswer && (
                            <CheckCircle className="w-5 h-5 text-success fill-success/10" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {quizChecked && (
                    <div
                      className={`p-4 rounded-2xl text-sm font-bold flex items-start gap-2.5
                        ${
                          quizCorrect
                            ? "bg-success/10 border border-success/20 text-success"
                            : "bg-danger/10 border border-danger/20 text-danger"
                        }
                      `}
                    >
                      <Info className="w-5 h-5 shrink-0" />
                      <div>
                        <p className="font-extrabold text-base">{quizCorrect ? "Excellent!" : "Not quite!"}</p>
                        <p className="font-semibold text-xs mt-1">
                          {quizCorrect ? "Your answer is completely correct. +10 XP!" : `The correct answer was "${stepData.quizAnswer}". Keep practicing!`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3. Listening UI */}
              {stepData.type === "listening" && (
                <div className="space-y-6 flex flex-col items-center">
                  <p className="text-center font-black text-slate-600 dark:text-zinc-300">
                    Click the speaker button, listen carefully, and type what you hear.
                  </p>

                  <button
                    onClick={() => speakText(stepData.listeningAudioText || "")}
                    className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                  >
                    <Volume2 className="w-10 h-10 fill-current" />
                  </button>

                  <input
                    type="text"
                    disabled={listeningChecked}
                    value={typedInput}
                    onChange={(e) => setTypedInput(e.target.value)}
                    placeholder="Type the English sentence here..."
                    className="lf-input text-center text-lg"
                  />

                  {listeningChecked && (
                    <div
                      className={`w-full p-4 rounded-2xl text-sm font-bold flex items-start gap-2.5
                        ${
                          listeningCorrect
                            ? "bg-success/10 border border-success/20 text-success"
                            : "bg-danger/10 border border-danger/20 text-danger"
                        }
                      `}
                    >
                      <Info className="w-5 h-5 shrink-0" />
                      <div>
                        <p className="font-extrabold text-base">{listeningCorrect ? "Excellent Listening!" : "Correction Needed"}</p>
                        <p className="font-semibold text-xs mt-1">
                          {listeningCorrect
                            ? "Perfect transcript! +10 XP!"
                            : `Transcription: "${stepData.listeningAudioText}"`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 4. Text/Coaching Prompt UI */}
              {stepData.type === "text" && (
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-dark-card border border-border dark:border-dark-border hover:shadow-sm transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-black uppercase text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
                        <Info className="w-4 h-4 text-primary" /> Study Reference / Prompt
                      </span>
                      <button
                        onClick={() => speakText(stepData.body || "")}
                        className="p-2 rounded-xl bg-primary-light text-primary hover:scale-105 active:scale-95 transition-transform"
                        title="Read aloud"
                      >
                        <Volume2 className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                    <p className="text-lg font-bold text-slate-700 dark:text-zinc-250 leading-relaxed whitespace-pre-line">
                      {stepData.body}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-border dark:border-dark-border pt-6 mt-8 flex justify-end">
              {stepData.type === "vocab" || stepData.type === "text" ? (
                <Button variant="primary" onClick={handleNextStep}>
                  {currentStep === totalSteps - 1 ? "Finish Lesson" : "Continue"} <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              ) : stepData.type === "quiz" ? (
                !quizChecked ? (
                  <Button variant="primary" disabled={!selectedOption} onClick={checkQuizAnswer}>
                    Check Answer
                  </Button>
                ) : (
                  <Button variant="primary" onClick={handleNextStep}>
                    {currentStep === totalSteps - 1 ? "Finish Lesson" : "Continue"} <ChevronRight className="w-5 h-5 ml-1" />
                  </Button>
                )
              ) : (
                !listeningChecked ? (
                  <Button variant="primary" disabled={!typedInput.trim()} onClick={checkListeningAnswer}>
                    Check Answer
                  </Button>
                ) : (
                  <Button variant="primary" onClick={handleNextStep}>
                    {currentStep === totalSteps - 1 ? "Finish Lesson" : "Continue"} <ChevronRight className="w-5 h-5 ml-1" />
                  </Button>
                )
              )}
            </div>
          </Card>

          {/* Interactive Mascot encouragement inline at the bottom */}
          <Card className="flex items-center gap-4 p-4 dark:border-dark-border">
            <Mascot expression={mascotExpr} message={mascotBubble} size={85} speechBubblePosition="right" />
          </Card>
        </div>

        {/* RIGHT COLUMN: Notion-style notepad */}
        <div className="flex flex-col gap-4">
          <Card className="flex-1 p-6 flex flex-col dark:border-dark-border">
            
            {/* Tabs Selector */}
            <div className="flex gap-2 border-b border-border dark:border-dark-border pb-3 mb-4">
              <button
                onClick={() => setActiveStickyTab("notes")}
                className={`px-4 py-2 font-black text-sm rounded-xl cursor-pointer transition-colors
                  ${
                    activeStickyTab === "notes"
                      ? "bg-secondary text-white"
                      : "text-zinc-400 hover:text-slate-600 hover:bg-zinc-50 dark:hover:bg-slate-800"
                  }
                `}
              >
                Notion Notebook
              </button>
              <button
                onClick={() => setActiveStickyTab("vocabulary")}
                className={`px-4 py-2 font-black text-sm rounded-xl cursor-pointer transition-colors relative
                  ${
                    activeStickyTab === "vocabulary"
                      ? "bg-secondary text-white"
                      : "text-zinc-400 hover:text-slate-600 hover:bg-zinc-50 dark:hover:bg-slate-800"
                  }
                `}
              >
                Vocabulary Bookmarks
                {noteBookmarks.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] w-4.5 h-4.5 flex items-center justify-center rounded-full font-black border border-white">
                    {noteBookmarks.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveStickyTab("guide")}
                className={`px-4 py-2 font-black text-sm rounded-xl cursor-pointer transition-colors
                  ${
                    activeStickyTab === "guide"
                      ? "bg-secondary text-white"
                      : "text-zinc-400 hover:text-slate-600 hover:bg-zinc-50 dark:hover:bg-slate-800"
                  }
                `}
              >
                MD Guide
              </button>
            </div>

            {/* TAB CONTENT: Notebook */}
            {activeStickyTab === "notes" && (
              <div className="flex flex-col flex-1 gap-3">
                <div className="flex justify-between items-center text-xs font-bold text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Save className="w-3.5 h-3.5" /> Saves automatically
                  </span>
                  <span>Notion-like markdown supported</span>
                </div>
                <textarea
                  value={noteContent}
                  onChange={handleNoteChange}
                  placeholder={`# ${lessonData.title}\n\nType your notes, shortcuts, or copy vocabulary examples here. Supports markdown syntax!`}
                  className="lf-textarea flex-1"
                />
              </div>
            )}

            {/* TAB CONTENT: Vocabulary Bookmarks */}
            {activeStickyTab === "vocabulary" && (
              <div className="flex-1 overflow-y-auto space-y-3">
                <div className="p-3 bg-zinc-50 dark:bg-dark-card border border-border dark:border-dark-border rounded-xl text-xs font-bold text-zinc-400 flex items-start gap-2">
                  <Info className="w-4 h-4 shrink-0 text-secondary" />
                  <span>Bookmarks show up when you click the star next to any vocabulary on the left panel!</span>
                </div>
                {noteBookmarks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-zinc-400 font-bold">
                    <Bookmark className="w-8 h-8 opacity-25 mb-2" />
                    <span>No bookmarked words yet.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {noteBookmarks.map((word) => (
                      <div
                        key={word}
                        className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl text-sm font-black"
                      >
                        <span>{word}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => speakText(word)}
                            className="p-1 text-primary hover:bg-primary-light rounded-lg"
                            title="Speak"
                          >
                            <Volume2 className="w-4 h-4 fill-current" />
                          </button>
                          <button
                            onClick={() => toggleBookmark(word)}
                            className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg"
                            title="Remove"
                          >
                            <BookmarkCheck className="w-4 h-4 fill-current" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: MD Guide */}
            {activeStickyTab === "guide" && (
              <div className="flex-1 overflow-y-auto space-y-4 font-semibold text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                <h4 className="font-extrabold text-slate-800 dark:text-white">Markdown Quick Shortcuts</h4>
                <ul className="space-y-2.5 list-disc pl-4">
                  <li><code># Header 1</code> - Page title</li>
                  <li><code>## Header 2</code> - Section heading</li>
                  <li><code>**Bold text**</code> - Highlight key terms</li>
                  <li><code>*Italic text*</code> - Add translations</li>
                  <li><code>- Bullet list</code> - Group notes list</li>
                  <li><code>1. Number list</code> - Step descriptions</li>
                  <li><code>`code text`</code> - Inline formulas</li>
                </ul>
              </div>
            )}
          </Card>
        </div>

      </div>
    </AppLayout>
  );
}
