import { create } from 'zustand';
import { UserProgress, KnowledgePointStat, DailyStudyRecord } from '../types';
import { storage } from '../utils/storage';
import { generateId } from '../utils/helpers';

interface UserState {
  userProgress: UserProgress;
  dailyRecords: DailyStudyRecord[];
  initialized: boolean;

  initUser: () => void;
  initUserProgress: () => void;
  updateProgress: (updates: Partial<UserProgress>) => void;
  addStudyTime: (minutes: number) => void;
  incrementCompletedExercises: () => void;
  updateKnowledgePointStat: (knowledgePoint: string, isCorrect: boolean) => void;
  unlockLevel: (levelId: string) => void;
  completeLevel: (levelId: string) => void;
  addDailyRecord: (record: Omit<DailyStudyRecord, 'date'>) => void;
  getTodayRecord: () => DailyStudyRecord | undefined;
  resetProgress: () => void;
  incrementTodayExerciseCount: () => void;
  incrementTodayTimeSpent: (minutes: number) => void;
  incrementTodayMistakeReview: () => void;
}

const defaultKnowledgePoints: KnowledgePointStat[] = [
  { knowledgePoint: '受理条件编制', questionCount: 0, correctCount: 0, wrongCount: 0, errorRate: 0 },
  { knowledgePoint: '申请材料编制', questionCount: 0, correctCount: 0, wrongCount: 0, errorRate: 0 },
  { knowledgePoint: '法定依据引用', questionCount: 0, correctCount: 0, wrongCount: 0, errorRate: 0 },
  { knowledgePoint: '办理时限设置', questionCount: 0, correctCount: 0, wrongCount: 0, errorRate: 0 },
  { knowledgePoint: '材料减免情形', questionCount: 0, correctCount: 0, wrongCount: 0, errorRate: 0 },
  { knowledgePoint: '通用规范', questionCount: 0, correctCount: 0, wrongCount: 0, errorRate: 0 },
];

const defaultProgress: UserProgress = {
  userId: generateId(),
  totalExercisesCompleted: 0,
  totalTimeSpent: 0,
  correctRate: 0,
  todayExerciseCount: 0,
  todayTimeSpent: 0,
  todayMistakeReview: 0,
  totalChallengesCompleted: 0,
  unlockedLevels: ['level-1'],
  completedLevels: [],
  knowledgePointStats: defaultKnowledgePoints,
};

export const useUserStore = create<UserState>((set, get) => ({
  userProgress: storage.get('userProgress', defaultProgress),
  dailyRecords: storage.get('dailyRecords', []),
  initialized: false,

  initUser: () => {
    if (get().initialized) return;

    const savedProgress = storage.get<UserProgress | null>('userProgress', null);
    if (!savedProgress) {
      storage.set('userProgress', defaultProgress);
      set({ userProgress: defaultProgress });
    } else {
      const today = new Date().toISOString().split('T')[0];
      const lastLogin = storage.get<string | null>('lastLoginDate', null);
      
      if (lastLogin !== today) {
        const updatedProgress = {
          ...savedProgress,
          todayExerciseCount: 0,
          todayTimeSpent: 0,
          todayMistakeReview: 0,
        };
        storage.set('userProgress', updatedProgress);
        storage.set('lastLoginDate', today);
        set({ userProgress: updatedProgress });
      }
    }

    set({ initialized: true });
  },

  initUserProgress: () => {
    get().initUser();
  },

  updateProgress: (updates) => {
    set((state) => {
      const newProgress = { ...state.userProgress, ...updates };
      storage.set('userProgress', newProgress);
      return { userProgress: newProgress };
    });
  },

  addStudyTime: (minutes) => {
    set((state) => {
      const newProgress = {
        ...state.userProgress,
        totalTimeSpent: state.userProgress.totalTimeSpent + minutes,
        todayTimeSpent: state.userProgress.todayTimeSpent + minutes,
      };
      storage.set('userProgress', newProgress);
      return { userProgress: newProgress };
    });
  },

  incrementCompletedExercises: () => {
    set((state) => {
      const newProgress = {
        ...state.userProgress,
        totalExercisesCompleted: state.userProgress.totalExercisesCompleted + 1,
        todayExerciseCount: state.userProgress.todayExerciseCount + 1,
      };
      storage.set('userProgress', newProgress);
      return { userProgress: newProgress };
    });
  },

  updateKnowledgePointStat: (knowledgePoint, isCorrect) => {
    set((state) => {
      const newStats = state.userProgress.knowledgePointStats.map((stat) => {
        if (stat.knowledgePoint === knowledgePoint) {
          const newQuestionCount = stat.questionCount + 1;
          const newCorrectCount = isCorrect ? stat.correctCount + 1 : stat.correctCount;
          const newWrongCount = !isCorrect ? stat.wrongCount + 1 : stat.wrongCount;
          return {
            ...stat,
            questionCount: newQuestionCount,
            correctCount: newCorrectCount,
            wrongCount: newWrongCount,
            errorRate: newQuestionCount > 0 ? (newWrongCount / newQuestionCount) * 100 : 0,
          };
        }
        return stat;
      });

      const totalQuestions = newStats.reduce((sum, s) => sum + s.questionCount, 0);
      const totalCorrect = newStats.reduce((sum, s) => sum + s.correctCount, 0);
      const correctRate = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

      const newProgress = {
        ...state.userProgress,
        knowledgePointStats: newStats,
        correctRate,
      };

      storage.set('userProgress', newProgress);
      return { userProgress: newProgress };
    });
  },

  unlockLevel: (levelId) => {
    set((state) => {
      if (state.userProgress.unlockedLevels.includes(levelId)) return state;

      const newProgress = {
        ...state.userProgress,
        unlockedLevels: [...state.userProgress.unlockedLevels, levelId],
      };
      storage.set('userProgress', newProgress);
      return { userProgress: newProgress };
    });
  },

  completeLevel: (levelId) => {
    set((state) => {
      if (state.userProgress.completedLevels.includes(levelId)) return state;

      const newProgress = {
        ...state.userProgress,
        completedLevels: [...state.userProgress.completedLevels, levelId],
        totalChallengesCompleted: state.userProgress.totalChallengesCompleted + 1,
      };
      storage.set('userProgress', newProgress);
      return { userProgress: newProgress };
    });
  },

  addDailyRecord: (record) => {
    set((state) => {
      const today = new Date().toISOString().split('T')[0];
      const existingIndex = state.dailyRecords.findIndex((r) => r.date === today);

      let newRecords;
      if (existingIndex >= 0) {
        newRecords = state.dailyRecords.map((r, i) =>
          i === existingIndex
            ? {
                ...r,
                exerciseCount: r.exerciseCount + record.exerciseCount,
                timeSpent: r.timeSpent + record.timeSpent,
                correctCount: r.correctCount + record.correctCount,
              }
            : r
        );
      } else {
        newRecords = [...state.dailyRecords, { ...record, date: today }];
      }

      storage.set('dailyRecords', newRecords.slice(-30));
      return { dailyRecords: newRecords.slice(-30) };
    });
  },

  getTodayRecord: () => {
    const today = new Date().toISOString().split('T')[0];
    return get().dailyRecords.find((r) => r.date === today);
  },

  resetProgress: () => {
    storage.set('userProgress', defaultProgress);
    storage.set('dailyRecords', []);
    storage.remove('mistakes');
    storage.remove('favorites');
    storage.remove('scores');
    storage.remove('challengeAttempts');
    set({
      userProgress: defaultProgress,
      dailyRecords: [],
    });
  },

  incrementTodayExerciseCount: () => {
    set((state) => {
      const newProgress = {
        ...state.userProgress,
        todayExerciseCount: state.userProgress.todayExerciseCount + 1,
      };
      storage.set('userProgress', newProgress);
      return { userProgress: newProgress };
    });
  },

  incrementTodayTimeSpent: (minutes) => {
    set((state) => {
      const newProgress = {
        ...state.userProgress,
        todayTimeSpent: state.userProgress.todayTimeSpent + minutes,
      };
      storage.set('userProgress', newProgress);
      return { userProgress: newProgress };
    });
  },

  incrementTodayMistakeReview: () => {
    set((state) => {
      const newProgress = {
        ...state.userProgress,
        todayMistakeReview: state.userProgress.todayMistakeReview + 1,
      };
      storage.set('userProgress', newProgress);
      return { userProgress: newProgress };
    });
  },
}));
