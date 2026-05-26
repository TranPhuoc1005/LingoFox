import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AvatarConfig {
  hat: "none" | "cap" | "glasses" | "crown" | "headphones" | "chef";
  outfit: "none" | "scarf" | "suit" | "hoodie" | "kimono" | "superhero";
  accessory: "none" | "book" | "star" | "cookie" | "balloon";
  backgroundColor: string;
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  lastStudyDate: string | null;
  dailyGoal: number; // e.g. 50 XP
  dailyXpEarned: number;
  avatar: AvatarConfig;
  badges: string[]; // Badge IDs
}

export interface LessonNote {
  lessonId: string;
  content: string;
  bookmarks: string[]; // List of bookmarked vocabulary words
}

export interface ExamAttempt {
  id: string;
  examId: string;
  examTitle: string;
  type: "TOEIC" | "IELTS";
  score: number;
  totalQuestions: number;
  submittedAt: string;
  answers: Record<number, string>;
  analysis: {
    strength: string;
    weakness: string;
    aiFeedback: string;
  };
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  message: string;
  timestamp: string;
  grammarFeedback?: string;
}

export interface CommunityComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorLevel: number;
  title: string;
  content: string;
  createdAt: string;
  likes: number;
  comments: CommunityComment[];
  likedByUser: boolean;
}

export interface VoiceRoom {
  id: string;
  name: string;
  activeCount: number;
  participants: { name: string; avatar: string; speaking: boolean }[];
}

interface AppState {
  // Theme & Settings
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  toggleDarkMode: () => void;
  
  // User Progression
  stats: UserStats;
  addXp: (amount: number) => { leveledUp: boolean; xpGained: number };
  incrementStreak: () => void;
  updateAvatar: (config: Partial<AvatarConfig>) => void;
  unlockBadge: (badgeId: string) => boolean;

  // Learning System Progress
  completedLessons: string[]; // List of completed lesson IDs
  completeLesson: (lessonId: string, xpReward: number) => void;

  // Notes System
  notes: Record<string, LessonNote>; // Key: lessonId or examId
  saveNote: (lessonId: string, content: string, bookmarks?: string[]) => void;
  
  // Exam System
  examAttempts: ExamAttempt[];
  addExamAttempt: (attempt: Omit<ExamAttempt, "submittedAt">) => void;
  
  // AI Interactions
  chatHistory: Record<string, ChatMessage[]>; // Key: topic / partner name
  addChatMessage: (topic: string, role: "user" | "assistant", message: string, grammarFeedback?: string) => void;
  clearChatHistory: (topic: string) => void;

  // Community State
  communityPosts: CommunityPost[];
  addPost: (title: string, content: string) => void;
  addComment: (postId: string, content: string) => void;
  toggleLikePost: (postId: string) => void;
  voiceRooms: VoiceRoom[];
  joinVoiceRoom: (roomId: string, name: string) => void;
  leaveVoiceRoom: (roomId: string) => void;

  hydrateFromApi: (data: {
    stats: UserStats;
    completedLessons: string[];
    examAttempts: ExamAttempt[];
  }) => void;
  setCommunityPosts: (posts: CommunityPost[]) => void;
  setVoiceRooms: (rooms: VoiceRoom[]) => void;
  setChatMessages: (topic: string, messages: ChatMessage[]) => void;
}

const initialAvatar: AvatarConfig = {
  hat: "none",
  outfit: "none",
  accessory: "none",
  backgroundColor: "#ff8f3d",
};

const initialStats: UserStats = {
  xp: 120,
  level: 1,
  streak: 3,
  lastStudyDate: new Date().toDateString(),
  dailyGoal: 50,
  dailyXpEarned: 20,
  avatar: initialAvatar,
  badges: ["first_steps"],
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme & Settings
      darkMode: false,
      setDarkMode: (dark) => {
        set({ darkMode: dark });
        if (dark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      },
      toggleDarkMode: () => {
        const newDark = !get().darkMode;
        get().setDarkMode(newDark);
      },

      // User Progression
      stats: initialStats,
      addXp: (amount) => {
        const stats = get().stats;
        let newXp = stats.xp + amount;
        let newLevel = stats.level;
        let leveledUp = false;
        
        // Dynamic Level Calculation: 100 XP per level + 50 XP scale
        // L1: 100XP, L2: 250XP, L3: 450XP, etc.
        const getXpThreshold = (lvl: number) => lvl * 150;
        
        while (newXp >= getXpThreshold(newLevel)) {
          newXp -= getXpThreshold(newLevel);
          newLevel += 1;
          leveledUp = true;
        }

        // Daily goal check
        const today = new Date().toDateString();
        let newDailyXp = stats.dailyXpEarned;
        if (stats.lastStudyDate === today) {
          newDailyXp += amount;
        } else {
          newDailyXp = amount;
        }

        // Unlock streak badges if applicable
        const badges = [...stats.badges];
        if (newLevel >= 5 && !badges.includes("level_5")) {
          badges.push("level_5");
        }
        if (newDailyXp >= stats.dailyGoal && !badges.includes("daily_goal")) {
          badges.push("daily_goal");
        }

        set({
          stats: {
            ...stats,
            xp: newXp,
            level: newLevel,
            dailyXpEarned: newDailyXp,
            lastStudyDate: today,
            badges,
          }
        });

        return { leveledUp, xpGained: amount };
      },

      incrementStreak: () => {
        const stats = get().stats;
        const today = new Date().toDateString();
        
        // If study completed on a new day, handle streak increment
        if (stats.lastStudyDate !== today) {
          let newStreak = stats.streak;
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (stats.lastStudyDate === yesterday.toDateString() || stats.lastStudyDate === null) {
            newStreak += 1;
          } else {
            // Missed a day, reset streak to 1
            newStreak = 1;
          }

          set({
            stats: {
              ...stats,
              streak: newStreak,
              lastStudyDate: today
            }
          });
        }
      },

      updateAvatar: (config) => {
        set({
          stats: {
            ...get().stats,
            avatar: {
              ...get().stats.avatar,
              ...config
            }
          }
        });
      },

      unlockBadge: (badgeId) => {
        const stats = get().stats;
        if (stats.badges.includes(badgeId)) return false;
        
        set({
          stats: {
            ...stats,
            badges: [...stats.badges, badgeId]
          }
        });
        return true;
      },

      // Learning System Progress
      completedLessons: [],
      completeLesson: (lessonId, _xpReward) => {
        const completed = get().completedLessons;
        if (!completed.includes(lessonId)) {
          set({ completedLessons: [...completed, lessonId] });
        }
      },

      hydrateFromApi: (data) => {
        set({
          stats: data.stats,
          completedLessons: data.completedLessons,
          examAttempts: data.examAttempts,
        });
      },
      setCommunityPosts: (posts) => set({ communityPosts: posts }),
      setVoiceRooms: (rooms) => set({ voiceRooms: rooms }),
      setChatMessages: (topic, messages) => {
        set({ chatHistory: { ...get().chatHistory, [topic]: messages } });
      },

      // Notes System
      notes: {},
      saveNote: (lessonId, content, bookmarks) => {
        const notes = { ...get().notes };
        notes[lessonId] = {
          lessonId,
          content,
          bookmarks: bookmarks || notes[lessonId]?.bookmarks || [],
        };
        set({ notes });
      },

      // Exam System
      examAttempts: [],
      addExamAttempt: (attempt) => {
        const newAttempt: ExamAttempt = {
          ...attempt,
          submittedAt: new Date().toLocaleString(),
        };
        set({
          examAttempts: [newAttempt, ...get().examAttempts]
        });
        // Add XP for completing exams
        get().addXp(attempt.score > 700 || attempt.score > 7.0 ? 150 : 80);
        get().incrementStreak();
        // Unlock exam badge
        get().unlockBadge("test_taker");
      },

      // AI Interactions
      chatHistory: {},
      addChatMessage: (topic, role, message, grammarFeedback) => {
        const history = { ...get().chatHistory };
        if (!history[topic]) {
          history[topic] = [];
        }
        
        history[topic].push({
          id: `msg-${Date.now()}`,
          role,
          message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          grammarFeedback
        });

        set({ chatHistory: history });
      },
      clearChatHistory: (topic) => {
        const history = { ...get().chatHistory };
        history[topic] = [];
        set({ chatHistory: history });
      },

      // Community State
      communityPosts: [],
      addPost: () => {},
      addComment: () => {},
      toggleLikePost: () => {},
      voiceRooms: [],
      joinVoiceRoom: (roomId, name) => {
        const rooms = get().voiceRooms.map(room => {
          if (room.id === roomId) {
            const isAlreadyIn = room.participants.some(p => p.name === name);
            if (isAlreadyIn) return room;
            return {
              ...room,
              activeCount: room.activeCount + 1,
              participants: [...room.participants, { name, avatar: "U", speaking: false }]
            };
          }
          return room;
        });
        set({ voiceRooms: rooms });
      },
      leaveVoiceRoom: (roomId) => {
        const rooms = get().voiceRooms.map(room => {
          if (room.id === roomId) {
            return {
              ...room,
              activeCount: Math.max(0, room.activeCount - 1),
              participants: room.participants.filter(p => p.name !== "You (Fox Cadet)")
            };
          }
          return room;
        });
        set({ voiceRooms: rooms });
      }
    }),
    {
      name: "lingofox-storage",
      partialize: (state) => ({
        darkMode: state.darkMode,
        notes: state.notes,
      }),
    }
  )
);
