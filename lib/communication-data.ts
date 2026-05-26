export interface DialogueChoice {
  text: string;
  nextId: string;
  score: number;
  feedback?: string;
}

export interface DialogueNode {
  id: string;
  speaker: string;
  speakerRole: string;
  text: string;
  translation?: string;
  choices?: DialogueChoice[];
  isEnd?: boolean;
}

export interface CommunicationScenarioData {
  slug: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  xpReward: number;
  nodes: Record<string, DialogueNode>;
  startId: string;
}

export const SCENARIOS: Record<string, CommunicationScenarioData> = {
  cafe: {
    slug: "cafe",
    title: "Café Conversations",
    description: "Order drinks, ask about menu items, and handle small talk with a barista.",
    icon: "☕",
    gradient: "from-amber-400 to-orange-500",
    xpReward: 30,
    startId: "start",
    nodes: {
      start: {
        id: "start",
        speaker: "Barista",
        speakerRole: "Kiko the Barista",
        text: "Good morning! Welcome to Fox Café. What can I get for you today?",
        translation: "Chào buổi sáng! Chào mừng đến Fox Café. Hôm nay bạn muốn gì?",
        choices: [
          { text: "I'd like a cappuccino, please.", nextId: "polite", score: 10, feedback: "Perfect polite order!" },
          { text: "Give me coffee.", nextId: "rude", score: 2, feedback: "A bit direct — try 'I'd like...' for politeness." },
          { text: "What do you recommend?", nextId: "ask", score: 8 },
        ],
      },
      polite: {
        id: "polite",
        speaker: "Barista",
        speakerRole: "Kiko",
        text: "Excellent choice! Would you like oat milk or regular milk?",
        choices: [
          { text: "Oat milk, please. To go.", nextId: "end_good", score: 10 },
          { text: "Regular milk is fine.", nextId: "end_good", score: 8 },
        ],
      },
      rude: {
        id: "rude",
        speaker: "Barista",
        speakerRole: "Kiko",
        text: "Sure... We have espresso, latte, and cappuccino. Which one?",
        choices: [
          { text: "Sorry — I'd like a latte, please.", nextId: "polite", score: 6 },
        ],
      },
      ask: {
        id: "ask",
        speaker: "Barista",
        speakerRole: "Kiko",
        text: "Our fox-special cappuccino is very popular! It's creamy with a hint of cinnamon.",
        choices: [
          { text: "That sounds great — I'll take one!", nextId: "end_good", score: 10 },
        ],
      },
      end_good: {
        id: "end_good",
        speaker: "Barista",
        speakerRole: "Kiko",
        text: "Here you go! Have a wonderful day. See you again soon! ☕🦊",
        isEnd: true,
      },
    },
  },
  airport: {
    slug: "airport",
    title: "Airport & Travel",
    description: "Check in, ask about gates, and handle travel emergencies.",
    icon: "✈️",
    gradient: "from-sky-400 to-blue-600",
    xpReward: 35,
    startId: "start",
    nodes: {
      start: {
        id: "start",
        speaker: "Agent",
        speakerRole: "Check-in Agent",
        text: "Hello! May I see your passport and booking reference, please?",
        choices: [
          { text: "Here you are. My reference is FX2841.", nextId: "ok", score: 10 },
          { text: "I lost my passport.", nextId: "lost", score: 5 },
        ],
      },
      ok: {
        id: "ok",
        speaker: "Agent",
        speakerRole: "Check-in Agent",
        text: "Thank you. You're checked in. Gate 12 boards in 40 minutes. Any checked bags?",
        choices: [
          { text: "Yes, one suitcase please.", nextId: "end", score: 10 },
          { text: "No, just carry-on.", nextId: "end", score: 10 },
        ],
      },
      lost: {
        id: "lost",
        speaker: "Agent",
        speakerRole: "Check-in Agent",
        text: "Please visit the airline desk immediately. They can help with emergency travel documents.",
        isEnd: true,
      },
      end: {
        id: "end",
        speaker: "Agent",
        speakerRole: "Check-in Agent",
        text: "Have a safe flight! Boarding starts at Gate 12. ✈️",
        isEnd: true,
      },
    },
  },
  interview: {
    slug: "interview",
    title: "Job Interview",
    description: "Answer common interview questions with confidence.",
    icon: "💼",
    gradient: "from-slate-500 to-slate-700",
    xpReward: 40,
    startId: "start",
    nodes: {
      start: {
        id: "start",
        speaker: "Interviewer",
        speakerRole: "HR Manager",
        text: "Tell me about yourself and why you're interested in this position.",
        choices: [
          {
            text: "I'm a motivated learner with strong communication skills, and I'm excited to grow with your team.",
            nextId: "good",
            score: 10,
          },
          { text: "I need money.", nextId: "weak", score: 2 },
        ],
      },
      good: {
        id: "good",
        speaker: "Interviewer",
        speakerRole: "HR Manager",
        text: "Great answer. Describe a challenge you overcame at work or school.",
        choices: [
          {
            text: "I struggled with public speaking, so I joined an English club and practiced daily until I led a presentation.",
            nextId: "end",
            score: 10,
          },
        ],
      },
      weak: {
        id: "weak",
        speaker: "Interviewer",
        speakerRole: "HR Manager",
        text: "I see. What skills would you bring to our team?",
        choices: [
          {
            text: "I'm reliable, eager to learn, and I work well with others.",
            nextId: "end",
            score: 6,
          },
        ],
      },
      end: {
        id: "end",
        speaker: "Interviewer",
        speakerRole: "HR Manager",
        text: "Thank you. We'll be in touch within a week. Good luck! 🎓",
        isEnd: true,
      },
    },
  },
};
