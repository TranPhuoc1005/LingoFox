"use client";

import React, { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { apiGet } from "@/lib/api-client";
import { Trophy, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";

interface ExamItem {
  id: string;
  slug: string;
  title: string;
  type: "TOEIC" | "IELTS";
  duration: number;
  questionsCount: number;
  xpReward: number;
  difficulty: string;
  description: string;
}

export default function ExamsLanding() {
  const { examAttempts } = useAppStore();
  const [exams, setExams] = useState<ExamItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<{ exams: ExamItem[] }>("/api/exams")
      .then((res) => setExams(res.exams))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-black text-card-foreground flex items-center gap-2">
              <Trophy className="w-8 h-8 text-accent" /> Exam Center
            </h1>
            <p className="text-sm font-semibold text-muted-foreground mt-1">
              Realistic IELTS & TOEIC tests with instant scores and AI advice.
            </p>
          </div>

          {loading ? (
            <p className="font-bold text-muted-foreground">Loading exams...</p>
          ) : (
            <div className="space-y-4">
              {exams.map((exam) => (
                <Card key={exam.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-primary/10 text-primary">{exam.type}</span>
                    <h3 className="font-extrabold text-xl text-card-foreground mt-2">{exam.title}</h3>
                    <p className="text-sm font-semibold text-muted-foreground mt-1">{exam.description}</p>
                    <div className="flex gap-4 mt-3 text-xs font-bold text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {exam.duration} min</span>
                      <span>{exam.questionsCount} questions</span>
                      <span className="text-primary">+{exam.xpReward} XP</span>
                    </div>
                  </div>
                  <Link href={`/exams/${exam.slug}`}>
                    <Button variant="primary">Start Exam <ChevronRight className="w-4 h-4 ml-1" /></Button>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
        <Card className="p-6 h-fit">
          <h3 className="font-black text-lg mb-4">Recent Attempts</h3>
          {examAttempts.length === 0 ? (
            <p className="text-xs font-bold text-muted-foreground">Complete a test to see scores here.</p>
          ) : (
            <div className="space-y-3">
              {examAttempts.map((a) => (
                <div key={a.id} className="p-3 lf-surface text-sm font-bold">
                  <p className="text-card-foreground">{a.examTitle}</p>
                  <p className="text-primary mt-1">Score: {a.score}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
