import { create } from 'zustand';
import { ChallengeLevel, ChallengeQuestion, ChallengeAttempt, ChallengeAnswer, Score, Mistake, KnowledgePointStat, BestScore } from '../types';
import { challengeLevels, challengeQuestions } from '../data/challenges';
import { validateChallengeAnswer } from '../utils/validation';
import { generateId, getRandomItems } from '../utils/helpers';
import { storage } from '../utils/storage';

interface ChallengeState {
  levels: ChallengeLevel[];
  questions: ChallengeQuestion[];
  currentLevel: ChallengeLevel | null;
  currentQuestionIndex: number;
  currentQuestions: ChallengeQuestion[];
  userAnswers: Record<string, string | string[]>;
  answers: ChallengeAnswer[];
  startTime: number | null;
  timeRemaining: number;
  attemptId: string | null;
  isSubmitted: boolean;
  challengeAttempts: ChallengeAttempt[];
  isPaused: boolean;
  showResult: boolean;
  currentAnswer: string | string[];

  setCurrentLevel: (levelId: string | null) => void;
  initChallenge: (levelId: string) => void;
  startChallenge: () => void;
  setCurrentAnswer: (answer: string | string[]) => void;
  setUserAnswer: (questionId: string, answer: string | string[]) => void;
  submitAnswer: () => { isCorrect: boolean; explanation: string };
  submitCurrentQuestion: () => { isCorrect: boolean; explanation: string };
  nextQuestion: () => void;
  prevQuestion: () => void;
  finishChallenge: () => ChallengeAttempt;
  submitChallenge: () => ChallengeAttempt;
  getCurrentQuestion: () => ChallengeQuestion | undefined;
  getScore: () => number;
  getTotalScore: () => number;
  getCorrectCount: () => number;
  getWrongCount: () => number;
  isLevelUnlocked: (levelId: string) => boolean;
  isLevelCompleted: (levelId: string) => boolean;
  getLevelById: (id: string) => ChallengeLevel | undefined;
  getQuestionById: (id: string) => ChallengeQuestion | undefined;
  getAttemptById: (id: string) => ChallengeAttempt | undefined;
  getLevelBestScore: (levelId: string) => BestScore;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetChallenge: () => void;
  initAttempts: () => void;
  tickTimer: () => void;
}

export const useChallengeStore = create<ChallengeState>((set, get) => ({
  levels: challengeLevels,
  questions: challengeQuestions,
  currentLevel: null,
  currentQuestionIndex: 0,
  currentQuestions: [],
  userAnswers: {},
  answers: [],
  startTime: null,
  timeRemaining: 0,
  attemptId: null,
  isSubmitted: false,
  challengeAttempts: [],
  isPaused: false,
  showResult: false,
  currentAnswer: '',

  setCurrentLevel: (levelId) => {
    if (!levelId) {
      set({ currentLevel: null });
      return;
    }
    const level = get().levels.find((l) => l.id === levelId);
    set({
      currentLevel: level || null,
      currentQuestionIndex: 0,
      currentQuestions: [],
      userAnswers: {},
      answers: [],
      startTime: null,
      timeRemaining: level ? level.timeLimit : 0,
      attemptId: null,
      isSubmitted: false,
      isPaused: false,
      showResult: false,
      currentAnswer: '',
    });
  },

  initChallenge: (levelId) => {
    const level = get().levels.find((l) => l.id === levelId);
    if (!level) return;

    const levelQuestions = level.questionIds
      .map((id) => get().questions.find((q) => q.id === id))
      .filter((q): q is ChallengeQuestion => q !== undefined);

    const shuffledQuestions = getRandomItems(levelQuestions, levelQuestions.length);

    set({
      currentLevel: level,
      currentQuestions: shuffledQuestions,
      currentQuestionIndex: 0,
      userAnswers: {},
      answers: [],
      startTime: null,
      timeRemaining: level.timeLimit,
      attemptId: generateId(),
      isSubmitted: false,
      isPaused: false,
      showResult: false,
      currentAnswer: '',
    });
  },

  startChallenge: () => {
    const { currentLevel, questions } = get();
    if (!currentLevel) return;

    const levelQuestions = currentLevel.questionIds
      .map((id) => questions.find((q) => q.id === id))
      .filter((q): q is ChallengeQuestion => q !== undefined);

    const shuffledQuestions = getRandomItems(levelQuestions, levelQuestions.length);

    set({
      currentQuestions: shuffledQuestions,
      startTime: Date.now(),
      timeRemaining: currentLevel.timeLimit,
      attemptId: generateId(),
      currentQuestionIndex: 0,
      userAnswers: {},
      answers: [],
      isSubmitted: false,
      isPaused: false,
      showResult: false,
      currentAnswer: '',
    });
  },

  setCurrentAnswer: (answer) => {
    set({ currentAnswer: answer });
  },

  setUserAnswer: (questionId, answer) => {
    set((state) => ({
      userAnswers: { ...state.userAnswers, [questionId]: answer },
    }));
  },

  submitAnswer: () => {
    const { getCurrentQuestion, currentAnswer, answers, userAnswers } = get();
    const question = getCurrentQuestion();
    if (!question) return { isCorrect: false, explanation: '未找到题目' };

    const userAnswer = currentAnswer || userAnswers[question.id];
    if (!userAnswer || (Array.isArray(userAnswer) && userAnswer.length === 0)) {
      return { isCorrect: false, explanation: '请先选择答案' };
    }

    const result = validateChallengeAnswer(userAnswer, question.correctAnswer, question.type);

    const answerRecord: ChallengeAnswer = {
      questionId: question.id,
      questionTitle: question.content.substring(0, 50) + '...',
      userAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect: result.isCorrect,
      timeSpent: 0,
      score: result.isCorrect ? question.score : 0,
    };

    set({
      answers: [...answers, answerRecord],
      userAnswers: { ...userAnswers, [question.id]: userAnswer },
      showResult: true,
    });

    if (!result.isCorrect) {
      const mistakes = storage.get<Mistake[]>('mistakes', []);
      const existingIndex = mistakes.findIndex(
        (m) => m.challengeQuestionId === question.id && m.type === 'challenge'
      );

      let newMistakes;
      if (existingIndex >= 0) {
        newMistakes = mistakes.map((m, i) =>
          i === existingIndex
            ? { ...m, retryCount: m.retryCount + 1, timestamp: Date.now(), reviewed: false }
            : m
        );
      } else {
        const newMistake: Mistake = {
          id: generateId(),
          challengeQuestionId: question.id,
          sourceId: question.id,
          type: 'challenge',
          userAnswer: Array.isArray(userAnswer) ? userAnswer.join('、') : userAnswer,
          correctAnswer: Array.isArray(question.correctAnswer)
            ? question.correctAnswer.join('、')
            : question.correctAnswer,
          errorType: 'content_incomplete',
          knowledgePoint: question.knowledgePoint,
          questionTitle: question.content.substring(0, 50) + '...',
          questionContent: question.content,
          timestamp: Date.now(),
          reviewed: false,
          retryCount: 0,
          explanation: question.explanation,
          score: 0,
        };
        newMistakes = [...mistakes, newMistake];
      }
      storage.set('mistakes', newMistakes);
    }

    return result;
  },

  submitCurrentQuestion: () => {
    return get().submitAnswer();
  },

  nextQuestion: () => {
    set((state) => {
      if (state.currentQuestionIndex < state.currentQuestions.length - 1) {
        return { 
          currentQuestionIndex: state.currentQuestionIndex + 1,
          showResult: false,
          currentAnswer: '',
        };
      }
      return state;
    });
  },

  prevQuestion: () => {
    set((state) => {
      if (state.currentQuestionIndex > 0) {
        return { 
          currentQuestionIndex: state.currentQuestionIndex - 1,
          showResult: false,
        };
      }
      return state;
    });
  },

  finishChallenge: () => {
    return get().submitChallenge();
  },

  submitChallenge: () => {
    const {
      currentLevel,
      currentQuestions,
      userAnswers,
      answers,
      startTime,
      attemptId,
      getScore,
      getTotalScore,
      getCorrectCount,
      getWrongCount,
      levels,
    } = get();

    if (!currentLevel || !startTime || !attemptId) {
      throw new Error('挑战未开始');
    }

    const allAnswers: ChallengeAnswer[] = currentQuestions.map((q) => {
      const existingAnswer = answers.find((a) => a.questionId === q.id);
      if (existingAnswer) return existingAnswer;

      const userAnswer = userAnswers[q.id] || '';
      const result = validateChallengeAnswer(userAnswer, q.correctAnswer, q.type);
      return {
        questionId: q.id,
        questionTitle: q.content.substring(0, 50) + '...',
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect: result.isCorrect,
        timeSpent: 0,
        score: result.isCorrect ? q.score : 0,
      };
    });

    const score = getScore();
    const totalScore = getTotalScore();
    const correctCount = getCorrectCount();
    const wrongCount = getWrongCount();
    const correctRate = totalScore > 0 ? (score / totalScore) * 100 : 0;
    const passed = score >= currentLevel.passingScore;
    const timeSpent = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

    const knowledgePointMap = new Map<string, { correct: number; total: number }>();
    allAnswers.forEach((answer) => {
      const question = currentQuestions.find((q) => q.id === answer.questionId);
      if (question) {
        const existing = knowledgePointMap.get(question.knowledgePoint) || { correct: 0, total: 0 };
        knowledgePointMap.set(question.knowledgePoint, {
          correct: existing.correct + (answer.isCorrect ? 1 : 0),
          total: existing.total + 1,
        });
      }
    });

    const knowledgePointStats: KnowledgePointStat[] = Array.from(knowledgePointMap.entries()).map(
      ([knowledgePoint, stats]) => ({
        knowledgePoint,
        questionCount: stats.total,
        correctCount: stats.correct,
        wrongCount: stats.total - stats.correct,
        errorRate: stats.total > 0 ? ((stats.total - stats.correct) / stats.total) * 100 : 0,
      })
    );

    const attempt: ChallengeAttempt = {
      id: attemptId,
      levelId: currentLevel.id,
      startTime,
      endTime: Date.now(),
      answers: allAnswers,
      score,
      passed,
      correctRate,
      timestamp: Date.now(),
      correctCount,
      wrongCount,
      timeSpent,
      totalQuestions: currentQuestions.length,
      knowledgePointStats,
    };

    const scores = storage.get<Score[]>('scores', []);
    const newScore: Score = {
      id: generateId(),
      type: 'challenge',
      targetId: currentLevel.id,
      targetName: currentLevel.name,
      score,
      totalScore,
      correctRate,
      timestamp: Date.now(),
    };
    scores.push(newScore);
    storage.set('scores', scores);

    const attempts = storage.get<ChallengeAttempt[]>('challengeAttempts', []);
    attempts.push(attempt);
    storage.set('challengeAttempts', attempts);

    if (passed) {
      const currentIndex = levels.findIndex((l) => l.id === currentLevel.id);
      if (currentIndex < levels.length - 1) {
        const nextLevel = levels[currentIndex + 1];
        const { useUserStore } = require('./useUserStore');
        useUserStore.getState().unlockLevel(nextLevel.id);
        useUserStore.getState().completeLevel(currentLevel.id);
      }
    }

    knowledgePointStats.forEach((stat) => {
      const { useUserStore } = require('./useUserStore');
      for (let i = 0; i < stat.correctCount; i++) {
        useUserStore.getState().updateKnowledgePointStat(stat.knowledgePoint, true);
      }
      for (let i = 0; i < stat.wrongCount; i++) {
        useUserStore.getState().updateKnowledgePointStat(stat.knowledgePoint, false);
      }
    });

    set({
      isSubmitted: true,
      challengeAttempts: [...get().challengeAttempts, attempt],
    });

    return attempt;
  },

  getCurrentQuestion: () => {
    const { currentQuestions, currentQuestionIndex } = get();
    return currentQuestions[currentQuestionIndex];
  },

  getScore: () => {
    const { currentQuestions, userAnswers, answers } = get();
    return currentQuestions.reduce((total, q) => {
      const existingAnswer = answers.find((a) => a.questionId === q.id);
      if (existingAnswer) {
        return total + existingAnswer.score;
      }
      const userAnswer = userAnswers[q.id];
      if (!userAnswer) return total;
      const result = validateChallengeAnswer(userAnswer, q.correctAnswer, q.type);
      return result.isCorrect ? total + q.score : total;
    }, 0);
  },

  getTotalScore: () => {
    return get().currentQuestions.reduce((total, q) => total + q.score, 0);
  },

  getCorrectCount: () => {
    const { currentQuestions, userAnswers, answers } = get();
    return currentQuestions.filter((q) => {
      const existingAnswer = answers.find((a) => a.questionId === q.id);
      if (existingAnswer) {
        return existingAnswer.isCorrect;
      }
      const userAnswer = userAnswers[q.id];
      if (!userAnswer) return false;
      const result = validateChallengeAnswer(userAnswer, q.correctAnswer, q.type);
      return result.isCorrect;
    }).length;
  },

  getWrongCount: () => {
    const { currentQuestions, userAnswers, answers } = get();
    return currentQuestions.filter((q) => {
      const existingAnswer = answers.find((a) => a.questionId === q.id);
      if (existingAnswer) {
        return !existingAnswer.isCorrect;
      }
      const userAnswer = userAnswers[q.id];
      if (!userAnswer) return false;
      const result = validateChallengeAnswer(userAnswer, q.correctAnswer, q.type);
      return !result.isCorrect;
    }).length;
  },

  isLevelUnlocked: (levelId) => {
    const { useUserStore } = require('./useUserStore');
    return useUserStore.getState().userProgress.unlockedLevels.includes(levelId);
  },

  isLevelCompleted: (levelId) => {
    const { useUserStore } = require('./useUserStore');
    return useUserStore.getState().userProgress.completedLevels.includes(levelId);
  },

  getLevelById: (id) => get().levels.find((l) => l.id === id),

  getQuestionById: (id) => get().questions.find((q) => q.id === id),

  getAttemptById: (id) => get().challengeAttempts.find((a) => a.id === id),

  getLevelBestScore: (levelId) => {
    const levelAttempts = get().challengeAttempts.filter((a) => a.levelId === levelId);
    if (levelAttempts.length === 0) {
      return { score: 0, correctRate: 0, timestamp: 0 };
    }
    const bestAttempt = levelAttempts.reduce((best, current) => 
      current.score > best.score ? current : best
    );
    return {
      score: bestAttempt.score,
      correctRate: bestAttempt.correctRate,
      timestamp: bestAttempt.timestamp,
    };
  },

  pauseTimer: () => set({ isPaused: true }),

  resumeTimer: () => set({ isPaused: false }),

  resetChallenge: () => {
    set({
      currentLevel: null,
      currentQuestionIndex: 0,
      currentQuestions: [],
      userAnswers: {},
      answers: [],
      startTime: null,
      timeRemaining: 0,
      attemptId: null,
      isSubmitted: false,
      isPaused: false,
      showResult: false,
      currentAnswer: '',
    });
  },

  initAttempts: () => {
    const saved = storage.get<ChallengeAttempt[]>('challengeAttempts', []);
    set({ challengeAttempts: saved });
  },

  tickTimer: () => {
    set((state) => {
      if (state.isPaused || state.isSubmitted || state.timeRemaining <= 0) {
        return state;
      }
      const newTime = state.timeRemaining - 1;
      if (newTime <= 0) {
        return { timeRemaining: 0 };
      }
      return { timeRemaining: newTime };
    });
  },
}));
