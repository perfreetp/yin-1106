import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, AlertTriangle, CheckCircle, XCircle, Send, Lightbulb } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { challengeLevels, challengeQuestions } from '../../data/challenges';
import { useChallengeStore } from '../../store/useChallengeStore';
import { cn, formatTime } from '../../utils/helpers';
import { ChallengeQuestion, ChallengeAnswer } from '../../types';

const ChallengePage = () => {
  const { levelId } = useParams<{ levelId: string }>();
  const navigate = useNavigate();
  const level = challengeLevels.find((l) => l.id === levelId);

  const {
    currentQuestionIndex,
    answers,
    timeRemaining,
    isSubmitted,
    showResult,
    currentAnswer,
    currentQuestions,
    initChallenge,
    setCurrentAnswer,
    submitAnswer,
    nextQuestion,
    finishChallenge,
    tickTimer,
  } = useChallengeStore();

  const [showHint, setShowHint] = useState(false);

  const currentQuestion: ChallengeQuestion | undefined = currentQuestions[currentQuestionIndex];
  const totalQuestions = currentQuestions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const timeProgress = level ? (timeRemaining / level.timeLimit) * 100 : 0;
  const isTimeWarning = timeRemaining <= 30;

  useEffect(() => {
    if (levelId) {
      initChallenge(levelId);
    }
    return () => {
      useChallengeStore.getState().resetChallenge();
    };
  }, [levelId, initChallenge]);

  useEffect(() => {
    if (isSubmitted || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted, timeRemaining, tickTimer]);

  useEffect(() => {
    if (timeRemaining <= 0 && !isSubmitted) {
      finishChallenge();
    }
  }, [timeRemaining, isSubmitted, finishChallenge]);

  useEffect(() => {
    if (showResult && !isSubmitted) {
      const timer = setTimeout(() => {
        if (isLastQuestion) {
          const attempt = finishChallenge();
          navigate(`/challenge/result/${attempt.id}`);
        } else {
          nextQuestion();
          setShowHint(false);
        }
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [showResult, isSubmitted, currentQuestionIndex, isLastQuestion, nextQuestion, finishChallenge, navigate]);

  const handleToggleOption = (option: string) => {
    if (showResult) return;

    const answerArr = Array.isArray(currentAnswer) ? currentAnswer : [];
    if (currentQuestion?.type === 'single' || currentQuestion?.type === 'judge') {
      setCurrentAnswer([option]);
    } else if (currentQuestion?.type === 'multiple') {
      setCurrentAnswer(
        answerArr.includes(option)
          ? answerArr.filter((a) => a !== option)
          : [...answerArr, option]
      );
    }
  };

  const handleFillChange = (value: string) => {
    if (showResult) return;
    setCurrentAnswer(value);
  };

  const handleSubmit = () => {
    const answerArr = Array.isArray(currentAnswer) ? currentAnswer : [currentAnswer];
    if (answerArr.filter(Boolean).length === 0 && currentQuestion?.type !== 'fill') return;
    submitAnswer();
  };

  const handleNext = () => {
    if (isLastQuestion) {
      const attempt = finishChallenge();
      navigate(`/challenge/result/${attempt.id}`);
    } else {
      nextQuestion();
      setShowHint(false);
    }
  };

  if (!level || !currentQuestion) {
    return (
      <div className="text-center py-16">
        <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">关卡不存在</h3>
        <Link to="/challenge">
          <Button variant="ghost">返回闯关大厅</Button>
        </Link>
      </div>
    );
  }

  const currentAnswerData = currentQuestion 
    ? answers.find(a => a.questionId === currentQuestion.id) 
    : undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/challenge" className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Noto Serif SC', serif" }}>
              {level.name}
            </h1>
            <p className="text-gray-500 text-sm">第 {currentQuestionIndex + 1} / {totalQuestions} 题</p>
          </div>
        </div>
        <div className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-lg font-bold',
          isTimeWarning ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-amber-100 text-amber-700'
        )}>
          <Clock className="w-5 h-5" />
          {formatTime(timeRemaining)}
        </div>
      </div>

      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-1000',
            isTimeWarning
              ? 'bg-gradient-to-r from-red-500 to-red-600'
              : 'bg-gradient-to-r from-amber-500 to-orange-500'
          )}
          style={{ width: `${timeProgress}%` }}
        ></div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {currentQuestions.map((q, index) => {
          const answer = answers.find(a => a.questionId === q.id);
          let status = 'pending';
          if (answer) {
            status = answer.isCorrect ? 'correct' : 'incorrect';
          } else if (index === currentQuestionIndex) {
            status = 'current';
          }

          return (
            <div
              key={index}
              className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium flex-shrink-0 transition-all duration-200',
                status === 'current' && 'bg-blue-600 text-white scale-110',
                status === 'correct' && 'bg-green-500 text-white',
                status === 'incorrect' && 'bg-red-500 text-white',
                status === 'pending' && 'bg-gray-200 text-gray-500'
              )}
            >
              {index + 1}
            </div>
          );
        })}
      </div>

      <Card>
        <Card.Header>
          <div className="flex items-center gap-3">
            <span className={cn(
              'px-3 py-1 text-xs font-medium rounded-full',
              currentQuestion.type === 'single' && 'bg-blue-100 text-blue-700',
              currentQuestion.type === 'multiple' && 'bg-purple-100 text-purple-700',
              currentQuestion.type === 'judge' && 'bg-green-100 text-green-700',
              currentQuestion.type === 'fill' && 'bg-amber-100 text-amber-700'
            )}>
              {currentQuestion.type === 'single' && '单选题'}
              {currentQuestion.type === 'multiple' && '多选题'}
              {currentQuestion.type === 'judge' && '判断题'}
              {currentQuestion.type === 'fill' && '填空题'}
            </span>
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
              {currentQuestion.knowledgePoint}
            </span>
          </div>
        </Card.Header>
        <Card.Body className="space-y-6">
          <div className="p-6 bg-gray-50 rounded-xl">
            <p className="text-gray-900 text-lg leading-relaxed">{currentQuestion.content}</p>
          </div>

          {currentQuestion.hint && !showResult && (
            <div>
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-2 text-amber-600 hover:text-amber-700 text-sm font-medium"
              >
                <Lightbulb className="w-4 h-4" />
                {showHint ? '隐藏提示' : '查看提示（-5分）'}
              </button>
              {showHint && (
                <div className="mt-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                  <p className="text-sm text-amber-800">{currentQuestion.hint}</p>
                </div>
              )}
            </div>
          )}

          {(currentQuestion.type === 'single' || currentQuestion.type === 'multiple') && (
            <div className="space-y-3">
              {currentQuestion.options?.map((option, index) => {
                const optionKey = String.fromCharCode(65 + index);
                const answerArr = Array.isArray(currentAnswer) ? currentAnswer : [];
                const correctArr = Array.isArray(currentQuestion.correctAnswer) ? currentQuestion.correctAnswer : [currentQuestion.correctAnswer];
                const isSelected = answerArr.includes(optionKey);
                const isCorrectOption = correctArr.includes(optionKey);
                const showCorrectness = showResult;

                return (
                  <div
                    key={optionKey}
                    onClick={() => handleToggleOption(optionKey)}
                    className={cn(
                      'p-4 border-2 rounded-xl cursor-pointer transition-all duration-200',
                      !showCorrectness && isSelected && 'border-blue-500 bg-blue-50',
                      !showCorrectness && !isSelected && 'border-gray-200 hover:border-gray-300',
                      showCorrectness && isCorrectOption && 'border-green-500 bg-green-50',
                      showCorrectness && isSelected && !isCorrectOption && 'border-red-500 bg-red-50',
                      showCorrectness && !isSelected && !isCorrectOption && 'border-gray-200 opacity-50',
                      showResult && 'cursor-not-allowed'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
                        !showCorrectness && isSelected && 'border-blue-500 bg-blue-500',
                        !showCorrectness && !isSelected && 'border-gray-300',
                        showCorrectness && isCorrectOption && 'border-green-500 bg-green-500',
                        showCorrectness && isSelected && !isCorrectOption && 'border-red-500 bg-red-500',
                        showCorrectness && !isSelected && !isCorrectOption && 'border-gray-300'
                      )}>
                        {(isSelected || (showCorrectness && isCorrectOption)) && (
                          <CheckCircle className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-gray-900 mr-2">{optionKey}.</span>
                        <span className="text-gray-700">{option}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {currentQuestion.type === 'judge' && (
            <div className="grid grid-cols-2 gap-4">
              {['正确', '错误'].map((option) => {
                const optionKey = option === '正确' ? 'A' : 'B';
                const answerArr = Array.isArray(currentAnswer) ? currentAnswer : [];
                const correctArr = Array.isArray(currentQuestion.correctAnswer) ? currentQuestion.correctAnswer : [currentQuestion.correctAnswer];
                const isSelected = answerArr.includes(optionKey);
                const isCorrectOption = correctArr.includes(optionKey);
                const showCorrectness = showResult;

                return (
                  <div
                    key={optionKey}
                    onClick={() => handleToggleOption(optionKey)}
                    className={cn(
                      'p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 text-center',
                      !showCorrectness && isSelected && 'border-blue-500 bg-blue-50',
                      !showCorrectness && !isSelected && 'border-gray-200 hover:border-gray-300',
                      showCorrectness && isCorrectOption && 'border-green-500 bg-green-50',
                      showCorrectness && isSelected && !isCorrectOption && 'border-red-500 bg-red-50',
                      showResult && 'cursor-not-allowed'
                    )}
                  >
                    <div className={cn(
                      'w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center',
                      !showCorrectness && isSelected && 'bg-blue-500',
                      !showCorrectness && !isSelected && 'bg-gray-200',
                      showCorrectness && isCorrectOption && 'bg-green-500',
                      showCorrectness && isSelected && !isCorrectOption && 'bg-red-500'
                    )}>
                      {option === '正确' ? (
                        <CheckCircle className={cn(
                          'w-6 h-6',
                          (isSelected || isCorrectOption) ? 'text-white' : 'text-gray-400'
                        )} />
                      ) : (
                        <XCircle className={cn(
                          'w-6 h-6',
                          (isSelected || isCorrectOption) ? 'text-white' : 'text-gray-400'
                        )} />
                      )}
                    </div>
                    <p className={cn(
                      'text-lg font-bold',
                      !showCorrectness && isSelected && 'text-blue-700',
                      showCorrectness && isCorrectOption && 'text-green-700',
                      showCorrectness && isSelected && !isCorrectOption && 'text-red-700'
                    )}>
                      {option}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {currentQuestion.type === 'fill' && (
            <div>
              <input
                type="text"
                value={typeof currentAnswer === 'string' ? currentAnswer : ''}
                onChange={(e) => handleFillChange(e.target.value)}
                placeholder="请输入答案..."
                className={cn(
                  'w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 text-lg',
                  !showResult && 'border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  showResult && currentAnswerData?.isCorrect && 'border-green-500 bg-green-50',
                  showResult && !currentAnswerData?.isCorrect && 'border-red-500 bg-red-50'
                )}
                disabled={showResult}
              />
              {showResult && (
                <p className="mt-2 text-sm text-gray-500">
                  正确答案：<span className="font-mono font-medium text-green-600">
                    {Array.isArray(currentQuestion.correctAnswer) ? currentQuestion.correctAnswer.join(', ') : currentQuestion.correctAnswer}
                  </span>
                </p>
              )}
            </div>
          )}

          {showResult && currentAnswerData && (
            <div className={cn(
              'p-6 rounded-xl',
              currentAnswerData.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            )}>
              <div className="flex items-start gap-3">
                {currentAnswerData.isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                )}
                <div>
                  <h4 className={cn(
                    'font-bold text-lg mb-2',
                    currentAnswerData.isCorrect ? 'text-green-900' : 'text-red-900'
                  )}>
                    {currentAnswerData.isCorrect ? '回答正确！' : '回答错误'}
                  </h4>
                  {currentQuestion.explanation && (
                    <p className={cn(
                      'text-sm',
                      currentAnswerData.isCorrect ? 'text-green-700' : 'text-red-700'
                    )}>
                      解析：{currentQuestion.explanation}
                    </p>
                  )}
                  {currentAnswerData.score !== undefined && (
                    <p className="mt-2 text-sm font-medium">
                      得分：<span className={currentAnswerData.isCorrect ? 'text-green-600' : 'text-red-600'}>
                        {currentAnswerData.score}
                      </span> 分
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </Card.Body>
        <Card.Footer className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {currentQuestion.type === 'multiple' && !showResult && (
              <span>本题为多选题，请选择所有正确答案</span>
            )}
          </div>
          <div className="flex gap-3">
            {!showResult ? (
              <Button
                variant="primary"
                size="md"
                icon={<Send className="w-4 h-4" />}
                onClick={handleSubmit}
                disabled={
                  (Array.isArray(currentAnswer) 
                    ? currentAnswer.filter(Boolean).length === 0 && currentQuestion.type !== 'fill'
                    : !currentAnswer && currentQuestion.type !== 'fill')
                }
              >
                提交答案
              </Button>
            ) : (
              <Button
                variant={isLastQuestion ? 'success' : 'primary'}
                size="md"
                onClick={handleNext}
              >
                {isLastQuestion ? '查看成绩' : '下一题'}
              </Button>
            )}
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default ChallengePage;
