"use client";

import React, { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { apiGet } from "@/lib/api-client";
import { CheckCircle2, Lock, Flame } from "lucide-react";
import Link from "next/link";

interface CourseCategory {
  title: string;
  desc: string;
  difficulty: string;
  lessonsCount: number;
  xpValue: number;
  lessons: { id: string; name: string; isLocked?: boolean; completed?: boolean }[];
}

export default function LessonsLanding() {
  const { completedLessons } = useAppStore();
  const [courses, setCourses] = useState<CourseCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<{ courses: CourseCategory[] }>("/api/lessons?grouped=true")
      .then((res) => setCourses(res.courses))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">Study Courses</h1>
          <p className="text-sm font-semibold text-muted-foreground">Pick a course and start learning!</p>
        </div>

        {loading ? (
          <p className="font-bold text-muted-foreground">Loading courses...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <Card key={`${course.difficulty}-${course.title}`} className="p-6 border-2 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                      {course.difficulty}
                    </span>
                    <h3 className="font-extrabold text-xl text-card-foreground mt-2">{course.title}</h3>
                  </div>
                  <div className="text-right text-sm font-extrabold text-primary flex items-center gap-1">
                    <Flame className="w-4 h-4" /> +{course.xpValue} XP
                  </div>
                </div>
                <p className="text-sm font-semibold text-muted-foreground mb-6 flex-1">{course.desc}</p>
                <div className="border-t border-border pt-4 space-y-3">
                  {course.lessons.map((lesson, index) => {
                    const isCompleted = completedLessons.includes(lesson.id) || lesson.completed;
                    const isUnlocked = isCompleted || index === 0 || completedLessons.includes(course.lessons[index - 1]?.id);
                    return (
                      <div key={`${course.difficulty}-${course.title}-${lesson.id}-${index}`} className="flex items-center justify-between p-3 lf-surface">
                        <div className="flex items-center gap-2 text-sm font-extrabold">
                          {isCompleted ? <CheckCircle2 className="w-4 h-4 text-success" /> : isUnlocked ? <div className="w-2 h-2 rounded-full bg-primary" /> : <Lock className="w-4 h-4 text-muted-foreground" />}
                          <span className={isUnlocked ? "text-card-foreground" : "text-muted-foreground"}>{lesson.name}</span>
                        </div>
                        {isUnlocked ? (
                          <Link href={`/lessons/${lesson.id}`}>
                            <Button variant={isCompleted ? "outline" : "primary"} size="sm">{isCompleted ? "Review" : "Study"}</Button>
                          </Link>
                        ) : (
                          <Button variant="ghost" size="sm" disabled>Locked</Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
