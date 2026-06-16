import { create } from 'zustand';
import { Mistake, ErrorType } from '../types';
import { storage } from '../utils/storage';

interface MistakesState {
  mistakes: Mistake[];
  filterType: ErrorType | 'all';
  filterSource: 'practice' | 'challenge' | 'all';
  searchKeyword: string;

  initMistakes: () => void;
  getFilteredMistakes: () => Mistake[];
  getMistakeById: (id: string) => Mistake | undefined;
  markAsReviewed: (id: string) => void;
  deleteMistake: (id: string) => void;
  clearAllMistakes: () => void;
  setFilterType: (type: ErrorType | 'all') => void;
  setFilterSource: (source: 'practice' | 'challenge' | 'all') => void;
  setSearchKeyword: (keyword: string) => void;
  getMistakesByKnowledgePoint: (knowledgePoint: string) => Mistake[];
  getMistakeStats: () => {
    total: number;
    byType: Record<ErrorType, number>;
    bySource: { practice: number; challenge: number };
    reviewed: number;
    unreviewed: number;
  };
  retryMistake: (id: string) => void;
}

export const useMistakesStore = create<MistakesState>((set, get) => ({
  mistakes: [],
  filterType: 'all',
  filterSource: 'all',
  searchKeyword: '',

  initMistakes: () => {
    const saved = storage.get<Mistake[]>('mistakes', []);
    set({ mistakes: saved });
  },

  getFilteredMistakes: () => {
    const { mistakes, filterType, filterSource, searchKeyword } = get();
    return mistakes.filter((mistake) => {
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

    mistakes.forEach((m) => {
      byType[m.errorType] = (byType[m.errorType] || 0) + 1;
      bySource[m.type]++;
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
