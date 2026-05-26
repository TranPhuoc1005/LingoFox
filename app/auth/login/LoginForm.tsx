"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mascot } from "@/components/mascot/Mascot";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getAuthCallbackUrl } from "@/lib/supabase/auth-redirect";

const supabaseAuthEnabled = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export function LoginForm({ initialError = "" }: { initialError?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (supabaseAuthEnabled) {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (signInError) {
        setError(signInError.message);
        return;
      }
      router.push("/dashboard");
      router.refresh();
      return;
    }

    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password (min 6 chars in demo mode)");
      return;
    }
    router.push("/dashboard");
  };

  const handleGoogle = async () => {
    if (supabaseAuthEnabled) {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: getAuthCallbackUrl("/dashboard") },
      });
      if (oauthError) setError(oauthError.message);
      return;
    }
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleDiscord = () => {
    if (supabaseAuthEnabled) {
      setError(
        "Discord sign-in uses NextAuth. Add Google in Supabase or remove Supabase Auth keys to use Discord."
      );
      return;
    }
    void signIn("discord", { callbackUrl: "/dashboard" });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-center mb-6">
        <Mascot expression="happy" message="Welcome back, cadet! 🦊" size={140} speechBubblePosition="top" />
      </div>

      <Card className="p-8 dark:border-dark-border">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">Sign in to LingoFox</h1>
          <p className="text-sm font-semibold text-zinc-400 mt-1">Continue your English adventure</p>
          {supabaseAuthEnabled && (
            <p className="text-xs font-bold text-primary mt-2">Secured with Supabase Auth</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-black text-zinc-500 uppercase tracking-wider">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-border dark:border-dark-border lf-input"
                placeholder="you@email.com"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-black text-zinc-500 uppercase tracking-wider">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-border dark:border-dark-border lf-input"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <p className="text-sm font-bold text-danger">{error}</p>}

          <div className="flex justify-end">
            <Link href="/auth/forgot-password" className="text-xs font-black text-primary hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button variant="primary" type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border dark:border-dark-border" />
          </div>
          <div className="relative flex justify-center text-xs font-black text-zinc-400 uppercase">
            <span className="bg-card text-muted-foreground px-3">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" type="button" onClick={handleGoogle} className="text-sm">
            Google
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={handleDiscord}
            className="text-sm !border-discord/30"
            disabled={supabaseAuthEnabled}
          >
            Discord
          </Button>
        </div>

        <p className="text-center text-sm font-bold text-zinc-400 mt-6">
          New here?{" "}
          <Link href="/auth/register" className="text-primary hover:underline">
            Create account
          </Link>
        </p>

        <Link href="/dashboard" className="block text-center text-xs font-bold text-zinc-400 mt-4 hover:text-primary">
          Skip login — try demo dashboard →
        </Link>
      </Card>
    </motion.div>
  );
}
