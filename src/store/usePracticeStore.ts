import { create } from 'zustand';
import { PracticeExercise, ExerciseCategory, ValidationResult, Mistake, ErrorType } from '../types';
import { exercises, exerciseCategories } from '../data/exercises';
import { validateAnswer } from '../utils/validation';
import { generateId } from '../utils/helpers';
import { storage } from '../utils/storage';
import { useMistakesStore } from './useMistakesStore';

interface PracticeState {
  exercises: PracticeExercise[];
  categories: ExerciseCategory[];
  currentExercise: PracticeExercise | null;
  currentExerciseId: string | null;
  userAnswer: string;
  selectedBasisId: string | null;
  validationResult: ValidationResult | null;
  showAnswer: boolean;
  completedExerciseIds: string[];
  selectedCategoryId: string | null;
  difficultyFilter: string | null;
  category: string | null;
  difficulty: string | null;

  setCategory: (categoryId: string | null) => void;
  setSelectedCategory: (categoryId: string | null) => void;
  setDifficulty: (difficulty: string | null) => void;
  setDifficultyFilter: (difficulty: string | null) => void;
  setCurrentExercise: (exerciseId: string | null) => void;
  setUserAnswer: (answer: string) => void;
  setSelectedBasisId: (basisId: string | null) => void;
  getFilteredExercises: () => PracticeExercise[];
  getExerciseById: (id: string) => PracticeExercise | undefined;
  submitAnswer: (exerciseId?: string, result?: ValidationResult, timeSpent?: number) => ValidationResult;
  resetExercise: () => void;
  resetCurrentExercise: () => void;
  showCorrectAnswer: () => void;
  markAsCompleted: (exerciseId: string) => void;
  isCompleted: (exerciseId: string) => boolean;
  getRandomExercise: () => PracticeExercise | undefined;
  initCompletedExercises: () => void;
  addToMistakes: (exercise: PracticeExercise, userAnswer: string, errorType: ErrorType) => void;
}

export const usePracticeStore = create<PracticeState>((set, get) => ({
  exercises,
  categories: exerciseCategories,
  currentExercise: null,
  currentExerciseId: null,
  userAnswer: '',
  selectedBasisId: null,
  validationResult: null,
  showAnswer: false,
  completedExerciseIds: [],
  selectedCategoryId: null,
  difficultyFilter: null,
  category: null,
  difficulty: null,

  setCategory: (categoryId) => set({ category: categoryId, selectedCategoryId: categoryId }),

  setSelectedCategory: (categoryId) => set({ selectedCategoryId: categoryId, category: categoryId }),

  setDifficulty: (difficulty) => set({ difficulty: difficulty, difficultyFilter: difficulty }),

  setDifficultyFilter: (difficulty) => set({ difficultyFilter: difficulty, difficulty: difficulty }),

  setCurrentExercise: (exerciseId) => {
    if (!exerciseId) {
      set({
        currentExercise: null,
        currentExerciseId: null,
        userAnswer: '',
        selectedBasisId: null,
        validationResult: null,
        showAnswer: false,
      });
      return;
    }
    const exercise = get().exercises.find((e) => e.id === exerciseId);
    set({
      currentExercise: exercise || null,
      currentExerciseId: exerciseId,
      userAnswer: '',
      selectedBasisId: null,
      validationResult: null,
      showAnswer: false,
    });
  },

  setUserAnswer: (answer) => set({ userAnswer: answer }),

  setSelectedBasisId: (basisId) => set({ selectedBasisId: basisId }),

  getFilteredExercises: () => {
    const { exercises, selectedCategoryId, difficultyFilter } = get();
    return exercises.filter((exercise) => {
      const matchesCategory = !selectedCategoryId || exercise.categoryId === selectedCategoryId;
      const matchesDifficulty = !difficultyFilter || exercise.difficulty === difficultyFilter;
      return matchesCategory && matchesDifficulty;
    });
  },

  getExerciseById: (id) => get().exercises.find((e) => e.id === id),

  submitAnswer: (exerciseId?: string, result?: ValidationResult, timeSpent?: number) => {
    const { currentExercise, userAnswer, selectedBasisId } = get();
    const exercise = exerciseId ? get().getExerciseById(exerciseId) : currentExercise;
    
    if (!exercise) {
      return { isValid: false, isCorrect: false, errors: ['未找到练习题目'], warnings: [], score: 0 };
    }

    const validationResult = result || validateAnswer(userAnswer, exercise, selectedBasisId || undefined);
    set({ validationResult: validationResult });

    if (!validationResult.isCorrect || validationResult.errors.length > 0) {
      let errorType: ErrorType = 'content_incomplete';
      if (validationResult.missingKeywords && validationResult.missingKeywords.length > 0) {
        errorType = 'missing_keyword';
      }
      if (validationResult.errors.some((e) => e.includes('法定依据'))) {
        errorType = 'legal_basis_mismatch';
      }
      if (validationResult.errors.some((e) => e.includes('时限') || e.includes('工作日'))) {
        errorType = 'time_limit_error';
      }
      if (validationResult.errors.some((e) => e.includes('减免') || e.includes('容缺') || e.includes('承诺'))) {
        errorType = 'reduction_invalid';
      }
      get().addToMistakes(exercise, userAnswer, errorType);
    }

    if (validationResult.isCorrect && validationResult.errors.length === 0) {
      get().markAsCompleted(exercise.id);
      try {
        useMistakesStore.getState().initMistakes();
        useMistakesStore.getState().markAsMastered(exercise.id, 'practice');
      } catch (_) {
        // ignore
      }
    }

    return validationResult;
  },

  resetExercise: () => {
    set({
      userAnswer: '',
      selectedBasisId: null,
      validationResult: null,
      showAnswer: false,
    });
  },

  resetCurrentExercise: () => {
    set({
      currentExercise: null,
      currentExerciseId: null,
      userAnswer: '',
      selectedBasisId: null,
      validationResult: null,
      showAnswer: false,
    });
  },

  showCorrectAnswer: () => set({ showAnswer: true }),

  markAsCompleted: (exerciseId) => {
    set((state) => {
      if (state.completedExerciseIds.includes(exerciseId)) return state;
      const newCompleted = [...state.completedExerciseIds, exerciseId];
      storage.set('completedExercises', newCompleted);
      return { completedExerciseIds: newCompleted };
    });
  },

  isCompleted: (exerciseId) => get().completedExerciseIds.includes(exerciseId),

  getRandomExercise: () => {
    const { exercises, completedExerciseIds } = get();
    const uncompleted = exercises.filter((e) => !completedExerciseIds.includes(e.id));
    if (uncompleted.length === 0) return undefined;
    return uncompleted[Math.floor(Math.random() * uncompleted.length)];
  },

  initCompletedExercises: () => {
    const saved = storage.get<string[]>('completedExercises', []);
    set({ completedExerciseIds: saved });
  },

  addToMistakes: (exercise, userAnswer, errorType) => {
    const mistakes = storage.get<Partial<Mistake>[]>('mistakes', []);
    const existingIndex = mistakes.findIndex(
      (m) => m.exerciseId === exercise.id && m.type === 'practice'
    );

    let newMistakes;
    if (existingIndex >= 0) {
      newMistakes = mistakes.map((m, i) =>
        i === existingIndex
          ? {
              ...m,
              userAnswer,
              errorType,
              timestamp: Date.now(),
              retryCount: (m.retryCount || 0) + 1,
              reviewed: false,
              mastered: false,
              correctRetryCount: m.correctRetryCount || 0,
            }
          : m
      );
    } else {
      const newMistake: Mistake = {
        id: generateId(),
        exerciseId: exercise.id,
        sourceId: exercise.id,
        type: 'practice',
        userAnswer,
        correctAnswer: exercise.correctAnswer,
        errorType,
        knowledgePoint: exercise.knowledgePoints[0] || '未知',
        questionTitle: exercise.title,
        questionContent: exercise.question,
        timestamp: Date.now(),
        reviewed: false,
        mastered: false,
        retryCount: 0,
        correctRetryCount: 0,
        explanation: exercise.explanation,
        score: 0,
      };
      newMistakes = [...mistakes, newMistake];
    }

    storage.set('mistakes', newMistakes);
    try {
      useMistakesStore.getState().initMistakes();
    } catch (_) {
      // ignore
    }
  },
}));
