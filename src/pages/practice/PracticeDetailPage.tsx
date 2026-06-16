import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Lightbulb, BookOpen, Clock, AlertTriangle, Send, RotateCcw } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { usePracticeStore } from '../../store/usePracticeStore';
import { exercises } from '../../data/exercises';
import { validateAnswer, checkLegalBasisSupport } from '../../utils/validation';
import { cn, getExerciseTypeLabel, formatTime } from '../../utils/helpers';
import { ValidationResult, ExerciseType, LegalBasisOption } from '../../types';

const typeColors: Record<ExerciseType, string> = {
  acceptance_condition: 'from-blue-500 to-blue-600',
  application_material: 'from-teal-500 to-teal-600',
  legal_basis: 'from-purple-500 to-purple-600',
  time_limit: 'from-amber-500 to-amber-600',
  reduction: 'from-green-500 to-green-600',
  material_reduction: 'from-green-500 to-green-600',
  comparison: 'from-gray-500 to-gray-600',
};

const PracticeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { currentExerciseId, submitAnswer, resetCurrentExercise, setCurrentExercise } = usePracticeStore();
  const exerciseId = id || currentExerciseId;
  const exercise = exercises.find((e) => e.id === exerciseId);

  const [userAnswer, setUserAnswer] = useState<string>('');
  const [selectedLegalBasis, setSelectedLegalBasis] = useState<string[]>([]);
  const [timeLimit, setTimeLimit] = useState<number | ''>('');
  const [isTimeLimitReduction, setIsTimeLimitReduction] = useState(false);
  const [reductionScenario, setReductionScenario] = useState('');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [legalBasisCheck, setLegalBasisCheck] = useState<{ isSupported: boolean; message: string } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!exercise) return;

    setUserAnswer('');
    setSelectedLegalBasis([]);
    setTimeLimit('');
    setIsTimeLimitReduction(false);
    setReductionScenario('');
    setValidationResult(null);
    setLegalBasisCheck(null);
    setShowHint(false);
    setShowExplanation(false);
    setTimeSpent(0);
  }, [exerciseId, exercise]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!validationResult) {
        setTimeSpent((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [validationResult]);

  if (!exercise) {
    return (
      <div className="text-center py-16">
        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">练习不存在</h3>
        <Link to="/practice">
          <Button variant="ghost">返回练习列表</Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);

    let fullAnswer = userAnswer;
    if (exercise.type === 'time_limit' && timeLimit) {
      fullAnswer = `承诺时限：${timeLimit}个工作日\n${isTimeLimitReduction ? '即办件' : ''}\n${userAnswer}`;
    } else if (exercise.type === 'reduction' || exercise.type === 'material_reduction') {
      fullAnswer = `减免情形：${reductionScenario}\n${userAnswer}`;
    }

    const result = validateAnswer(fullAnswer, exercise, selectedLegalBasis[0]);
    setValidationResult(result);

    if (exercise.type === 'legal_basis' && selectedLegalBasis.length > 0) {
      const basisContents = selectedLegalBasis
        .map((id) => exercise.legalBasisOptions?.find((o) => o.id === id)?.content)
        .filter(Boolean)
        .join(' ');
      const basisCheck = checkLegalBasisSupport(basisContents, userAnswer);
      setLegalBasisCheck(basisCheck);
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    submitAnswer();
    setIsSubmitting(false);
  };

  const handleReset = () => {
    resetCurrentExercise();
    setUserAnswer('');
    setSelectedLegalBasis([]);
    setTimeLimit('');
    setIsTimeLimitReduction(false);
    setReductionScenario('');
    setValidationResult(null);
    setLegalBasisCheck(null);
    setShowHint(false);
    setShowExplanation(false);
    setTimeSpent(0);
  };

  const toggleLegalBasis = (id: string) => {
    setSelectedLegalBasis((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const renderInputArea = () => {
    switch (exercise.type) {
      case 'acceptance_condition':
      case 'application_material':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              请填写{exercise.type === 'acceptance_condition' ? '受理条件' : '申请材料'}
            </label>
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder={exercise.type === 'acceptance_condition'
                ? '例如：1. 年满18周岁，具有完全民事行为能力\n2. 具有本市常住户口或有效居住证明\n3. 身体健康，无传染性疾病'
                : '例如：1. 居民身份证（原件及复印件）\n2. 户口簿（原件）\n3. 近期免冠照片2张'}
              className="w-full h-40 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none font-mono text-sm"
              disabled={!!validationResult}
            />
          </div>
        );

      case 'legal_basis':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                请填写您的表述内容
              </label>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="请根据所选法定依据，填写相应的办理要素..."
                className="w-full h-32 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none font-mono text-sm"
                disabled={!!validationResult}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                请选择支撑该表述的法定依据（可多选）
              </label>
              <div className="space-y-3">
                {exercise.legalBasisOptions?.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => toggleLegalBasis(option.id)}
                    className={cn(
                      'p-4 border-2 rounded-xl cursor-pointer transition-all duration-200',
                      selectedLegalBasis.includes(option.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300',
                      validationResult && option.isCorrect && 'border-green-500 bg-green-50',
                      validationResult && selectedLegalBasis.includes(option.id) && !option.isCorrect && 'border-red-500 bg-red-50',
                      validationResult && 'cursor-not-allowed opacity-70'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
                        selectedLegalBasis.includes(option.id)
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      )}>
                        {selectedLegalBasis.includes(option.id) && (
                          <CheckCircle className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{option.title}</p>
                        <p className="text-sm text-gray-500 mt-1">{option.content}</p>
                        {option.provision && (
                          <p className="text-xs text-gray-400 mt-1">{option.provision}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'time_limit':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                请设置承诺时限（工作日）
              </label>
              <input
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value === '' ? '' : parseInt(e.target.value))}
                placeholder="请输入承诺时限（工作日）"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                disabled={!!validationResult}
                min="1"
                max="100"
              />
              {exercise.legalTimeLimit && (
                <p className="text-sm text-gray-500 mt-2">
                  提示：法定时限为 {exercise.legalTimeLimit.legal} 个工作日，建议承诺时限不超过 {exercise.legalTimeLimit.commitment} 个{exercise.legalTimeLimit.unit}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isReduction"
                checked={isTimeLimitReduction}
                onChange={(e) => setIsTimeLimitReduction(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                disabled={!!validationResult}
              />
              <label htmlFor="isReduction" className="text-sm text-gray-700">
                该时限设置为即办件（0.5个工作日以内）
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                请说明时限压缩的理由（如适用）
              </label>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="例如：通过信息共享、流程优化等方式压缩办理时限..."
                className="w-full h-24 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none font-mono text-sm"
                disabled={!!validationResult}
              />
            </div>
          </div>
        );

      case 'material_reduction':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                请选择适用的减免情形
              </label>
              <div className="space-y-3">
                {['免交', '容缺受理', '告知承诺制'].map((scenario, index) => (
                  <div
                    key={scenario}
                    onClick={() => setReductionScenario(scenario)}
                    className={cn(
                      'p-4 border-2 rounded-xl cursor-pointer transition-all duration-200',
                      reductionScenario === scenario
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300',
                      validationResult && 'cursor-not-allowed opacity-70'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                        reductionScenario === scenario
                          ? 'border-green-500 bg-green-500'
                          : 'border-gray-300'
                      )}>
                        {reductionScenario === scenario && (
                          <CheckCircle className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="font-medium text-gray-900">{scenario}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                请编写具体的减免说明
              </label>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder={reductionScenario === '免交'
                  ? '例如：1. 居民身份证：通过数据共享核验免交\n2. 营业执照：通过电子证照系统调用免交'
                  : reductionScenario === '容缺受理'
                  ? '例如：1. 缺少非核心材料可先行受理，申请人承诺3个工作日内补齐\n2. 容缺材料清单：[列出可容缺的材料]'
                  : '例如：1. 申请人签订《告知承诺书》，承诺[具体承诺事项]\n2. 审批部门先行作出审批决定，后续加强核查'}
                className="w-full h-40 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none font-mono text-sm"
                disabled={!!validationResult}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/practice" className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={cn(
                'inline-block px-2 py-0.5 text-xs font-medium rounded-md text-white bg-gradient-to-r',
                typeColors[exercise.type]
              )}>
                {getExerciseTypeLabel(exercise.type)}
              </span>
              <span className={cn(
                'inline-block px-2 py-0.5 text-xs font-medium rounded-md',
                exercise.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                exercise.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
              )}>
                {exercise.difficulty === 'easy' ? '简单' : exercise.difficulty === 'medium' ? '中等' : '困难'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Noto Serif SC', serif" }}>
              {exercise.title}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{formatTime(timeSpent)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <Card.Header>
              <h3 className="text-lg font-bold text-gray-900">练习题目</h3>
            </Card.Header>
            <Card.Body>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-blue-900 font-medium">【{exercise.itemType}】{exercise.itemName}</p>
                    <p className="text-blue-700 mt-2">{exercise.question}</p>
                  </div>
                </div>
              </div>

              {exercise.hint && (
                <div className="mb-6">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="flex items-center gap-2 text-amber-600 hover:text-amber-700 text-sm font-medium"
                  >
                    <Lightbulb className="w-4 h-4" />
                    {showHint ? '隐藏提示' : '查看提示'}
                  </button>
                  {showHint && (
                    <div className="mt-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                      <p className="text-sm text-amber-800">{exercise.hint}</p>
                    </div>
                  )}
                </div>
              )}

              {renderInputArea()}
            </Card.Body>
            <Card.Footer className="flex justify-between items-center">
              <div>
                {validationResult ? (
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                  >
                    <RotateCcw className="w-4 h-4" />
                    重新作答
                  </button>
                ) : null}
              </div>
              <div className="flex gap-3">
                {!validationResult && (
                  <Button
                    variant="primary"
                    size="md"
                    icon={<Send className="w-4 h-4" />}
                    onClick={handleSubmit}
                    loading={isSubmitting}
                  >
                    提交答案
                  </Button>
                )}
                <Link to="/practice">
                  <Button variant="ghost" size="md">
                    返回列表
                  </Button>
                </Link>
              </div>
            </Card.Footer>
          </Card>

          {validationResult && (
            <Card>
              <Card.Header>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  {validationResult.isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500" />
                  )}
                  {validationResult.isCorrect ? '回答正确！' : '回答有误'}
                </h3>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  {validationResult.errors.length > 0 && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                      <h4 className="font-medium text-red-900 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        检测到的问题：
                      </h4>
                      <ul className="space-y-2">
                        {validationResult.errors.map((error, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-red-700">
                            <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                              {index + 1}
                            </span>
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {legalBasisCheck && (
                    <div className={cn(
                      'p-4 border rounded-xl',
                      legalBasisCheck.isSupported
                        ? 'bg-green-50 border-green-100'
                        : 'bg-yellow-50 border-yellow-100'
                    )}>
                      <h4 className={cn(
                        'font-medium mb-2 flex items-center gap-2',
                        legalBasisCheck.isSupported ? 'text-green-900' : 'text-yellow-900'
                      )}>
                        {legalBasisCheck.isSupported ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        )}
                        法定依据匹配性检查：
                      </h4>
                      <p className={cn(
                        'text-sm',
                        legalBasisCheck.isSupported ? 'text-green-700' : 'text-yellow-700'
                      )}>
                        {legalBasisCheck.message}
                      </p>
                    </div>
                  )}

                  <div>
                    <button
                      onClick={() => setShowExplanation(!showExplanation)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      {showExplanation ? '隐藏解析' : '查看解析和参考答案'}
                    </button>
                    {showExplanation && (
                      <div className="mt-4 space-y-4">
                        <div className="p-4 bg-gray-50 rounded-xl">
                          <h5 className="font-medium text-gray-900 mb-2">解析</h5>
                          <p className="text-sm text-gray-700">{exercise.explanation}</p>
                        </div>
                        <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                          <h5 className="font-medium text-green-900 mb-2">参考答案</h5>
                          <pre className="whitespace-pre-wrap text-sm text-green-800 font-mono leading-relaxed">
                            {typeof exercise.correctAnswer === 'string'
                              ? exercise.correctAnswer
                              : JSON.stringify(exercise.correctAnswer, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <Card.Header>
              <h3 className="text-lg font-bold text-gray-900">练习信息</h3>
            </Card.Header>
            <Card.Body className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">事项类型</span>
                <span className="text-sm font-medium text-gray-900">{exercise.itemType}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">事项名称</span>
                <span className="text-sm font-medium text-gray-900">{exercise.itemName}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">知识点</span>
                <span className="text-sm font-medium text-gray-900">{exercise.knowledgePoints?.[0] || exercise.knowledgePoint || '通用'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">预计时长</span>
                <span className="text-sm font-medium text-gray-900">{exercise.estimatedTime} 分钟</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-500">已用时间</span>
                <span className="text-sm font-medium text-blue-600">{formatTime(timeSpent)}</span>
              </div>
            </Card.Body>
          </Card>

          {validationResult && (
            <Card>
              <Card.Header>
                <h3 className="text-lg font-bold text-gray-900">答题结果</h3>
              </Card.Header>
              <Card.Body className="space-y-4">
                <div className="text-center py-4">
                  <div className={cn(
                    'w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3',
                    validationResult.isCorrect ? 'bg-green-100' : 'bg-red-100'
                  )}>
                    <span className={cn(
                      'text-3xl font-bold',
                      validationResult.isCorrect ? 'text-green-600' : 'text-red-600'
                    )}>
                      {Math.round(validationResult.score)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">得分（满分100）</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">
                      {validationResult.isCorrect ? '✓' : '✗'}
                    </p>
                    <p className="text-xs text-gray-500">{validationResult.isCorrect ? '正确' : '错误'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{timeSpent}s</p>
                    <p className="text-xs text-gray-500">用时</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}

          {exercise.validationRules && exercise.validationRules.length > 0 && (
            <Card>
              <Card.Header>
                <h3 className="text-lg font-bold text-gray-900">校验规则</h3>
              </Card.Header>
              <Card.Body className="space-y-2">
                {exercise.validationRules.map((rule, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{rule.description || rule.errorMessage}</span>
                  </div>
                ))}
              </Card.Body>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticeDetailPage;
