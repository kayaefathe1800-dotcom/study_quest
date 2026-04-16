"use client";
import { CHARACTER_DEFS, getStageForLevel } from "@/lib/characters";

interface Props {
  currentId: string;
  level: number;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export default function CharacterSelect({ currentId, level, onSelect, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-gray-900 border-2 border-yellow-400 rounded-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-4 flex items-center justify-between">
          <div>
            <h2 className="text-black font-bold text-xl">🎭 キャラクター選択</h2>
            <p className="text-black/70 text-sm">3人の中から1人を選ぼう！</p>
          </div>
          <button onClick={onClose}
            className="text-black bg-black/20 hover:bg-black/30 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
            ✕
          </button>
        </div>

        <div className="p-4 space-y-3">
          {CHARACTER_DEFS.map((char) => {
            const stage = getStageForLevel(char.id, level);
            const isSelected = char.id === currentId;
            return (
              <button
                key={char.id}
                onClick={() => { onSelect(char.id); onClose(); }}
                className={`w-full rounded-2xl border-2 p-4 flex items-center gap-4 transition active:scale-95 text-left
                  ${isSelected
                    ? "border-yellow-400 bg-yellow-400/10"
                    : "border-gray-700 bg-gray-800 hover:border-gray-500"
                  }`}
              >
                {/* Character preview */}
                <div className={`w-20 h-20 rounded-xl bg-gradient-to-b ${stage.color}
                  flex items-center justify-center shrink-0 shadow-lg border-2 border-white/20`}>
                  <span className="text-4xl">{stage.emoji}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{char.emoji}</span>
                    <p className="text-white font-bold text-lg">{char.name}</p>
                    {isSelected && (
                      <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">選択中</span>
                    )}
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed whitespace-pre-line">
                    {char.description}
                  </p>
                  {/* Evolution preview */}
                  <div className="flex items-center gap-1 mt-2">
                    {char.stages.map((s, i) => (
                      <div key={i} className="flex items-center gap-0.5">
                        <span className={`text-base ${level >= s.minLevel ? "opacity-100" : "opacity-25"}`}>
                          {s.emoji}
                        </span>
                        {i < char.stages.length - 1 && (
                          <span className="text-gray-600 text-xs">→</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}

          <p className="text-center text-xs text-gray-500 pt-1">
            ※キャラを変えてもレベル・XP・アイテムはそのまま！
          </p>
        </div>
      </div>
    </div>
  );
}
