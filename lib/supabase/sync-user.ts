import type { User as SupabaseUser } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";

export async function ensurePrismaUserFromSupabase(supabaseUser: SupabaseUser) {
  const email = supabaseUser.email;
  if (!email) return null;

  const meta = supabaseUser.user_metadata ?? {};
  const name =
    (typeof meta.full_name === "string" && meta.full_name) ||
    (typeof meta.name === "string" && meta.name) ||
    email.split("@")[0];
  const image =
    (typeof meta.avatar_url === "string" && meta.avatar_url) ||
    (typeof meta.picture === "string" && meta.picture) ||
    null;
  const emailVerified = supabaseUser.email_confirmed_at
    ? new Date(supabaseUser.email_confirmed_at)
    : undefined;

  return prisma.user.upsert({
    where: { email },
    update: {
      name,
      image,
      ...(emailVerified ? { emailVerified } : {}),
    },
    create: {
      email,
      name,
      image,
      emailVerified,
    },
  });
}
