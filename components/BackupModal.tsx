"use client";
import { useState } from "react";
import { GameState } from "@/lib/types";

interface Props {
  gameState: GameState;
  onRestore: (state: GameState) => void;
  onClose: () => void;
}

function encode(state: GameState): string {
  // dailyMissionsは毎日リセットされるので除外してコードを短くする
  const { dailyMissions, dailyMissionsDate, ...rest } = state;
  void dailyMissions; void dailyMissionsDate;
  return btoa(encodeURIComponent(JSON.stringify(rest)));
}

function decode(code: string): GameState {
  return JSON.parse(decodeURIComponent(atob(code.trim())));
}

export default function BackupModal({ gameState, onRestore, onClose }: Props) {
  const [tab, setTab] = useState<"save" | "load">("save");
  const [inputCode, setInputCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const saveCode = encode(gameState);

  function handleCopy() {
    navigator.clipboard.writeText(saveCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // クリップボードAPIが使えない場合はtextareaを選択状態にする
      const el = document.getElementById("save-code-area") as HTMLTextAreaElement;
      el?.select();
    });
  }

  function handleRestore() {
    setError("");
    try {
      const decoded = decode(inputCode);
      if (typeof decoded.xp !== "number" || typeof decoded.level !== "number") {
        setError("コードが正しくありません。もう一度確認してください。");
        return;
      }
      onRestore(decoded);
      setSuccess(true);
      setTimeout(() => { setSuccess(false); onClose(); }, 1500);
    } catch {
      setError("コードが正しくありません。もう一度確認してください。");
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-gray-900 border-2 border-blue-500 rounded-2xl w-full max-w-sm flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 flex items-center justify-between rounded-t-2xl flex-shrink-0">
          <div>
            <h2 className="text-white font-bold text-lg">💾 データのバックアップ</h2>
            <p className="text-white/70 text-xs">コードでセーブ・ロードできるよ</p>
          </div>
          <button
            onClick={onClose}
            className="text-white bg-white/20 hover:bg-white/30 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold transition"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 flex-shrink-0">
          <button
            onClick={() => setTab("save")}
            className={`flex-1 py-3 text-sm font-bold transition ${
              tab === "save" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            📤 セーブ
          </button>
          <button
            onClick={() => setTab("load")}
            className={`flex-1 py-3 text-sm font-bold transition ${
              tab === "load" ? "text-green-400 border-b-2 border-green-400" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            📥 ロード
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {tab === "save" && (
            <>
              {/* 現在のデータ概要 */}
              <div className="bg-gray-800 rounded-xl p-3 grid grid-cols-2 gap-2">
                <div className="text-xs text-gray-300">レベル: <span className="text-yellow-400 font-bold">Lv.{gameState.level}</span></div>
                <div className="text-xs text-gray-300">XP: <span className="text-green-400 font-bold">{gameState.xp}</span></div>
                <div className="text-xs text-gray-300">コイン: <span className="text-yellow-400 font-bold">🪙{gameState.coins}</span></div>
                <div className="text-xs text-gray-300">連続: <span className="text-orange-400 font-bold">🔥{gameState.streak}日</span></div>
              </div>

              {/* セーブコード */}
              <div>
                <p className="text-xs text-gray-400 font-bold mb-2">📋 セーブコード</p>
                <textarea
                  id="save-code-area"
                  readOnly
                  value={saveCode}
                  className="w-full bg-gray-800 border border-gray-600 rounded-xl p-3 text-white text-xs
                    font-mono resize-none h-24 focus:outline-none focus:border-blue-400 transition"
                  onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                />
              </div>

              <button
                onClick={handleCopy}
                className={`w-full py-3 rounded-xl font-bold text-sm transition ${
                  copied ? "bg-green-500 text-white" : "bg-blue-500 hover:bg-blue-400 text-white"
                }`}
              >
                {copied ? "✅ コピーしました！" : "📋 コードをコピーする"}
              </button>

              <div className="bg-yellow-900/40 border border-yellow-600/40 rounded-xl p-3 space-y-1">
                <p className="text-yellow-400 font-bold text-xs">💡 保存方法</p>
                <p className="text-gray-300 text-xs">① コードをコピーする</p>
                <p className="text-gray-300 text-xs">② メモ帳・LINEノート・メールに貼り付けて保存</p>
                <p className="text-gray-300 text-xs">③ 別のブラウザでロードすれば復元できる！</p>
              </div>
            </>
          )}

          {tab === "load" && (
            <>
              <div>
                <p className="text-xs text-gray-400 font-bold mb-2">📥 セーブコードを貼り付けてください</p>
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
                  inputCode.trim() ? "bg-green-500 hover:bg-green-400 text-white" : "bg-gray-700 text-gray-500 cursor-not-allowed"
                }`}
              >
                📥 このコードで復元する
              </button>

              <div className="bg-red-900/30 border border-red-600/30 rounded-xl p-3">
                <p className="text-red-400 text-xs font-bold">⚠️ 注意</p>
                <p className="text-gray-300 text-xs mt-1">復元すると現在のデータは上書きされます。</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
