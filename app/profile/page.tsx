"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore, AvatarConfig } from "@/store/useAppStore";
import { Mascot } from "@/components/mascot/Mascot";
import { Progress } from "@/components/ui/progress";
import { Award, ShieldAlert, Sparkles, BookOpen, Flame, Settings, User } from "lucide-react";

export default function Profile() {
  const { stats, updateAvatar } = useAppStore();

  const [mascotBubble, setMascotBubble] = useState("Looking sharp! You can customize your avatar style here. 🦊👔");

  // Selection configurations
  const hats: { id: AvatarConfig["hat"]; label: string; icon: string }[] = [
    { id: "none", label: "No Hat", icon: "❌" },
    { id: "cap", label: "Graduate", icon: "🎓" },
    { id: "glasses", label: "Cool Glasses", icon: "🕶️" },
    { id: "crown", label: "Crown", icon: "👑" },
    { id: "headphones", label: "Headphones", icon: "🎧" },
    { id: "chef", label: "Chef Hat", icon: "👩‍🍳" }
  ];

  const outfits: { id: AvatarConfig["outfit"]; label: string; icon: string }[] = [
    { id: "none", label: "No Outfit", icon: "❌" },
    { id: "scarf", label: "Winter Scarf", icon: "🧣" },
    { id: "suit", label: "Formal Suit", icon: "👔" },
    { id: "hoodie", label: "Hoodie", icon: "🧥" },
    { id: "superhero", label: "Super Cape", icon: "🦸" }
  ];

  const accessories: { id: AvatarConfig["accessory"]; label: string; icon: string }[] = [
    { id: "none", label: "No Accessory", icon: "❌" },
    { id: "book", label: "Study Book", icon: "📘" },
    { id: "star", label: "Lucky Star", icon: "⭐" },
    { id: "cookie", label: "Cookie", icon: "🍪" },
    { id: "balloon", label: "Balloon", icon: "🎈" }
  ];

  const bgColors = [
    { name: "Orange", hex: "#ff8f3d" },
    { name: "Purple", hex: "#8b5cf6" },
    { name: "Blue", hex: "#0ea5e9" },
    { name: "Pink", hex: "#ec4899" },
    { name: "Green", hex: "#10b981" }
  ];

  const badgesList = [
    { id: "first_steps", title: "First Steps", desc: "Started the learning journey", icon: "🌱" },
    { id: "level_5", title: "Rising Star", desc: "Reached Level 5 Cadet status", icon: "⭐" },
    { id: "daily_goal", title: "Focused Mind", desc: "Hit Daily XP Goal in a study session", icon: "🎯" },
    { id: "test_taker", title: "Exam Master", desc: "Completed an IELTS or TOEIC mock exam", icon: "🎓" }
  ];

  // Dynamic Avatar SVG compiler
  const renderAvatarPreview = () => {
    const config = stats.avatar;

    return (
      <svg
        viewBox="0 0 120 120"
        className="w-full max-w-[200px] aspect-square rounded-3xl border-4 border-white dark:border-slate-800 shadow-xl"
        style={{ backgroundColor: config.backgroundColor || "#ff8f3d" }}
      >
        {/* Shadow */}
        <ellipse cx="60" cy="108" rx="28" ry="5" fill="rgba(0,0,0,0.15)" />

        {/* Tail (Orange with white tip) */}
        <path d="M 75,85 Q 98,72 95,52 Q 91,40 82,58 Z" fill="#e07424" />
        <path d="M 95,52 Q 93,46 88,48 Q 84,51 82,58 Q 90,56 95,52 Z" fill="#ffffff" />

        {/* Ears */}
        <path d="M 28,45 L 42,20 L 50,42 Z" fill="#e07424" />
        <path d="M 32,41 L 40,25 L 45,39 Z" fill="#fda4af" />
        <path d="M 92,45 L 78,20 L 70,42 Z" fill="#e07424" />
        <path d="M 88,41 L 80,25 L 75,39 Z" fill="#fda4af" />

        {/* Head */}
        <path d="M 30,65 C 30,50 42,42 60,42 C 78,42 90,50 90,65 C 90,80 80,88 60,88 C 40,88 30,80 30,65 Z" fill="#ff8f3d" />
        {/* Cheeks */}
        <path d="M 30,65 C 30,73 36,82 46,82 C 54,82 56,76 60,76 C 64,76 66,82 74,82 C 84,82 90,73 90,65 C 90,59 87,67 74,70 C 64,72 56,72 46,70 C 33,67 30,59 30,65 Z" fill="#ffffff" />

        {/* Eyes (Cute curved arches) */}
        <ellipse cx="48" cy="58" rx="4" ry="5" fill="#475569" />
        <ellipse cx="72" cy="58" rx="4" ry="5" fill="#475569" />
        <circle cx="47" cy="56" r="1.5" fill="white" />
        <circle cx="71" cy="56" r="1.5" fill="white" />

        {/* Nose */}
        <polygon points="58,65 62,65 60,67" fill="#475569" />
        {/* Mouth */}
        <path d="M 56,70 Q 60,74 64,70" stroke="#475569" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* DYNAMIC HAT RENDERS */}
        {config.hat === "cap" && (
          <g>
            <polygon points="60,12 85,20 60,28 35,20" fill="#1e293b" />
            <path d="M 48,22 Q 60,25 72,22 L 72,25 Q 60,28 48,25 Z" fill="#0f172a" />
            <line x1="60" y1="20" x2="38" y2="26" stroke="#ffc83b" strokeWidth="1.5" />
            <circle cx="38" cy="26" r="2.5" fill="#ffc83b" />
          </g>
        )}
        {config.hat === "glasses" && (
          <g>
            <rect x="36" y="52" width="48" height="10" rx="2" fill="rgba(15,23,42,0.8)" />
            <circle cx="47" cy="57" r="7" stroke="#1e293b" strokeWidth="2.5" fill="rgba(56,189,248,0.3)" />
            <circle cx="73" cy="57" r="7" stroke="#1e293b" strokeWidth="2.5" fill="rgba(56,189,248,0.3)" />
          </g>
        )}
        {config.hat === "crown" && (
          <g>
            <polygon points="40,25 45,12 60,20 75,12 80,25" fill="#ffc83b" stroke="#d97706" strokeWidth="1" />
            <circle cx="45" cy="11" r="1.5" fill="#ef4444" />
            <circle cx="60" cy="19" r="1.5" fill="#3b82f6" />
            <circle cx="75" cy="11" r="1.5" fill="#ef4444" />
          </g>
        )}
        {config.hat === "headphones" && (
          <g>
            {/* Band */}
            <path d="M 38,40 Q 60,25 82,40" stroke="#a855f7" strokeWidth="5" fill="none" />
            {/* Ear cups */}
            <rect x="30" y="44" width="10" height="18" rx="4" fill="#7c3aed" />
            <rect x="80" y="44" width="10" height="18" rx="4" fill="#7c3aed" />
          </g>
        )}
        {config.hat === "chef" && (
          <g>
            <path d="M 45,28 C 40,16 52,10 60,14 C 68,10 80,16 75,28 Z" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
            <rect x="46" y="24" width="28" height="8" fill="#e2e8f0" rx="1" />
          </g>
        )}

        {/* DYNAMIC OUTFIT RENDERS */}
        {config.outfit === "scarf" && (
          <g>
            {/* Main neck scarf */}
            <path d="M 42,84 Q 60,92 78,84 L 74,90 Q 60,96 46,90 Z" fill="#ef4444" />
            {/* Hanging piece */}
            <path d="M 68,88 L 74,106 L 62,104 Z" fill="#dc2626" />
          </g>
        )}
        {config.outfit === "suit" && (
          <g>
            {/* Collar */}
            <path d="M 44,88 L 76,88 L 60,108 Z" fill="#1e293b" />
            {/* White shirt triangle */}
            <polygon points="54,88 66,88 60,98" fill="#ffffff" />
            {/* Red Tie */}
            <polygon points="59,96 61,96 62,106 60,108 58,106" fill="#ef4444" />
          </g>
        )}
        {config.outfit === "hoodie" && (
          <g>
            {/* Hoodie vest shoulders */}
            <path d="M 38,88 C 38,82 45,80 60,80 C 75,80 82,82 82,88 L 82,108 C 82,108 80,110 60,110 C 40,110 38,108 38,108 Z" fill="#3b82f6" />
            {/* Drawstrings */}
            <line x1="53" y1="84" x2="53" y2="98" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            <line x1="67" y1="84" x2="67" y2="98" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}
        {config.outfit === "superhero" && (
          <g>
            {/* Back cape shoulders showing */}
            <path d="M 30,88 Q 60,78 90,88 L 95,115 Q 60,112 25,115 Z" fill="#f43f5e" />
            {/* Star badge in front */}
            <polygon points="60,88 61.5,91 64.5,91 62,93 63,96 60,94 57,96 58,93 55,91 58.5,91" fill="#ffc83b" />
          </g>
        )}

        {/* DYNAMIC ACCESSORY RENDERS */}
        {config.accessory === "book" && (
          <g>
            {/* Book rectangle standing */}
            <rect x="25" y="80" width="18" height="24" rx="2" fill="#0284c7" />
            <rect x="23" y="82" width="4" height="20" rx="1" fill="#bae6fd" />
            <line x1="28" y1="88" x2="38" y2="88" stroke="#ffffff" strokeWidth="2" />
            <line x1="28" y1="94" x2="38" y2="94" stroke="#ffffff" strokeWidth="2" />
          </g>
        )}
        {config.accessory === "star" && (
          <g>
            <polygon points="32,74 34.5,82 42,82 36,86 38.5,94 32,89 25.5,94 28,86 22,82 29.5,82" fill="#ffc83b" stroke="#d97706" strokeWidth="1" />
          </g>
        )}
        {config.accessory === "cookie" && (
          <g>
            <circle cx="30" cy="92" r="10" fill="#d97706" />
            {/* Chocolate chips */}
            <circle cx="26" cy="88" r="1.5" fill="#451a03" />
            <circle cx="34" cy="90" r="1.5" fill="#451a03" />
            <circle cx="28" cy="96" r="1.5" fill="#451a03" />
            <circle cx="33" cy="95" r="1.5" fill="#451a03" />
          </g>
        )}
        {config.accessory === "balloon" && (
          <g>
            {/* Balloon string */}
            <path d="M 28,95 Q 24,105 28,115" stroke="#94a3b8" strokeWidth="1" fill="none" />
            {/* Balloon body */}
            <ellipse cx="28" cy="80" rx="10" ry="13" fill="#ec4899" />
            {/* Highlight */}
            <ellipse cx="25" cy="74" rx="3" ry="5" fill="rgba(255,255,255,0.4)" />
          </g>
        )}
      </svg>
    );
  };

  return (
    <AppLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Profile Stats & Badges */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* User Quick Info */}
          <Card className="p-6 text-center dark:border-dark-border flex flex-col items-center gap-4">
            <div className="relative">
              {renderAvatarPreview()}
              <div className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-2xl font-black text-xs border-2 border-white shadow-md">
                Lvl {stats.level}
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white">You (Fox Cadet)</h2>
              <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mt-0.5">
                Active Streak: {stats.streak} Days
              </span>
            </div>

            <div className="w-full border-t border-border dark:border-dark-border pt-4 grid grid-cols-2 gap-4">
              <div className="text-center">
                <span className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 block">Total XP</span>
                <span className="text-xl font-black text-primary mt-1 block">{(stats.level - 1) * 150 + stats.xp}</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 block">Badges</span>
                <span className="text-xl font-black text-secondary mt-1 block">{stats.badges.length} / 4</span>
              </div>
            </div>
          </Card>

          {/* Badges Checklist */}
          <Card className="p-6 dark:border-dark-border">
            <h3 className="font-black text-lg text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" /> Achievement Badges
            </h3>

            <div className="space-y-4">
              {badgesList.map((badge) => {
                const isUnlocked = stats.badges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`flex items-center gap-4 p-3 rounded-2xl border-2 transition-all
                      ${
                        isUnlocked
                          ? "border-accent/30 bg-amber-500/5"
                          : "border-border dark:border-dark-border opacity-50 bg-zinc-50/50 dark:bg-dark-card/30"
                      }
                    `}
                  >
                    <div className="text-3xl shrink-0">{badge.icon}</div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                        {badge.title}
                        {isUnlocked ? (
                          <span className="text-[9px] font-black uppercase bg-emerald-500/10 text-success px-2 py-0.5 rounded-md">
                            Unlocked
                          </span>
                        ) : (
                          <span className="text-[9px] font-black uppercase bg-zinc-200 dark:bg-slate-800 text-zinc-400 px-2 py-0.5 rounded-md">
                            Locked
                          </span>
                        )}
                      </h4>
                      <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 leading-normal mt-0.5">
                        {badge.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

        </div>

        {/* RIGHT TWO COLUMNS: Custom Avatar Editor */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 dark:border-dark-border flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white">
                  Avatar Customizer
                </h1>
                <p className="text-sm font-semibold text-zinc-400 dark:text-zinc-500">
                  Select hats, outfits, and accessory sets to dress up your cadet avatar. Saved automatically!
                </p>
              </div>

              {/* Background Color selector */}
              <div className="space-y-2">
                <span className="text-xs font-black text-zinc-400 uppercase tracking-widest block">Background Color</span>
                <div className="flex gap-2">
                  {bgColors.map((color) => {
                    const isSelected = stats.avatar.backgroundColor === color.hex;
                    return (
                      <button
                        key={color.name}
                        onClick={() => {
                          updateAvatar({ backgroundColor: color.hex });
                          setMascotBubble(`Awesome! That ${color.name} background looks lovely. 🦊✨`);
                        }}
                        className={`w-10 h-10 rounded-full border-4 cursor-pointer transition-all hover:scale-105 active:scale-95
                          ${isSelected ? "border-slate-800 dark:border-white scale-110" : "border-transparent"}
                        `}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Hats Select Grid */}
              <div className="space-y-2">
                <span className="text-xs font-black text-zinc-400 uppercase tracking-widest block">Headwear / Hats</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {hats.map((hat) => {
                    const isSelected = stats.avatar.hat === hat.id;
                    return (
                      <button
                        key={hat.id}
                        onClick={() => {
                          updateAvatar({ hat: hat.id });
                          setMascotBubble(`That ${hat.label} fits you perfectly! 🎓🦊`);
                        }}
                        className={`p-3 rounded-2xl border-2 font-black text-xs transition-all flex items-center gap-2 cursor-pointer
                          ${
                            isSelected
                              ? "border-primary bg-primary-light/50 text-slate-800 dark:text-white"
                              : "lf-choice text-muted-foreground"
                          }
                        `}
                      >
                        <span className="text-lg">{hat.icon}</span>
                        <span>{hat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Outfits selector */}
              <div className="space-y-2">
                <span className="text-xs font-black text-zinc-400 uppercase tracking-widest block">Outfits / Clothing</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {outfits.map((outfit) => {
                    const isSelected = stats.avatar.outfit === outfit.id;
                    return (
                      <button
                        key={outfit.id}
                        onClick={() => {
                          updateAvatar({ outfit: outfit.id });
                          setMascotBubble(`Looking very stylish in that ${outfit.label}! 🧣🦊`);
                        }}
                        className={`p-3 rounded-2xl border-2 font-black text-xs transition-all flex items-center gap-2 cursor-pointer
                          ${
                            isSelected
                              ? "border-primary bg-primary-light/50 text-slate-800 dark:text-white"
                              : "lf-choice text-muted-foreground"
                          }
                        `}
                      >
                        <span className="text-lg">{outfit.icon}</span>
                        <span>{outfit.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Accessories selector */}
              <div className="space-y-2">
                <span className="text-xs font-black text-zinc-400 uppercase tracking-widest block">Accessories</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {accessories.map((acc) => {
                    const isSelected = stats.avatar.accessory === acc.id;
                    return (
                      <button
                        key={acc.id}
                        onClick={() => {
                          updateAvatar({ accessory: acc.id });
                          setMascotBubble(`Nice choice! The ${acc.label} represents your cadet profile. 🦊`);
                        }}
                        className={`p-3 rounded-2xl border-2 font-black text-xs transition-all flex items-center gap-2 cursor-pointer
                          ${
                            isSelected
                              ? "border-primary bg-primary-light/50 text-slate-800 dark:text-white"
                              : "lf-choice text-muted-foreground"
                          }
                        `}
                      >
                        <span className="text-lg">{acc.icon}</span>
                        <span>{acc.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </Card>

          {/* Interactive Mascot feedback */}
          <Card className="p-4 flex items-center gap-4 dark:border-dark-border">
            <Mascot expression="happy" message={mascotBubble} size={90} speechBubblePosition="right" />
          </Card>
        </div>

      </div>
    </AppLayout>
  );
}
