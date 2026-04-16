import { Item } from "./types";

export const shopItems: Item[] = [
  // Hats
  { id: "hat_crown", name: "おうかん", emoji: "👑", description: "王様の証！", price: 100, slot: "hat" },
  { id: "hat_helmet", name: "ヘルメット", emoji: "⛑️", description: "冒険者の必需品！", price: 50, slot: "hat" },
  { id: "hat_tophat", name: "シルクハット", emoji: "🎩", description: "紳士のたしなみ", price: 80, slot: "hat" },
  { id: "hat_wizard", name: "魔法使いの帽子", emoji: "🧙", description: "魔力が上がる気がする！", price: 120, slot: "hat" },

  // Weapons
  { id: "weapon_sword", name: "つるぎ", emoji: "⚔️", description: "勇者の武器！", price: 60, slot: "weapon" },
  { id: "weapon_staff", name: "まほうのつえ", emoji: "🪄", description: "魔法が使えそう！", price: 80, slot: "weapon" },
  { id: "weapon_shield", name: "たて", emoji: "🛡️", description: "守りを固めよう！", price: 50, slot: "weapon" },
  { id: "weapon_bow", name: "ゆみ", emoji: "🏹", description: "遠くの敵も倒せる！", price: 70, slot: "weapon" },

  // Accessories
  { id: "acc_gem", name: "ほうせき", emoji: "💎", description: "輝くダイヤ！", price: 150, slot: "accessory" },
  { id: "acc_fire", name: "炎のオーラ", emoji: "🔥", description: "熱い戦士の証！", price: 100, slot: "accessory" },
  { id: "acc_star", name: "ほし", emoji: "⭐", description: "スターになれる！", price: 80, slot: "accessory" },
  { id: "acc_lightning", name: "かみなり", emoji: "⚡", description: "最速の証！", price: 90, slot: "accessory" },
];
