"use client";
import { DailyMission } from "@/lib/types";

interface Props {
  missions: DailyMission[];
}

export default function DailyMissions({ missions }: Props) {
  const completed = missions.filter((m) => m.completed).length;

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">
          🎯 デイリーミッション
        </h3>
        <span className="text-xs text-yellow-400 font-bold">{completed}/{missions.length}</span>
      </div>

      <div className="space-y-2.5">
        {missions.map((m) => (
          <div
            key={m.id}
            className={`rounded-xl p-3 border transition-all ${
              m.completed
                ? "bg-green-900/30 border-green-700/50"
                : "bg-gray-800 border-gray-700"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-base">{m.completed ? "✅" : "🎯"}</span>
                <span
                  className={`text-sm font-medium ${
                    m.completed ? "text-green-400 line-through" : "text-white"
                  }`}
                >
                  {m.description}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs shrink-0 ml-2">
                <span className="text-green-400 font-bold">+{m.xpReward}XP</span>
                <span className="text-yellow-400 font-bold">+{m.coinReward}🪙</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  m.completed ? "bg-green-400" : "bg-yellow-400"
                }`}
                style={{ width: `${Math.min((m.progress / m.target) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1 text-right">
              {m.progress} / {m.target}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
