import { create } from 'zustand';
import { Mistake, ErrorType } from '../types';
import { storage } from '../utils/storage';

interface MistakesState {
  mistakes: Mistake[];
  filterType: ErrorType | 'all';
  filterSource: 'practice' | 'challenge' | 'all';
  searchKeyword: string;
  showMastered: boolean;

  initMistakes: () => void;
  getFilteredMistakes: () => Mistake[];
  getMistakeById: (id: string) => Mistake | undefined;
  markAsReviewed: (id: string) => void;
  markAsMastered: (sourceId: string, type?: 'practice' | 'challenge') => void;
  markMistakeCorrect: (id: string) => void;
  deleteMistake: (id: string) => void;
  clearAllMistakes: () => void;
  setFilterType: (type: ErrorType | 'all') => void;
  setFilterSource: (source: 'practice' | 'challenge' | 'all') => void;
  setSearchKeyword: (keyword: string) => void;
  setShowMastered: (show: boolean) => void;
  getMistakesByKnowledgePoint: (knowledgePoint: string) => Mistake[];
  getMistakeStats: () => {
    total: number;
    byType: Record<ErrorType, number>;
    bySource: { practice: number; challenge: number };
    reviewed: number;
    unreviewed: number;
    mastered: number;
    pending: number;
  };
  retryMistake: (id: string) => void;
}

const normalizeMistake = (m: Partial<Mistake>): Mistake => ({
  ...m,
  mastered: typeof m.mastered === 'boolean' ? m.mastered : false,
  reviewed: typeof m.reviewed === 'boolean' ? m.reviewed : false,
  retryCount: m.retryCount || 0,
  correctRetryCount: m.correctRetryCount || 0,
  score: m.score || 0,
}) as Mistake;

export const useMistakesStore = create<MistakesState>((set, get) => ({
  mistakes: [],
  filterType: 'all',
  filterSource: 'all',
  searchKeyword: '',
  showMastered: true,

  initMistakes: () => {
    const saved = storage.get<Partial<Mistake>[]>('mistakes', []);
    const normalized = saved.map(normalizeMistake);
    set({ mistakes: normalized });
  },

  getFilteredMistakes: () => {
    const { mistakes, filterType, filterSource, searchKeyword, showMastered } = get();
    return mistakes.filter((mistake) => {
      if (!showMastered && mistake.mastered) return false;
      const matchesType = filterType === 'all' || mistake.errorType === filterType;
      const matchesSource = filterSource === 'all' || mistake.type === filterSource;
      const matchesSearch =
        !searchKeyword ||
        mistake.questionTitle.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        mistake.explanation.toLowerCase().includes(searchKeyword.toLowerCase());
      return matchesType && matchesSource && matchesSearch;
    });
  },

  getMistakeById: (id) => get().mistakes.find((m) => m.id === id),

  markAsReviewed: (id) => {
    set((state) => {
      const newMistakes = state.mistakes.map((m) =>
        m.id === id ? { ...m, reviewed: true } : m
      );
      storage.set('mistakes', newMistakes);
      return { mistakes: newMistakes };
    });
  },

  markAsMastered: (sourceId, type) => {
    set((state) => {
      const newMistakes = state.mistakes.map((m) => {
        const matches = m.sourceId === sourceId && (!type || m.type === type);
        if (matches) {
          return { ...m, mastered: true, reviewed: true };
        }
        return m;
      });
      storage.set('mistakes', newMistakes);
      return { mistakes: newMistakes };
    });
  },

  markMistakeCorrect: (id) => {
    set((state) => {
      const newMistakes = state.mistakes.map((m) => {
        if (m.id === id) {
          const newCorrectCount = (m.correctRetryCount || 0) + 1;
          const mastered = newCorrectCount >= 2 || m.reviewed;
          return {
            ...m,
            correctRetryCount: newCorrectCount,
            retryCount: m.retryCount + 1,
            mastered,
            reviewed: true,
          };
        }
        return m;
      });
      storage.set('mistakes', newMistakes);
      return { mistakes: newMistakes };
    });
  },

  deleteMistake: (id) => {
    set((state) => {
      const newMistakes = state.mistakes.filter((m) => m.id !== id);
      storage.set('mistakes', newMistakes);
      return { mistakes: newMistakes };
    });
  },

  clearAllMistakes: () => {
    storage.set('mistakes', []);
    set({ mistakes: [] });
  },

  setFilterType: (type) => set({ filterType: type }),

  setFilterSource: (source) => set({ filterSource: source }),

  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),

  setShowMastered: (show) => set({ showMastered: show }),

  getMistakesByKnowledgePoint: (knowledgePoint) => {
    return get().mistakes.filter((m) => m.knowledgePoint === knowledgePoint);
  },

  getMistakeStats: () => {
    const { mistakes } = get();
    const byType = {
      missing_keyword: 0,
      format_error: 0,
      legal_basis_mismatch: 0,
      time_limit_error: 0,
      reduction_invalid: 0,
      content_incomplete: 0,
    } as Record<ErrorType, number>;
    const bySource = { practice: 0, challenge: 0 };
    let reviewed = 0;
    let unreviewed = 0;
    let mastered = 0;
    let pending = 0;

    mistakes.forEach((m) => {
      byType[m.errorType] = (byType[m.errorType] || 0) + 1;
      bySource[m.type]++;
      if (m.mastered) {
        mastered++;
      } else {
        pending++;
      }
      if (m.reviewed) {
        reviewed++;
      } else {
        unreviewed++;
      }
    });

    return {
      total: mistakes.length,
      byType,
      bySource,
      reviewed,
      unreviewed,
      mastered,
      pending,
    };
  },

  retryMistake: (id) => {
    set((state) => {
      const newMistakes = state.mistakes.map((m) =>
        m.id === id ? { ...m, retryCount: m.retryCount + 1, reviewed: false } : m
      );
      storage.set('mistakes', newMistakes);
      return { mistakes: newMistakes };
    });
  },
}));
