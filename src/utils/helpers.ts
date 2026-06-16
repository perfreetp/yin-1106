export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateShort = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit'
  });
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const getRandomItems = <T>(array: T[], count: number): T[] => {
  if (count >= array.length) return [...array];
  return shuffleArray(array).slice(0, count);
};

export const calculateSimilarity = (str1: string, str2: string): number => {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();

  if (s1 === s2) return 1;
  if (!s1 || !s2) return 0;

  const words1 = new Set(s1.split(/\s+/));
  const words2 = new Set(s2.split(/\s+/));

  let intersection = 0;
  words1.forEach(word => {
    if (words2.has(word)) intersection++;
  });

  const union = words1.size + words2.size - intersection;
  if (union === 0) return 0;

  const wordSimilarity = intersection / union;

  let charMatches = 0;
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;

  for (let i = 0; i < shorter.length; i++) {
    if (longer[i] === shorter[i]) charMatches++;
  }

  const charSimilarity = charMatches / longer.length;

  return (wordSimilarity * 0.6) + (charSimilarity * 0.4);
};

export const extractKeywords = (text: string): string[] => {
  const keywords: string[] = [];
  const patterns = [
    /[《]([^》]+)[》]/g,
    /["]([^"]+)["]/g,
    /[(]([^)]+)[)]/g,
  ];

  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      if (match[1] && match[1].length >= 2) {
        keywords.push(match[1]);
      }
    }
  });

  const commonWords = ['的', '和', '与', '或', '及', '等', '在', '对', '为', '以', '由', '所', '可', '应', '应当', '必须', '需要', '提供', '提交', '申请', '办理'];
  const words = text.split(/[\s，。；：、！？（）《》""''\[\]【】]+/).filter(w => w.length >= 2 && !commonWords.includes(w));

  return [...new Set([...keywords, ...words])];
};

export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'easy': return 'text-emerald-600 bg-emerald-50';
    case 'medium': return 'text-amber-600 bg-amber-50';
    case 'hard': return 'text-red-600 bg-red-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

export const getDifficultyLabel = (difficulty: string): string => {
  switch (difficulty) {
    case 'easy': return '简单';
    case 'medium': return '中等';
    case 'hard': return '困难';
    default: return '未知';
  }
};

export const getExerciseTypeLabel = (type: string): string => {
  switch (type) {
    case 'acceptance_condition': return '受理条件';
    case 'application_material': return '申请材料';
    case 'legal_basis': return '法定依据';
    case 'time_limit': return '承诺时限';
    case 'reduction': return '材料减免';
    case 'comparison': return '地区对比';
    default: return '未知类型';
  }
};

export const getErrorTypeLabel = (type: string): string => {
  switch (type) {
    case 'missing_keyword': return '缺少关键词';
    case 'format_error': return '格式错误';
    case 'legal_basis_mismatch': return '法定依据不匹配';
    case 'time_limit_error': return '时限设置错误';
    case 'reduction_invalid': return '减免情形无效';
    case 'content_incomplete': return '内容不完整';
    default: return '其他错误';
  }
};

export const getErrorTypeColor = (type: string): string => {
  switch (type) {
    case 'missing_keyword': return 'text-orange-600 bg-orange-50';
    case 'format_error': return 'text-purple-600 bg-purple-50';
    case 'legal_basis_mismatch': return 'text-red-600 bg-red-50';
    case 'time_limit_error': return 'text-blue-600 bg-blue-50';
    case 'reduction_invalid': return 'text-pink-600 bg-pink-50';
    case 'content_incomplete': return 'text-amber-600 bg-amber-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

export const cn = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
