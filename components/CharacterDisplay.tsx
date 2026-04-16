"use client";
import { GameState } from "@/lib/types";
import { getXPForNextLevel, LEVEL_THRESHOLDS } from "@/lib/gameStore";
import { getStageForLevel } from "@/lib/characters";
import { shopItems } from "@/lib/items";

interface Props {
  gameState: GameState;
  isLevelingUp?: boolean;
  onSelectCharacter?: () => void;
}

export default function CharacterDisplay({ gameState, isLevelingUp, onSelectCharacter }: Props) {
  const charId = gameState.selectedCharacter ?? "brave";
  const stage = getStageForLevel(charId, gameState.level);
  const currentLevelXP = LEVEL_THRESHOLDS[gameState.level - 1] || 0;
  const nextLevelXP = getXPForNextLevel(gameState.level);
  const progress = Math.min(
    ((gameState.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100,
    100
  );

  const hat = gameState.equippedItems.hat
    ? shopItems.find((i) => i.id === gameState.equippedItems.hat)
    : null;
  const weapon = gameState.equippedItems.weapon
    ? shopItems.find((i) => i.id === gameState.equippedItems.weapon)
    : null;
  const accessory = gameState.equippedItems.accessory
    ? shopItems.find((i) => i.id === gameState.equippedItems.accessory)
    : null;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Character Frame */}
      <div className="relative">
        <div
          className={`w-36 h-36 rounded-2xl bg-gradient-to-b ${stage.color}
            flex items-center justify-center shadow-lg border-4 border-white/20
            ${isLevelingUp ? "animate-char-bounce" : ""}`}
          style={isLevelingUp ? { boxShadow: "0 0 30px rgba(250,204,21,0.8)" } : {}}
        >
          <span className={`text-7xl select-none drop-shadow-lg transition-all duration-300 ${isLevelingUp ? "scale-110" : "scale-100"}`}>
            {stage.emoji}
          </span>

          {hat && <span className="absolute -top-5 text-3xl drop-shadow">{hat.emoji}</span>}
          {weapon && <span className="absolute -right-5 top-4 text-3xl drop-shadow">{weapon.emoji}</span>}
          {accessory && <span className="absolute -left-5 top-4 text-3xl drop-shadow">{accessory.emoji}</span>}

          {/* Level up stars */}
          {isLevelingUp && (
            <div className="absolute inset-0 pointer-events-none">
              {["⭐","✨","💫","⚡","🌟"].map((s, i) => (
                <span key={i} className="absolute text-xl animate-sparkle"
                  style={{ top: `${10 + Math.sin(i * 1.3) * 35}%`, left: `${10 + Math.cos(i * 1.3) * 35}%`,
                    animationDelay: `${i * 0.15}s`, animationDuration: "1s" }}>
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Level badge */}
        <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 font-bold text-sm px-3 py-0.5
          rounded-full border-2 shadow whitespace-nowrap
          ${isLevelingUp ? "bg-yellow-300 border-yellow-500 text-black animate-bounce" : "bg-yellow-400 border-yellow-600 text-black"}`}>
          Lv. {gameState.level}
        </div>
      </div>

      {/* Character Name + Change button */}
      <div className="text-center mt-3 flex items-center gap-2">
        <p className="text-white font-bold text-lg tracking-widest">{stage.stageName}</p>
        {onSelectCharacter && (
          <button onClick={onSelectCharacter}
            className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded-lg transition">
            🎭 変更
          </button>
        )}
      </div>

      {/* XP Bar */}
      <div className="w-full max-w-48">
        <div className="flex justify-between text-xs text-gray-300 mb-1">
          <span>XP</span>
          <span>{gameState.xp} / {nextLevelXP}</span>
        </div>
        <div className="h-4 bg-gray-700 rounded-full border border-gray-600 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-700 rounded-full"
            style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-1 text-yellow-400">
          <span>🪙</span>
          <span className="font-bold">{gameState.coins}</span>
        </div>
        <div className="flex items-center gap-1 text-orange-400">
          <span>🔥</span>
          <span className="font-bold">{gameState.streak}日連続</span>
        </div>
      </div>
    </div>
  );
}
