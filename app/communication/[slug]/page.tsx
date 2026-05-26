"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NotePanel } from "@/components/learning/NotePanel";
import { apiGet } from "@/lib/api-client";
import type { CommunicationScenarioData } from "@/lib/communication-data";
import { ArrowLeft, Volume2 } from "lucide-react";
import confetti from "canvas-confetti";

export default function CommunicationPracticePage() {
  const params = useParams();
  const slug = (params?.slug as string) || "cafe";
  const [scenario, setScenario] = useState<CommunicationScenarioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [nodeId, setNodeId] = useState("start");
  const [totalScore, setTotalScore] = useState(0);
  const [noteContent, setNoteContent] = useState("");
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"notes" | "vocabulary" | "guide">("notes");

  useEffect(() => {
    apiGet<{ scenario: CommunicationScenarioData }>(`/api/communication/${slug}`)
      .then((res) => {
        setScenario(res.scenario);
        setNodeId(res.scenario.startId);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading || !scenario) {
    return (
      <AppLayout>
        <div className="p-12 text-center font-bold text-muted-foreground">Loading scenario...</div>
      </AppLayout>
    );
  }

  const nodes = scenario.nodes as CommunicationScenarioData["nodes"];
  const node = nodes[nodeId];

  const speak = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <AppLayout>
      <Link href="/communication"><Button variant="ghost" size="sm" className="mb-4"><ArrowLeft className="w-4 h-4 mr-1" /> Scenarios</Button></Link>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className={`p-6 bg-gradient-to-br ${scenario.gradient} text-white`}>
          <h1 className="text-2xl font-black">{scenario.title}</h1>
          <p className="text-sm opacity-90 mt-2">Score: {totalScore}</p>
        </Card>
        <Card className="p-6 space-y-4">
          <p className="font-extrabold text-lg">{node.text}</p>
          {node.translation && <p className="text-sm italic text-muted-foreground">{node.translation}</p>}
          <button onClick={() => speak(node.text)} className="text-primary text-sm font-bold flex items-center gap-1"><Volume2 className="w-4 h-4" /> Play</button>
          {node.choices?.map((c: { text: string; nextId: string; score: number }) => (
            <button key={c.text} onClick={() => { setTotalScore((s) => s + c.score); setNodeId(c.nextId); if (nodes[c.nextId]?.isEnd) confetti({ particleCount: 80 }); }} className="lf-choice w-full text-left">{c.text}</button>
          ))}
          {node.isEnd && <Link href="/communication"><Button variant="primary">Done</Button></Link>}
        </Card>
        <NotePanel title={scenario.title} noteContent={noteContent} onNoteChange={setNoteContent} bookmarks={bookmarks} onToggleBookmark={() => {}} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </AppLayout>
  );
}
