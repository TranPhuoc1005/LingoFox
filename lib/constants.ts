export const LEVELS = [
  "Beginner",
  "Elementary",
  "Intermediate",
  "Advanced",
  "TOEIC",
  "IELTS",
] as const;

export const CATEGORIES = [
  "Vocabulary",
  "Grammar",
  "Listening",
  "Speaking",
  "Writing",
  "Reading",
  "Communication English",
  "Business English",
  "Daily conversation",
  "Pronunciation",
] as const;

export const COMMUNICATION_SCENARIOS = [
  { slug: "cafe", title: "Café Conversations", icon: "☕", color: "from-amber-400 to-orange-500" },
  { slug: "airport", title: "Airport & Travel", icon: "✈️", color: "from-sky-400 to-blue-600" },
  { slug: "interview", title: "Job Interview", icon: "💼", color: "from-slate-500 to-slate-700" },
  { slug: "school", title: "School Life", icon: "🏫", color: "from-emerald-400 to-teal-600" },
  { slug: "dating", title: "Dating & Social", icon: "💕", color: "from-pink-400 to-rose-500" },
  { slug: "business", title: "Business Meetings", icon: "📊", color: "from-indigo-400 to-violet-600" },
  { slug: "travel", title: "Traveling", icon: "🗺️", color: "from-cyan-400 to-teal-500" },
  { slug: "daily", title: "Daily Life", icon: "🏠", color: "from-lime-400 to-green-600" },
] as const;

export const ACCENTS = ["US", "UK", "AU", "IN"] as const;

export const MOTIVATION_QUOTES = [
  "Every expert was once a beginner. Keep going! 🦊",
  "Mistakes are proof that you are trying. — Kiko",
  "15 minutes a day beats 2 hours once a week.",
  "Your accent is your story — own it!",
  "Fluency is a journey, not a destination. ✨",
];
