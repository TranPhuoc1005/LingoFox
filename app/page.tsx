"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mascot } from "@/components/mascot/Mascot";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Trophy, BookOpen, GraduationCap, ArrowRight, Star, Flame, NotepadText } from "lucide-react";

export default function LandingPage() {
  const [particles, setParticles] = useState<{ id: number; left: string; delay: string; size: string }[]>([]);

  useEffect(() => {
    // Generate simple floating particles client-side
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 12}s`,
      size: `${Math.random() * 12 + 6}px`,
    }));
    setParticles(newParticles);
  }, []);

  const features = [
    {
      icon: Sparkles,
      color: "text-primary bg-primary-light",
      title: "AI Speaking Partner",
      desc: "Simulate real conversations (Cafe, Interviews, Traveling) with real-time accent checks."
    },
    {
      icon: NotepadText,
      color: "text-secondary bg-purple-100 dark:bg-purple-950/30",
      title: "Split-Screen Notepad",
      desc: "Take Notion-like notes alongside every lesson. Highlights and vocabulary save instantly."
    },
    {
      icon: Trophy,
      color: "text-accent bg-amber-100 dark:bg-amber-950/30",
      title: "Gaming Progression",
      desc: "Earn XP, unlock cute badges, and rank up in weekly competitive leagues like Duolingo."
    },
    {
      icon: GraduationCap,
      color: "text-info bg-sky-100 dark:bg-sky-950/30",
      title: "IELTS / TOEIC Paths",
      desc: "Structured roadmaps leading from complete zero to professional certification exams."
    }
  ];

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-dark-bg overflow-hidden flex flex-col font-sans">
      {/* Background Particles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] bg-secondary/15 rounded-full blur-[140px]" />
        {particles.map((p) => (
          <div
            key={p.id}
            className="floating-particle"
            style={{
              left: p.left,
              animationDelay: p.delay,
              width: p.size,
              height: p.size,
              top: "100%",
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-black text-white text-xl shadow-md shadow-primary/20">
            🦊
          </div>
          <span className="text-xl font-black tracking-tight text-slate-800 dark:text-white">
            Lingo<span className="text-primary">Fox</span>
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Link href="/auth/login">
            <Button variant="ghost" size="sm">Log in</Button>
          </Link>
          <Link href="/auth/register">
            <Button variant="outline" size="sm">
              Sign up <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-7xl mx-auto px-6 py-8 md:py-16 text-center">
        {/* Floating Little Star Decor */}
        <motion.div
          animate={{ rotate: 360, y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 8 }}
          className="hidden md:block absolute left-[15%] top-[25%] text-accent"
        >
          <Star className="w-8 h-8 fill-accent" />
        </motion.div>
        
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
          className="hidden md:block absolute right-[15%] bottom-[30%] text-secondary"
        >
          <Flame className="w-9 h-9 fill-secondary/20" />
        </motion.div>

        {/* Mascot Center Welcome */}
        <div className="mb-8 flex flex-col items-center">
          <Mascot
            expression="happy"
            message="Welcome, cadet! 🦊 Ready to level up your English skills?"
            size={180}
            speechBubblePosition="top"
          />
        </div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black tracking-tight text-slate-800 dark:text-white max-w-3xl leading-[1.1] mb-6"
        >
          The Cute, Gaming Way to Master <span className="text-primary underline decoration-wavy decoration-accent">English</span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-slate-600 dark:text-zinc-300 text-lg md:text-xl max-w-xl mb-10 leading-relaxed font-bold"
        >
          From absolute beginner zero to advanced IELTS 7.5+ and TOEIC 900. Learn, chat, write, and play with Kiko the Fox!
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="flex flex-col sm:flex-row gap-4 mb-16 justify-center w-full max-w-md"
        >
          <Link href="/auth/register" className="flex-1">
            <Button variant="primary" size="lg" className="w-full justify-center text-lg py-4">
              Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/dashboard?demo=true" className="flex-1">
            <Button variant="outline" size="lg" className="w-full justify-center text-lg py-4">
              Try Demo Class
            </Button>
          </Link>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-8">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.3 }}
              >
                <Card className="h-full text-left flex flex-col p-6 hover:shadow-xl dark:border-dark-border" hoverRaise>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${feat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-800 dark:text-white mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Footer bar */}
      <footer className="relative z-10 bg-slate-100 dark:bg-dark-card border-t border-zinc-200 dark:border-dark-border py-8 text-center text-xs font-bold text-muted-foreground mt-16">
        <p>© 2026 LingoFox Education Inc. Built for students worldwide. Let's make learning magical! ✨🦊</p>
      </footer>
    </div>
  );
}
