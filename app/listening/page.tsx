"use client";

import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { Volume2, Play, Clock, BarChart, Sparkles, Headphones, Award } from "lucide-react";
import Link from "next/link";

interface ListeningTrack {
  id: string;
  title: string;
  topic: string;
  level: string;
  accent: string;
  duration: string;
  questionsCount: number;
  xpValue: number;
  speaker: string;
  description: string;
  emoji: string;
}

export default function ListeningLandingPage() {
  const { completedLessons } = useAppStore();
  const [tracks, setTracks] = useState<ListeningTrack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("@/lib/api-client").then(({ apiGet }) => {
      apiGet<{ exercises: any[] }>("/api/listening")
        .then((res) => {
          const mapped = res.exercises.map((e) => {
            const type = e.type;
            const topic = type === "dictation" ? "Daily Dictation" : type === "multiple_choice" ? "Travel & Announcements" : "Leisure & Outdoors";
            const emoji = type === "dictation" ? "☕" : type === "multiple_choice" ? "💻" : "🐨";
            const accentLabel = e.accent === "US" ? "US (New York)" : e.accent === "UK" ? "UK (London)" : e.accent === "AU" ? "Australian (Sydney)" : "Indian (Mumbai)";
            
            return {
              id: e.id,
              title: e.title,
              topic: topic,
              level: e.difficulty,
              accent: accentLabel,
              duration: type === "dictation" ? "1:00" : type === "multiple_choice" ? "2:00" : "1:30",
              questionsCount: type === "multiple_choice" ? 1 : 1,
              xpValue: e.xpReward,
              speaker: e.accent === "US" ? "Marcus" : e.accent === "UK" ? "Clara" : e.accent === "AU" ? "Liam" : "Amit",
              emoji: emoji,
              description: e.audioText || "Listen to a live recording and answer high-quality interactive exercises.",
            };
          });
          setTracks(mapped);
        })
        .catch((err) => {
          console.error(err);
          // Static fallback
          setTracks([
            {
              id: "listening_track_1",
              title: "Cozy Morning Café Conversation",
              topic: "Daily Life & Dining",
              level: "Intermediate",
              accent: "UK (London)",
              duration: "2:45",
              questionsCount: 4,
              xpValue: 60,
              speaker: "Clara",
              emoji: "☕",
              description: "Listen to a lively British conversation between a barista and a regular customer discussing coffee origins, weekend plans, and baked treats."
            },
            {
              id: "listening_track_2",
              title: "Tech Startup Team Standup",
              topic: "Business & Technology",
              level: "Advanced",
              accent: "US (New York)",
              duration: "3:15",
              questionsCount: 5,
              xpValue: 80,
              speaker: "Marcus",
              emoji: "💻",
              description: "A fast-paced American startup meeting discussing deployment bottlenecks, UX design sprint cycles, and cloud migration schedules."
            },
            {
              id: "listening_track_3",
              title: "Wild Outback Wildlife Report",
              topic: "Nature & Travel",
              level: "Beginner",
              accent: "Australian (Sydney)",
              duration: "1:50",
              questionsCount: 3,
              xpValue: 40,
              speaker: "Liam",
              emoji: "🐨",
              description: "An easy-to-follow Australian commentary introducing unique marsupials in the blue mountains and eco-tourism safety tips."
            }
          ]);
        })
        .finally(() => setLoading(false));
    });
  }, []);

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-3xl p-8 shadow-xl shadow-indigo-500/10">
          <div className="absolute right-0 bottom-0 opacity-10 translate-y-6 translate-x-4 scale-150">
            <Headphones className="w-56 h-56" />
          </div>
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="text-xs font-black bg-white/20 px-3 py-1.5 rounded-full uppercase tracking-wider">
              Audio Lab
            </span>
            <h1 className="text-3xl sm:text-4xl font-black">AI Listening Studio</h1>
            <p className="text-sm font-bold text-violet-100/90 leading-relaxed">
              Accelerate your English comprehension by tuning in to multiple regional accents. Engage in real-time dictation, split-screen note-taking, and active multiple-choice analysis!
            </p>
          </div>
        </div>

        {/* Listings */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white">Active Audio Workbooks</h2>
              <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500">Pick an accent and start practicing deep comprehension</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-black text-violet-600 dark:text-violet-400">
              <span>All Accents Unlocked</span>
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          {loading ? (
            <p className="font-bold text-muted-foreground">Loading exercises...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tracks.map((track) => (
                <Card key={track.id} className="p-6 border-2 flex flex-col justify-between dark:border-dark-border group hover:border-violet-400 dark:hover:border-violet-600 transition-colors">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="text-3xl">{track.emoji}</div>
                      <span
                        className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-md
                          ${
                            track.level === "Beginner"
                              ? "bg-sky-100 text-sky-600 dark:bg-sky-950/20"
                              : track.level === "Intermediate"
                              ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/20"
                              : "bg-purple-100 text-purple-600 dark:bg-purple-950/20"
                          }
                        `}
                    >
                      {track.level}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-extrabold text-lg text-slate-800 dark:text-white leading-snug group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      {track.title}
                    </h3>
                    <p className="text-xs font-black text-zinc-400 dark:text-zinc-500">
                      {track.topic}
                    </p>
                  </div>

                  <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 leading-relaxed line-clamp-3">
                    {track.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border dark:border-dark-border space-y-4">
                  <div className="flex justify-between items-center text-xs font-bold text-zinc-400">
                    <span className="flex items-center gap-1 bg-zinc-100 dark:bg-dark-card px-2 py-1 rounded-md text-[10px]">
                      Accent: <strong className="text-slate-600 dark:text-zinc-350">{track.accent}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {track.duration}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold text-violet-600 dark:text-violet-400 flex items-center gap-1">
                      <Award className="w-4 h-4" /> +{track.xpValue} XP
                    </span>
                    <Link href={`/listening/${track.id}`}>
                      <Button variant="primary" size="sm" className="flex items-center gap-1 text-xs">
                        Start Practice <Play className="w-3.5 h-3.5 fill-current" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
