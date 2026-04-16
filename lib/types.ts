export type Subject = "math" | "japanese" | "science";

export interface Question {
  id: string;
  subject: Subject;
  difficulty: 1 | 2 | 3;
  question: string;
  choices: string[];
  answer: number;
  explanation: string;
  xpReward: number;
}

export interface Item {
  id: string;
  name: string;
  emoji: string;
  description: string;
  price: number;
  slot: "hat" | "weapon" | "accessory";
}

export interface DailyMission {
  id: string;
  description: string;
  subject: Subject | "any";
  type: "solve" | "perfect" | "streak";
  target: number;
  progress: number;
  completed: boolean;
  xpReward: number;
  coinReward: number;
}

export interface GameState {
  xp: number;
  level: number;
  coins: number;
  streak: number;
  lastStudiedDate: string | null;
  equippedItems: {
    hat: string | null;
    weapon: string | null;
    accessory: string | null;
  };
  ownedItems: string[];
  subjectStats: {
    math: { correct: number; total: number };
    japanese: { correct: number; total: number };
    science: { correct: number; total: number };
  };
  completedQuestions: string[];
  wrongQuestions: string[];       // 間違えた問題IDリスト
  dailyMissions: DailyMission[];
  dailyMissionsDate: string | null;
}
