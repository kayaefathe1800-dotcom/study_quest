"use client";
import { useState } from "react";
import { GameState } from "@/lib/types";

interface Props {
  gameState: GameState;
  onRestore: (state: GameState) => void;
  onClose: () => void;
}

export default function BackupModal({ gameState, onRestore, onClose }: Props) {
  const [tab, setTab] = useState<"save" | "load">("save");
  const [inputCode, setInputCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const saveCode = btoa(encodeURIComponent(JSON.stringify(gameState)));

  function handleCopy() {
    navigator.clipboard.writeText(saveCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleRestore() {
    setError("");
    try {
      const decoded = JSON.parse(decodeURIComponent(atob(inputCode.trim())));
      if (typeof decoded.xp !== "number" || typeof decoded.level !== "number") {
        setError("コードが正しくありません。もう一度確認してください。");
        return;
      }
      onRestore(decoded);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch {
      setError("コードが正しくありません。もう一度確認してください。");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border-2 border-blue-500 rounded-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">💾 データのバックアップ</h2>
            <p className="text-white/70 text-xs">コードでセーブ・ロードできるよ</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white text-xl">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setTab("save")}
            className={`flex-1 py-3 text-sm font-bold transition ${
              tab === "save"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            📤 セーブコードを作る
          </button>
          <button
            onClick={() => setTab("load")}
            className={`flex-1 py-3 text-sm font-bold transition ${
              tab === "load"
                ? "text-green-400 border-b-2 border-green-400"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            📥 コードで復元する
          </button>
        </div>

        <div className="p-5">
          {tab === "save" && (
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-2">📋 現在のセーブコード</p>
                <p className="text-white text-xs font-mono break-all leading-relaxed select-all bg-gray-700 rounded-lg p-2">
                  {saveCode}
                </p>
              </div>

              <button
                onClick={handleCopy}
                className={`w-full py-3 rounded-xl font-bold text-sm transition ${
                  copied
                    ? "bg-green-500 text-white"
                    : "bg-blue-500 hover:bg-blue-400 text-white"
                }`}
              >
                {copied ? "✅ コピーしました！" : "📋 コードをコピーする"}
              </button>

              <div className="bg-yellow-900/40 border border-yellow-600/40 rounded-xl p-3 space-y-1.5">
                <p className="text-yellow-400 font-bold text-xs">💡 保存方法</p>
                <p className="text-gray-300 text-xs">① 上のコードをコピーする</p>
                <p className="text-gray-300 text-xs">② メモ帳・LINEのノート・メールに貼り付けて保存</p>
                <p className="text-gray-300 text-xs">③ 別のブラウザや端末でも「復元」タブで入力すれば使える！</p>
              </div>

              <div className="bg-gray-800 rounded-xl p-3 space-y-1">
                <p className="text-xs text-gray-400 font-bold">現在のデータ</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="text-xs text-gray-300">レベル: <span className="text-yellow-400 font-bold">Lv.{gameState.level}</span></div>
                  <div className="text-xs text-gray-300">XP: <span className="text-green-400 font-bold">{gameState.xp}</span></div>
                  <div className="text-xs text-gray-300">コイン: <span className="text-yellow-400 font-bold">🪙{gameState.coins}</span></div>
                  <div className="text-xs text-gray-300">連続: <span className="text-orange-400 font-bold">🔥{gameState.streak}日</span></div>
                </div>
              </div>
            </div>
          )}

          {tab === "load" && (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400 mb-2">📥 セーブコードを入力してください</p>
                <textarea
                  value={inputCode}
                  onChange={(e) => { setInputCode(e.target.value); setError(""); }}
                  placeholder="コードをここに貼り付け..."
                  className="w-full bg-gray-800 border border-gray-600 rounded-xl p-3 text-white text-xs
                    font-mono resize-none h-28 focus:outline-none focus:border-green-500 transition"
                />
              </div>

              {error && (
                <div className="bg-red-900/40 border border-red-500/40 rounded-xl p-3">
                  <p className="text-red-400 text-xs">❌ {error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-900/40 border border-green-500/40 rounded-xl p-3">
                  <p className="text-green-400 text-xs font-bold">✅ データを復元しました！</p>
                </div>
              )}

              <button
                onClick={handleRestore}
                disabled={!inputCode.trim()}
                className={`w-full py-3 rounded-xl font-bold text-sm transition ${
                  inputCode.trim()
                    ? "bg-green-500 hover:bg-green-400 text-white"
                    : "bg-gray-700 text-gray-500 cursor-not-allowed"
                }`}
              >
                📥 このコードで復元する
              </button>

              <div className="bg-red-900/30 border border-red-600/30 rounded-xl p-3">
                <p className="text-red-400 text-xs font-bold">⚠️ 注意</p>
                <p className="text-gray-300 text-xs mt-1">復元すると現在のデータは上書きされます。先に現在のコードを保存しておこう！</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
