"use client";
import { useState, useEffect } from "react";
import { Question } from "./types";
import { questions as defaultQuestions } from "./questions";

const STORAGE_KEY = "study-game-custom-questions";

export function useQuestions() {
  const [questions, setQuestions] = useState<Question[]>(defaultQuestions);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setQuestions(JSON.parse(stored));
    } catch {
      // fallback to default
    }
  }, []);

  return questions;
}

export function getQuestionsBySubjectFromList(list: Question[], subject: string): Question[] {
  return list.filter((q) => q.subject === subject);
}

export function getRandomQuestionsFromList(list: Question[], subject: string, count: number): Question[] {
  const filtered = list.filter((q) => q.subject === subject);
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
