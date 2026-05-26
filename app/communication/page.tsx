"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Mascot } from "@/components/mascot/Mascot";
import { apiGet } from "@/lib/api-client";
import { ChevronRight, MessagesSquare } from "lucide-react";
import { motion } from "framer-motion";

interface ScenarioItem {
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  xpReward: number;
}

export default function CommunicationHubPage() {
  const [scenarios, setScenarios] = useState<ScenarioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<{ scenarios: ScenarioItem[] }>("/api/communication")
      .then((res) => setScenarios(res.scenarios))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout>
      <h1 className="text-3xl font-black text-card-foreground flex items-center gap-2 mb-8">
        <MessagesSquare className="w-8 h-8 text-secondary" /> Communication English
      </h1>
      {loading ? (
        <p className="font-bold text-muted-foreground">Loading scenarios...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((s, i) => (
            <motion.div key={s.slug} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={`/communication/${s.slug}`}>
                <Card hoverRaise className="h-full p-6 cursor-pointer">
                  <span className="text-4xl">{s.icon}</span>
                  <h3 className="font-extrabold text-lg mt-4">{s.title}</h3>
                  <p className="text-xs text-muted-foreground mt-2">{s.description}</p>
                  <p className="text-primary font-black text-sm mt-4">+{s.xpReward} XP</p>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
