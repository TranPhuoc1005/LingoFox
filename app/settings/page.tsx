"use client";

import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { Mascot } from "@/components/mascot/Mascot";
import {
  Target,
  Bell,
  Focus,
  Volume2,
  Shield,
  Trash2,
} from "lucide-react";

export default function SettingsPage() {
  const { stats } = useAppStore();
  const [focusMode, setFocusMode] = React.useState(false);
  const [dailyGoal, setDailyGoal] = React.useState(stats.dailyGoal);
  const [notifications, setNotifications] = React.useState(true);
  const [ttsEnabled, setTtsEnabled] = React.useState(true);

  return (
    <AppLayout>
      <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2">Settings</h1>
      <p className="text-sm font-semibold text-zinc-400 mb-8">Customize your LingoFox learning experience</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 dark:border-dark-border">
            <h2 className="font-black text-lg flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-primary" /> Study Goals
            </h2>
            <label className="text-xs font-black text-zinc-400 uppercase">Daily XP Goal</label>
            <input
              type="range"
              min={20}
              max={200}
              step={10}
              value={dailyGoal}
              onChange={(e) => setDailyGoal(Number(e.target.value))}
              className="w-full mt-2 accent-primary"
            />
            <p className="text-sm font-black text-primary mt-2">{dailyGoal} XP / day</p>
          </Card>

          <Card className="p-6 dark:border-dark-border">
            <h2 className="font-black text-lg flex items-center gap-2 mb-4">
              <Focus className="w-5 h-5 text-success" /> Focus Mode
            </h2>
            <p className="text-sm font-semibold text-zinc-400 mb-4">
              Hides distractions while studying lessons and listening exercises.
            </p>
            <div className="flex items-center justify-between p-4 rounded-2xl lf-surface">
              <span className="font-bold text-sm">Enable Focus Mode</span>
              <button
                onClick={() => setFocusMode(!focusMode)}
                className={`w-14 h-8 rounded-full transition-colors relative ${focusMode ? "bg-success" : "bg-zinc-300"}`}
              >
                <span
                  className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-transform ${focusMode ? "left-7" : "left-1"}`}
                />
              </button>
            </div>
          </Card>

          <Card className="p-6 dark:border-dark-border">
            <h2 className="font-black text-lg flex items-center gap-2 mb-4">
              <Volume2 className="w-5 h-5 text-info" /> Audio & Speech
            </h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 rounded-2xl lf-surface cursor-pointer text-card-foreground">
                <span className="font-bold text-sm flex items-center gap-2">
                  <Bell className="w-4 h-4" /> Study reminders
                </span>
                <input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} className="accent-primary w-5 h-5" />
              </label>
              <label className="flex items-center justify-between p-4 rounded-2xl lf-surface cursor-pointer text-card-foreground">
                <span className="font-bold text-sm">Text-to-speech in lessons</span>
                <input type="checkbox" checked={ttsEnabled} onChange={(e) => setTtsEnabled(e.target.checked)} className="accent-primary w-5 h-5" />
              </label>
            </div>
          </Card>

          <Card className="p-6 dark:border-dark-border border-danger/20">
            <h2 className="font-black text-lg flex items-center gap-2 mb-4 text-danger">
              <Shield className="w-5 h-5" /> Data
            </h2>
            <Button
              variant="outline"
              onClick={() => {
                if (confirm("Clear all local progress? This cannot be undone.")) {
                  localStorage.removeItem("lingofox-storage");
                  window.location.reload();
                }
              }}
              className="text-danger border-danger/30"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Reset Local Progress
            </Button>
          </Card>
        </div>

        <Card className="p-6 flex flex-col items-center dark:border-dark-border h-fit">
          <Mascot
            expression="happy"
            message={focusMode ? "Focus mode ON — you've got this! 🦊🎯" : "Tune settings to match your study style!"}
            size={140}
          />
          <p className="text-xs font-bold text-zinc-400 mt-4 text-center">LingoFox v1.2 • Kiko Edition</p>
        </Card>
      </div>
    </AppLayout>
  );
}
