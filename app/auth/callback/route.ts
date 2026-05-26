import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensurePrismaUserFromSupabase } from "@/lib/supabase/sync-user";
import { isSupabaseAuthConfigured } from "@/lib/supabase/env";

export async function GET(request: Request) {
  if (!isSupabaseAuthConfigured()) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      await ensurePrismaUserFromSupabase(data.user);
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(
    `${origin}/auth/login?error=${encodeURIComponent("Could not complete sign-in. Check Supabase redirect URLs.")}`
  );
}
