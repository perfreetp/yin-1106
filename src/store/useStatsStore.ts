import { create } from 'zustand';
import { Score, KnowledgePointStat, DailyStudyRecord } from '../types';
import { storage } from '../utils/storage';
import { useUserStore } from './useUserStore';

interface StatsState {
  scores: Score[];

  initScores: () => void;
  getScoresByType: (type: 'exercise' | 'challenge' | 'exam') => Score[];
  getLatestScores: (count?: number) => Score[];
  getAverageScore: (type?: 'exercise' | 'challenge' | 'exam') => number;
  getBestScore: (type?: 'exercise' | 'challenge' | 'exam') => Score | undefined;
  getWeakPoints: () => { knowledgePoint: string; errorRate: number; suggestion: string }[];
  getStrongPoints: () => { knowledgePoint: string; errorRate: number; label: string }[];
  getWeaknessAnalysis: () => { knowledgePoint: string; errorRate: number; questionCount: number; suggestion: string }[];
  getStrengthAnalysis: () => { knowledgePoint: string; errorRate: number; questionCount: number; suggestion: string }[];
  getImprovementSuggestions: () => string[];
  getWeeklyTrend: () => { date: string; correctRate: number; exerciseCount: number }[];
  getOverallStats: () => {
    totalExercises: number;
    totalTime: number;
    averageCorrectRate: number;
    totalChallenges: number;
    passedChallenges: number;
    streakDays: number;
  };
  generateReport: () => {
    overall: {
      grade: string;
      totalScore: number;
      totalTime: string;
      totalExercises: number;
      averageCorrectRate: number;
      level: string;
    };
    skillScores: {
      knowledgePoint: string;
      score: number;
      level: string;
      description: string;
    }[];
    strengths: string[];
    weaknesses: string[];
    tags: {
      text: string;
      type: 'strength' | 'weakness' | 'normal';
    }[];
    improvementPlan: string[];
    conclusion: string;
  };
  addScore: (score: Omit<Score, 'id'>) => void;
  clearAllScores: () => void;
}

const getLevelLabel = (correctRate: number): string => {
  if (correctRate >= 90) return '优秀';
  if (correctRate >= 80) return '良好';
  if (correctRate >= 70) return '中等';
  if (correctRate >= 60) return '及格';
  return '需要加强';
};

const getGrade = (score: number): string => {
  if (score >= 90) return '优秀';
  if (score >= 80) return '良好';
  if (score >= 70) return '合格';
  return '待提升';
};

const knowledgePointDescriptions: Record<string, string> = {
  '受理条件编制': '掌握受理条件的合法性、明确性、可操作性要求',
  '申请材料编制': '掌握申请材料的名称、来源、形式等要素规范',
  '法定依据引用': '掌握法律法规的引用格式和依据匹配要求',
  '办理时限设置': '掌握法定时限与承诺时限的关系和计算方式',
  '材料减免情形': '掌握免交、容缺、告知承诺的适用场景',
  '通用规范': '掌握事项名称、办理流程等通用编制规范',
};

export const useStatsStore = create<StatsState>((set, get) => ({
  scores: [],

  initScores: () => {
    const saved = storage.get<Score[]>('scores', []);
    set({ scores: saved });
  },

  getScoresByType: (type) => {
    return get().scores.filter((s) => s.type === type);
  },

  getLatestScores: (count = 10) => {
    return [...get().scores].sort((a, b) => b.timestamp - a.timestamp).slice(0, count);
  },

  getAverageScore: (type) => {
    const scores = type ? get().getScoresByType(type) : get().scores;
    if (scores.length === 0) return 0;
    const total = scores.reduce((sum, s) => sum + s.correctRate, 0);
    return Math.round(total / scores.length);
  },

  getBestScore: (type) => {
    const scores = type ? get().getScoresByType(type) : get().scores;
    if (scores.length === 0) return undefined;
    return [...scores].sort((a, b) => b.score - a.score)[0];
  },

  getWeakPoints: () => {
    const { userProgress } = useUserStore.getState();
    const suggestions: Record<string, string> = {
      '受理条件编制': '建议复习规则课堂中"受理条件编制规则"章节，多练习不同类型事项的受理条件表述。',
      '申请材料编制': '加强申请材料要素完整性训练，注意标注可共享免交的材料。',
      '法定依据引用': '熟记常用法律法规的名称和条款号，注意依据的时效性和关联性。',
      '办理时限设置': '掌握法定时限与承诺时限的关系，学会合理分解环节时限。',
      '材料减免情形': '深入理解材料减免的政策依据，掌握免交、容缺、告知承诺的适用场景。',
      '通用规范': '加强事项名称规范、办理流程编写等通用技能的训练。',
    };

    return userProgress.knowledgePointStats
      .filter((s) => s.questionCount > 0 && s.errorRate >= 30)
      .sort((a, b) => b.errorRate - a.errorRate)
      .slice(0, 5)
      .map((s) => ({
        knowledgePoint: s.knowledgePoint,
        errorRate: Math.round(s.errorRate),
        suggestion: suggestions[s.knowledgePoint] || '建议加强该知识点的学习和练习。',
      }));
  },

  getStrongPoints: () => {
    const { userProgress } = useUserStore.getState();
    const labels: Record<string, string> = {
      '受理条件编制': '条件把控能手',
      '申请材料编制': '材料清单达人',
      '法定依据引用': '法规引用高手',
      '办理时限设置': '时限优化先锋',
      '材料减免情形': '便民服务标兵',
      '通用规范': '标准化专家',
    };

    return userProgress.knowledgePointStats
      .filter((s) => s.questionCount > 0 && s.errorRate < 20)
      .sort((a, b) => a.errorRate - b.errorRate)
      .slice(0, 5)
      .map((s) => ({
        knowledgePoint: s.knowledgePoint,
        errorRate: Math.round(s.errorRate),
        label: labels[s.knowledgePoint] || '表现优秀',
      }));
  },

  getWeaknessAnalysis: () => {
    const { userProgress } = useUserStore.getState();
    const suggestions: Record<string, string> = {
      '受理条件编制': '建议重点复习受理条件编制规则，多练习不同类型主体的资格条件表述，避免使用模糊用语。',
      '申请材料编制': '建议加强申请材料的规范性训练，注意材料名称、来源渠道、份数规格等要素的完整性。',
      '法定依据引用': '建议系统学习常用法律法规的引用规范，重点掌握依据条款与事项要素的对应关系。',
      '办理时限设置': '建议加强时限计算训练，明确工作日与自然日的区别，掌握特殊环节的时限扣除规则。',
      '材料减免情形': '建议深入学习材料减免的政策文件，重点掌握告知承诺制的适用范围和监管要求。',
      '通用规范': '建议强化事项编制的通用标准训练，提升事项名称、办理流程等要素的规范化水平。',
    };

    return userProgress.knowledgePointStats
      .filter((s) => s.questionCount > 0)
      .sort((a, b) => b.errorRate - a.errorRate)
      .filter((s) => s.errorRate >= 20)
      .slice(0, 4)
      .map((s) => ({
        knowledgePoint: s.knowledgePoint,
        errorRate: Math.round(s.errorRate),
        questionCount: s.questionCount,
        suggestion: suggestions[s.knowledgePoint] || '建议加强该知识点的学习和练习。',
      }));
  },

  getStrengthAnalysis: () => {
    const { userProgress } = useUserStore.getState();
    const suggestions: Record<string, string> = {
      '受理条件编制': '您在受理条件编制方面表现优秀，能够准确把握申请主体资格要求，建议继续保持并帮助其他学员。',
      '申请材料编制': '您在申请材料编制方面表现突出，能够规范表述材料要素，建议总结经验分享给其他学员。',
      '法定依据引用': '您在法定依据引用方面表现优秀，能够准确引用法律法规条款，建议挑战更高难度的练习。',
      '办理时限设置': '您在办理时限设置方面表现出色，能够合理设置承诺时限，建议深入学习时限优化的方法。',
      '材料减免情形': '您在材料减免情形方面表现优秀，能够准确适用减免政策，建议加强对告知承诺制的研究。',
      '通用规范': '您在通用规范方面表现突出，事项编制标准化水平高，建议担任班组的规范监督员。',
    };

    return userProgress.knowledgePointStats
      .filter((s) => s.questionCount > 0)
      .sort((a, b) => a.errorRate - b.errorRate)
      .filter((s) => s.errorRate < 30)
      .slice(0, 4)
      .map((s) => ({
        knowledgePoint: s.knowledgePoint,
        errorRate: Math.round(s.errorRate),
        questionCount: s.questionCount,
        suggestion: suggestions[s.knowledgePoint] || '您在该知识点表现优秀，继续保持！',
      }));
  },

  getImprovementSuggestions: () => {
    const weaknesses = get().getWeaknessAnalysis();
    const suggestions: string[] = [];

    if (weaknesses.length === 0) {
      suggestions.push('您的整体表现优秀，建议继续保持学习热情，挑战更高难度的练习题目。');
      suggestions.push('尝试将所学知识应用到实际工作中，帮助同事提升清单编制水平。');
      suggestions.push('定期回顾已掌握的知识点，巩固学习成果，防止遗忘。');
    } else {
      weaknesses.forEach((w) => {
        suggestions.push(`针对【${w.knowledgePoint}】：${w.suggestion}`);
      });
    }

    suggestions.push('建议每周完成至少5道练习题，保持学习连续性和知识熟练度。');
    suggestions.push('建议每月完成1次综合闯关测试，检验阶段性学习成果。');
    suggestions.push('建议建立个人错题本，定期回顾错误题目，避免重复犯错。');

    return suggestions.slice(0, 6);
  },

  getWeeklyTrend: () => {
    const { dailyRecords } = useUserStore.getState();
    const last7Days = dailyRecords.slice(-7);

    return last7Days.map((record) => {
      const correctRate =
        record.exerciseCount > 0
          ? Math.round((record.correctCount / record.exerciseCount) * 100)
          : 0;
      return {
        date: record.date,
        correctRate,
        exerciseCount: record.exerciseCount,
      };
    });
  },

  getOverallStats: () => {
    const { userProgress, dailyRecords } = useUserStore.getState();
    const { scores } = get();

    const challengeScores = scores.filter((s) => s.type === 'challenge');
    const passedChallenges = challengeScores.filter((s) => s.correctRate >= 60).length;

    let streakDays = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      const hasRecord = dailyRecords.some((r) => r.date === dateStr && r.exerciseCount > 0);
      if (hasRecord) {
        streakDays++;
      } else if (i > 0) {
        break;
      }
    }

    return {
      totalExercises: userProgress.totalExercisesCompleted,
      totalTime: userProgress.totalTimeSpent,
      averageCorrectRate: Math.round(userProgress.correctRate),
      totalChallenges: challengeScores.length,
      passedChallenges,
      streakDays,
    };
  },

  generateReport: () => {
    const { getOverallStats, getStrengthAnalysis, getWeaknessAnalysis, getImprovementSuggestions } = get();
    const stats = getOverallStats();
    const strengths = getStrengthAnalysis();
    const weaknesses = getWeaknessAnalysis();
    const suggestions = getImprovementSuggestions();

    const hours = Math.floor(stats.totalTime / 60);
    const minutes = stats.totalTime % 60;
    const timeStr = hours > 0 ? `${hours}小时${minutes}分钟` : `${minutes}分钟`;

    const level = getLevelLabel(stats.averageCorrectRate);
    const grade = getGrade(stats.averageCorrectRate);
    const totalScore = Math.round(stats.averageCorrectRate);

    const knowledgePoints = ['受理条件编制', '申请材料编制', '法定依据引用', '办理时限设置', '材料减免情形', '通用规范'];
    const { userProgress } = useUserStore.getState();

    const skillScores = knowledgePoints.map((kp) => {
      const stat = userProgress.knowledgePointStats.find((s) => s.knowledgePoint === kp);
      const correctRate = stat && stat.questionCount > 0 ? Math.round(100 - stat.errorRate) : 60;
      const level = correctRate >= 80 ? '熟练' : correctRate >= 60 ? '良好' : correctRate >= 40 ? '一般' : '待加强';
      return {
        knowledgePoint: kp,
        score: correctRate,
        level,
        description: knowledgePointDescriptions[kp] || '',
      };
    });

    const strengthTexts = strengths.map(
      (p) => `${p.knowledgePoint}：正确率${100 - p.errorRate}%，已练习${p.questionCount}题`
    );

    const weaknessTexts = weaknesses.map(
      (p) => `${p.knowledgePoint}：错误率${p.errorRate}%，已练习${p.questionCount}题`
    );

    const tags = [
      ...strengths.slice(0, 3).map((s) => ({ text: `擅长${s.knowledgePoint}`, type: 'strength' as const })),
      ...weaknesses.slice(0, 2).map((w) => ({ text: `提升${w.knowledgePoint}`, type: 'weakness' as const })),
      { text: `累计${stats.totalExercises}题`, type: 'normal' as const },
      { text: `连续${stats.streakDays}天`, type: 'normal' as const },
    ];

    const improvementPlan = suggestions.slice(0, 5);

    let conclusion = '';
    if (stats.averageCorrectRate >= 90) {
      conclusion = `恭喜您！经过系统学习和训练，您在政务服务事项清单编制方面已达到优秀水平。累计完成${stats.totalExercises}道练习题，平均正确率${stats.averageCorrectRate}%，充分展示了扎实的专业功底。建议您继续保持学习热情，将所学知识应用到实际工作中，并积极帮助身边同事共同提升，成为单位的业务骨干。`;
    } else if (stats.averageCorrectRate >= 70) {
      conclusion = `您在政务服务事项清单编制方面已具备良好的基础，累计完成${stats.totalExercises}道练习题，平均正确率${stats.averageCorrectRate}%。在${strengths.length > 0 ? strengths.map(s => s.knowledgePoint).join('、') : '部分知识点'}方面表现优秀，但在${weaknesses.length > 0 ? weaknesses.map(w => w.knowledgePoint).join('、') : '某些方面'}还有提升空间。建议按照学习建议重点突破薄弱环节，争取更上一层楼！`;
    } else {
      conclusion = `您已开始政务服务事项清单编制的学习之旅，累计完成${stats.totalExercises}道练习题，平均正确率${stats.averageCorrectRate}%。目前正处于知识积累阶段，建议保持耐心，按照学习计划循序渐进。重点加强薄弱知识点的学习，多做练习题巩固记忆。相信通过持续努力，您一定能够掌握清单编制的要领，成为合格的事项管理员！`;
    }

    return {
      overall: {
        grade,
        totalScore,
        totalTime: timeStr,
        totalExercises: stats.totalExercises,
        averageCorrectRate: stats.averageCorrectRate,
        level,
      },
      skillScores,
      strengths: strengthTexts,
      weaknesses: weaknessTexts,
      tags,
      improvementPlan,
      conclusion,
    };
  },

  addScore: (scoreData) => {
    set((state) => {
      const newScore: Score = {
        ...scoreData,
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      };
      const newScores = [...state.scores, newScore];
      storage.set('scores', newScores);
      return { scores: newScores };
    });
  },

  clearAllScores: () => {
    storage.set('scores', []);
    set({ scores: [] });
  },
}));
