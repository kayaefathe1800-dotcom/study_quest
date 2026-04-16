import { Item } from "./types";

export const shopItems: Item[] = [
  // ===== 帽子 =====
  { id: "hat_helmet",  name: "ヘルメット",    emoji: "⛑️",  description: "冒険者の必需品！",    price: 50,  slot: "hat" },
  { id: "hat_crown",   name: "おうかん",      emoji: "👑",  description: "王様の証！",          price: 120, slot: "hat" },
  { id: "hat_tophat",  name: "シルクハット",  emoji: "🎩",  description: "紳士のたしなみ",      price: 80,  slot: "hat" },
  { id: "hat_wizard",  name: "魔法使いの帽子",emoji: "🧙",  description: "魔力が上がる気がする！",price: 130, slot: "hat" },
  { id: "hat_party",   name: "パーティーハット",emoji:"🎉", description: "お祝いムード全開！",  price: 40,  slot: "hat" },
  { id: "hat_grad",    name: "博士帽",        emoji: "🎓",  description: "勉強の神様に近づく！",price: 150, slot: "hat" },
  { id: "hat_ninja",   name: "忍者ずきん",    emoji: "🥷",  description: "影に溶け込む…",       price: 90,  slot: "hat" },
  { id: "hat_cowboy",  name: "カウボーイハット",emoji:"🤠", description: "荒野の勇者！",        price: 70,  slot: "hat" },

  // ===== 武器・道具 =====
  { id: "weapon_sword",   name: "つるぎ",      emoji: "⚔️", description: "勇者の武器！",       price: 60,  slot: "weapon" },
  { id: "weapon_staff",   name: "まほうのつえ",emoji: "🪄", description: "魔法が使えそう！",   price: 80,  slot: "weapon" },
  { id: "weapon_shield",  name: "たて",        emoji: "🛡️", description: "守りを固めよう！",   price: 50,  slot: "weapon" },
  { id: "weapon_bow",     name: "ゆみ",        emoji: "🏹", description: "遠くの敵も倒せる！", price: 70,  slot: "weapon" },
  { id: "weapon_trident", name: "さんさのやり",emoji: "🔱", description: "海の王者の武器！",   price: 100, slot: "weapon" },
  { id: "weapon_bomb",    name: "ばくだん",    emoji: "💣", description: "ドカーン！",         price: 90,  slot: "weapon" },
  { id: "weapon_shuriken",name: "しゅりけん",  emoji: "✡️", description: "忍者の必殺技！",     price: 75,  slot: "weapon" },
  { id: "weapon_book",    name: "まほうの本",  emoji: "📖", description: "知識は最強の武器！", price: 110, slot: "weapon" },
  { id: "weapon_pencil",  name: "まほうのえんぴつ",emoji:"✏️",description:"これで何でも書ける！",price:45, slot: "weapon" },

  // ===== アクセサリー =====
  { id: "acc_gem",       name: "ほうせき",      emoji: "💎", description: "輝くダイヤ！",       price: 150, slot: "accessory" },
  { id: "acc_fire",      name: "炎のオーラ",    emoji: "🔥", description: "熱い戦士の証！",     price: 100, slot: "accessory" },
  { id: "acc_star",      name: "ほし",          emoji: "⭐", description: "スターになれる！",   price: 80,  slot: "accessory" },
  { id: "acc_lightning", name: "かみなり",      emoji: "⚡", description: "最速の証！",         price: 90,  slot: "accessory" },
  { id: "acc_rainbow",   name: "レインボーオーラ",emoji:"🌈",description: "七色に輝く！",      price: 200, slot: "accessory" },
  { id: "acc_moon",      name: "みかづき",      emoji: "🌙", description: "夜の加護を受ける！", price: 110, slot: "accessory" },
  { id: "acc_dragon",    name: "ドラゴンのつばさ",emoji:"🐉",description:"最強の力が宿る！",  price: 250, slot: "accessory" },
  { id: "acc_music",     name: "音符",          emoji: "🎵", description: "リズムに乗って！",   price: 60,  slot: "accessory" },
  { id: "acc_clover",    name: "四つ葉のクローバー",emoji:"🍀",description:"幸運が訪れる！", price: 130, slot: "accessory" },
  { id: "acc_skull",     name: "どくろ",        emoji: "💀", description: "最強の威圧感！",     price: 180, slot: "accessory" },
];
