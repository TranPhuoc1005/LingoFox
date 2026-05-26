"use client";

import React, { useState, useEffect, useRef } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/mascot/Mascot";
import { useAppStore } from "@/store/useAppStore";
import {
  Mic,
  MicOff,
  Send,
  Trash2,
  Sparkles,
  Award,
  BookOpen,
  Volume2,
  AlertCircle,
  HelpCircle,
  BrainCircuit,
  CornerDownRight
} from "lucide-react";

interface SpeechGrammarCheck {
  isCorrect: boolean;
  corrected?: string;
  tip?: string;
}

const _legacyMockAIReplies: Record<string, { reply: string; grammar: SpeechGrammarCheck }> = {
  "hello": {
    reply: "Hello there! I'm doing great. How is your English learning journey going today? 🦊",
    grammar: { isCorrect: true }
  },
  "how are you": {
    reply: "I feel fantastic, thank you! Ready to practice some English with me. 🦊☕ What did you do today?",
    grammar: { isCorrect: true }
  },
  "he go to school": {
    reply: "That's good! Routine is important.",
    grammar: {
      isCorrect: false,
      corrected: "He goes to school.",
      tip: "Subject-verb agreement: third-person singular (he/she/it) requires 'goes' instead of 'go'."
    }
  },
  "i am look for keys": {
    reply: "Oh, where did you last see them? Let's hope you find them soon!",
    grammar: {
      isCorrect: false,
      corrected: "I am looking for my keys.",
      tip: "Present continuous structure requires 'be + verb-ing' (am looking)."
    }
  },
  "i want buy espresso": {
    reply: "Sure! Coming right up. That will be three dollars, please.",
    grammar: {
      isCorrect: false,
      corrected: "I want to buy an espresso.",
      tip: "The verb 'want' must be followed by an infinitive verb ('to buy') and an article ('an espresso')."
    }
  }
};

export default function AISpeaking() {
  const { chatHistory, addChatMessage, setChatMessages, stats, addXp } = useAppStore();

  const [activeTopic, setActiveTopic] = useState("kiko_general");
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [pronunciationScore, setPronunciationScore] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const activeMessages = chatHistory[activeTopic] || [];

  useEffect(() => {
    import("@/lib/api-client").then(({ apiGet }) => {
      apiGet<{ messages: typeof activeMessages }>(`/api/ai/chat?topic=${activeTopic}`)
        .then((res) => setChatMessages(activeTopic, res.messages))
        .catch(() => {});
    });
  }, [activeTopic, setChatMessages]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = "en-US";

        rec.onstart = () => {
          setIsListening(true);
          setPronunciationScore(null);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          const confidence = event.results[0][0].confidence;
          setInputText(transcript);
          
          // Calculate a pronunciation accuracy score based on recognition confidence
          const score = Math.round(confidence * 100);
          setPronunciationScore(score);
          handleSendMessage(transcript, score);
        };

        recognitionRef.current = rec;
      }
    }
  }, [activeTopic]);

  // Scroll to bottom on new chats
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  const toggleListening = () => {
    if (!speechSupported) return;
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setInputText("");
      recognitionRef.current?.start();
    }
  };

  // Speaks Kiko's replies
  const speakReply = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      // Remove emojis to avoid speak glitches
      const cleanText = text.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "en-US";
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = (textToSend?: string, speakScore?: number) => {
    const message = textToSend || inputText;
    if (!message.trim()) return;

    // Check grammar feedback
    const cleanText = message.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();
    addChatMessage(activeTopic, "user", message);
    setInputText("");
    addXp(speakScore ? 8 : 4);

    import("@/lib/api-client").then(({ apiPost }) => {
      apiPost<{ reply: string; grammarFeedback?: string; message: { message: string; grammarFeedback?: string } }>(
        "/api/ai/chat",
        { message, topic: activeTopic }
      ).then((res) => {
        addChatMessage(activeTopic, "assistant", res.reply, res.grammarFeedback);
        speakReply(res.reply);
      });
    });
  };

  const handleClearHistory = () => setChatMessages(activeTopic, []);

  const topics = [
    { id: "kiko_general", title: "General Chat 💬", desc: "Open practice conversation on any topic." },
    { id: "kiko_cafe", title: "Cafe Roleplay ☕", desc: "Practice ordering coffee and pastries." },
    { id: "kiko_interview", title: "Job Interview 💼", desc: "Simulate a professional interview." }
  ];

  return (
    <AppLayout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-stretch h-[calc(100vh-140px)]">
        
        {/* TOPICS / SITUATIONS SELECTOR */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <h3 className="font-black text-lg text-slate-800 dark:text-white flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-primary" /> Situations
          </h3>

          <div className="flex-1 space-y-3">
            {topics.map((t) => {
              const isActive = activeTopic === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => {
                    setActiveTopic(t.id);
                    setPronunciationScore(null);
                  }}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col gap-1
                    ${
                      isActive
                        ? "border-primary bg-primary-light/50 text-slate-800 dark:text-white"
                        : "lf-choice text-muted-foreground"
                    }
                  `}
                >
                  <h4 className="font-extrabold text-sm">{t.title}</h4>
                  <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 leading-relaxed">
                    {t.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CHAT WINDOW INTERFACE */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <Card className="flex-1 p-6 flex flex-col justify-between dark:border-dark-border overflow-hidden h-full">
            
            {/* Header toolbar */}
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-border dark:border-dark-border">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping-slow" />
                <span className="font-extrabold text-slate-800 dark:text-white text-sm">
                  Active Connection: Tutor Kiko
                </span>
              </div>
              
              <button
                onClick={handleClearHistory}
                className="p-2 rounded-xl text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all cursor-pointer"
                title="Clear Chat Logs"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Chat message listing logs */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin">
              {activeMessages.map((msg) => {
                const isAssistant = msg.role === "assistant";
                const grammarFeedback = msg.grammarFeedback ? JSON.parse(msg.grammarFeedback) : null;

                return (
                  <div key={msg.id} className={`flex ${isAssistant ? "justify-start" : "justify-end"} items-start gap-3`}>
                    
                    {isAssistant && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm shrink-0 shadow-sm">
                        🦊
                      </div>
                    )}

                    <div className="space-y-1.5 max-w-[75%]">
                      <div
                        className={`p-4 rounded-3xl text-sm font-semibold leading-relaxed shadow-sm
                          ${
                            isAssistant
                              ? "bg-zinc-100 dark:bg-dark-card text-slate-800 dark:text-zinc-200 rounded-tl-none"
                              : "bg-primary text-white rounded-tr-none"
                          }
                        `}
                      >
                        {msg.message}
                      </div>

                      {/* Grammar corrections display */}
                      {isAssistant && grammarFeedback && (
                        <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-danger rounded-2xl text-xs font-bold leading-relaxed space-y-1 animate-wiggle">
                          <p className="flex items-center gap-1">
                            <CornerDownRight className="w-3.5 h-3.5" /> Correction: "{grammarFeedback.corrected}"
                          </p>
                          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold pl-4">
                            Tip: {grammarFeedback.tip}
                          </p>
                        </div>
                      )}

                      <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 block px-2">
                        {msg.timestamp}
                      </span>
                    </div>

                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input actions (typing or speech check) */}
            <div className="space-y-3 border-t border-border dark:border-dark-border pt-4">
              
              {/* Pronunciation score indicator */}
              {pronunciationScore !== null && (
                <div className="flex items-center gap-2 text-xs font-black text-emerald-600 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                  <Award className="w-4 h-4 fill-emerald-500/15" />
                  <span>Pronunciation Accuracy: {pronunciationScore}% (Great intelligibility!)</span>
                </div>
              )}

              <div className="flex gap-2 items-center">
                {speechSupported && (
                  <button
                    onClick={toggleListening}
                    className={`p-4 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-md shrink-0
                      ${
                        isListening
                          ? "bg-rose-500 text-white animate-pulse"
                          : "bg-zinc-100 dark:bg-slate-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-slate-750"
                      }
                    `}
                    title="Speak using microphone"
                  >
                    {isListening ? (
                      <div className="flex items-center gap-1.5">
                        <MicOff className="w-5 h-5" />
                        {/* Custom Wave Visualizer */}
                        <div className="flex items-center">
                          <span className="wave-bar bg-white" />
                          <span className="wave-bar bg-white" />
                          <span className="wave-bar bg-white" />
                        </div>
                      </div>
                    ) : (
                      <Mic className="w-5 h-5" />
                    )}
                  </button>
                )}

                <input
                  type="text"
                  disabled={isListening}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder={
                    isListening ? "Listening... Speak now!" : "Type a message or click mic to speak..."
                  }
                  className="lf-input flex-1 p-3"
                />

                <Button variant="primary" size="md" disabled={isListening || !inputText.trim()} onClick={() => handleSendMessage()}>
                  <Send className="w-5 h-5 fill-current" />
                </Button>
              </div>

              {!speechSupported && (
                <p className="text-[10px] text-zinc-400 text-center font-bold">
                  ⚠️ Speech recognition is unsupported in your current browser. Keyboard inputs are fully supported!
                </p>
              )}
            </div>

          </Card>
        </div>

      </div>
    </AppLayout>
  );
}
