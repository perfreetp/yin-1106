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
    while ((match = timePattern.exec(userAnswer)) !== null) {
      hasTimeLimit = true;
      const days = parseInt(match[1], 10);
      if (days > 20) {
        result.warnings.push('承诺时限过长，建议优化办理流程');
      }
    }
    if (!hasTimeLimit) {
      result.isValid = false;
      result.isCorrect = false;
      result.errors.push('未明确承诺时限，请添加具体的办理时限');
    }
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

  result.score = Math.round((result.similarity || 0) * 100);

  return result;
};

export const validateChallengeAnswer = (
  userAnswer: string | string[],
  correctAnswer: string | string[],
  type: string
): { isCorrect: boolean; explanation: string } => {
  let isCorrect = false;
  let explanation = '';

  if (type === 'single_choice' || type === 'fill_blank') {
    isCorrect = (userAnswer as string).trim() === (correctAnswer as string).trim();
    if (!isCorrect) {
      explanation = `正确答案是: ${correctAnswer}`;
    }
  } else if (type === 'multiple_choice') {
    const userArr = Array.isArray(userAnswer) ? userAnswer.sort() : [userAnswer].sort();
    const correctArr = Array.isArray(correctAnswer) ? correctAnswer.sort() : [correctAnswer].sort();
    isCorrect = JSON.stringify(userArr) === JSON.stringify(correctArr);
    if (!isCorrect) {
      explanation = `正确答案是: ${correctArr.join('、')}`;
    }
  } else if (type === 'judgment') {
    isCorrect = userAnswer === correctAnswer;
    if (!isCorrect) {
      explanation = `正确答案是: ${correctAnswer === 'true' ? '正确' : '错误'}`;
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
