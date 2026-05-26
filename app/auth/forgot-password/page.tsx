"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mascot } from "@/components/mascot/Mascot";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getAuthCallbackUrl } from "@/lib/supabase/auth-redirect";

const supabaseAuthEnabled = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!supabaseAuthEnabled) {
      setSent(true);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getAuthCallbackUrl("/dashboard"),
    });
    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }
    setSent(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-center mb-6">
        <Mascot
          expression={sent ? "happy" : "thinking"}
          message={sent ? "Check your inbox! 📧🦊" : "No worries, I'll help you reset!"}
          size={130}
          speechBubblePosition="top"
        />
      </div>

      <Card className="p-8 dark:border-dark-border">
        <h1 className="text-2xl font-black text-center text-slate-800 dark:text-white mb-2">Reset Password</h1>
        <p className="text-sm font-semibold text-center text-zinc-400 mb-6">
          Enter your email and we&apos;ll send a verification link.
        </p>

        {sent ? (
          <div className="text-center space-y-4">
            <p className="text-sm font-bold text-success">
              If an account exists for {email}, you will receive reset instructions shortly.
            </p>
            <Link href="/auth/login">
              <Button variant="primary" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 py-3 rounded-xl border-2 border-border dark:border-dark-border lf-input"
                placeholder="you@email.com"
              />
            </div>
            {error && <p className="text-sm font-bold text-danger">{error}</p>}
            {!supabaseAuthEnabled && (
              <p className="text-xs font-semibold text-zinc-400">
                Configure Supabase Auth env vars to send real reset emails.
              </p>
            )}
            <Button variant="primary" type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        )}

        <Link
          href="/auth/login"
          className="flex items-center justify-center gap-1 text-sm font-black text-zinc-400 mt-6 hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4" /> Back to login
        </Link>
      </Card>
    </motion.div>
  );
}
