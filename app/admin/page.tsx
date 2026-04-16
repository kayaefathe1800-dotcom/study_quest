"use client";
import { useState, useEffect } from "react";
import { Question, Subject } from "@/lib/types";
import { questions as defaultQuestions } from "@/lib/questions";

const ADMIN_PASSWORD = "studyquest2024";
const STORAGE_KEY = "study-game-custom-questions";

const SUBJECT_NAMES: Record<Subject, string> = {
  math: "数学",
  japanese: "国語",
  science: "理科",
};

const emptyQuestion = (): Omit<Question, "id"> => ({
  subject: "math",
  difficulty: 1,
  question: "",
  choices: ["", "", "", ""],
  answer: 0,
  explanation: "",
  xpReward: 15,
});

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Question, "id">>(emptyQuestion());
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<Subject | "all">("all");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!authed) return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      setQuestions(stored ? JSON.parse(stored) : defaultQuestions);
    } catch {
      setQuestions(defaultQuestions);
    }
  }, [authed]);

  function saveToStorage(qs: Question[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(qs));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleLogin() {
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true);
      setPwError(false);
    } else {
      setPwError(true);
    }
  }

  function handleAdd() {
    setEditingId(null);
    setForm(emptyQuestion());
    setShowForm(true);
  }

  function handleEdit(q: Question) {
    setEditingId(q.id);
    setForm({
      subject: q.subject,
      difficulty: q.difficulty,
      question: q.question,
      choices: [...q.choices],
      answer: q.answer,
      explanation: q.explanation,
      xpReward: q.xpReward,
    });
    setShowForm(true);
  }

  function handleDelete(id: string) {
    if (!confirm("この問題を削除しますか？")) return;
    const updated = questions.filter((q) => q.id !== id);
    setQuestions(updated);
    saveToStorage(updated);
  }

  function handleSave() {
    if (!form.question.trim() || form.choices.some((c) => !c.trim()) || !form.explanation.trim()) {
      alert("問題・選択肢・解説をすべて入力してください");
      return;
    }
    let updated: Question[];
    if (editingId) {
      updated = questions.map((q) =>
        q.id === editingId ? { ...form, id: editingId } : q
      );
    } else {
      const newId = `custom_${Date.now()}`;
      updated = [...questions, { ...form, id: newId }];
    }
    setQuestions(updated);
    saveToStorage(updated);
    setShowForm(false);
    setEditingId(null);
  }

  function handleReset() {
    if (!confirm("問題をすべて初期状態に戻しますか？（追加・編集した問題は消えます）")) return;
    setQuestions(defaultQuestions);
    saveToStorage(defaultQuestions);
  }

  const filtered = filter === "all" ? questions : questions.filter((q) => q.subject === filter);

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="bg-gray-900 border-2 border-yellow-400 rounded-2xl p-8 w-full max-w-xs text-center">
          <div className="text-5xl mb-4">🔐</div>
          <h1 className="text-white font-bold text-xl mb-1">管理画面</h1>
          <p className="text-gray-400 text-sm mb-6">パスワードを入力してください</p>
          <input
            type="password"
            value={pw}
            onChange={(e) => { setPw(e.target.value); setPwError(false); }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="パスワード"
            className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white
              text-center mb-3 focus:outline-none focus:border-yellow-400 transition"
          />
          {pwError && <p className="text-red-400 text-xs mb-3">パスワードが違います</p>}
          <button
            onClick={handleLogin}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 rounded-xl transition"
          >
            ログイン
          </button>
          <a href="/" className="block mt-4 text-gray-500 text-xs hover:text-gray-300">
            ← アプリに戻る
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <a href="/" className="text-gray-400 hover:text-white text-sm">← 戻る</a>
          <h1 className="font-bold text-lg text-yellow-400">🛠️ 問題管理</h1>
        </div>
        <div className="flex items-center gap-2">
          {saved && <span className="text-green-400 text-xs font-bold animate-pulse">✅ 保存済み</span>}
          <button
            onClick={handleAdd}
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-3 py-1.5 rounded-lg text-sm transition"
          >
            ＋ 追加
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          {(["all", "math", "japanese", "science"] as const).map((s) => {
            const count = s === "all" ? questions.length : questions.filter((q) => q.subject === s).length;
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`rounded-xl p-2 text-center border transition ${
                  filter === s ? "border-yellow-400 bg-yellow-400/10" : "border-gray-700 bg-gray-900"
                }`}
              >
                <p className="text-white font-bold text-lg">{count}</p>
                <p className="text-xs text-gray-400">
                  {s === "all" ? "全科目" : SUBJECT_NAMES[s]}
                </p>
              </button>
            );
          })}
        </div>

        {/* Question List */}
        <div className="space-y-2">
          {filtered.map((q) => (
            <div key={q.id} className="bg-gray-900 border border-gray-700 rounded-xl p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    q.subject === "math" ? "bg-blue-600 text-white" :
                    q.subject === "japanese" ? "bg-pink-600 text-white" :
                    "bg-green-600 text-white"
                  }`}>
                    {SUBJECT_NAMES[q.subject]}
                  </span>
                  <span className="text-yellow-400 text-xs">{"★".repeat(q.difficulty)}{"☆".repeat(3 - q.difficulty)}</span>
                  <span className="text-green-400 text-xs">+{q.xpReward}XP</span>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => handleEdit(q)}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg transition"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="bg-red-700 hover:bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg transition"
                  >
                    削除
                  </button>
                </div>
              </div>
              <p className="text-white text-sm font-medium mb-1">{q.question}</p>
              <div className="grid grid-cols-2 gap-1">
                {q.choices.map((c, i) => (
                  <p key={i} className={`text-xs px-2 py-1 rounded ${
                    i === q.answer ? "bg-green-700/50 text-green-300" : "text-gray-400"
                  }`}>
                    {["ア", "イ", "ウ", "エ"][i]}. {c}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Reset button */}
        <button
          onClick={handleReset}
          className="w-full border border-red-700/50 text-red-400 hover:bg-red-900/20 py-2.5 rounded-xl text-sm transition"
        >
          🔄 初期の問題に戻す
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border-2 border-yellow-400 rounded-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-4 flex items-center justify-between sticky top-0">
              <h2 className="text-black font-bold text-lg">
                {editingId ? "✏️ 問題を編集" : "➕ 問題を追加"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-black/70 hover:text-black text-xl">✕</button>
            </div>

            <div className="p-5 space-y-4">
              {/* Subject */}
              <div>
                <label className="text-xs text-gray-400 font-bold block mb-1.5">科目</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["math", "japanese", "science"] as Subject[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setForm((f) => ({ ...f, subject: s }))}
                      className={`py-2 rounded-xl text-sm font-bold border transition ${
                        form.subject === s
                          ? "border-yellow-400 bg-yellow-400/20 text-yellow-400"
                          : "border-gray-600 text-gray-400 hover:border-gray-500"
                      }`}
                    >
                      {SUBJECT_NAMES[s]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="text-xs text-gray-400 font-bold block mb-1.5">難しさ</label>
                <div className="grid grid-cols-3 gap-2">
                  {([1, 2, 3] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setForm((f) => ({ ...f, difficulty: d }))}
                      className={`py-2 rounded-xl text-sm font-bold border transition ${
                        form.difficulty === d
                          ? "border-yellow-400 bg-yellow-400/20 text-yellow-400"
                          : "border-gray-600 text-gray-400 hover:border-gray-500"
                      }`}
                    >
                      {"★".repeat(d)}
                    </button>
                  ))}
                </div>
              </div>

              {/* XP */}
              <div>
                <label className="text-xs text-gray-400 font-bold block mb-1.5">獲得XP</label>
                <select
                  value={form.xpReward}
                  onChange={(e) => setForm((f) => ({ ...f, xpReward: Number(e.target.value) }))}
                  className="w-full bg-gray-800 border border-gray-600 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-400"
                >
                  {[10, 15, 20, 25, 30].map((v) => (
                    <option key={v} value={v}>{v} XP</option>
                  ))}
                </select>
              </div>

              {/* Question */}
              <div>
                <label className="text-xs text-gray-400 font-bold block mb-1.5">問題文</label>
                <textarea
                  value={form.question}
                  onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
                  placeholder="例：3 × 7 はいくつ？"
                  className="w-full bg-gray-800 border border-gray-600 rounded-xl px-3 py-2.5 text-white text-sm
                    resize-none h-20 focus:outline-none focus:border-yellow-400 transition"
                />
              </div>

              {/* Choices */}
              <div>
                <label className="text-xs text-gray-400 font-bold block mb-1.5">
                  選択肢（緑が正解）
                </label>
                <div className="space-y-2">
                  {form.choices.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <button
                        onClick={() => setForm((f) => ({ ...f, answer: i }))}
                        className={`w-8 h-8 rounded-lg text-sm font-bold border-2 transition shrink-0 ${
                          form.answer === i
                            ? "bg-green-600 border-green-400 text-white"
                            : "border-gray-600 text-gray-400 hover:border-gray-400"
                        }`}
                      >
                        {["ア", "イ", "ウ", "エ"][i]}
                      </button>
                      <input
                        value={c}
                        onChange={(e) => {
                          const newChoices = [...form.choices];
                          newChoices[i] = e.target.value;
                          setForm((f) => ({ ...f, choices: newChoices }));
                        }}
                        placeholder={`選択肢${["ア", "イ", "ウ", "エ"][i]}`}
                        className="flex-1 bg-gray-800 border border-gray-600 rounded-xl px-3 py-2 text-white text-sm
                          focus:outline-none focus:border-yellow-400 transition"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">正解の選択肢のボタンを押して緑にしてね</p>
              </div>

              {/* Explanation */}
              <div>
                <label className="text-xs text-gray-400 font-bold block mb-1.5">解説</label>
                <textarea
                  value={form.explanation}
                  onChange={(e) => setForm((f) => ({ ...f, explanation: e.target.value }))}
                  placeholder="例：3 × 7 = 21 だよ！九九の「さんしち21」！"
                  className="w-full bg-gray-800 border border-gray-600 rounded-xl px-3 py-2.5 text-white text-sm
                    resize-none h-20 focus:outline-none focus:border-yellow-400 transition"
                />
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 rounded-xl transition text-sm"
              >
                {editingId ? "✅ 変更を保存する" : "➕ この問題を追加する"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
