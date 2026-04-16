"use client";
import { useState, useEffect } from "react";
import { Question, Subject } from "@/lib/types";
import { questions as defaultQuestions } from "@/lib/questions";
import { CATEGORIES, getCategoriesBySubject, loadActiveCategories, saveActiveCategories } from "@/lib/categories";

const ADMIN_PASSWORD = "studyquest2024";
const STORAGE_KEY = "study-game-custom-questions";

const SUBJECT_NAMES: Record<Subject, string> = { math: "数学", japanese: "国語", logic: "論理思考" };
const SUBJECT_EMOJIS: Record<Subject, string> = { math: "📐", japanese: "📖", logic: "🧩" };
const SUBJECT_COLORS: Record<Subject, { tab: string; badge: string }> = {
  math:     { tab: "border-blue-400 text-blue-400",   badge: "bg-blue-600" },
  japanese: { tab: "border-pink-400 text-pink-400",   badge: "bg-pink-600" },
  logic:    { tab: "border-purple-400 text-purple-400", badge: "bg-purple-600" },
};

const emptyForm = (subject: Subject, category: string): Omit<Question, "id"> => ({
  subject, category, difficulty: 1,
  question: "", choices: ["", "", "", ""], answer: 0, explanation: "", xpReward: 15,
});

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set());
  const [activeSubject, setActiveSubject] = useState<Subject>("math");
  const [filterCategory, setFilterCategory] = useState<string | "all">("all");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Question, "id">>(emptyForm("math", "math_calc"));
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!authed) return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      setQuestions(stored ? JSON.parse(stored) : defaultQuestions);
    } catch { setQuestions(defaultQuestions); }
    setActiveCategories(loadActiveCategories());
  }, [authed]);

  function saveQ(qs: Question[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(qs));
    flashSaved();
  }
  function saveCats(cats: Set<string>) {
    saveActiveCategories(cats);
    flashSaved();
  }
  function flashSaved() { setSaved(true); setTimeout(() => setSaved(false), 2000); }

  function toggleCategory(catId: string) {
    const next = new Set(activeCategories);
    next.has(catId) ? next.delete(catId) : next.add(catId);
    setActiveCategories(next);
    saveCats(next);
  }

  function toggleAllInSubject(subject: Subject, on: boolean) {
    const next = new Set(activeCategories);
    CATEGORIES.filter((c) => c.subject === subject).forEach((c) =>
      on ? next.add(c.id) : next.delete(c.id)
    );
    setActiveCategories(next);
    saveCats(next);
  }

  function handleAdd() {
    const cats = getCategoriesBySubject(activeSubject);
    const defaultCat = cats[0]?.id ?? "";
    setEditingId(null);
    setForm(emptyForm(activeSubject, defaultCat));
    setShowForm(true);
  }

  function handleEdit(q: Question) {
    setEditingId(q.id);
    setForm({ subject: q.subject, category: q.category, difficulty: q.difficulty,
      question: q.question, choices: [...q.choices], answer: q.answer,
      explanation: q.explanation, xpReward: q.xpReward });
    setShowForm(true);
  }

  function handleDelete(id: string) {
    if (!confirm("この問題を削除しますか？")) return;
    const updated = questions.filter((q) => q.id !== id);
    setQuestions(updated); saveQ(updated);
  }

  function handleSave() {
    if (!form.question.trim() || form.choices.some((c) => !c.trim()) || !form.explanation.trim()) {
      alert("問題・選択肢・解説をすべて入力してください");
      return;
    }
    let updated: Question[];
    if (editingId) {
      updated = questions.map((q) => q.id === editingId ? { ...form, id: editingId } : q);
    } else {
      updated = [...questions, { ...form, id: `custom_${Date.now()}` }];
    }
    setQuestions(updated); saveQ(updated);
    setShowForm(false); setEditingId(null);
  }

  function handleReset() {
    if (!confirm("問題をすべて初期状態に戻しますか？")) return;
    setQuestions(defaultQuestions); saveQ(defaultQuestions);
  }

  const subjectQs = questions.filter((q) => q.subject === activeSubject);
  const displayQs = filterCategory === "all" ? subjectQs : subjectQs.filter((q) => q.category === filterCategory);
  const subjectCats = getCategoriesBySubject(activeSubject);
  const allOn = subjectCats.every((c) => activeCategories.has(c.id));

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="bg-gray-900 border-2 border-yellow-400 rounded-2xl p-8 w-full max-w-xs text-center">
          <div className="text-5xl mb-4">🔐</div>
          <h1 className="text-white font-bold text-xl mb-1">管理画面</h1>
          <p className="text-gray-400 text-sm mb-6">パスワードを入力してください</p>
          <input type="password" value={pw}
            onChange={(e) => { setPw(e.target.value); setPwError(false); }}
            onKeyDown={(e) => e.key === "Enter" && (pw === ADMIN_PASSWORD ? (setAuthed(true), setPwError(false)) : setPwError(true))}
            placeholder="パスワード"
            className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white text-center mb-3 focus:outline-none focus:border-yellow-400"
          />
          {pwError && <p className="text-red-400 text-xs mb-3">パスワードが違います</p>}
          <button onClick={() => pw === ADMIN_PASSWORD ? (setAuthed(true), setPwError(false)) : setPwError(true)}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 rounded-xl transition">
            ログイン
          </button>
          <a href="/" className="block mt-4 text-gray-500 text-xs hover:text-gray-300">← アプリに戻る</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-24">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <a href="/" className="text-gray-400 hover:text-white text-sm">← 戻る</a>
          <h1 className="font-bold text-lg text-yellow-400">🛠️ 問題管理</h1>
        </div>
        <div className="flex items-center gap-2">
          {saved && <span className="text-green-400 text-xs font-bold animate-pulse">✅ 保存済み</span>}
          <button onClick={handleAdd}
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-3 py-1.5 rounded-lg text-sm transition">
            ＋ 追加
          </button>
        </div>
      </div>

      {/* Subject Tabs */}
      <div className="flex border-b border-gray-800 bg-gray-900 sticky top-14 z-20">
        {(["math", "japanese", "logic"] as Subject[]).map((s) => (
          <button key={s} onClick={() => { setActiveSubject(s); setFilterCategory("all"); }}
            className={`flex-1 py-3 text-sm font-bold border-b-2 transition
              ${activeSubject === s ? SUBJECT_COLORS[s].tab : "border-transparent text-gray-500 hover:text-gray-300"}`}>
            {SUBJECT_EMOJIS[s]} {SUBJECT_NAMES[s]}
          </button>
        ))}
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">

        {/* ── カテゴリーON/OFF ── */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-300">
              📋 出題するカテゴリーを選ぶ
            </h2>
            <button onClick={() => toggleAllInSubject(activeSubject, !allOn)}
              className={`text-xs font-bold px-3 py-1 rounded-lg transition ${
                allOn ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-yellow-400 text-black hover:bg-yellow-300"}`}>
              {allOn ? "全部OFF" : "全部ON"}
            </button>
          </div>
          <div className="space-y-2">
            {subjectCats.map((cat) => {
              const on = activeCategories.has(cat.id);
              const count = questions.filter((q) => q.category === cat.id).length;
              return (
                <button key={cat.id} onClick={() => toggleCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition
                    ${on ? "border-yellow-400 bg-yellow-400/10" : "border-gray-700 bg-gray-800 opacity-50"}`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold border-2 ${
                      on ? "bg-yellow-400 border-yellow-400 text-black" : "border-gray-500 text-transparent"}`}>
                      ✓
                    </span>
                    <span className="text-lg">{cat.emoji}</span>
                    <span className="text-white font-medium text-sm">{cat.name}</span>
                  </div>
                  <span className="text-gray-400 text-xs">{count}問</span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            ✅ チェックしたカテゴリーの問題だけがクイズに出るよ
          </p>
        </div>

        {/* ── 問題一覧 ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-300">
              📝 問題一覧（{displayQs.length}問）
            </h2>
            {/* カテゴリーフィルター */}
            <select value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-2 py-1 text-white text-xs focus:outline-none">
              <option value="all">全カテゴリー</option>
              {subjectCats.map((c) => (
                <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            {displayQs.length === 0 && (
              <div className="text-center text-gray-500 text-sm py-8">
                このカテゴリーに問題がありません。<br />「＋ 追加」から問題を追加しよう！
              </div>
            )}
            {displayQs.map((q) => {
              const cat = CATEGORIES.find((c) => c.id === q.category);
              const on = activeCategories.has(q.category);
              return (
                <div key={q.id} className={`bg-gray-900 border rounded-xl p-4 transition ${on ? "border-gray-700" : "border-gray-800 opacity-50"}`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${SUBJECT_COLORS[q.subject].badge} text-white`}>
                        {cat?.emoji} {cat?.name ?? q.category}
                      </span>
                      <span className="text-yellow-400 text-xs">{"★".repeat(q.difficulty)}{"☆".repeat(3 - q.difficulty)}</span>
                      <span className="text-green-400 text-xs">+{q.xpReward}XP</span>
                      {!on && <span className="text-xs text-gray-500">（出題OFF）</span>}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => handleEdit(q)}
                        className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg transition">
                        編集
                      </button>
                      <button onClick={() => handleDelete(q.id)}
                        className="bg-red-700 hover:bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg transition">
                        削除
                      </button>
                    </div>
                  </div>
                  <p className="text-white text-sm font-medium mb-2">{q.question}</p>
                  <div className="grid grid-cols-2 gap-1">
                    {q.choices.map((c, i) => (
                      <p key={i} className={`text-xs px-2 py-1 rounded ${i === q.answer ? "bg-green-700/50 text-green-300" : "text-gray-400"}`}>
                        {["ア","イ","ウ","エ"][i]}. {c}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button onClick={handleReset}
          className="w-full border border-red-700/50 text-red-400 hover:bg-red-900/20 py-2.5 rounded-xl text-sm transition">
          🔄 初期の問題に戻す
        </button>
      </div>

      {/* ── 問題追加・編集フォーム ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border-2 border-yellow-400 rounded-2xl w-full max-w-sm max-h-[92vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-4 flex items-center justify-between sticky top-0 rounded-t-2xl">
              <h2 className="text-black font-bold text-lg">
                {editingId ? "✏️ 問題を編集" : "➕ 問題を追加"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-black/70 hover:text-black text-xl font-bold">✕</button>
            </div>

            <div className="p-5 space-y-4">
              {/* 科目 */}
              <div>
                <label className="text-xs text-gray-400 font-bold block mb-1.5">科目</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["math", "japanese", "logic"] as Subject[]).map((s) => (
                    <button key={s} onClick={() => {
                      const cats = getCategoriesBySubject(s);
                      setForm((f) => ({ ...f, subject: s, category: cats[0]?.id ?? "" }));
                    }}
                      className={`py-2 rounded-xl text-sm font-bold border-2 transition
                        ${form.subject === s ? "border-yellow-400 bg-yellow-400/20 text-yellow-400" : "border-gray-600 text-gray-400"}`}>
                      {SUBJECT_EMOJIS[s]} {SUBJECT_NAMES[s]}
                    </button>
                  ))}
                </div>
              </div>

              {/* カテゴリー */}
              <div>
                <label className="text-xs text-gray-400 font-bold block mb-1.5">カテゴリー</label>
                <div className="grid grid-cols-2 gap-2">
                  {getCategoriesBySubject(form.subject).map((cat) => (
                    <button key={cat.id} onClick={() => setForm((f) => ({ ...f, category: cat.id }))}
                      className={`py-2 px-3 rounded-xl text-sm font-bold border-2 transition text-left
                        ${form.category === cat.id ? "border-yellow-400 bg-yellow-400/20 text-yellow-400" : "border-gray-600 text-gray-400"}`}>
                      {cat.emoji} {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 難しさ */}
              <div>
                <label className="text-xs text-gray-400 font-bold block mb-1.5">難しさ</label>
                <div className="grid grid-cols-3 gap-2">
                  {([1, 2, 3] as const).map((d) => (
                    <button key={d} onClick={() => setForm((f) => ({ ...f, difficulty: d }))}
                      className={`py-2 rounded-xl text-sm font-bold border-2 transition
                        ${form.difficulty === d ? "border-yellow-400 bg-yellow-400/20 text-yellow-400" : "border-gray-600 text-gray-400"}`}>
                      {"★".repeat(d)}
                    </button>
                  ))}
                </div>
              </div>

              {/* XP */}
              <div>
                <label className="text-xs text-gray-400 font-bold block mb-1.5">獲得XP</label>
                <select value={form.xpReward} onChange={(e) => setForm((f) => ({ ...f, xpReward: Number(e.target.value) }))}
                  className="w-full bg-gray-800 border border-gray-600 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-400">
                  {[10, 15, 20, 25, 30].map((v) => <option key={v} value={v}>{v} XP</option>)}
                </select>
              </div>

              {/* 問題文 */}
              <div>
                <label className="text-xs text-gray-400 font-bold block mb-1.5">問題文</label>
                <textarea value={form.question} onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
                  placeholder="例：3 × 7 はいくつ？"
                  className="w-full bg-gray-800 border border-gray-600 rounded-xl px-3 py-2.5 text-white text-sm resize-none h-20 focus:outline-none focus:border-yellow-400" />
              </div>

              {/* 選択肢 */}
              <div>
                <label className="text-xs text-gray-400 font-bold block mb-1.5">
                  選択肢　<span className="text-green-400">（緑のボタン = 正解）</span>
                </label>
                <div className="space-y-2">
                  {form.choices.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <button onClick={() => setForm((f) => ({ ...f, answer: i }))}
                        className={`w-9 h-9 rounded-lg text-sm font-bold border-2 transition shrink-0
                          ${form.answer === i ? "bg-green-600 border-green-400 text-white" : "border-gray-600 text-gray-400 hover:border-gray-400"}`}>
                        {["ア","イ","ウ","エ"][i]}
                      </button>
                      <input value={c} onChange={(e) => {
                        const nc = [...form.choices]; nc[i] = e.target.value;
                        setForm((f) => ({ ...f, choices: nc }));
                      }} placeholder={`選択肢${["ア","イ","ウ","エ"][i]}`}
                        className="flex-1 bg-gray-800 border border-gray-600 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-400" />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">正解の選択肢のボタンを押して緑にしてね</p>
              </div>

              {/* 解説 */}
              <div>
                <label className="text-xs text-gray-400 font-bold block mb-1.5">解説</label>
                <textarea value={form.explanation} onChange={(e) => setForm((f) => ({ ...f, explanation: e.target.value }))}
                  placeholder="例：3 × 7 = 21 だよ！九九の「さんしち21」！"
                  className="w-full bg-gray-800 border border-gray-600 rounded-xl px-3 py-2.5 text-white text-sm resize-none h-20 focus:outline-none focus:border-yellow-400" />
              </div>

              <button onClick={handleSave}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 rounded-xl transition text-sm">
                {editingId ? "✅ 変更を保存する" : "➕ この問題を追加する"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
