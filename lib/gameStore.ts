"use client";
import { GameState, DailyMission, Subject } from "./types";

const STORAGE_KEY = "study-game-state";

export const LEVEL_THRESHOLDS = [0, 50, 120, 220, 350, 520, 730, 990, 1300, 1700, 2200];

export function getLevelFromXP(xp: number): number {
  let level = 1;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
      break;
    }
  }
  return Math.min(level, 10);
}

export function getXPForNextLevel(level: number): number {
  return LEVEL_THRESHOLDS[Math.min(level, LEVEL_THRESHOLDS.length - 1)] || 9999;
}


// デイリーミッション定義
const MISSION_TEMPLATES: Omit<DailyMission, "progress" | "completed">[] = [
  { id: "m_math3", description: "数学を3問解く", subject: "math", type: "solve", target: 3, xpReward: 30, coinReward: 15 },
  { id: "m_jp3", description: "国語を3問解く", subject: "japanese", type: "solve", target: 3, xpReward: 30, coinReward: 15 },
  { id: "m_logic3", description: "論理思考を3問解く", subject: "logic", type: "solve", target: 3, xpReward: 40, coinReward: 20 },
  { id: "m_any5", description: "合計5問解く", subject: "any", type: "solve", target: 5, xpReward: 35, coinReward: 15 },
  { id: "m_logic_perfect", description: "論理思考で全問正解する", subject: "logic", type: "perfect", target: 1, xpReward: 50, coinReward: 25 },
  { id: "m_math_perfect", description: "数学で全問正解する", subject: "math", type: "perfect", target: 1, xpReward: 50, coinReward: 25 },
  { id: "m_streak", description: "今日の学習を始める", subject: "any", type: "streak", target: 1, xpReward: 20, coinReward: 10 },
];

export function generateDailyMissions(dateStr: string): DailyMission[] {
  // 日付をシードにしてランダムに3つ選ぶ
  const seed = dateStr.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const shuffled = [...MISSION_TEMPLATES].sort((a, b) => {
    const ha = Math.sin(seed + a.id.length) * 10000;
    const hb = Math.sin(seed + b.id.length) * 10000;
    return (ha - Math.floor(ha)) - (hb - Math.floor(hb));
  });
  return shuffled.slice(0, 3).map((t) => ({ ...t, progress: 0, completed: false }));
}

const defaultState: GameState = {
  xp: 0,
  level: 1,
  coins: 30,
  streak: 0,
  lastStudiedDate: null,
  equippedItems: { hat: null, weapon: null, accessory: null },
  ownedItems: [],
  subjectStats: {
    math: { correct: 0, total: 0 },
    japanese: { correct: 0, total: 0 },
    logic: { correct: 0, total: 0 },
  } as GameState["subjectStats"],
  completedQuestions: [],
  wrongQuestions: [],
  dailyMissions: [],
  dailyMissionsDate: null,
  selectedCharacter: "brave",
};

export function loadGameState(): GameState {
  if (typeof window === "undefined") return defaultState;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const base = stored ? { ...defaultState, ...JSON.parse(stored) } : { ...defaultState };
    // 今日のミッションがなければ生成
    const today = new Date().toDateString();
    if (base.dailyMissionsDate !== today) {
      base.dailyMissions = generateDailyMissions(today);
      base.dailyMissionsDate = today;
    }
    return base;
  } catch {
    return defaultState;
  }
}

export function saveGameState(state: GameState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function addXP(state: GameState, amount: number): GameState {
  const newXP = state.xp + amount;
  const newLevel = getLevelFromXP(newXP);
  return { ...state, xp: newXP, level: newLevel };
}

export function addCoins(state: GameState, amount: number): GameState {
  return { ...state, coins: state.coins + amount };
}

export function checkAndUpdateStreak(state: GameState): GameState {
  const today = new Date().toDateString();
  if (state.lastStudiedDate === today) return state;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const isConsecutive = state.lastStudiedDate === yesterday.toDateString();
  return {
    ...state,
    streak: isConsecutive ? state.streak + 1 : 1,
    lastStudiedDate: today,
  };
}

/** クイズ完了後にミッション進捗を更新。完了したミッションの報酬を返す */
export function updateMissions(
  state: GameState,
  subject: Subject,
  solvedCount: number,
  isPerfect: boolean
): { state: GameState; rewards: { xp: number; coins: number; names: string[] } } {
  const rewards = { xp: 0, coins: 0, names: [] as string[] };
  const missions = state.dailyMissions.map((m) => {
    if (m.completed) return m;
    let newProgress = m.progress;
    if (m.type === "solve") {
      if (m.subject === "any") newProgress += solvedCount;
      else if (m.subject === subject) newProgress += solvedCount;
    } else if (m.type === "perfect" && isPerfect) {
      if (m.subject === subject) newProgress += 1;
    } else if (m.type === "streak") {
      newProgress = 1;
    }
    const nowComplete = !m.completed && newProgress >= m.target;
    if (nowComplete) {
      rewards.xp += m.xpReward;
      rewards.coins += m.coinReward;
      rewards.names.push(m.description);
    }
    return { ...m, progress: Math.min(newProgress, m.target), completed: nowComplete || m.completed };
  });
  return { state: { ...state, dailyMissions: missions }, rewards };
}
