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
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Award,
  BookOpen,
  VolumeX,
  FileText,
  Eye,
  EyeOff,
  Flame,
  Plus,
  Trash2,
  Highlighter,
  ChevronDown
} from "lucide-react";
import confetti from "canvas-confetti";

interface ListeningQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
}

interface AudioTrackData {
  id: string;
  title: string;
  topic: string;
  level: string;
  defaultAccent: string;
  duration: number; // in seconds
  audioText: string;
  description: string;
  speaker: string;
  imageTheme: "cafe" | "tech" | "nature";
  questions: ListeningQuestion[];
  vocab: { word: string; translation: string; definition: string; example: string; ipa: string }[];
}

const mockTracks: Record<string, AudioTrackData> = {
  listening_track_1: {
    id: "listening_track_1",
    title: "Cozy Morning Café Conversation",
    topic: "Daily Life & Dining",
    level: "Intermediate",
    defaultAccent: "UK (London)",
    duration: 165, // 2:45
    audioText: "I would like a fresh double shot espresso and a warm buttery croissant, please. Do you bake these pastries in-house every morning? Yes, we bake them at dawn!",
    description: "Listen to Clara ordering coffee and talking about baking processes.",
    speaker: "Clara",
    imageTheme: "cafe",
    questions: [
      {
        id: "cafe_q1",
        questionText: "What breakfast combinations does the customer order?",
        options: [
          "(A) A black filter tea and chocolate muffin",
          "(B) A double shot espresso and a warm croissant",
          "(C) A vanilla latte and avocado toast",
          "(D) An iced americano and a blueberry bagel"
        ],
        correctAnswer: "(B) A double shot espresso and a warm croissant"
      },
      {
        id: "cafe_q2",
        questionText: "When are the pastries baked in the café?",
        options: [
          "(A) In the evening before closing",
          "(B) Handed over from an external bakery at noon",
          "(C) Baked in-house every morning at dawn",
          "(D) Prepared over the weekend and frozen"
        ],
        correctAnswer: "(C) Baked in-house every morning at dawn"
      }
    ],
    vocab: [
      {
        word: "Croissant",
        translation: "Bánh sừng bò",
        definition: "A flaky, buttery French pastry shaped like a crescent.",
        example: "A fresh croissant goes beautifully with hot espresso.",
        ipa: "/ˈkwɑː.sɒ̃/"
      },
      {
        word: "Pastry",
        translation: "Bánh ngọt",
        definition: "A dough of flour, fat, and water, used as a base and cover in pies and baked goods.",
        example: "The display cases are filled with delicious pastries.",
        ipa: "/ˈpeɪ.stri/"
      },
      {
        word: "Barista",
        translation: "Nhân viên pha chế",
        definition: "A person who prepares and serves espresso-based coffee drinks.",
        example: "The barista painted a cute leaf in my coffee foam.",
        ipa: "/bəˈriː.stə/"
      }
    ]
  },
  listening_track_2: {
    id: "listening_track_2",
    title: "Tech Startup Team Standup",
    topic: "Business & Technology",
    level: "Advanced",
    defaultAccent: "US (New York)",
    duration: 195, // 3:15
    audioText: "We need to push the latest build to our staging server by noon. We also have a minor frontend glitch with the active sidebar toggle. Let's solve it immediately.",
    description: "An American developer standup on issues and staging deadlines.",
    speaker: "Marcus",
    imageTheme: "tech",
    questions: [
      {
        id: "tech_q1",
        questionText: "What is the primary target deadline mentioned?",
        options: [
          "(A) Complete the system review by next Friday",
          "(B) Deploy the latest build to staging by noon today",
          "(C) Hold a marketing kickoff at 3:00 PM",
          "(D) Refactor the Prisma store tables by midnight"
        ],
        correctAnswer: "(B) Deploy the latest build to staging by noon today"
      },
      {
        id: "tech_q2",
        questionText: "Which specific component is facing a bug?",
        options: [
          "(A) The database query optimization cache",
          "(B) The payment gateway integration checkout",
          "(C) The active sidebar toggle menu",
          "(D) The responsive hero parallax background"
        ],
        correctAnswer: "(C) The active sidebar toggle menu"
      }
    ],
    vocab: [
      {
        word: "Staging",
        translation: "Môi trường thử nghiệm",
        definition: "A production-like test server environment used to verify code changes before going live.",
        example: "Test the user auth flow on the staging server first.",
        ipa: "/ˈsteɪ.dʒɪŋ/"
      },
      {
        word: "Glitch",
        translation: "Sự cố nhỏ",
        definition: "A sudden, usually temporary malfunction or fault in an electrical or computer system.",
        example: "A minor CSS layout glitch caused the sidebar to overlap.",
        ipa: "/ɡlɪtʃ/"
      },
      {
        word: "Standup",
        translation: "Họp nhanh hàng ngày",
        definition: "A daily brief meeting of a software development team to review status and coordinate tasks.",
        example: "The developers gathered at 9 AM for their daily standup.",
        ipa: "/ˈstænd.ʌp/"
      }
    ]
  },
  listening_track_3: {
    id: "listening_track_3",
    title: "Wild Outback Wildlife Report",
    topic: "Nature & Travel",
    level: "Beginner",
    defaultAccent: "Australian (Sydney)",
    duration: 110, // 1:50
    audioText: "Welcome to the blue mountains. Today we will spot wild koalas sleeping high up in the eucalyptus trees. Keep your voices quiet to avoid waking them up.",
    description: "An easy Australian report introduction about regional koalas.",
    speaker: "Liam",
    imageTheme: "nature",
    questions: [
      {
        id: "nature_q1",
        questionText: "Where are the wild koalas sleeping according to the speaker?",
        options: [
          "(A) Under the sandy banks of the creek",
          "(B) High up in the branches of eucalyptus trees",
          "(C) Inside hollow logs in the deep valleys",
          "(D) Near the administrative visitor cabins"
        ],
        correctAnswer: "(B) High up in the branches of eucalyptus trees"
      },
      {
        id: "nature_q2",
        questionText: "What instruction is given to the eco-tourists?",
        options: [
          "(A) Keep your voices quiet so you don't wake the animals",
          "(B) Take high flash photography to capture clear images",
          "(C) Feed them fresh eucalyptus leaves directly",
          "(D) Wear bright safety jackets for high visibility"
        ],
        correctAnswer: "(A) Keep your voices quiet so you don't wake the animals"
      }
    ],
    vocab: [
      {
        word: "Koala",
        translation: "Gấu túi",
        definition: "A bear-like Australian arboreal marsupial that eats eucalyptus leaves.",
        example: "A koala spends up to 20 hours a day sleeping in trees.",
        ipa: "/kəʊˈɑː.lə/"
      },
      {
        word: "Eucalyptus",
        translation: "Cây khuynh diệp / bạch đàn",
        definition: "An evergreen Australasian tree valued for its wood, oil, and leaves, which are the main diet of koalas.",
        example: "Eucalyptus leaves have a strong, soothing medicinal scent.",
        ipa: "/ˌjuː.kəl.ɪp.təs/"
      },
      {
        word: "Arboreal",
        translation: "Sống trên cây",
        definition: "Living in or relating to trees.",
        example: "Squirrels and koalas are highly specialized arboreal species.",
        ipa: "/ɑːˈbɔː.ri.əl/"
      }
    ]
  }
};

interface StickyNote {
  id: string;
  content: string;
  color: "yellow" | "mint" | "pink";
}

export default function ListeningDetailPage() {
  const params = useParams();
  const router = useRouter();
  const trackId = (params?.id as string) || "listening_track_1";

  // Zustand Store
  const { notes, saveNote, addXp } = useAppStore();

  const [trackData, setTrackData] = useState<AudioTrackData | null>(null);
  const [loading, setLoading] = useState(true);

  // Study state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [accent, setAccent] = useState("US (New York)");
  const [currentTime, setCurrentTime] = useState(0);
  
  // Timer State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(true);

  // Layout focus state
  const [focusMode, setFocusMode] = useState(false);

  // Study questions answers
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [quizChecked, setQuizChecked] = useState(false);

  // Listen and type dictation state
  const [dictationInput, setDictationInput] = useState("");
  const [dictationAccuracy, setDictationAccuracy] = useState<number | null>(null);
  const [dictationChecked, setDictationChecked] = useState(false);

  // Right-side Panel
  const [activeRightTab, setActiveRightTab] = useState<"notebook" | "vocab" | "stickies">("notebook");
  const [notebookContent, setNotebookContent] = useState("");
  const [bookmarkedWords, setBookmarkedWords] = useState<string[]>([]);
  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>([
    { id: "note-1", content: "Key accent tip: Listen for Clara's soft 't' pronunciations.", color: "yellow" },
    { id: "note-2", content: "Remember to review croiss-ant spelling rules!", color: "mint" }
  ]);
  const [newStickyText, setNewStickyText] = useState("");
  const [highlighterColor, setHighlighterColor] = useState<"none" | "yellow" | "mint" | "pink">("none");

  // Mascot AI Assistant
  const [mascotBubble, setMascotBubble] = useState(`Hello! Let's train your ears with Clara's beautiful British accent! 🦊☕`);
  const [mascotExpr, setMascotExpr] = useState<"idle" | "happy" | "thinking" | "sad">("idle");

  // References
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioProgressRef = useRef<NodeJS.Timeout | null>(null);
  const notebookTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Dynamic API Fetching
  useEffect(() => {
    import("@/lib/api-client").then(({ apiGet }) => {
      apiGet<{ exercise: AudioTrackData }>(`/api/listening/${trackId}`)
        .then((res) => {
          setTrackData(res.exercise);
          setAccent(res.exercise.defaultAccent);
          setMascotBubble(`Hello! Let's train your ears with ${res.exercise.speaker}'s beautiful ${res.exercise.defaultAccent} accent! 🦊🎧`);
        })
        .catch(() => {
          const fallback = mockTracks[trackId] || mockTracks.listening_track_1;
          setTrackData(fallback);
          setAccent(fallback.defaultAccent);
          setMascotBubble(`Hello! Let's train your ears with ${fallback.speaker}'s beautiful ${fallback.defaultAccent} accent! 🦊☕`);
        })
        .finally(() => setLoading(false));
    });
  }, [trackId]);

  // Initialize notebooks and bookmarks
  useEffect(() => {
    const saved = notes[trackId];
    if (saved) {
      setNotebookContent(saved.content);
      setBookmarkedWords(saved.bookmarks || []);
    } else {
      setNotebookContent("");
      setBookmarkedWords([]);
    }
  }, [trackId, notes]);

  // General study timer
  useEffect(() => {
    if (timerActive) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timerActive]);

  // Audio simulation timeline
  useEffect(() => {
    if (!trackData) return;
    if (isPlaying) {
      audioProgressRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= trackData.duration) {
            setIsPlaying(false);
            setMascotExpr("happy");
            setMascotBubble("Audio finished playing! Let's answer the quiz questions now! 🦊🏆");
            return trackData.duration;
          }
          return prev + playbackSpeed;
        });
      }, 1000);
    } else {
      if (audioProgressRef.current) clearInterval(audioProgressRef.current);
    }
    return () => {
      if (audioProgressRef.current) clearInterval(audioProgressRef.current);
    };
  }, [isPlaying, playbackSpeed, trackData]);

  if (loading || !trackData) {
    return (
      <AppLayout>
        <div className="p-12 text-center font-bold text-muted-foreground animate-pulse">
          🦊 Loading listening lab...
        </div>
      </AppLayout>
    );
  }

  const formatAudioTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Replay actions
  const adjustAudioTime = (amount: number) => {
    setCurrentTime((prev) => {
      const next = prev + amount;
      return Math.max(0, Math.min(trackData.duration, next));
    });
  };

  const speakText = (text: string, accentType = accent) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Attempt accent configurations
      if (accentType.includes("UK")) {
        utterance.lang = "en-GB";
      } else if (accentType.includes("Australian")) {
        utterance.lang = "en-AU";
      } else if (accentType.includes("Indian")) {
        utterance.lang = "en-IN";
      } else {
        utterance.lang = "en-US";
      }

      utterance.rate = playbackSpeed;
      window.speechSynthesis.speak(utterance);

      setMascotExpr("happy");
      setMascotBubble(`Speaking with ${accentType} pronunciation speed ${playbackSpeed}x! 🗣️🦊`);
    }
  };

  const handleNotebookChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setNotebookContent(text);

    // Auto save notes
    if (notebookTimeoutRef.current) clearTimeout(notebookTimeoutRef.current);
    notebookTimeoutRef.current = setTimeout(() => {
      saveNote(trackId, text, bookmarkedWords);
    }, 700);
  };

  // Bookmark actions
  const toggleGlossaryWord = (word: string) => {
    let updated: string[];
    if (bookmarkedWords.includes(word)) {
      updated = bookmarkedWords.filter((w) => w !== word);
      setMascotBubble(`Removed "${word}" from your active vocabulary list!`);
    } else {
      updated = [...bookmarkedWords, word];
      setMascotBubble(`Awesome! Added "${word}" to bookmarks. Check the vocabulary tab. 📚🦊`);
    }
    setBookmarkedWords(updated);
    saveNote(trackId, notebookContent, updated);
  };

  // Check Multiple Choice answers
  const checkMultipleChoice = () => {
    setQuizChecked(true);
    let correctCount = 0;
    trackData.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    if (correctCount === trackData.questions.length) {
      setMascotExpr("happy");
      setMascotBubble("Unbelievable! You got every multiple-choice question correct! +20 XP! 🦊🏆");
      addXp(20);
      confetti({ particleCount: 80, spread: 60 });
    } else {
      setMascotExpr("sad");
      setMascotBubble(`You got ${correctCount}/${trackData.questions.length} correct. Review and try again!`);
    }
  };

  // Dictation analysis
  const checkDictationSpelling = () => {
    if (!dictationInput.trim()) return;

    const cleanInput = dictationInput.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();
    const cleanTarget = trackData.audioText.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();

    const inputWords = cleanInput.split(/\s+/);
    const targetWords = cleanTarget.split(/\s+/);

    let matchingWordsCount = 0;
    inputWords.forEach((word) => {
      if (targetWords.includes(word)) {
        matchingWordsCount++;
      }
    });

    const accuracy = Math.round((matchingWordsCount / Math.max(1, targetWords.length)) * 100);
    setDictationAccuracy(accuracy);
    setDictationChecked(true);

    if (accuracy >= 80) {
      setMascotExpr("happy");
      setMascotBubble(`Wonderful transcription! Accuracy is at ${accuracy}%. You have excellent focus! +30 XP! 🦊🎓`);
      addXp(30);
      confetti({ particleCount: 100, spread: 80 });
    } else {
      setMascotExpr("thinking");
      setMascotBubble(`Spelling accuracy: ${accuracy}%. Try replaying the audio at a slower speed (0.8x)! 🦊🎧`);
    }
  };

  // Sticky notes actions
  const addStickyNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStickyText.trim()) return;
    const colors: StickyNote["color"][] = ["yellow", "mint", "pink"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    setStickyNotes([
      ...stickyNotes,
      { id: `sticky-${Date.now()}`, content: newStickyText, color: randomColor }
    ]);
    setNewStickyText("");
  };

  const deleteStickyNote = (id: string) => {
    setStickyNotes(stickyNotes.filter((s) => s.id !== id));
  };

  // Text highlighter tool wrapper
  const applyHighlightText = (colorName: typeof highlighterColor) => {
    setHighlighterColor(colorName);
    if (colorName !== "none") {
      setMascotBubble(`Highlighter active: ${colorName}! Select content to color-code your notes.`);
    } else {
      setMascotBubble(`Highlighter turned off.`);
    }
  };

  return (
    <AppLayout>
      {/* Immersive Focus Mode styling overrides */}
      <div className={`space-y-6 ${focusMode ? "fixed inset-0 z-50 bg-amber-50/5 dark:bg-zinc-950 p-8 overflow-y-auto" : ""}`}>
        
        {/* TOP STATUS BAR */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border dark:border-dark-border pb-4">
          <div className="flex items-center gap-3">
            <Link href="/listening">
              <Button variant="ghost" size="sm" className="pl-1 text-zinc-500 font-extrabold flex items-center gap-1.5">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white leading-tight">
                {trackData.title}
              </h1>
              <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mt-0.5">
                Active Topic: {trackData.topic} • Voice: {trackData.speaker} ({accent})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Timer widget */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400 font-black text-sm border border-violet-100 dark:border-violet-900/50">
              <Clock className="w-4 h-4" />
              <span>{formatAudioTime(timerSeconds)}</span>
              <button onClick={() => setTimerActive(!timerActive)} className="hover:opacity-85 text-xs ml-1 border-l border-violet-200 dark:border-violet-800 pl-2">
                {timerActive ? "Pause" : "Start"}
              </button>
            </div>

            {/* Immersive Focus Toggle */}
            <Button
              variant={focusMode ? "primary" : "outline"}
              onClick={() => {
                setFocusMode(!focusMode);
                setMascotBubble(focusMode ? "Exited focus mode. Back to regular dashboard!" : "Entered Focus Study Mode. Cozy environment loaded! 🕯️🦊");
              }}
              size="sm"
              className="font-black text-xs"
            >
              {focusMode ? <EyeOff className="w-4 h-4 mr-1.5" /> : <Eye className="w-4 h-4 mr-1.5" />}
              {focusMode ? "Exit Focus" : "Focus Mode"}
            </Button>
          </div>
        </div>

        {/* MAIN PANEL SPLIT CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch min-h-[550px]">
          
          {/* ==================== LEFT SIDE: Listening Lab ==================== */}
          <div className="space-y-6 flex flex-col justify-between">
            <Card className="p-6 border-2 dark:border-dark-border space-y-6 flex-1 flex flex-col justify-between">
              
              {/* Cozy AI Generated Conversation Scene Graphic */}
              <div className="relative w-full h-44 rounded-2xl bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-slate-900 dark:to-slate-900 flex items-center justify-center overflow-hidden border border-border dark:border-dark-border group">
                <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                
                {/* Active Audio Pulse Emitters */}
                {isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center gap-1 z-0 pointer-events-none">
                    <span className="w-1.5 bg-violet-400/35 h-16 rounded-full animate-pulse-glow" style={{ animationDelay: "0.1s" }} />
                    <span className="w-1.5 bg-violet-400/35 h-24 rounded-full animate-pulse-glow" style={{ animationDelay: "0.3s" }} />
                    <span className="w-1.5 bg-violet-400/35 h-20 rounded-full animate-pulse-glow" style={{ animationDelay: "0.2s" }} />
                    <span className="w-1.5 bg-violet-400/35 h-12 rounded-full animate-pulse-glow" style={{ animationDelay: "0.4s" }} />
                  </div>
                )}

                {/* Simulated AI Image elements */}
                <div className="relative z-10 flex flex-col items-center gap-2 text-center select-none">
                  {trackData.imageTheme === "cafe" && (
                    <g className="flex flex-col items-center">
                      <span className="text-5xl group-hover:scale-110 transition-transform">☕🥐🧁</span>
                      <span className="text-xs font-black text-slate-700 dark:text-zinc-200 mt-2 block">AI Cozy Baker Café Scene</span>
                    </g>
                  )}
                  {trackData.imageTheme === "tech" && (
                    <g className="flex flex-col items-center">
                      <span className="text-5xl group-hover:scale-110 transition-transform">💻🚀📋</span>
                      <span className="text-xs font-black text-slate-700 dark:text-zinc-200 mt-2 block">AI Agile Scrum Team Environment</span>
                    </g>
                  )}
                  {trackData.imageTheme === "nature" && (
                    <g className="flex flex-col items-center">
                      <span className="text-5xl group-hover:scale-110 transition-transform">🐨🍃🌲</span>
                      <span className="text-xs font-black text-slate-700 dark:text-zinc-200 mt-2 block">AI Eucalyptus Blue Mountains Outback</span>
                    </g>
                  )}
                  <div className="px-2 py-0.5 rounded-md bg-white/70 dark:bg-black/50 text-[9px] text-zinc-500 font-extrabold uppercase mt-1">
                    Simulated Conversation Atmosphere
                  </div>
                </div>

                {/* Accent selector badge over image */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white dark:bg-dark-card border border-border dark:border-dark-border px-3 py-1 rounded-xl shadow-sm text-xs font-black">
                  <span>Accent:</span>
                  <select
                    value={accent}
                    onChange={(e) => {
                      setAccent(e.target.value);
                      setMascotBubble(`Accent updated to ${e.target.value}! Press play to hear speaker.`);
                    }}
                    className="bg-transparent border-none text-violet-600 focus:outline-none cursor-pointer"
                  >
                    <option>US (New York)</option>
                    <option>UK (London)</option>
                    <option>Australian (Sydney)</option>
                    <option>Indian (Mumbai)</option>
                  </select>
                </div>
              </div>

              {/* TIMELINE SLIDER CONTROLLER */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-zinc-400">
                  <span>{formatAudioTime(currentTime)}</span>
                  <span>{formatAudioTime(trackData.duration)}</span>
                </div>
                {/* Simulated Progress track bar */}
                <div
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const width = rect.width;
                    const percent = clickX / width;
                    setCurrentTime(percent * trackData.duration);
                  }}
                  className="h-2.5 w-full bg-zinc-200 dark:bg-slate-800 rounded-full cursor-pointer relative overflow-hidden group"
                >
                  <div
                    className="h-full bg-violet-600 group-hover:bg-violet-500 rounded-full transition-all"
                    style={{ width: `${(currentTime / trackData.duration) * 100}%` }}
                  />
                </div>

                {/* Player button controllers */}
                <div className="flex justify-between items-center pt-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => adjustAudioTime(-5)}
                      className="p-2 text-zinc-500 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-slate-800 transition-colors"
                      title="Rewind 5s"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-3 bg-violet-600 text-white rounded-full hover:scale-105 active:scale-95 transition-all shadow-md shadow-violet-500/10 cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                    </button>
                    <button
                      onClick={() => adjustAudioTime(5)}
                      className="p-2 text-zinc-500 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-slate-800 transition-colors"
                      title="Forward 5s"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Playback rate speed selector */}
                  <div className="flex gap-1 bg-zinc-100 dark:bg-dark-card p-1 rounded-xl">
                    {[0.8, 1.0, 1.2].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => {
                          setPlaybackSpeed(speed);
                          setMascotBubble(`Speed rate updated to ${speed}x! 🏎️🦊`);
                        }}
                        className={`px-2.5 py-1 text-[10px] font-black rounded-lg cursor-pointer transition-all
                          ${
                            playbackSpeed === speed
                              ? "bg-violet-600 text-white"
                              : "text-zinc-400 hover:text-slate-700 dark:hover:text-white"
                          }
                        `}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* DUAL COMPREHENSION WORKSPACE TABS */}
              <div className="border-t border-border dark:border-dark-border pt-6 space-y-6">
                
                {/* 1. Multiple Choice Area */}
                <div className="space-y-4">
                  <h3 className="font-black text-sm text-slate-700 dark:text-white flex items-center gap-1.5 border-b border-border dark:border-dark-border pb-2">
                    <FileText className="w-4.5 h-4.5 text-violet-600" /> Comprehension Questions
                  </h3>

                  <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
                    {trackData.questions.map((q) => (
                      <div key={q.id} className="space-y-2 text-xs font-semibold">
                        <p className="font-extrabold text-slate-800 dark:text-zinc-200">{q.questionText}</p>
                        
                        <div className="grid grid-cols-1 gap-2">
                          {q.options.map((opt) => {
                            const isSelected = selectedAnswers[q.id] === opt;
                            const isCorrectAns = opt === q.correctAnswer;
                            return (
                              <button
                                key={opt}
                                disabled={quizChecked}
                                onClick={() => {
                                  setSelectedAnswers({ ...selectedAnswers, [q.id]: opt });
                                }}
                                className={`w-full text-left p-2.5 rounded-xl border-2 font-black transition-all cursor-pointer flex justify-between items-center
                                  ${
                                    isSelected
                                      ? "border-violet-600 bg-violet-500/10 text-violet-600"
                                      : "border-border dark:border-dark-border bg-white dark:bg-dark-card hover:bg-zinc-50 dark:hover:bg-muted"
                                  }
                                `}
                              >
                                <span>{opt}</span>
                                {quizChecked && isCorrectAns && (
                                  <CheckCircle className="w-4 h-4 text-success fill-success/15" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {!quizChecked ? (
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full"
                      onClick={checkMultipleChoice}
                      disabled={Object.keys(selectedAnswers).length < trackData.questions.length}
                    >
                      Check Comprehension Answers
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setQuizChecked(false)}>
                      Try Again
                    </Button>
                  )}
                </div>

                {/* 2. Dictation spelling typing lab */}
                <div className="space-y-3 pt-2">
                  <h3 className="font-black text-sm text-slate-700 dark:text-white flex items-center gap-1.5 border-b border-border dark:border-dark-border pb-2">
                    <Volume2 className="w-4.5 h-4.5 text-violet-600" /> Listen & Dictate spelling
                  </h3>
                  
                  <textarea
                    rows={3}
                    placeholder="Click play, listen closely, and type out the complete spoken transcription sentence..."
                    value={dictationInput}
                    onChange={(e) => setDictationInput(e.target.value)}
                    disabled={dictationChecked}
                    className="w-full p-3 bg-zinc-50 dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl text-xs font-semibold focus:outline-none focus:border-violet-600 leading-relaxed"
                  />

                  {dictationChecked && dictationAccuracy !== null && (
                    <div className="p-3.5 bg-violet-500/10 border border-violet-500/20 text-violet-600 rounded-2xl text-xs font-bold leading-normal">
                      <p className="font-black text-sm">Dictation Accuracy Check: {dictationAccuracy}%</p>
                      
                      {/* Interactive spelling validator highlight */}
                      <div className="mt-2 text-zinc-500 dark:text-zinc-400 space-y-1">
                        <p><strong className="text-violet-600">Your Draft:</strong> {dictationInput || "(empty)"}</p>
                        <p><strong className="text-slate-800 dark:text-white">Correct Audio:</strong> "{trackData.audioText}"</p>
                      </div>
                    </div>
                  )}

                  {!dictationChecked ? (
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full"
                      onClick={checkDictationSpelling}
                      disabled={!dictationInput.trim()}
                    >
                      Verify Dictation Spelling
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setDictationChecked(false);
                        setDictationAccuracy(null);
                        setDictationInput("");
                      }}
                    >
                      Reset Dictation Session
                    </Button>
                  )}
                </div>

              </div>

            </Card>

            {/* Mascot advice bubble */}
            <Card className="p-4 flex items-center gap-4 dark:border-dark-border">
              <Mascot expression={mascotExpr} message={mascotBubble} size={80} speechBubblePosition="right" />
            </Card>
          </div>

          {/* ==================== RIGHT SIDE: Notion Notebook & Vocabulary ==================== */}
          <div className="space-y-6">
            <Card className="p-6 border-2 dark:border-dark-border flex flex-col justify-between h-full min-h-[500px]">
              
              <div>
                {/* Header selectors */}
                <div className="flex gap-2 border-b border-border dark:border-dark-border pb-3 mb-4">
                  <button
                    onClick={() => setActiveRightTab("notebook")}
                    className={`px-4 py-2 font-black text-xs rounded-xl cursor-pointer transition-colors
                      ${
                        activeRightTab === "notebook"
                          ? "bg-violet-600 text-white"
                          : "text-zinc-400 hover:text-slate-700 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-muted"
                      }
                    `}
                  >
                    Personal Notebook
                  </button>
                  <button
                    onClick={() => setActiveRightTab("vocab")}
                    className={`px-4 py-2 font-black text-xs rounded-xl cursor-pointer transition-colors relative
                      ${
                        activeRightTab === "vocab"
                          ? "bg-violet-600 text-white"
                          : "text-zinc-400 hover:text-slate-700 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-muted"
                      }
                    `}
                  >
                    Vocabulary
                    {bookmarkedWords.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-violet-600 text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-black border border-white dark:border-slate-900">
                        {bookmarkedWords.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveRightTab("stickies")}
                    className={`px-4 py-2 font-black text-xs rounded-xl cursor-pointer transition-colors
                      ${
                        activeRightTab === "stickies"
                          ? "bg-violet-600 text-white"
                          : "text-zinc-400 hover:text-slate-700 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-muted"
                      }
                    `}
                  >
                    Sticky Notes
                  </button>
                </div>

                {/* TAB 1: Notepad & Highlights */}
                {activeRightTab === "notebook" && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs font-bold text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Save className="w-3.5 h-3.5" /> Saves automatically
                      </span>

                      {/* Highlighter selection tool */}
                      <div className="flex items-center gap-1.5">
                        <Highlighter className="w-3.5 h-3.5 text-zinc-400" />
                        <span className="mr-1">Highlight Brush:</span>
                        {[
                          { id: "none", color: "transparent" },
                          { id: "yellow", color: "#fef08a" },
                          { id: "mint", color: "#a7f3d0" },
                          { id: "pink", color: "#fbcfe8" }
                        ].map((brush) => (
                          <button
                            key={brush.id}
                            onClick={() => applyHighlightText(brush.id as any)}
                            className={`w-4 h-4 rounded-full border border-border cursor-pointer transition-all
                              ${highlighterColor === brush.id ? "scale-125 border-zinc-700" : "scale-100"}
                            `}
                            style={{ backgroundColor: brush.color }}
                            title={`${brush.id} brush`}
                          />
                        ))}
                      </div>
                    </div>

                    <textarea
                      value={notebookContent}
                      onChange={handleNotebookChange}
                      placeholder={`# ${trackData.title} Listening Notes\n\n- Accent detail observations:\n- New words typed down:\n- Key dialogue points:\n\nSupports custom notations!`}
                      style={{
                        backgroundColor:
                          highlighterColor === "yellow"
                            ? "#fefaf0"
                            : highlighterColor === "mint"
                            ? "#f0fdf4"
                            : highlighterColor === "pink"
                            ? "#fdf2f8"
                            : undefined
                      }}
                      className="w-full h-80 p-4 border border-border dark:border-dark-border bg-zinc-50 dark:bg-dark-card rounded-2xl font-mono text-xs leading-relaxed resize-none focus:outline-none focus:border-violet-600 transition-colors"
                    />

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const snippet = `\n[Accents Observation - Clara UK]: Soften prepositions and precise vowel enunciations.\n`;
                          const updated = notebookContent + snippet;
                          setNotebookContent(updated);
                          saveNote(trackId, updated, bookmarkedWords);
                        }}
                      >
                        Append Clara Accent Tip
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const snippet = `\n## Vocabulary Highlight Checklist\n`;
                          const updated = notebookContent + snippet;
                          setNotebookContent(updated);
                          saveNote(trackId, updated, bookmarkedWords);
                        }}
                      >
                        Insert Vocab Header
                      </Button>
                    </div>
                  </div>
                )}

                {/* TAB 2: Vocabulary & Pronunciation Helper */}
                {activeRightTab === "vocab" && (
                  <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                    <div className="p-3 bg-zinc-50 dark:bg-dark-card border border-border dark:border-dark-border rounded-xl text-xs font-semibold text-zinc-400 flex items-start gap-2 leading-relaxed">
                      <Info className="w-4 h-4 shrink-0 text-violet-600" />
                      <span>Learn definitions, phonetic spelling (IPA), and play regional pronunciations by clicking speaker icons.</span>
                    </div>

                    <div className="space-y-4">
                      {trackData.vocab.map((v) => {
                        const isBookmarked = bookmarkedWords.includes(v.word);
                        return (
                          <div
                            key={v.word}
                            className="p-4 rounded-2xl bg-zinc-50 dark:bg-dark-card border border-border dark:border-dark-border space-y-2 hover:shadow-sm transition-all"
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">
                                  {v.word}
                                </h4>
                                <span className="text-[10px] text-zinc-400 font-bold font-mono">
                                  {v.ipa}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => speakText(v.word)}
                                  className="p-1 text-violet-600 hover:bg-violet-100 dark:hover:bg-violet-950/20 rounded-lg"
                                  title="Pronunciation Helper (Speak)"
                                >
                                  <Volume2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => toggleGlossaryWord(v.word)}
                                  className="p-1 text-zinc-400 hover:text-violet-600 rounded-lg"
                                >
                                  {isBookmarked ? (
                                    <BookmarkCheck className="w-4 h-4 text-violet-600 fill-violet-600/10" />
                                  ) : (
                                    <Bookmark className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            </div>

                            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                              Translation: <strong className="text-slate-700 dark:text-zinc-300">{v.translation}</strong>
                            </p>
                            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 leading-normal">
                              {v.definition}
                            </p>
                            <p className="text-xs font-bold text-zinc-600 dark:text-zinc-300 italic">
                              Example: "{v.example}"
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 3: Interactive Stickies Board */}
                {activeRightTab === "stickies" && (
                  <div className="space-y-4">
                    <form onSubmit={addStickyNote} className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Add quick study reminder/sticky thoughts..."
                        value={newStickyText}
                        onChange={(e) => setNewStickyText(e.target.value)}
                        className="flex-1 p-2.5 rounded-xl border border-border dark:border-dark-border bg-white dark:bg-dark-card text-xs font-semibold focus:outline-none focus:border-violet-600"
                      />
                      <Button variant="primary" size="sm" type="submit">
                        Add Note
                      </Button>
                    </form>

                    <div className="grid grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-1">
                      {stickyNotes.map((sticky) => (
                        <div
                          key={sticky.id}
                          className={`p-4 rounded-2xl border-2 flex flex-col justify-between h-28 relative group transition-transform hover:scale-102
                            ${
                              sticky.color === "yellow"
                                ? "bg-amber-100/50 border-amber-200 text-amber-800 dark:bg-amber-950/20 dark:border-amber-900/50 dark:text-amber-300"
                                : sticky.color === "mint"
                                ? "bg-emerald-100/50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-300"
                                : "bg-rose-100/50 border-rose-200 text-rose-800 dark:bg-rose-950/20 dark:border-rose-900/50 dark:text-rose-300"
                            }
                          `}
                        >
                          <p className="text-xs font-bold leading-normal pr-4 line-clamp-3">
                            {sticky.content}
                          </p>

                          <button
                            onClick={() => deleteStickyNote(sticky.id)}
                            className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-rose-500 hover:bg-white dark:hover:bg-muted rounded-lg transition-all"
                            title="Delete note"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Bottom control saves */}
              <div className="border-t border-border dark:border-dark-border pt-4 mt-6 flex justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    saveNote(trackId, notebookContent, bookmarkedWords);
                    setMascotBubble("Notebook saved successfully! Keep study logs updated. 📚🏆");
                    setMascotExpr("happy");
                    confetti({ particleCount: 40, spread: 30 });
                  }}
                >
                  Save Active Notes
                </Button>
              </div>

            </Card>
          </div>

        </div>

      </div>
    </AppLayout>
  );
}
