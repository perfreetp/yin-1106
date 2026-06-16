export interface UserProgress {
  userId: string;
  totalExercisesCompleted: number;
  totalTimeSpent: number;
  correctRate: number;
  todayExerciseCount: number;
  todayTimeSpent: number;
  todayMistakeReview: number;
  totalChallengesCompleted: number;
  unlockedLevels: string[];
  completedLevels: string[];
  knowledgePointStats: KnowledgePointStat[];
}

export interface KnowledgePointStat {
  knowledgePoint: string;
  questionCount: number;
  correctCount: number;
  wrongCount: number;
  errorRate: number;
}

export type RuleCategory = 'acceptance_condition' | 'application_material' | 'legal_basis' | 'time_limit' | 'reduction' | 'general';

export interface CommonMistake {
  description: string;
  example?: string;
  correction?: string;
}

export interface Rule {
  id: string;
  categoryId: RuleCategory;
  category: RuleCategory;
  title: string;
  content: string;
  description: string;
  keyPoints: string[];
  commonMistakes: CommonMistake[];
  correctExamples: string[];
  correctExample: string;
  explanation: string;
  relatedExerciseIds: string[];
  relatedExercises: string[];
  difficulty: number;
  knowledgePoint: string;
}

export type ExerciseType = 'acceptance_condition' | 'application_material' | 'legal_basis' | 'time_limit' | 'reduction' | 'comparison' | 'material_reduction';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface PracticeExercise {
  id: string;
  categoryId: string;
  category?: ExerciseCategoryId;
  title: string;
  type: ExerciseType;
  difficulty: Difficulty;
  estimatedTime: number;
  question: string;
  legalBasisOptions: LegalBasisOption[];
  correctAnswer: string;
  validationRules: ValidationRule[];
  explanation: string;
  knowledgePoints: string[];
  knowledgePoint?: string;
  hints?: string[];
  hint?: string;
  legalTimeLimit?: {
    legal: number;
    commitment: number;
    unit: string;
  };
  itemType?: string;
  itemName?: string;
  description?: string;
}

export interface LegalBasisOption {
  id: string;
  name: string;
  title?: string;
  content: string;
  provision?: string;
  supportsElement: boolean;
  isCorrect?: boolean;
  reason: string;
}

export interface ValidationRule {
  field: string;
  type: 'required' | 'pattern' | 'custom' | 'keyword' | 'length' | 'format';
  value?: string;
  errorMessage: string;
  description?: string;
}

export type ExerciseCategoryId = 'ec-1' | 'ec-2' | 'ec-3' | 'ec-4' | 'ec-5' | string;

export interface ExerciseCategory {
  id: ExerciseCategoryId;
  name: string;
  description: string;
  icon: string;
  exerciseCount: number;
}

export interface ComparisonItem {
  id: string;
  exerciseId: string;
  itemName?: string;
  itemType?: string;
  category?: string;
  regionA: string;
  regionB: string;
  contentA: string;
  contentB: string;
  differences: DifferencePoint[];
  suggestions?: string[];
}

export interface DifferencePoint {
  field: string;
  aspect?: string;
  description: string;
  descriptionA?: string;
  descriptionB?: string;
  suggestion: string;
  analysis?: string;
  isASuperior?: boolean;
  isBSuperior?: boolean;
}

export interface ChallengeLevel {
  id: string;
  name: string;
  description: string;
  unlockRequirement: number;
  timeLimit: number;
  passingScore: number;
  questionIds: string[];
}

export type QuestionType = 'single_choice' | 'multiple_choice' | 'judgment' | 'fill_blank' | 'single' | 'multiple' | 'judge' | 'fill';

export interface ChallengeQuestion {
  id: string;
  content: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string | string[];
  score: number;
  knowledgePoint: string;
  explanation: string;
  hint?: string;
}

export interface ChallengeAttempt {
  id: string;
  levelId: string;
  startTime: number;
  endTime?: number;
  answers: ChallengeAnswer[];
  score: number;
  passed: boolean;
  correctRate: number;
  timestamp: number;
  correctCount: number;
  wrongCount: number;
  timeSpent: number;
  totalQuestions: number;
  knowledgePointStats: KnowledgePointStat[];
}

export interface ChallengeAnswer {
  questionId: string;
  questionTitle: string;
  userAnswer: string | string[];
  correctAnswer: string | string[];
  isCorrect: boolean;
  timeSpent: number;
  score: number;
  attemptId?: string;
}

export type ErrorType = 'missing_keyword' | 'format_error' | 'legal_basis_mismatch' | 'time_limit_error' | 'reduction_invalid' | 'content_incomplete';

export interface ValidationErrorDetail {
  message: string;
  suggestion?: string;
}

export interface Mistake {
  id: string;
  exerciseId?: string;
  challengeQuestionId?: string;
  sourceId: string;
  type: 'practice' | 'challenge';
  userAnswer: string;
  correctAnswer: string;
  errorType: ErrorType;
  knowledgePoint: string;
  questionTitle: string;
  questionContent: string;
  timestamp: number;
  reviewed: boolean;
  retryCount: number;
  explanation: string;
  score: number;
  errorDetails?: ValidationErrorDetail[];
}

export type FavoriteType = 'rule' | 'example';

export interface Favorite {
  id: string;
  type: FavoriteType;
  targetId: string;
  targetTitle: string;
  targetContent: string;
  timestamp: number;
}

export type ScoreType = 'exercise' | 'challenge' | 'exam';

export interface Score {
  id: string;
  type: ScoreType;
  targetId: string;
  targetName: string;
  score: number;
  totalScore: number;
  correctRate: number;
  timestamp: number;
}

export interface ValidationResult {
  isValid: boolean;
  isCorrect: boolean;
  errors: string[];
  warnings: string[];
  errorDetails?: ValidationErrorDetail[];
  similarity?: number;
  matchedKeywords?: string[];
  missingKeywords?: string[];
  score?: number;
}

export interface BestScore {
  score: number;
  correctRate: number;
  timestamp: number;
}

export interface LegalBasisCheckResult {
  isSupported: boolean;
  message: string;
}

export interface DailyStudyRecord {
  date: string;
  exerciseCount: number;
  timeSpent: number;
  correctCount: number;
}
