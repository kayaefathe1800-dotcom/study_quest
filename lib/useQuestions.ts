"use client";
import { useState, useEffect } from "react";
import { Question } from "./types";
import { questions as defaultQuestions } from "./questions";
import { loadActiveCategories } from "./categories";

const STORAGE_KEY = "study-game-custom-questions";

export function useQuestions() {
  const [questions, setQuestions] = useState<Question[]>(defaultQuestions);
  const [activeCategories, setActiveCategories] = useState<Set<string>>(
    () => new Set(defaultQuestions.map((q) => q.category))
  );

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setQuestions(JSON.parse(stored));
    } catch { /* fallback */ }

    setActiveCategories(loadActiveCategories());
  }, []);

  // アクティブなカテゴリーの問題だけ返す
  const filtered = questions.filter((q) => activeCategories.has(q.category));
  return filtered;
}

export function getRandomQuestionsFromList(list: Question[], subject: string, count: number): Question[] {
  const filtered = list.filter((q) => q.subject === subject);
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
