import { Subject } from "./types";

export interface Category {
  id: string;
  name: string;
  emoji: string;
  subject: Subject;
}

export const CATEGORIES: Category[] = [
  // 数学
  { id: "math_calc",    name: "四則計算",     emoji: "➕", subject: "math" },
  { id: "math_frac",    name: "分数",         emoji: "½",  subject: "math" },
  { id: "math_shape",   name: "図形・面積",   emoji: "📐", subject: "math" },
  { id: "math_percent", name: "割合・百分率", emoji: "📊", subject: "math" },
  { id: "math_speed",   name: "速さ・比",     emoji: "🏃", subject: "math" },

  // 国語
  { id: "jp_read",  name: "漢字の読み", emoji: "👁️", subject: "japanese" },
  { id: "jp_write", name: "漢字の書き", emoji: "✏️", subject: "japanese" },
  { id: "jp_vocab", name: "語彙・熟語", emoji: "📚", subject: "japanese" },
  { id: "jp_idiom", name: "四字熟語",   emoji: "🀄", subject: "japanese" },

  // 論理思考
  { id: "logic_seq",    name: "数列・パターン", emoji: "🔢", subject: "logic" },
  { id: "logic_reason", name: "推理・論法",     emoji: "🔍", subject: "logic" },
  { id: "logic_count",  name: "場合の数",       emoji: "🎲", subject: "logic" },
];

export function getCategoriesBySubject(subject: Subject): Category[] {
  return CATEGORIES.filter((c) => c.subject === subject);
}

const SETTINGS_KEY = "study-game-active-categories";

export function loadActiveCategories(): Set<string> {
  if (typeof window === "undefined") return new Set(CATEGORIES.map((c) => c.id));
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) return new Set(CATEGORIES.map((c) => c.id));
    return new Set(JSON.parse(stored));
  } catch {
    return new Set(CATEGORIES.map((c) => c.id));
  }
}

export function saveActiveCategories(active: Set<string>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(Array.from(active)));
}
