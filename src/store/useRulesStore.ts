import { create } from 'zustand';
import { Rule, RuleCategory, Favorite } from '../types';
import { rules, ruleCategories } from '../data/rules';
import { storage } from '../utils/storage';
import { generateId } from '../utils/helpers';

interface RulesState {
  rules: Rule[];
  categories: { id: RuleCategory; name: string; icon: string; description: string }[];
  favorites: Favorite[];
  searchKeyword: string;
  selectedCategoryId: RuleCategory | null;
  category: RuleCategory | null | string;

  initRules: () => void;
  setSearchKeyword: (keyword: string) => void;
  setSelectedCategory: (categoryId: RuleCategory | null) => void;
  setCategory: (categoryId: RuleCategory | null | string) => void;
  getFilteredRules: () => Rule[];
  getRuleById: (id: string) => Rule | undefined;
  getCategoryById: (id: string) => { id: RuleCategory; name: string; icon: string; description: string } | undefined;
  isFavorite: (ruleId: string) => boolean;
  toggleFavorite: (rule: Rule | string) => void;
  removeFavorite: (favoriteId: string) => void;
  initFavorites: () => void;
}

export const useRulesStore = create<RulesState>((set, get) => ({
  rules,
  categories: ruleCategories,
  favorites: [],
  searchKeyword: '',
  selectedCategoryId: null,
  category: null,

  initRules: () => {
    const savedFavorites = storage.get<Favorite[]>('favorites', []);
    set({ favorites: savedFavorites });
  },

  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),

  setSelectedCategory: (categoryId) => set({ selectedCategoryId: categoryId, category: categoryId }),

  setCategory: (categoryId) => {
    const catId = categoryId === 'all' ? null : categoryId as RuleCategory | null;
    set({ selectedCategoryId: catId, category: categoryId });
  },

  getFilteredRules: () => {
    const { rules, searchKeyword, selectedCategoryId } = get();
    return rules.filter((rule) => {
      const matchesCategory = !selectedCategoryId || rule.categoryId === selectedCategoryId;
      const matchesSearch =
        !searchKeyword ||
        rule.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        rule.content.toLowerCase().includes(searchKeyword.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  },

  getRuleById: (id) => get().rules.find((r) => r.id === id),

  getCategoryById: (id) => get().categories.find((c) => c.id === id),

  isFavorite: (ruleId) => get().favorites.some((f) => f.targetId === ruleId),

  toggleFavorite: (ruleOrId) => {
    set((state) => {
      let rule: Rule | undefined;
      let ruleId: string;

      if (typeof ruleOrId === 'string') {
        ruleId = ruleOrId;
        rule = state.rules.find((r) => r.id === ruleId);
      } else {
        rule = ruleOrId;
        ruleId = ruleOrId.id;
      }

      const existingIndex = state.favorites.findIndex((f) => f.targetId === ruleId);
      let newFavorites;

      if (existingIndex >= 0) {
        newFavorites = state.favorites.filter((f) => f.targetId !== ruleId);
      } else {
        const newFavorite: Favorite = {
          id: generateId(),
          type: 'rule',
          targetId: ruleId,
          targetTitle: rule?.title || '未知规则',
          targetContent: rule?.content || '',
          timestamp: Date.now(),
        };
        newFavorites = [...state.favorites, newFavorite];
      }

      storage.set('favorites', newFavorites);
      return { favorites: newFavorites };
    });
  },

  removeFavorite: (favoriteId) => {
    set((state) => {
      const newFavorites = state.favorites.filter((f) => f.id !== favoriteId);
      storage.set('favorites', newFavorites);
      return { favorites: newFavorites };
    });
  },

  initFavorites: () => {
    const savedFavorites = storage.get<Favorite[]>('favorites', []);
    set({ favorites: savedFavorites });
  },
}));
