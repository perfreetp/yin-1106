import { ValidationResult, ValidationRule, PracticeExercise } from '../types';
import { calculateSimilarity, extractKeywords } from './helpers';

export const validateAnswer = (
  userAnswer: string,
  exercise: PracticeExercise,
  selectedBasisId?: string
): ValidationResult => {
  const result: ValidationResult = {
    isValid: true,
    isCorrect: true,
    errors: [],
    warnings: [],
    matchedKeywords: [],
    missingKeywords: []
  };

  if (!userAnswer || userAnswer.trim().length === 0) {
    result.isValid = false;
    result.isCorrect = false;
    result.errors.push('答案不能为空');
    return result;
  }

  exercise.validationRules.forEach(rule => {
    switch (rule.type) {
      case 'required':
        if (!userAnswer.trim()) {
          result.isValid = false;
          result.isCorrect = false;
          result.errors.push(rule.errorMessage);
        }
        break;

      case 'length':
        if (rule.value) {
          const minLength = parseInt(rule.value, 10);
          if (userAnswer.length < minLength) {
            result.isValid = false;
            result.isCorrect = false;
            result.errors.push(rule.errorMessage);
          }
        }
        break;

      case 'pattern':
        if (rule.value) {
          const regex = new RegExp(rule.value);
          if (!regex.test(userAnswer)) {
            result.isValid = false;
            result.isCorrect = false;
            result.errors.push(rule.errorMessage);
          }
        }
        break;

      case 'keyword':
        if (rule.value) {
          const keywords = rule.value.split(',').map(k => k.trim());
          const missing = keywords.filter(k => !userAnswer.includes(k));
          if (missing.length > 0) {
            result.isValid = false;
            result.isCorrect = false;
            result.missingKeywords = missing;
            result.errors.push(`缺少必要关键词: ${missing.join('、')}`);
          }
          const matched = keywords.filter(k => userAnswer.includes(k));
          result.matchedKeywords = matched;
        }
        break;

      case 'format':
        if (rule.value === 'list') {
          const lines = userAnswer.split('\n').filter(l => l.trim());
          if (lines.length < 2) {
            result.warnings.push('建议使用条目式列出，每条一行');
          }
        }
        break;

      case 'custom':
        if (rule.field === 'length' && rule.value) {
          const minLength = parseInt(rule.value, 10);
          if (userAnswer.length < minLength) {
            result.isValid = false;
            result.isCorrect = false;
            result.errors.push(rule.errorMessage);
          }
        }
        if (rule.field === 'format' && rule.value === 'list') {
          const lines = userAnswer.split('\n').filter(l => l.trim());
          if (lines.length < 2) {
            result.warnings.push('建议使用条目式列出，每条一行');
          }
        }
        break;
    }
  });

  const similarity = calculateSimilarity(userAnswer, exercise.correctAnswer);
  result.similarity = similarity;

  if (similarity < 0.3) {
    result.isValid = false;
    result.isCorrect = false;
    result.errors.push('答案与正确答案相似度较低，请检查内容是否完整');
  } else if (similarity < 0.6) {
    result.warnings.push('答案部分正确，建议补充更多细节');
  }

  const correctKeywords = extractKeywords(exercise.correctAnswer);
  const userKeywords = extractKeywords(userAnswer);
  const missingKeywords = correctKeywords.filter(k => !userKeywords.some(uk => uk.includes(k) || k.includes(uk)));

  if (missingKeywords.length > 0 && result.missingKeywords) {
    result.missingKeywords = [...new Set([...result.missingKeywords, ...missingKeywords.slice(0, 3)])];
  }

  if (selectedBasisId && exercise.type === 'legal_basis') {
    const selectedBasis = exercise.legalBasisOptions.find(b => b.id === selectedBasisId);
    if (selectedBasis && !selectedBasis.supportsElement) {
      result.isValid = false;
      result.isCorrect = false;
      result.errors.push(`法定依据不匹配: ${selectedBasis.reason}`);
    }
  }

  if (exercise.type === 'time_limit') {
    const timePattern = /(\d+)\s*(个)?(工作日|天|小时)/g;
    let match;
    let hasTimeLimit = false;
    let commitmentDays = 0;
    let legalDays = 0;
    const allNumbers: number[] = [];

    while ((match = timePattern.exec(userAnswer)) !== null) {
      hasTimeLimit = true;
      const days = parseInt(match[1], 10);
      allNumbers.push(days);
      if (match[3] === '工作日' || match[3] === '天') {
        if (commitmentDays === 0 || days < commitmentDays) {
          commitmentDays = days;
        }
      }
    }

    const numberPattern = /(\d+)\s*(个)?(工作日|天|小时)?/g;
    let numMatch;
    while ((numMatch = numberPattern.exec(exercise.correctAnswer)) !== null) {
      const d = parseInt(numMatch[1], 10);
      if (d > 1 && d <= 100) {
        if (legalDays === 0 || d > legalDays) {
          legalDays = d;
        }
      }
    }

    if (allNumbers.length > 0) {
      const sorted = [...allNumbers].sort((a, b) => b - a);
      legalDays = sorted[0] || legalDays;
      commitmentDays = sorted[sorted.length - 1] || commitmentDays;
    }

    if (!hasTimeLimit) {
      result.isValid = false;
      result.isCorrect = false;
      result.errors.push('未明确承诺时限，请添加具体的办理时限');
    } else {
      if (exercise.legalTimeLimit && exercise.legalTimeLimit.commitment) {
        if (commitmentDays > exercise.legalTimeLimit.commitment) {
          result.isValid = false;
          result.isCorrect = false;
          result.errors.push(`承诺时限(${commitmentDays}个工作日)超过建议标准(${exercise.legalTimeLimit.commitment}个工作日)，请进一步压缩`);
        }
        if (exercise.legalTimeLimit.legal && commitmentDays > exercise.legalTimeLimit.legal) {
          result.isValid = false;
          result.isCorrect = false;
          result.errors.push(`承诺时限(${commitmentDays}个工作日)超过法定时限(${exercise.legalTimeLimit.legal}个工作日)，违反规范要求！`);
        }
      }
      if (commitmentDays > 20) {
        result.warnings.push('承诺时限过长，建议优化办理流程');
      }
    }

    const hasLegalMention = userAnswer.includes('法定时限') || userAnswer.includes('法定期限');
    const hasCommitmentMention = userAnswer.includes('承诺时限') || userAnswer.includes('承诺期限');
    const hasCompression = userAnswer.includes('压缩') || userAnswer.includes('优化');
    const hasSpecialNote = userAnswer.includes('不计入') || userAnswer.includes('特殊环节') || userAnswer.includes('现场核查') || userAnswer.includes('专家评审');

    let timeScoreBase = 0;
    if (hasTimeLimit) timeScoreBase += 30;
    if (hasLegalMention) timeScoreBase += 15;
    if (hasCommitmentMention) timeScoreBase += 15;
    if (hasCompression) timeScoreBase += 10;
    if (hasSpecialNote) timeScoreBase += 10;
    if (result.errors.length === 0 && hasTimeLimit) timeScoreBase += 20;

    const originalSim = result.similarity || 0;
    const combinedSim = Math.max(originalSim, timeScoreBase / 100);
    result.similarity = combinedSim;
  }

  if (exercise.type === 'reduction') {
    const hasReductionScenario = userAnswer.includes('免予提交') ||
      userAnswer.includes('容缺受理') ||
      userAnswer.includes('告知承诺') ||
      userAnswer.includes('共享获取') ||
      userAnswer.includes('取消');

    if (!hasReductionScenario) {
      result.warnings.push('建议明确具体的减免情形，如免予提交、容缺受理、告知承诺等');
    }
  }

  let finalScore = 0;
  if (result.similarity !== undefined && result.similarity !== null && !isNaN(Number(result.similarity))) {
    finalScore = Math.round(Number(result.similarity) * 100);
  }
  finalScore = Math.max(0, Math.min(100, finalScore));
  result.score = finalScore;

  if (result.score >= 80 && result.errors.length === 0) {
    result.isCorrect = true;
  }

  return result;
};

export const validateChallengeAnswer = (
  userAnswer: string | string[],
  correctAnswer: string | string[],
  type: string
): { isCorrect: boolean; explanation: string } => {
  let isCorrect = false;
  let explanation = '';

  const isSingleType = type === 'single_choice' || type === 'single';
  const isMultipleType = type === 'multiple_choice' || type === 'multiple';
  const isJudgeType = type === 'judgment' || type === 'judge';
  const isFillType = type === 'fill_blank' || type === 'fill';

  if (isSingleType) {
    const userStr = Array.isArray(userAnswer) ? userAnswer[0] : userAnswer as string;
    const correctStr = Array.isArray(correctAnswer) ? correctAnswer[0] : correctAnswer as string;
    isCorrect = (userStr || '').trim() === (correctStr || '').trim();
    if (!isCorrect) {
      explanation = `正确答案是: ${correctStr}`;
    }
  } else if (isFillType) {
    const userStr = Array.isArray(userAnswer) ? userAnswer[0] : userAnswer as string;
    const correctStr = Array.isArray(correctAnswer) ? correctAnswer[0] : correctAnswer as string;
    isCorrect = (userStr || '').trim() === (correctStr || '').trim();
    if (!isCorrect) {
      explanation = `正确答案是: ${correctStr}`;
    }
  } else if (isMultipleType) {
    const userArr = (Array.isArray(userAnswer) ? userAnswer : [userAnswer]).filter(Boolean).sort();
    const correctArr = (Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer]).filter(Boolean).sort();
    isCorrect = userArr.length > 0 && JSON.stringify(userArr) === JSON.stringify(correctArr);
    if (!isCorrect) {
      explanation = `正确答案是: ${correctArr.join('、')}`;
    }
  } else if (isJudgeType) {
    let userVal = Array.isArray(userAnswer) ? userAnswer[0] : userAnswer;
    let correctVal = Array.isArray(correctAnswer) ? correctAnswer[0] : correctAnswer;
    const normalize = (v: unknown) => {
      const s = String(v || '');
      if (s === 'A' || s === '正确') return '正确';
      if (s === 'B' || s === '错误') return '错误';
      return s;
    };
    isCorrect = normalize(userVal) === normalize(correctVal);
    if (!isCorrect) {
      explanation = `正确答案是: ${normalize(correctVal)}`;
    }
  }

  return { isCorrect, explanation };
};

export const checkLegalBasisSupport = (
  basisContent: string,
  elementContent: string
): { isSupported: boolean; message: string } => {
  const basisLower = basisContent.toLowerCase();
  const elementLower = elementContent.toLowerCase();

  const supportKeywords = ['规定', '应当', '必须', '需要', '要求', '可以', '允许', '根据', '依据', '按照'];
  const hasSupportKeywords = supportKeywords.some(k => basisLower.includes(k));

  const elementKeywords = extractKeywords(elementContent);
  const matchedKeywords = elementKeywords.filter(k =>
    basisLower.includes(k.toLowerCase())
  );

  if (matchedKeywords.length >= 2 && hasSupportKeywords) {
    return {
      isSupported: true,
      message: `法定依据包含关键词: ${matchedKeywords.join('、')}，能够支撑该要素设置`
    };
  }

  const missing = elementKeywords.filter(k => !basisLower.includes(k.toLowerCase()));
  return {
    isSupported: false,
    message: `法定依据未明确提及: ${missing.slice(0, 3).join('、')}，无法支撑该要素设置，请重新选择依据`
  };
};
