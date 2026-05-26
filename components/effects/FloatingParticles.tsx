"use client";

import React, { useEffect, useState } from "react";

export function FloatingParticles({ count = 12 }: { count?: number }) {
  const [particles, setParticles] = useState<
    { id: number; left: string; delay: string; size: string }[]
  >([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 12}s`,
        size: `${Math.random() * 10 + 6}px`,
      }))
    );
  }, [count]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>
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
  );
}
