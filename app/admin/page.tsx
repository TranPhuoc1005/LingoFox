"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/mascot/Mascot";
import { useAppStore } from "@/store/useAppStore";
import {
  Users,
  BookOpen,
  GraduationCap,
  Sparkles,
  BarChart3,
  TrendingUp,
  FilePlus,
  Wand2,
  Trash,
  CheckCircle,
  HelpCircle
} from "lucide-react";

export default function AdminPanel() {
  const { addXp } = useAppStore();
  const [mascotBubble, setMascotBubble] = useState("Welcome to LingoFox Admin Headquarters! 🦊🛠️");
  
  // Form states for creating lesson
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("Vocabulary");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [stepsCount, setStepsCount] = useState(3);
  
  const [adminLogs, setAdminLogs] = useState<string[]>([
    "System initialized successfully.",
    "Database connected to postgresql://lingo_prod...",
    "Active voice server check: 3 healthy rooms."
  ]);

  const [aiGenerating, setAiGenerating] = useState(false);

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;

    const newLog = `Added course "${courseTitle}" (${difficulty} ${category}) successfully to PostgreSQL.`;
    setAdminLogs([newLog, ...adminLogs]);
    setMascotBubble(`Successfully published course: "${courseTitle}"! +50 Admin XP. 🦊🎓`);
    addXp(50);
    
    setCourseTitle("");
  };

  // Mock AI Generator
  const handleAILessonGenerate = () => {
    setAiGenerating(true);
    setMascotBubble("Contacting Kiko AI Generator engine... 🦊🧠");
    
    setTimeout(() => {
      setCourseTitle("AI-Generated Airport Travel Dialogue");
      setCategory("Daily Conversation");
      setDifficulty("Intermediate");
      setStepsCount(4);
      setAiGenerating(false);

      const newLog = "AI Engine generated dialogue course blueprint: 'Airport Travel Dialogue'.";
      setAdminLogs([newLog, ...adminLogs]);
      setMascotBubble("AI Lesson blueprints generated successfully! Review parameters below. 🦊✨");
    }, 1500);
  };

  const usersCount = 1420;
  const activeVoiceRooms = 3;
  const lessonsCount = 18;

  return (
    <AppLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: System Metrics & Logs */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="font-black text-lg text-slate-800 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-secondary" /> System Metrics
          </h3>

          <div className="grid grid-cols-1 gap-4">
            <Card className="p-5 flex items-center gap-4 dark:border-dark-border">
              <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-950/20 text-sky-600 flex items-center justify-center text-lg">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 block">Total Students</span>
                <span className="text-xl font-black text-slate-800 dark:text-white">{usersCount}</span>
              </div>
            </Card>

            <Card className="p-5 flex items-center gap-4 dark:border-dark-border">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/20 text-success flex items-center justify-center text-lg">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 block">Published Lessons</span>
                <span className="text-xl font-black text-slate-800 dark:text-white">{lessonsCount}</span>
              </div>
            </Card>

            <Card className="p-5 flex items-center gap-4 dark:border-dark-border">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/20 text-accent flex items-center justify-center text-lg">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 block">Mock Exams</span>
                <span className="text-xl font-black text-slate-800 dark:text-white">6</span>
              </div>
            </Card>
          </div>

          {/* Action Log Console */}
          <Card className="p-5 dark:border-dark-border flex flex-col h-[280px]">
            <h4 className="font-extrabold text-sm text-slate-800 dark:text-white mb-3">System Log Console</h4>
            <div className="flex-1 bg-zinc-950 p-4 rounded-2xl font-mono text-[10px] leading-relaxed text-emerald-400 overflow-y-auto space-y-1.5">
              {adminLogs.map((log, idx) => (
                <div key={idx} className="flex gap-1.5 items-start">
                  <span className="text-zinc-500 shrink-0">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* RIGHT TWO COLUMNS: Course Creation & AI Tools */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 dark:border-dark-border">
            
            {/* Header */}
            <div className="flex justify-between items-start gap-4 mb-6 border-b border-border dark:border-dark-border pb-4">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white">
                  Lesson & Course Creator
                </h1>
                <p className="text-sm font-semibold text-zinc-400 dark:text-zinc-500">
                  Publish courses directly into the learning database tree, or compile templates using our integrated AI tools.
                </p>
              </div>

              {/* AI Auto generator button */}
              <Button
                variant="outline"
                size="sm"
                disabled={aiGenerating}
                onClick={handleAILessonGenerate}
                className="border-primary text-primary hover:bg-primary-light flex items-center gap-1.5 font-black"
              >
                <Wand2 className="w-4 h-4" /> {aiGenerating ? "Generating..." : "AI Generate Course"}
              </Button>
            </div>

            {/* Creation Form */}
            <form onSubmit={handleCreateLesson} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Course Name */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Course Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter Course Title (e.g. Shopping vocabulary dialogue)"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    className="w-full p-3 rounded-xl border border-border dark:border-dark-border lf-input"
                  />
                </div>

                {/* Category Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 rounded-xl border border-border dark:border-dark-border lf-input"
                  >
                    <option>Vocabulary</option>
                    <option>Grammar</option>
                    <option>Listening</option>
                    <option>Speaking</option>
                    <option>Daily Conversation</option>
                  </select>
                </div>

                {/* Difficulty Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Target Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full p-3 rounded-xl border border-border dark:border-dark-border lf-input"
                  >
                    <option>Beginner</option>
                    <option>Elementary</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                    <option>TOEIC</option>
                    <option>IELTS</option>
                  </select>
                </div>

                {/* Steps Count */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Step Count</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={stepsCount}
                    onChange={(e) => setStepsCount(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-border dark:border-dark-border lf-input"
                  />
                </div>

              </div>

              {/* Submit actions */}
              <div className="flex justify-end pt-4 border-t border-border dark:border-dark-border mt-6">
                <Button variant="primary" type="submit" className="flex items-center gap-1.5">
                  <FilePlus className="w-5 h-5" /> Publish New Course
                </Button>
              </div>
            </form>
          </Card>

          {/* Interactive Mascot dashboard tips */}
          <Card className="p-4 flex items-center gap-4 dark:border-dark-border">
            <Mascot expression="happy" message={mascotBubble} size={85} speechBubblePosition="right" />
          </Card>
        </div>

      </div>
    </AppLayout>
  );
}
