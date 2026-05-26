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
  Clock,
  Volume2,
  FileText,
  Bookmark,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  XCircle,
  Award,
  AlertCircle,
  ArrowRight,
  Notebook
} from "lucide-react";
import confetti from "canvas-confetti";

interface ExamQuestion {
  id: string;
  type: "listening" | "reading";
  questionText: string;
  passage?: string;
  audioText?: string; // For TTS listening
  imageSvg?: React.ReactNode; // Optional inline SVG for image question
  options: string[];
  correctAnswer: string;
}

const mockExamData: Record<string, { title: string; type: "TOEIC" | "IELTS"; duration: number; questions: ExamQuestion[] }> = {
  toeic_mock_1: {
    title: "TOEIC Listening & Reading Sprint",
    type: "TOEIC",
    duration: 15, // 15 mins
    questions: [
      {
        id: "toeic_q1",
        type: "listening",
        questionText: "Look at the image details. Click the speaker, listen, and select the best statement describing the photograph.",
        audioText: "He is looking at some books in the library.",
        imageSvg: (
          <svg viewBox="0 0 150 100" className="w-full max-w-[240px] h-auto bg-slate-100 rounded-2xl border border-zinc-200">
            {/* Table */}
            <rect x="20" y="70" width="110" height="15" rx="2" fill="#cbd5e1" />
            <line x1="40" y1="85" x2="40" y2="98" stroke="#94a3b8" strokeWidth="4" />
            <line x1="110" y1="85" x2="110" y2="98" stroke="#94a3b8" strokeWidth="4" />
            {/* Person */}
            <circle cx="75" cy="40" r="10" fill="#94a3b8" />
            <path d="M 60,70 L 65,52 Q 75,52 85,52 L 90,70 Z" fill="#94a3b8" />
            {/* Books stack on table */}
            <rect x="35" y="55" width="20" height="15" rx="1" fill="#ff8f3d" />
            <rect x="38" y="48" width="14" height="7" rx="1" fill="#ffc83b" />
          </svg>
        ),
        options: [
          "(A) He is eating in a busy restaurant.",
          "(B) He is looking at some books in the library.",
          "(C) He is walking outside in a green park.",
          "(D) He is sleeping on a wood bench."
        ],
        correctAnswer: "(B) He is looking at some books in the library."
      },
      {
        id: "toeic_q2",
        type: "reading",
        questionText: "Choose the word that best completes the sentence.",
        passage: "The marketing director announced that the advertising campaign was a huge _______.",
        options: [
          "(A) succeed",
          "(B) success",
          "(C) successful",
          "(D) successfully"
        ],
        correctAnswer: "(B) success"
      },
      {
        id: "toeic_q3",
        type: "reading",
        questionText: "Choose the word that best completes the sentence.",
        passage: "Employees are reminded that all safety gear _______ be worn in the factory area.",
        options: [
          "(A) must",
          "(B) would",
          "(C) can",
          "(D) might"
        ],
        correctAnswer: "(A) must"
      },
      {
        id: "toeic_q4",
        type: "reading",
        questionText: "Choose the word that best completes the sentence.",
        passage: "Despite the _______ weather, the charity run was attended by over 500 runners.",
        options: [
          "(A) adverse",
          "(B) adversity",
          "(C) adversely",
          "(D) adverseness"
        ],
        correctAnswer: "(A) adverse"
      },
      {
        id: "toeic_q5",
        type: "reading",
        questionText: "Choose the word that best completes the sentence.",
        passage: "The new software update will allow users to customize their interface _______.",
        options: [
          "(A) easily",
          "(B) ease",
          "(C) easy",
          "(D) easiness"
        ],
        correctAnswer: "(A) easily"
      }
    ]
  },
  ielts_mock_1: {
    title: "IELTS Reading & Speaking Review",
    type: "IELTS",
    duration: 20,
    questions: [
      {
        id: "ielts_q1",
        type: "reading",
        questionText: "Read the paragraph and answer: What is the main driver of global temperature rise according to the text?",
        passage: "Climatologists indicate that while astronomical fluctuations influence weather long-term, the accelerated global warming over the past century is primarily driven by anthropogenic greenhouse gas emissions, specifically carbon dioxide released from fossil fuel burning.",
        options: [
          "(A) Solar flare activity",
          "(B) Natural astronomical cycles",
          "(C) Human carbon emissions",
          "(D) Volcanic eruption dust"
        ],
        correctAnswer: "(C) Human carbon emissions"
      },
      {
        id: "ielts_q2",
        type: "reading",
        questionText: "Find the synonym of 'anthropogenic' as used in the passage.",
        options: [
          "(A) Natural",
          "(B) Human-induced",
          "(C) Prehistoric",
          "(D) Outer-space"
        ],
        correctAnswer: "(B) Human-induced"
      },
      {
        id: "ielts_q3",
        type: "reading",
        questionText: "Complete the sentence based on the passage: Solar variations play a _______ role compared to human emissions.",
        options: [
          "(A) minor",
          "(B) dominant",
          "(C) non-existent",
          "(D) catastrophic"
        ],
        correctAnswer: "(A) minor"
      },
      {
        id: "ielts_q4",
        type: "listening",
        questionText: "IELTS Speaking Cue Card: Click the speaker to listen to the prompt. Prepare a 1-minute response.",
        audioText: "Describe a memorable vacation you took as a child. You should say where you went, who was with you, and explain why it was memorable.",
        options: [
          "(A) Yes, I have prepared my answer about a beach trip.",
          "(B) Yes, I have prepared my answer about a mountain hike.",
          "(C) Yes, I have prepared my answer about a museum visit.",
          "(D) No, I need more time."
        ],
        correctAnswer: "(A) Yes, I have prepared my answer about a beach trip."
      }
    ]
  }
};

type ExamData = {
  slug: string;
  title: string;
  type: "TOEIC" | "IELTS";
  duration: number;
  questions: ExamQuestion[];
};

export default function ExamDetail() {
  const params = useParams();
  const router = useRouter();
  const examSlug = (params?.id as string) || "toeic_mock_1";

  const { addExamAttempt } = useAppStore();

  const [examData, setExamData] = useState<ExamData | null>(null);
  const [loading, setLoading] = useState(true);

  const questions = examData?.questions ?? [];
  const totalQuestions = questions.length;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [finalAnalysis, setFinalAnalysis] = useState({ strength: "", weakness: "", aiFeedback: "" });

  useEffect(() => {
    import("@/lib/api-client").then(({ apiGet }) => {
      apiGet<{ exam: ExamData }>(`/api/exams/${examSlug}`)
        .then((res) => {
          setExamData(res.exam);
          setTimeLeft(res.exam.duration * 60);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    });
  }, [examSlug]);
  const [activeRightTab, setActiveRightTab] = useState<"bubble" | "notepad">("bubble");
  const [notepadContent, setNotepadContent] = useState("");

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Countdown timer
  useEffect(() => {
    if (isSubmitted) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSubmitted]);

  const activeQuestion = questions[currentQuestionIndex];

  // Speech for listening sections
  const speakText = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  const selectAnswer = (option: string) => {
    if (!activeQuestion) return;
    setUserAnswers({ ...userAnswers, [activeQuestion.id]: option });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const generateDiagnostic = (score: number, type: "TOEIC" | "IELTS") => {
    let strength = "Good vocabulary usage.";
    let weakness = "Need grammar review.";
    let aiFeedback = "Overall solid structure. Focus on prepositions and spelling errors.";

    if (type === "TOEIC") {
      if (score >= 900) {
        strength = "Outstanding speed and grammar comprehension.";
        weakness = "Minor details in listening accents.";
        aiFeedback = "Excellent! You are ready for the actual TOEIC exam. Keep your streak alive! 🦊🔥";
      } else if (score >= 700) {
        strength = "Solid sentence completion logic.";
        weakness = "Part 5 parts of speech and suffixes.";
        aiFeedback = "Very good! Try practicing more suffix identification lessons. 📚";
      } else {
        strength = "Basic reading comprehension.";
        weakness = "Grammar structures & listening descriptions.";
        aiFeedback = "Keep going! We recommend reviewing the 'TOEIC Grammar Prep' modules first.";
      }
    } else {
      // IELTS
      if (score >= 7.5) {
        strength = "Advanced reading summary & coherence.";
        weakness = "Lexical resource spelling errors.";
        aiFeedback = "Incredible band! Review complex writing tasks to secure your 8.0! 🏆";
      } else if (score >= 6.0) {
        strength = "Good grasp of paragraph main ideas.";
        weakness = "Synonym transformations and details.";
        aiFeedback = "Great job! Try to build custom vocabulary lists for key academic words.";
      } else {
        strength = "Basic scanning skills.";
        weakness = "Speaking coherence & complex text speed.";
        aiFeedback = "We suggest studying daily conversations and simple listening shadowing first.";
      }
    }

    return { strength, weakness, aiFeedback };
  };

  const handleSubmit = async () => {
    if (!examData) return;
    setIsSubmitted(true);
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      const { apiPost } = await import("@/lib/api-client");
      const res = await apiPost<{
        submission: { score: number; analytics: typeof finalAnalysis; xpGained: number };
      }>(`/api/exams/${examSlug}/submit`, { answers: userAnswers, timeSpent: examData.duration * 60 - timeLeft });

      setFinalScore(res.submission.score);
      setFinalAnalysis(res.submission.analytics);
      addExamAttempt({
        id: `attempt-${Date.now()}`,
        examId: examSlug,
        examTitle: examData.title,
        type: examData.type,
        score: res.submission.score,
        totalQuestions,
        answers: userAnswers,
        analysis: res.submission.analytics,
      });
    } catch {
      const diagnostics = generateDiagnostic(0, examData.type);
      setFinalAnalysis(diagnostics);
    }

    confetti({
      particleCount: 180,
      spread: 90
    });
  };

  if (loading || !examData) {
    return (
      <AppLayout>
        <div className="p-12 text-center font-bold text-muted-foreground">Loading exam...</div>
      </AppLayout>
    );
  }

  if (isSubmitted) {
    const score = finalScore;
    const diagnostics = finalAnalysis;
    const scorePercentage = (score / (examData.type === "TOEIC" ? 990 : 9.0)) * 100;

    return (
      <AppLayout>
        <div className="max-w-3xl mx-auto space-y-8 py-4">
          <Card className="p-8 text-center border-2 dark:border-dark-border space-y-6">
            <div className="flex flex-col items-center">
              <Mascot
                expression={scorePercentage >= 70 ? "cheer" : "sad"}
                message={scorePercentage >= 70 ? "Woohoo! Awesome exam results! 🏆" : "It's okay! We learn from mistakes! 🦊💪"}
                size={160}
                speechBubblePosition="top"
              />
              <h2 className="text-3xl font-black text-slate-800 dark:text-white mt-6">
                Exam Completed!
              </h2>
              <p className="text-sm font-semibold text-zinc-400 dark:text-zinc-500 mt-1">
                {examData.title}
              </p>
            </div>

            {/* Score Showcase */}
            <div className="py-6 px-8 rounded-3xl bg-zinc-50 dark:bg-dark-card border border-border dark:border-dark-border inline-flex flex-col items-center">
              <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">
                Your Estimated Score
              </span>
              <span className="text-5xl font-black text-primary mt-2">
                {examData.type === "TOEIC" ? `${score} / 990` : `Band ${score}`}
              </span>
              <div className="w-48 h-2 bg-zinc-200 dark:bg-slate-700 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${Math.max(10, scorePercentage)}%` }} />
              </div>
            </div>

            {/* Diagnostics Report */}
            <div className="text-left space-y-4 border-t border-border dark:border-dark-border pt-6 mt-4">
              <h4 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-secondary" /> Performance Feedback
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm font-semibold">
                  <h5 className="font-extrabold text-sm flex items-center gap-1.5 mb-1 text-success">
                    <CheckCircle className="w-4 h-4 fill-success/15" /> Key Strengths
                  </h5>
                  <p className="text-xs leading-relaxed">{diagnostics.strength}</p>
                </div>

                <div className="p-4 rounded-2xl bg-danger/10 border border-danger/20 text-danger text-sm font-semibold">
                  <h5 className="font-extrabold text-sm flex items-center gap-1.5 mb-1 text-danger">
                    <XCircle className="w-4 h-4" /> Areas to Improve
                  </h5>
                  <p className="text-xs leading-relaxed">{diagnostics.weakness}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-dark-card border border-border dark:border-dark-border text-xs font-bold leading-relaxed text-zinc-500 dark:text-zinc-400">
                <span className="block font-black text-slate-700 dark:text-white text-sm mb-1">
                  💡 Tutor Kiko's Recommendations
                </span>
                {diagnostics.aiFeedback}
              </div>
            </div>

            {/* Back action */}
            <div className="pt-4 border-t border-border dark:border-dark-border flex justify-center">
              <Link href="/exams">
                <Button variant="primary">
                  Return to Exams <ArrowRight className="w-5 h-5 ml-1.5" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Top Header with Timer and title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border dark:border-dark-border">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white">
            {examData.title}
          </h2>
          <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
            {examData.type} Simulator
          </span>
        </div>
        
        {/* Timer Box */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-danger/10 border border-danger/20 text-danger font-black text-lg">
          <Clock className="w-5 h-5 animate-pulse" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Main Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch min-h-[550px] flex-1">
        
        {/* LEFT COLUMN: Exam Question Card */}
        <div className="flex flex-col gap-6">
          <Card className="flex-1 p-6 flex flex-col justify-between dark:border-dark-border">
            <div>
              <span className="text-xs font-black text-primary bg-primary-light px-3 py-1 rounded-full uppercase tracking-wide">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              
              <h3 className="text-lg font-black text-slate-700 dark:text-white mt-4 leading-relaxed">
                {activeQuestion.questionText}
              </h3>

              {/* Listening question controls */}
              {activeQuestion.type === "listening" && (
                <div className="flex flex-col items-center gap-4 my-6 py-4 bg-zinc-50 dark:bg-dark-card border border-border dark:border-dark-border rounded-3xl">
                  {activeQuestion.type === "listening" && (
                    <div className="w-full max-w-[240px] aspect-video bg-muted rounded-2xl flex items-center justify-center border border-border">
                      <Volume2 className="w-12 h-12 text-primary" />
                    </div>
                  )}
                  <button
                    onClick={() => speakText(activeQuestion.audioText || "")}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white font-extrabold shadow-md shadow-primary/20 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                  >
                    <Volume2 className="w-5 h-5 fill-current" /> Play Audio
                  </button>
                </div>
              )}

              {/* Reading Passage */}
              {activeQuestion.type === "reading" && activeQuestion.passage && (
                <div className="my-6 p-5 bg-zinc-50 dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl font-mono text-sm leading-relaxed text-slate-700 dark:text-zinc-200">
                  {activeQuestion.passage}
                </div>
              )}

              {/* Multiple choices */}
              <div className="space-y-2.5 mt-6">
                {activeQuestion.options.map((opt) => {
                  const isSelected = userAnswers[activeQuestion.id] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => selectAnswer(opt)}
                      className={`w-full text-left p-3.5 rounded-2xl border-2 font-black text-sm transition-all cursor-pointer
                        ${
                          isSelected ? "lf-choice lf-choice-selected" : "lf-choice"
                        }
                      `}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stepper Footer actions */}
            <div className="flex justify-between items-center border-t border-border dark:border-dark-border pt-5 mt-8">
              <Button
                variant="outline"
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
              >
                Previous
              </Button>
              
              {currentQuestionIndex < totalQuestions - 1 ? (
                <Button variant="primary" onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}>
                  Next Question
                </Button>
              ) : (
                <Button variant="success" onClick={handleSubmit}>
                  Submit Exam
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: Split screen Notepad / Answer Grid bubble sheet */}
        <div className="flex flex-col gap-4">
          <Card className="flex-1 p-6 flex flex-col dark:border-dark-border">
            {/* Header Tabs */}
            <div className="flex gap-2 border-b border-border dark:border-dark-border pb-3 mb-5">
              <button
                onClick={() => setActiveRightTab("bubble")}
                className={`px-4 py-2 font-black text-sm rounded-xl cursor-pointer transition-colors
                  ${
                    activeRightTab === "bubble"
                      ? "bg-secondary text-white"
                      : "text-zinc-400 hover:text-slate-600 hover:bg-zinc-50 hover:bg-muted"
                  }
                `}
              >
                Answer Sheet Bubbles
              </button>
              <button
                onClick={() => setActiveRightTab("notepad")}
                className={`px-4 py-2 font-black text-sm rounded-xl cursor-pointer transition-colors
                  ${
                    activeRightTab === "notepad"
                      ? "bg-secondary text-white"
                      : "text-zinc-400 hover:text-slate-600 hover:bg-zinc-50 hover:bg-muted"
                  }
                `}
              >
                Scratch Notepad
              </button>
            </div>

            {/* TAB CONTENT: Answer bubble sheet grid */}
            {activeRightTab === "bubble" && (
              <div className="flex-1 space-y-6">
                <div className="p-3.5 bg-zinc-50 dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl text-xs font-bold text-zinc-400 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0 text-secondary" />
                  <span>Review all answers. Click a bubble to edit, or submit below when ready.</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {questions.map((q, idx) => {
                    const ans = userAnswers[idx];
                    const charAns = ans ? ans.match(/^\(([A-D])\)/)?.[1] || "?" : "None";
                    const isSelectedIdx = currentQuestionIndex === idx;

                    return (
                      <div
                        key={q.id}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`flex items-center justify-between p-3.5 rounded-2xl border-2 cursor-pointer transition-all
                          ${
                            isSelectedIdx
                              ? "border-secondary bg-purple-50/50 dark:bg-purple-950/20"
                              : "border-border dark:border-dark-border hover:bg-zinc-50 hover:bg-muted"
                          }
                        `}
                      >
                        <span className="font-extrabold text-sm text-zinc-500 dark:text-zinc-400">
                          Q {idx + 1}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-7.5 h-7.5 rounded-full flex items-center justify-center text-xs font-black
                              ${
                                charAns !== "None"
                                  ? "bg-primary text-white"
                                  : "bg-zinc-200 dark:bg-slate-700 text-zinc-500"
                              }
                            `}
                          >
                            {charAns}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-6 border-t border-border dark:border-dark-border flex justify-end">
                  <Button variant="success" className="w-full" onClick={handleSubmit}>
                    Submit Mock Exam
                  </Button>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Scratch Notepad */}
            {activeRightTab === "notepad" && (
              <div className="flex flex-col flex-1 gap-2">
                <span className="text-xs font-bold text-zinc-400">
                  Write down vocabulary, drafts for essays, or scratch ideas here during the exam.
                </span>
                <textarea
                  value={notepadContent}
                  onChange={(e) => setNotepadContent(e.target.value)}
                  placeholder="Exam drafts / Scratch space..."
                  className="lf-textarea flex-1"
                />
              </div>
            )}
          </Card>
        </div>

      </div>
    </AppLayout>
  );
}
