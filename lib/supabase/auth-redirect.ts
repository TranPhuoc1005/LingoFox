/** OAuth / email link redirect target for Supabase Auth. */
export function getAuthCallbackUrl(next = "/dashboard"): string {
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.NEXTAUTH_URL ||
        "http://localhost:3000";
  const path = `/auth/callback${next !== "/dashboard" ? `?next=${encodeURIComponent(next)}` : ""}`;
  return `${origin}${path}`;
}
