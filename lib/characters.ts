export interface CharacterDef {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string; // tailwind gradient classes
  stages: {
    minLevel: number;
    maxLevel: number;
    stageName: string;
    emoji: string;
    color: string;
  }[];
}

export const CHARACTER_DEFS: CharacterDef[] = [
  {
    id: "brave",
    name: "勇者",
    emoji: "⚔️",
    description: "真っ向から挑む熱血タイプ！\nどんな敵も正面から倒す！",
    color: "from-yellow-500 to-orange-600",
    stages: [
      { minLevel: 1,  maxLevel: 2,  stageName: "たまご",   emoji: "🥚", color: "from-gray-400 to-gray-500" },
      { minLevel: 3,  maxLevel: 4,  stageName: "ひよこ",   emoji: "🐣", color: "from-yellow-400 to-yellow-500" },
      { minLevel: 5,  maxLevel: 6,  stageName: "見習い",   emoji: "🧒", color: "from-blue-400 to-blue-500" },
      { minLevel: 7,  maxLevel: 8,  stageName: "勇者",     emoji: "🦸", color: "from-orange-400 to-red-500" },
      { minLevel: 9,  maxLevel: 10, stageName: "大勇者",   emoji: "👑", color: "from-yellow-400 to-yellow-600" },
    ],
  },
  {
    id: "wizard",
    name: "魔法使い",
    emoji: "🔮",
    description: "知識と魔法で世界を変える！\n頭脳派の天才タイプ！",
    color: "from-purple-500 to-indigo-700",
    stages: [
      { minLevel: 1,  maxLevel: 2,  stageName: "たまご",   emoji: "🥚", color: "from-gray-400 to-gray-500" },
      { minLevel: 3,  maxLevel: 4,  stageName: "ひな",     emoji: "🐤", color: "from-yellow-300 to-yellow-400" },
      { minLevel: 5,  maxLevel: 6,  stageName: "見習い魔法使い", emoji: "🧙", color: "from-purple-400 to-purple-500" },
      { minLevel: 7,  maxLevel: 8,  stageName: "魔法使い", emoji: "🔮", color: "from-indigo-400 to-purple-600" },
      { minLevel: 9,  maxLevel: 10, stageName: "大賢者",   emoji: "⭐", color: "from-yellow-300 to-purple-500" },
    ],
  },
  {
    id: "ninja",
    name: "忍者",
    emoji: "🥷",
    description: "素早さと冷静さで切り抜ける！\nクールな影の戦士タイプ！",
    color: "from-gray-600 to-gray-900",
    stages: [
      { minLevel: 1,  maxLevel: 2,  stageName: "たまご",   emoji: "🥚", color: "from-gray-400 to-gray-500" },
      { minLevel: 3,  maxLevel: 4,  stageName: "ひよこ",   emoji: "🐥", color: "from-yellow-400 to-yellow-500" },
      { minLevel: 5,  maxLevel: 6,  stageName: "見習い忍者", emoji: "🥷", color: "from-gray-500 to-gray-600" },
      { minLevel: 7,  maxLevel: 8,  stageName: "上忍",     emoji: "🗡️", color: "from-gray-600 to-slate-800" },
      { minLevel: 9,  maxLevel: 10, stageName: "影の王",   emoji: "💀", color: "from-slate-700 to-gray-900" },
    ],
  },
];

export function getCharacterDef(id: string): CharacterDef {
  return CHARACTER_DEFS.find((c) => c.id === id) ?? CHARACTER_DEFS[0];
}

export function getStageForLevel(charId: string, level: number) {
  const def = getCharacterDef(charId);
  return (
    def.stages.find((s) => level >= s.minLevel && level <= s.maxLevel) ??
    def.stages[0]
  );
}
