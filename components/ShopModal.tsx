"use client";
import { GameState } from "@/lib/types";
import { shopItems } from "@/lib/items";

interface Props {
  gameState: GameState;
  onBuy: (itemId: string, price: number) => void;
  onEquip: (itemId: string, slot: "hat" | "weapon" | "accessory") => void;
  onClose: () => void;
}

export default function ShopModal({ gameState, onBuy, onEquip, onClose }: Props) {
  const slots = ["hat", "weapon", "accessory"] as const;
  const slotNames = { hat: "帽子", weapon: "ぶき", accessory: "アクセサリー" };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border-2 border-yellow-400 rounded-2xl w-full max-w-sm overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-black font-bold text-xl">🏪 アイテムショップ</h2>
            <p className="text-black/70 text-sm">🪙 所持コイン: {gameState.coins}</p>
          </div>
          <button onClick={onClose} className="text-black/70 hover:text-black text-xl">✕</button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-6">
          {slots.map((slot) => (
            <div key={slot}>
              <h3 className="text-yellow-400 font-bold text-sm mb-3 uppercase tracking-wider">
                {slotNames[slot]}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {shopItems.filter((item) => item.slot === slot).map((item) => {
                  const owned = gameState.ownedItems.includes(item.id);
                  const equipped = gameState.equippedItems[slot] === item.id;
                  const canAfford = gameState.coins >= item.price;

                  return (
                    <div
                      key={item.id}
                      className={`relative rounded-xl border-2 p-3 text-center transition
                        ${equipped ? "border-yellow-400 bg-yellow-400/10" : "border-gray-600 bg-gray-800"}`}
                    >
                      {equipped && (
                        <span className="absolute top-1 right-1 text-xs bg-yellow-400 text-black px-1 rounded font-bold">
                          装備中
                        </span>
                      )}
                      <div className="text-3xl mb-1">{item.emoji}</div>
                      <p className="text-white text-xs font-bold mb-0.5">{item.name}</p>
                      <p className="text-gray-400 text-xs mb-2">{item.description}</p>

                      {owned ? (
                        <button
                          onClick={() => onEquip(item.id, slot)}
                          className={`w-full text-xs py-1.5 rounded-lg font-bold transition
                            ${equipped
                              ? "bg-gray-600 text-gray-400 cursor-default"
                              : "bg-blue-500 hover:bg-blue-400 text-white"
                            }`}
                          disabled={equipped}
                        >
                          {equipped ? "装備中" : "装備する"}
                        </button>
                      ) : (
                        <button
                          onClick={() => onBuy(item.id, item.price)}
                          disabled={!canAfford}
                          className={`w-full text-xs py-1.5 rounded-lg font-bold transition
                            ${canAfford
                              ? "bg-yellow-400 hover:bg-yellow-300 text-black"
                              : "bg-gray-700 text-gray-500 cursor-not-allowed"
                            }`}
                        >
                          🪙 {item.price}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
