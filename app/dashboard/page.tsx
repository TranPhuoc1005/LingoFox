"use client";

import React, { useState, useEffect } from "react";
import { apiGet } from "@/lib/api-client";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAppStore } from "@/store/useAppStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/mascot/Mascot";
import { Progress } from "@/components/ui/progress";
import {
  Flame,
  BookOpen,
  Trophy,
  ArrowRight,
  CheckCircle,
  Lock,
  Play,
  Calendar,
  Sparkles,
  Award
} from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const { stats, completedLessons } = useAppStore();
  const [mascotMsg, setMascotMsg] = useState(
    stats.dailyXpEarned >= stats.dailyGoal
      ? "Daily goal achieved! You are amazing! 🏆🦊"
      : `You're just ${stats.dailyGoal - stats.dailyXpEarned} XP away from your daily goal! Let's study! 🔥`
  );
  
  const [mascotExpr, setMascotExpr] = useState<"idle" | "happy" | "thinking">("idle");

  const [roadmapNodes, setRoadmapNodes] = useState<
    { id: string; title: string; subtitle: string; xp: number; difficulty: string; icon: string }[]
  >([]);

  useEffect(() => {
    apiGet<{ lessons: { slug: string; title: string; description: string | null; xpReward: number; difficulty: string; category: string }[] }>("/api/lessons")
      .then((res) => {
        const icons: Record<string, string> = { Vocabulary: "🍎", Grammar: "📝", Speaking: "🎙️", "Communication English": "☕" };
        setRoadmapNodes(
          res.lessons.map((l) => ({
            id: l.slug,
            title: l.title,
            subtitle: l.description ?? l.category,
            xp: l.xpReward,
            difficulty: l.difficulty,
            icon: icons[l.category] ?? "📚",
          }))
        );
      })
      .catch(console.error);
  }, []);

  const badgesList = [
    { id: "first_steps", title: "First Steps", desc: "Started the journey", icon: "🌱" },
    { id: "level_5", title: "Rising Star", desc: "Reached Level 5", icon: "⭐" },
    { id: "daily_goal", title: "Focused Mind", desc: "Hit Daily XP Goal", icon: "🎯" },
    { id: "test_taker", title: "Exam Master", desc: "Took an IELTS/TOEIC mock", icon: "🎓" }
  ];

  // SVG Chart data
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const xpEarnedPerDay = [15, 30, stats.dailyXpEarned, 0, 0, 0, 0]; // Simulating values for current week (Mon, Tue, Wed)

  const handleMascotClick = () => {
    setMascotExpr("happy");
    const quotes = [
      "Practice makes perfect! Did you speak English today? 🦊",
      "I believe in you! Every small step counts. ✨",
      "Duolingo has a green owl, but LingoFox has me! 🦊",
      "Remember to write down new vocabulary in your Notepad!",
      "Don't worry about mistakes. They are just stepping stones!"
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setMascotMsg(randomQuote);
    setTimeout(() => setMascotExpr("idle"), 2000);
  };

  return (
    <AppLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Main Progression Path & Roadmap */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Welcome Card */}
          <div className="relative overflow-hidden bg-gradient-to-r from-primary to-orange-400 text-white rounded-3xl p-8 shadow-xl shadow-primary/10">
            <div className="absolute right-0 bottom-0 opacity-15 translate-y-6 translate-x-4 scale-150">
              <BookOpen className="w-48 h-48" />
            </div>
            <div className="relative z-10 max-w-md">
              <span className="text-xs font-black bg-white/20 px-3 py-1.5 rounded-full uppercase tracking-wider">
                Let's study English!
              </span>
              <h1 className="text-3xl font-black mt-3 mb-2">Hello, English Cadet!</h1>
              <p className="text-sm font-bold text-orange-50/80 mb-6">
                You have maintained a {stats.streak}-day learning streak. The next suggested lesson is ready for you.
              </p>
              <Link href="/lessons/daily_conv_1">
                <Button variant="outline" className="!bg-card border-primary/30 shadow-md active:translate-y-[2px] transition-all">
                  Start Next Lesson <Play className="w-4 h-4 ml-1.5 fill-current" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Roadmap: Duolingo style progression nodes */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white">
                  Your Learning Roadmap
                </h3>
                <p className="text-sm font-bold text-zinc-400 dark:text-zinc-500">
                  Progression path from Zero to Advanced IELTS/TOEIC
                </p>
              </div>
              <div className="flex items-center gap-1 text-sm font-extrabold text-primary">
                <span>Map Mode</span>
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            <div className="relative border-l-4 border-dashed border-zinc-200 dark:border-slate-700 pl-8 ml-6 py-2 space-y-8">
              {roadmapNodes.map((node, index) => {
                const isCompleted = completedLessons.includes(node.id);
                // Node is unlocked if it's completed or if the previous node is completed, or it's the very first node
                const isUnlocked = isCompleted || index === 0 || completedLessons.includes(roadmapNodes[index - 1]?.id);

                return (
                  <div key={`${node.id}-${index}`} className="relative">
                    {/* Node marker bubble on line */}
                    <div
                      className={`absolute left-[-48px] top-1.5 w-9 h-9 rounded-full border-4 border-background dark:border-dark-bg flex items-center justify-center font-extrabold text-sm shadow-md
                        ${
                          isCompleted
                            ? "bg-success text-white"
                            : isUnlocked
                            ? "bg-primary text-white animate-pulse"
                            : "bg-zinc-300 dark:bg-slate-700 text-zinc-500"
                        }
                      `}
                    >
                      {isCompleted ? <CheckCircle className="w-5 h-5 fill-current" /> : index + 1}
                    </div>

                    <Card
                      className={`relative flex items-center justify-between p-5 dark:border-dark-border
                        ${!isUnlocked ? "opacity-60 bg-zinc-50 dark:bg-dark-card/40" : "hover:shadow-md transition-shadow"}
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl">
                          {node.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-lg text-slate-800 dark:text-white">
                              {node.title}
                            </h4>
                            <span
                              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md
                                ${
                                  node.difficulty === "Beginner"
                                    ? "bg-sky-100 text-sky-600 dark:bg-sky-950/20"
                                    : node.difficulty === "TOEIC"
                                    ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/20"
                                    : "bg-purple-100 text-purple-600 dark:bg-purple-950/20"
                                }
                              `}
                            >
                              {node.difficulty}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-zinc-400 dark:text-zinc-500">
                            {node.subtitle}
                          </p>
                        </div>
                      </div>

                      <div>
                        {isCompleted ? (
                          <Link href={`/lessons/${node.id}`}>
                            <Button variant="outline" size="sm" className="border-success text-success hover:bg-success/5">
                              Review
                            </Button>
                          </Link>
                        ) : isUnlocked ? (
                          <Link href={`/lessons/${node.id}`}>
                            <Button variant="primary" size="sm">
                              Start (+{node.xp} XP)
                            </Button>
                          </Link>
                        ) : (
                          <div className="p-2 bg-zinc-100 dark:bg-slate-800 rounded-xl text-zinc-400">
                            <Lock className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: User stats & Mascot encouragement */}
        <div className="space-y-8">
          
          {/* Active Mascot Widget */}
          <Card className="flex flex-col items-center text-center p-6 cursor-pointer select-none" onClick={handleMascotClick}>
            <Mascot expression={mascotExpr} message={mascotMsg} size={150} />
            <div className="mt-4">
              <h4 className="font-black text-slate-800 dark:text-white">Kiko (Your Tutor)</h4>
              <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500">Click on me to chat!</p>
            </div>
          </Card>

          {/* Daily Goal & Streak Card */}
          <Card className="p-6 dark:border-dark-border">
            <h3 className="font-black text-lg text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-accent" /> Daily XP Goal
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm font-extrabold text-zinc-500 dark:text-zinc-400">
                <span>Today's Progress</span>
                <span className="text-primary font-black">
                  {stats.dailyXpEarned} / {stats.dailyGoal} XP
                </span>
              </div>
              <Progress value={stats.dailyXpEarned} max={stats.dailyGoal} color="primary" />

              <div className="flex items-center gap-3 pt-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                <Calendar className="w-4 h-4 text-primary" />
                <span>Streak ends at midnight if you miss today!</span>
              </div>
            </div>
          </Card>

          {/* Weekly Activity Custom SVG Chart */}
          <Card className="p-6 dark:border-dark-border">
            <h3 className="font-black text-lg text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-secondary" /> Study Activity
            </h3>
            
            <div className="h-32 w-full flex items-end justify-between pt-4 px-2">
              {daysOfWeek.map((day, i) => {
                const heightPercent = Math.min(100, (xpEarnedPerDay[i] / stats.dailyGoal) * 100);
                const isActiveDay = xpEarnedPerDay[i] > 0;
                
                return (
                  <div key={day} className="flex flex-col items-center flex-1 gap-2">
                    <div className="w-6 bg-zinc-100 dark:bg-slate-700 h-20 rounded-lg flex items-end overflow-hidden relative">
                      <div
                        className={`w-full rounded-lg ${isActiveDay ? "bg-secondary" : "bg-zinc-300 dark:bg-slate-700"}`}
                        style={{ height: `${heightPercent || 5}%` }}
                      />
                    </div>
                    <span className="text-xs font-black text-zinc-400 dark:text-zinc-500">{day}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Unlocked Badges */}
          <Card className="p-6 dark:border-dark-border">
            <h3 className="font-black text-lg text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" /> Achievement Badges
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {badgesList.map((badge) => {
                const isUnlocked = stats.badges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    title={`${badge.title}: ${badge.desc}`}
                    className={`aspect-square rounded-2xl border-2 flex items-center justify-center text-2xl relative
                      ${
                        isUnlocked
                          ? "border-accent bg-amber-500/10 grayscale-0"
                          : "border-zinc-200 bg-zinc-50 dark:border-slate-800 dark:bg-dark-card grayscale opacity-45"
                      }
                    `}
                  >
                    {badge.icon}
                    {isUnlocked && (
                      <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-accent animate-ping-slow" />
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

        </div>
      </div>
    </AppLayout>
  );
}
