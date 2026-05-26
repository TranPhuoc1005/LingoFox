"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mascot } from "@/components/mascot/Mascot";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getAuthCallbackUrl } from "@/lib/supabase/auth-redirect";

const supabaseAuthEnabled = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");

    if (supabaseAuthEnabled) {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name, name },
          emailRedirectTo: getAuthCallbackUrl("/dashboard"),
        },
      });
      setLoading(false);

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.session) {
        router.push("/dashboard");
        router.refresh();
        return;
      }

      setInfo("Check your email to confirm your account, then sign in.");
      return;
    }

    await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-center mb-6">
        <Mascot expression="cheer" message="Join the fox squad! 🦊✨" size={140} speechBubblePosition="top" />
      </div>

      <Card className="p-8 dark:border-dark-border">
        <h1 className="text-2xl font-black text-center text-slate-800 dark:text-white mb-6">Create Account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-black text-zinc-500 uppercase">Name</label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 py-3 rounded-xl border-2 border-border dark:border-dark-border lf-input"
                placeholder="Your name"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-black text-zinc-500 uppercase">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 py-3 rounded-xl border-2 border-border dark:border-dark-border lf-input"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-black text-zinc-500 uppercase">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 py-3 rounded-xl border-2 border-border dark:border-dark-border lf-input"
              />
            </div>
          </div>

          {error && <p className="text-sm font-bold text-danger">{error}</p>}
          {info && <p className="text-sm font-bold text-success">{info}</p>}

          <Button variant="primary" type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Start Learning Free"} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        <p className="text-center text-sm font-bold text-zinc-400 mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </motion.div>
  );
}
