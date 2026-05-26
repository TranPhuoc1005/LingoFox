"use client";

import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/store/useAppStore";
import { Mascot } from "@/components/mascot/Mascot";
import { Progress } from "@/components/ui/progress";
import { Trophy, Award, Flame, Zap, Shield, ArrowUp, Info } from "lucide-react";

interface LeaderboardUser {
  rank: number;
  name: string;
  level: number;
  xp: number;
  streak: number;
  badgeIcon?: string;
  isSelf?: boolean;
}

export default function Leaderboard() {
  const { stats } = useAppStore();
  const [activeLeague, setActiveLeague] = useState<"Gold" | "Diamond" | "Bronze">("Gold");
  const [dbUsers, setDbUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("@/lib/api-client").then(({ apiGet }) => {
      apiGet<{ leaderboard: any[] }>("/api/leaderboard")
        .then((res) => {
          setDbUsers(res.leaderboard);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    });
  }, []);

  const getActiveLeagueUsers = () => {
    // Partition based on XP
    const filtered = dbUsers.filter((u) => {
      if (activeLeague === "Diamond") return u.xp >= 1000;
      if (activeLeague === "Gold") return u.xp >= 300 && u.xp < 1000;
      return u.xp < 300;
    });

    const defaults = {
      Bronze: [
        { rank: 1, name: "David Miller", level: 3, xp: 220, streak: 5 },
        { rank: 2, name: "Lily Smith", level: 2, xp: 180, streak: 4 },
        { rank: 3, name: "Lucas Brown", level: 2, xp: 90, streak: 2 },
      ],
      Gold: [
        { rank: 1, name: "Jennie_Learn", level: 6, xp: 740, streak: 12, badgeIcon: "⚡" },
        { rank: 2, name: "Sophia Grey", level: 4, xp: 530, streak: 15, badgeIcon: "⭐" },
        { rank: 3, name: "Carlos R.", level: 3, xp: 380, streak: 3 },
        { rank: 4, name: "Sarah M.", level: 3, xp: 340, streak: 6 },
      ],
      Diamond: [
        { rank: 1, name: "Master Linguist", level: 15, xp: 1840, streak: 58, badgeIcon: "👑" },
        { rank: 2, name: "Polyglot Sam", level: 12, xp: 1510, streak: 42, badgeIcon: "💫" },
        { rank: 3, name: "Emma Johnson", level: 10, xp: 1280, streak: 31, badgeIcon: "🛡️" },
        { rank: 4, name: "Daniel K.", level: 9, xp: 1100, streak: 19 }
      ]
    };

    // Map db users
    const mappedDb = filtered.map((u) => {
      const isSelf = u.id === stats.id || u.name?.includes("You") || u.name?.includes("Cadet");
      return {
        rank: 0,
        name: isSelf ? "You (Fox Cadet)" : u.name || "Anonymous User",
        level: u.level || 1,
        xp: u.xp || 0,
        streak: u.streak || 0,
        badgeIcon: u.name === "Alex The Fox" ? "🦊" : undefined,
        isSelf
      };
    });

    // Merge static default list to ensure a rich populated league
    const merged: LeaderboardUser[] = [...mappedDb];
    defaults[activeLeague].forEach((def) => {
      if (!merged.some((m) => m.name === def.name)) {
        merged.push(def);
      }
    });

    // Add current user if not present in any list to ensure they always see themselves
    const hasSelf = merged.some((m) => m.isSelf);
    if (!hasSelf && activeLeague === "Gold") {
      merged.push({
        rank: 0,
        name: "You (Fox Cadet)",
        level: stats.level,
        xp: stats.xp + 300,
        streak: stats.streak,
        badgeIcon: "🌱",
        isSelf: true
      });
    }

    // Sort descending by XP and assign dynamic ranks
    return merged
      .sort((a, b) => b.xp - a.xp)
      .map((u, i) => ({ ...u, rank: i + 1 }));
  };

  const getRankMedal = (rank: number) => {
    switch (rank) {
      case 1:
        return <span className="text-xl">🥇</span>;
      case 2:
        return <span className="text-xl">🥈</span>;
      case 3:
        return <span className="text-xl">🥉</span>;
      default:
        return <span className="text-sm font-black text-zinc-400 dark:text-zinc-500">#{rank}</span>;
    }
  };

  const weeklyGoalTarget = 400;
  const currentWeeklyXp = stats.xp + stats.dailyXpEarned;

  return (
    <AppLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT TWO COLUMNS: Rankings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">
                Ranks & Leagues
              </h1>
              <p className="text-sm font-semibold text-zinc-400 dark:text-zinc-500">
                Compete with students globally. Earn XP to climb to Diamond League!
              </p>
            </div>

            {/* League Tabs */}
            <div className="flex gap-1.5 bg-zinc-100 dark:bg-dark-card p-1.5 rounded-2xl border border-border dark:border-dark-border">
              {(["Bronze", "Gold", "Diamond"] as const).map((league) => (
                <button
                  key={league}
                  onClick={() => setActiveLeague(league)}
                  className={`px-4 py-2 font-black text-xs rounded-xl cursor-pointer transition-colors
                    ${
                      activeLeague === league
                        ? "bg-primary text-white"
                        : "text-zinc-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-white"
                    }
                  `}
                >
                  {league} League
                </button>
              ))}
            </div>
          </div>

          {/* Leaderboard Table List */}
          <Card className="p-4 dark:border-dark-border overflow-hidden">
            <div className="space-y-2">
              
              {/* Header Titles */}
              <div className="flex justify-between items-center text-xs font-black text-zinc-400 dark:text-zinc-500 px-4 py-2 border-b border-border dark:border-dark-border">
                <div className="flex items-center gap-6">
                  <span className="w-8 text-center">Rank</span>
                  <span>User Name</span>
                </div>
                <div className="flex items-center gap-10">
                  <span className="w-12 text-center">Streak</span>
                  <span className="w-16 text-right">Weekly XP</span>
                </div>
              </div>

              {/* Users Row Listings */}
              {getActiveLeagueUsers().map((user) => (
                <div
                  key={user.name}
                  className={`flex justify-between items-center px-4 py-3 rounded-2xl border-2 transition-all
                    ${
                      user.isSelf
                        ? "border-primary bg-primary-light/40 dark:bg-dark-card/60"
                        : "border-transparent hover:bg-zinc-50 dark:hover:bg-slate-700"
                    }
                  `}
                >
                  <div className="flex items-center gap-6">
                    {/* Rank */}
                    <div className="w-8 flex items-center justify-center">
                      {getRankMedal(user.rank)}
                    </div>

                    {/* Profile */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-xs">
                        {user.badgeIcon || user.name[0]}
                      </div>
                      <div>
                        <span className={`font-extrabold text-sm flex items-center gap-1.5
                          ${user.isSelf ? "text-primary font-black" : "text-slate-800 dark:text-zinc-200"}
                        `}>
                          {user.name}
                        </span>
                        <span className="text-[9px] font-black uppercase text-zinc-400 dark:text-zinc-500 block">
                          Level {user.level}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-10 text-xs font-black text-zinc-500">
                    {/* Streak */}
                    <span className="w-12 text-center flex items-center gap-1 justify-center text-orange-500">
                      <Flame className="w-4 h-4 fill-orange-500/10" /> {user.streak}d
                    </span>

                    {/* XP */}
                    <span className="w-16 text-right flex items-center gap-1 justify-end text-secondary">
                      <Zap className="w-4 h-4 fill-secondary/15" /> {user.xp} XP
                    </span>
                  </div>

                </div>
              ))}

            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: Weekly Sprint details */}
        <div className="space-y-6">
          <Card className="p-6 dark:border-dark-border">
            <h3 className="font-black text-lg text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-secondary" /> Promotion Zone
            </h3>

            <div className="p-4 rounded-2xl bg-primary-light dark:bg-dark-card border border-primary/20 text-xs font-bold leading-relaxed text-slate-700 dark:text-zinc-300">
              <h4 className="font-black text-sm text-primary mb-1">Promotion criteria:</h4>
              <p>Top 3 students in Gold League will advance to Diamond League at the end of the week! 💎</p>
              <div className="flex items-center gap-1.5 mt-3 text-secondary font-black">
                <ArrowUp className="w-4 h-4" /> <span>Keep learning to stay in the top 3!</span>
              </div>
            </div>
          </Card>

          {/* Weekly Sprint Challenge */}
          <Card className="p-6 dark:border-dark-border">
            <h3 className="font-black text-lg text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-accent" /> Weekly Challenge
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-extrabold text-zinc-500">
                <span>Earn {weeklyGoalTarget} XP this week</span>
                <span className="text-primary">{currentWeeklyXp} / {weeklyGoalTarget} XP</span>
              </div>
              <Progress value={currentWeeklyXp} max={weeklyGoalTarget} color="accent" />

              <div className="p-3 bg-zinc-50 dark:bg-dark-card border border-border dark:border-dark-border rounded-xl text-[10px] font-bold text-zinc-400 flex items-start gap-1.5">
                <Info className="w-4 h-4 shrink-0 text-accent" />
                <span>Unlocks the "Weekly Sprint Hero" achievement badge on completion.</span>
              </div>
            </div>
          </Card>

          {/* Mascot encouraging words */}
          <Card className="p-4 flex flex-col items-center">
            <Mascot
              expression="happy"
              message="Top 3 in Gold League get promoted to Diamond League! Let's do this! 🦊🏆"
              size={130}
              speechBubblePosition="top"
            />
          </Card>

        </div>

      </div>
    </AppLayout>
  );
}
