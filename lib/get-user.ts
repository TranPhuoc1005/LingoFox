import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isSupabaseAuthConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { ensurePrismaUserFromSupabase } from "@/lib/supabase/sync-user";

export const DEMO_USER_EMAIL = "demo@lingofox.app";

export async function getApiUser() {
  if (isSupabaseAuthConfigured()) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) {
        const dbUser = await ensurePrismaUserFromSupabase(user);
        if (dbUser) return dbUser;
      }
    } catch {
      // fall through to NextAuth / demo
    }
  }

  const session = await auth();

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (user) return user;
  }

  let demo = await prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
  });

  if (!demo) {
    demo = await prisma.user.create({
      data: {
        email: DEMO_USER_EMAIL,
        name: "Fox Cadet",
        xp: 120,
        level: 1,
        streak: 3,
        dailyGoal: 50,
        lastStudyDate: new Date(),
      },
    });
  }

  return demo;
}

export async function getApiUserId() {
  const user = await getApiUser();
  return user.id;
}
