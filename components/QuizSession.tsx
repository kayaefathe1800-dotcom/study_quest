"use client";
import { useState } from "react";
import { Question, Subject } from "@/lib/types";
import { getRandomQuestionsFromList } from "@/lib/useQuestions";

interface Props {
  subject: Subject;
  reviewQuestions?: Question[];
  allQuestions: Question[];
  onComplete: (correct: number, total: number, earnedXP: number, wrongIds: string[]) => void;
  onClose: () => void;
}

const SUBJECT_NAMES: Record<Subject, string> = {
  math: "数学",
  japanese: "国語",
  science: "理科",
};

const SUBJECT_EMOJIS: Record<Subject, string> = {
  math: "📐",
  japanese: "📖",
  science: "🔬",
};

const SUBJECT_COLORS: Record<Subject, string> = {
  math: "from-blue-500 to-blue-700",
  japanese: "from-pink-500 to-rose-600",
  science: "from-green-500 to-emerald-700",
};

export default function QuizSession({ subject, reviewQuestions, allQuestions, onComplete, onClose }: Props) {
  const [questions] = useState<Question[]>(
    () => reviewQuestions ?? getRandomQuestionsFromList(allQuestions, subject, 5)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [sparkle, setSparkle] = useState(false);
  const [shake, setShake] = useState(false);
  const [xpFloats, setXpFloats] = useState<{ id: number; value: number }[]>([]);
  const isReview = !!reviewQuestions;

  const question = questions[currentIndex];

  function handleSelect(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    setShowResult(true);
    const isCorrect = idx === question.answer;
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
      setTotalXP((x) => x + question.xpReward);
      setSparkle(true);
      const floatId = Date.now();
      setXpFloats((prev) => [...prev, { id: floatId, value: question.xpReward }]);
      setTimeout(() => {
        setSparkle(false);
        setXpFloats((prev) => prev.filter((f) => f.id !== floatId));
      }, 1200);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setWrongIds((prev) => [...prev, question.id]);
    }
    setAnswers((prev) => [...prev, isCorrect]);
  }

  function handleNext() {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelected(null);
    setShowResult(false);
  }

  if (finished) {
    const bonusXP = correctCount === questions.length ? 20 : 0;
    const finalXP = totalXP + bonusXP;
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 border-2 border-yellow-400 rounded-2xl p-6 w-full max-w-sm text-center">
          <div className="text-5xl mb-3">
            {correctCount === questions.length ? "🎉" : correctCount >= 3 ? "😊" : "😅"}
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">
            {isReview ? "復習完了！" : "クイズ終了！"}
          </h2>
          <p className="text-gray-400 mb-4">
            {SUBJECT_EMOJIS[subject]} {SUBJECT_NAMES[subject]}
            {isReview && <span className="ml-2 text-orange-400 text-xs font-bold">復習モード</span>}
          </p>

          <div className="flex justify-center gap-2 mb-4">
            {answers.map((correct, i) => (
              <span key={i} className="text-2xl">
                {correct ? "⭕" : "❌"}
              </span>
            ))}
          </div>

          <div className="bg-gray-800 rounded-xl p-4 mb-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">正解数</span>
              <span className="text-white font-bold">{correctCount} / {questions.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">獲得XP</span>
              <span className="text-green-400 font-bold">+{totalXP} XP</span>
            </div>
            {bonusXP > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-yellow-400">全問正解ボーナス！</span>
                <span className="text-yellow-400 font-bold">+{bonusXP} XP</span>
              </div>
            )}
            <div className="border-t border-gray-700 pt-2 flex justify-between">
              <span className="text-gray-300 font-bold">合計XP</span>
              <span className="text-yellow-400 font-bold text-lg">+{finalXP} XP</span>
            </div>
          </div>

          {correctCount === questions.length && (
            <p className="text-yellow-400 font-bold text-sm mb-3">🌟 パーフェクト！すごい！</p>
          )}

          <button
            onClick={() => onComplete(correctCount, questions.length, finalXP, wrongIds)}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 rounded-xl transition"
          >
            結果を反映する
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border-2 border-gray-600 rounded-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-r ${SUBJECT_COLORS[subject]} p-4 flex items-center justify-between`}>
          <div>
            <p className="text-white/80 text-sm flex items-center gap-1">
              {SUBJECT_EMOJIS[subject]} {SUBJECT_NAMES[subject]}
              {isReview && <span className="bg-orange-400 text-black text-xs font-bold px-1.5 py-0.5 rounded ml-1">復習</span>}
            </p>
            <p className="text-white font-bold">
              問題 {currentIndex + 1} / {questions.length}
            </p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white text-xl">✕</button>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-gray-700">
          <div
            className="h-full bg-white/50 transition-all duration-300"
            style={{ width: `${(currentIndex / questions.length) * 100}%` }}
          />
        </div>

        <div className="p-5 relative">
          {/* XP float animations */}
          {xpFloats.map((f) => (
            <div
              key={f.id}
              className="absolute top-4 right-4 text-green-400 font-black text-xl animate-float-up pointer-events-none z-10"
            >
              +{f.value} XP
            </div>
          ))}

          {/* Sparkle overlay */}
          {sparkle && (
            <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
              {["⭐", "✨", "💫", "⚡"].map((s, i) => (
                <span
                  key={i}
                  className="absolute text-2xl animate-sparkle"
                  style={{
                    top: `${20 + Math.sin(i * 1.5) * 30}%`,
                    left: `${20 + Math.cos(i * 1.5) * 40}%`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          )}

          {/* Difficulty */}
          <div className="flex gap-1 mb-3">
            {[1, 2, 3].map((d) => (
              <span key={d} className={`text-xs ${d <= question.difficulty ? "text-yellow-400" : "text-gray-600"}`}>★</span>
            ))}
            <span className="text-xs text-gray-500 ml-1">難しさ</span>
          </div>

          {/* Question */}
          <p className="text-white font-bold text-base mb-5 leading-relaxed min-h-12">
            {question.question}
          </p>

          {/* Choices */}
          <div className={`space-y-2.5 ${shake ? "animate-shake" : ""}`}>
            {question.choices.map((choice, idx) => {
              let style = "bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700";
              if (selected !== null) {
                if (idx === question.answer) {
                  style = "bg-green-600 border-green-400 text-white";
                } else if (idx === selected && idx !== question.answer) {
                  style = "bg-red-600 border-red-400 text-white";
                } else {
                  style = "bg-gray-800 border-gray-700 text-gray-500";
                }
              }
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 font-medium transition text-sm ${style}`}
                >
                  <span className="text-gray-400 mr-2">{["ア", "イ", "ウ", "エ"][idx]}.</span>
                  {choice}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showResult && (
            <div className="mt-4 p-3 bg-blue-900/40 border border-blue-500/30 rounded-xl">
              <p className="text-xs text-blue-300 font-bold mb-1">
                {selected === question.answer ? "✅ 正解！" : "❌ 不正解…"}
              </p>
              <p className="text-xs text-gray-300 leading-relaxed">{question.explanation}</p>
              {selected === question.answer && (
                <p className="text-xs text-green-400 font-bold mt-1">+{question.xpReward} XP 獲得！</p>
              )}
            </div>
          )}

          {showResult && (
            <button
              onClick={handleNext}
              className="w-full mt-4 bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 rounded-xl transition"
            >
              {currentIndex + 1 >= questions.length ? "結果を見る" : "次の問題 →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
