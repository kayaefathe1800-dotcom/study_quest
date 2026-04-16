"use client";
import { useState, useEffect } from "react";
import CharacterDisplay from "@/components/CharacterDisplay";
import QuizSession from "@/components/QuizSession";
import ShopModal from "@/components/ShopModal";
import DailyMissions from "@/components/DailyMissions";
import {
  loadGameState,
  saveGameState,
  addXP,
  addCoins,
  checkAndUpdateStreak,
  updateMissions,
} from "@/lib/gameStore";
import { GameState, Subject } from "@/lib/types";
import { questions } from "@/lib/questions";

const SUBJECTS: {
  id: Subject;
  name: string;
  emoji: string;
  desc: string;
  color: string;
  bonus?: string;
}[] = [
  {
    id: "math",
    name: "数学",
    emoji: "📐",
    desc: "方程式・計算・図形",
    color: "from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700",
  },
  {
    id: "japanese",
    name: "国語",
    emoji: "📖",
    desc: "漢字・文法・読解",
    color: "from-pink-600 to-rose-700 hover:from-pink-500 hover:to-rose-600",
  },
  {
    id: "science",
    name: "理科",
    emoji: "🔬",
    desc: "物理・化学・生物・地学",
    color: "from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600",
    bonus: "XP2倍！",
  },
];

type ModalState =
  | { type: "none" }
  | { type: "quiz"; subject: Subject }
  | { type: "review"; subject: Subject }
  | { type: "shop" };

export default function Home() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [modal, setModal] = useState<ModalState>({ type: "none" });
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [notification, setNotification] = useState<{ text: string; key: number } | null>(null);
  const [missionNotifs, setMissionNotifs] = useState<string[]>([]);

  useEffect(() => {
    setGameState(loadGameState());
  }, []);

  if (!gameState) return null;

  function showNotif(text: string) {
    setNotification({ text, key: Date.now() });
    setTimeout(() => setNotification(null), 3000);
  }

  function handleQuizComplete(
    correct: number,
    total: number,
    earnedXP: number,
    wrongIds: string[]
  ) {
    const subject = (modal as { type: "quiz" | "review"; subject: Subject }).subject;
    setModal({ type: "none" });

    const prevLevel = gameState!.level;
    let newState = checkAndUpdateStreak(gameState!);

    const coinsEarned = correct * 5 + (correct === total ? 10 : 0);
    newState = addXP(newState, earnedXP);
    newState = addCoins(newState, coinsEarned);

    // 科目成績を更新
    newState = {
      ...newState,
      subjectStats: {
        ...newState.subjectStats,
        [subject]: {
          correct: newState.subjectStats[subject].correct + correct,
          total: newState.subjectStats[subject].total + total,
        },
      },
    };

    // 間違えた問題を記録（復習モードで正解したら削除）
    const currentWrong = new Set(newState.wrongQuestions);
    if (modal.type === "review") {
      // 復習で正解した問題はリストから削除
      const reviewedIds = gameState!.wrongQuestions.filter((id) => {
        const q = questions.find((q) => q.id === id && q.subject === subject);
        return !!q;
      });
      reviewedIds.forEach((id) => {
        if (!wrongIds.includes(id)) currentWrong.delete(id);
      });
    }
    // 新しい間違いを追加
    wrongIds.forEach((id) => currentWrong.add(id));
    newState = { ...newState, wrongQuestions: Array.from(currentWrong) };

    // ミッション進捗を更新
    const isPerfect = correct === total;
    const { state: stateWithMissions, rewards } = updateMissions(
      newState,
      subject,
      correct,
      isPerfect
    );
    newState = stateWithMissions;

    // ミッション完了報酬を付与
    if (rewards.names.length > 0) {
      newState = addXP(newState, rewards.xp);
      newState = addCoins(newState, rewards.coins);
      setMissionNotifs(rewards.names);
      setTimeout(() => setMissionNotifs([]), 4000);
    }

    saveGameState(newState);
    setGameState(newState);

    if (newState.level > prevLevel) {
      setIsLevelingUp(true);
      setTimeout(() => setIsLevelingUp(false), 2500);
      showNotif(`🎉 レベルアップ！Lv.${newState.level} になった！`);
    } else {
      showNotif(`✅ ${earnedXP} XP + 🪙${coinsEarned} コイン獲得！`);
    }
  }

  function handleBuy(itemId: string, price: number) {
    if (gameState!.coins < price) return;
    const newState = {
      ...gameState!,
      coins: gameState!.coins - price,
      ownedItems: [...gameState!.ownedItems, itemId],
    };
    saveGameState(newState);
    setGameState(newState);
    showNotif("🛒 購入した！");
  }

  function handleEquip(itemId: string, slot: "hat" | "weapon" | "accessory") {
    const newState = {
      ...gameState!,
      equippedItems: { ...gameState!.equippedItems, [slot]: itemId },
    };
    saveGameState(newState);
    setGameState(newState);
    showNotif("⚔️ 装備した！");
  }

  const totalCorrect =
    gameState.subjectStats.math.correct +
    gameState.subjectStats.japanese.correct +
    gameState.subjectStats.science.correct;
  const totalSolved =
    gameState.subjectStats.math.total +
    gameState.subjectStats.japanese.total +
    gameState.subjectStats.science.total;
  const accuracy = totalSolved > 0 ? Math.round((totalCorrect / totalSolved) * 100) : 0;

  // 科目ごとの間違い問題数
  const wrongBySubject = (subject: Subject) =>
    gameState.wrongQuestions.filter((id) =>
      questions.find((q) => q.id === id && q.subject === subject)
    ).length;

  // クイズセッションに渡す復習問題
  const getReviewQuestions = (subject: Subject) => {
    const wrongIds = gameState.wrongQuestions.filter((id) =>
      questions.find((q) => q.id === id && q.subject === subject)
    );
    return questions
      .filter((q) => wrongIds.includes(q.id))
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white pb-10">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <h1 className="font-bold text-lg text-yellow-400 tracking-wider">
          📚 STUDY QUEST
        </h1>
        <button
          onClick={() => setModal({ type: "shop" })}
          className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-4 py-1.5 rounded-lg text-sm transition"
        >
          🏪 ショップ
        </button>
      </div>

      {/* Notification */}
      {notification && (
        <div
          key={notification.key}
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-yellow-400 text-black
            font-bold px-6 py-3 rounded-full shadow-lg text-sm whitespace-nowrap
            animate-bounce"
        >
          {notification.text}
        </div>
      )}

      {/* Mission Complete Notifications */}
      {missionNotifs.length > 0 && (
        <div className="fixed top-28 left-1/2 -translate-x-1/2 z-50 space-y-2">
          {missionNotifs.map((name, i) => (
            <div
              key={i}
              className="bg-green-500 text-white font-bold px-5 py-2 rounded-full shadow-lg
                text-sm whitespace-nowrap text-center animate-float-up"
            >
              🎯 ミッション完了！「{name}」
            </div>
          ))}
        </div>
      )}

      {/* Level Up Overlay */}
      {isLevelingUp && (
        <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center">
          <div className="animate-levelup text-center">
            <p className="text-5xl font-black text-yellow-400 drop-shadow-lg">LEVEL UP!</p>
            <p className="text-2xl font-bold text-white mt-2">Lv. {gameState.level}</p>
          </div>
        </div>
      )}

      <div className="max-w-sm mx-auto px-4 pt-6 space-y-6">
        {/* Character Card */}
        <div
          className={`bg-gray-900 border rounded-2xl p-6 transition-all duration-500 ${
            isLevelingUp ? "border-yellow-400 shadow-lg shadow-yellow-400/20" : "border-gray-700"
          }`}
        >
          <CharacterDisplay gameState={gameState} isLevelingUp={isLevelingUp} />
        </div>

        {/* Daily Missions */}
        <DailyMissions missions={gameState.dailyMissions} />

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          {(["math", "japanese", "science"] as Subject[]).map((s) => {
            const stats = gameState.subjectStats[s];
            const acc = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
            const sub = SUBJECTS.find((x) => x.id === s)!;
            return (
              <div key={s} className="bg-gray-900 border border-gray-700 rounded-xl p-3 text-center">
                <div className="text-xl mb-1">{sub.emoji}</div>
                <p className="text-xs text-gray-400">{sub.name}</p>
                <p className="text-white font-bold text-sm">{acc}%</p>
                <p className="text-gray-500 text-xs">{stats.total}問</p>
              </div>
            );
          })}
        </div>

        {/* Subject Buttons */}
        <div>
          <h2 className="text-gray-400 text-sm font-bold mb-3 uppercase tracking-wider">
            📚 科目を選んで学習しよう
          </h2>
          <div className="space-y-3">
            {SUBJECTS.map((subject) => {
              const wrongCount = wrongBySubject(subject.id);
              return (
                <div key={subject.id} className="space-y-1.5">
                  {/* Normal quiz button */}
                  <button
                    onClick={() => setModal({ type: "quiz", subject: subject.id })}
                    className={`w-full bg-gradient-to-r ${subject.color} rounded-xl p-4 flex items-center
                      justify-between transition active:scale-95 text-left border border-white/10`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{subject.emoji}</span>
                      <div>
                        <p className="font-bold text-white text-lg">{subject.name}</p>
                        <p className="text-white/70 text-xs">{subject.desc}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {subject.bonus && (
                        <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                          {subject.bonus}
                        </span>
                      )}
                      <span className="text-white/70 text-sm">→</span>
                    </div>
                  </button>

                  {/* Review button */}
                  {wrongCount > 0 && (
                    <button
                      onClick={() => setModal({ type: "review", subject: subject.id })}
                      className="w-full bg-orange-900/60 hover:bg-orange-800/70 border border-orange-600/50
                        rounded-xl px-4 py-2.5 flex items-center justify-between transition active:scale-95"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🔄</span>
                        <span className="text-orange-300 text-sm font-bold">
                          {subject.name}の復習
                        </span>
                        <span className="bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                          {wrongCount}問
                        </span>
                      </div>
                      <span className="text-orange-400 text-sm">→</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Overall Stats */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4">
          <h3 className="text-gray-400 text-sm font-bold mb-3">📊 総合成績</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-white">{totalSolved}</p>
              <p className="text-xs text-gray-400">解いた問題数</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-green-400">{accuracy}%</p>
              <p className="text-xs text-gray-400">正解率</p>
            </div>
          </div>
          <div className="mt-3 text-center text-xs text-gray-500">
            {gameState.streak > 0 ? (
              <p>🔥 {gameState.streak}日連続学習中！この調子で続けよう！</p>
            ) : (
              <p>今日も学習して連続記録を作ろう！</p>
            )}
          </div>
        </div>

        {/* Evolution Guide */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4">
          <h3 className="text-gray-400 text-sm font-bold mb-3">⚡ キャラ進化ガイド</h3>
          <div className="flex justify-between items-center">
            {[
              { emoji: "🥚", level: 1 },
              { emoji: "🐣", level: 3 },
              { emoji: "🧒", level: 5 },
              { emoji: "🧑‍🦯", level: 7 },
              { emoji: "😈", level: 9 },
            ].map((c, i) => (
              <div key={i} className="text-center flex-1">
                <div className={`text-2xl ${gameState.level >= c.level ? "opacity-100" : "opacity-25"}`}>
                  {c.emoji}
                </div>
                <p className="text-xs text-gray-500">Lv{c.level}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center mt-2 px-2">
            {[3, 5, 7, 9].map((threshold, i) => (
              <div
                key={i}
                className={`flex-1 h-1.5 mx-1 rounded-full transition-all duration-500 ${
                  gameState.level >= threshold ? "bg-yellow-400" : "bg-gray-700"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      {(modal.type === "quiz" || modal.type === "review") && (
        <QuizSession
          subject={modal.subject}
          reviewQuestions={
            modal.type === "review" ? getReviewQuestions(modal.subject) : undefined
          }
          onComplete={handleQuizComplete}
          onClose={() => setModal({ type: "none" })}
        />
      )}

      {/* Shop Modal */}
      {modal.type === "shop" && (
        <ShopModal
          gameState={gameState}
          onBuy={handleBuy}
          onEquip={handleEquip}
          onClose={() => setModal({ type: "none" })}
        />
      )}
    </main>
  );
}
