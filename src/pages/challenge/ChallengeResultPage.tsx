import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Trophy, CheckCircle, XCircle, Clock, Target, Star, RotateCcw, ChevronRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { challengeLevels } from '../../data/challenges';
import { useChallengeStore } from '../../store/useChallengeStore';
import { useUserStore } from '../../store/useUserStore';
import { cn, formatTime, formatDate } from '../../utils/helpers';

const ChallengeResultPage = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const { getAttemptById } = useChallengeStore();
  const { userProgress } = useUserStore();

  const attempt = getAttemptById(attemptId || '');
  const level = attempt ? challengeLevels.find((l) => l.id === attempt.levelId) : undefined;

  if (!attempt || !level) {
    return (
      <div className="text-center py-16">
        <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">成绩记录不存在</h3>
        <Link to="/challenge">
          <Button variant="ghost">返回闯关大厅</Button>
        </Link>
      </div>
    );
  }

  const isPassed = attempt.correctRate >= level.passingScore;
  const hasNextLevel = userProgress.unlockedLevels.includes(
    challengeLevels[challengeLevels.findIndex((l) => l.id === level.id) + 1]?.id || ''
  );
  const nextLevel = challengeLevels[challengeLevels.findIndex((l) => l.id === level.id) + 1];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/challenge" className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            {level.name} - 闯关结果
          </h1>
          <p className="text-gray-500 mt-1">完成时间：{formatDate(attempt.timestamp)}</p>
        </div>
      </div>

      <Card className={cn(
        'border-2',
        isPassed ? 'border-green-200' : 'border-amber-200'
      )}>
        <Card.Body className="p-8">
          <div className="text-center">
            <div className={cn(
              'w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6',
              isPassed ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-amber-400 to-amber-600'
            )}>
              {isPassed ? (
                <Trophy className="w-16 h-16 text-white" />
              ) : (
                <Star className="w-16 h-16 text-white" />
              )}
            </div>

            <h2 className={cn(
              'text-3xl font-bold mb-2',
              isPassed ? 'text-green-600' : 'text-amber-600'
            )}>
              {isPassed ? '恭喜通关！' : '继续加油！'}
            </h2>
            <p className="text-gray-500 mb-6">
              {isPassed
                ? '您已成功通过本关，可以挑战下一关了！'
                : `需要达到 ${level.passingScore}% 的正确率才能通过本关`}
            </p>

            <div className="text-6xl font-bold text-gray-900 mb-2">
              {attempt.score}
              <span className="text-2xl text-gray-400 ml-2">分</span>
            </div>
            <p className="text-lg text-gray-500">
              正确率 <span className={cn(
                'font-bold',
                isPassed ? 'text-green-600' : 'text-amber-600'
              )}>{attempt.correctRate}%</span>
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="p-4 bg-gray-50 rounded-xl text-center">
              <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{attempt.correctCount}</p>
              <p className="text-sm text-gray-500">正确</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl text-center">
              <XCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{attempt.wrongCount}</p>
              <p className="text-sm text-gray-500">错误</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl text-center">
              <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{formatTime(attempt.timeSpent)}</p>
              <p className="text-sm text-gray-500">用时</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl text-center">
              <Target className="w-6 h-6 text-amber-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{attempt.totalQuestions}</p>
              <p className="text-sm text-gray-500">总题数</p>
            </div>
          </div>

          {attempt.knowledgePointStats && attempt.knowledgePointStats.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">知识点掌握情况</h3>
              <div className="space-y-3">
                {attempt.knowledgePointStats.map((stat, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="w-28 text-sm text-gray-600 truncate">{stat.knowledgePoint}</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          stat.errorRate < 20 ? 'bg-green-500' :
                          stat.errorRate < 40 ? 'bg-amber-500' : 'bg-red-500'
                        )}
                        style={{ width: `${100 - stat.errorRate}%` }}
                      ></div>
                    </div>
                    <span className={cn(
                      'w-12 text-sm font-medium text-right',
                      stat.errorRate < 20 ? 'text-green-600' :
                      stat.errorRate < 40 ? 'text-amber-600' : 'text-red-600'
                    )}>
                      {Math.round(100 - stat.errorRate)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card.Body>
        <Card.Footer className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Link to="/challenge">
            <Button variant="ghost" size="md" icon={<ArrowLeft className="w-4 h-4" />}>
              返回大厅
            </Button>
          </Link>
          <div className="flex gap-3">
            <Link to={`/challenge/${level.id}`}>
              <Button variant="secondary" size="md" icon={<RotateCcw className="w-4 h-4" />}>
                再次挑战
              </Button>
            </Link>
            {isPassed && nextLevel && (
              <Link to={`/challenge/${nextLevel.id}`}>
                <Button variant="primary" size="md" icon={<ChevronRight className="w-4 h-4" />}>
                  挑战下一关
                </Button>
              </Link>
            )}
          </div>
        </Card.Footer>
      </Card>

      <Card>
        <Card.Header>
          <h3 className="text-lg font-bold text-gray-900">答题详情</h3>
        </Card.Header>
        <Card.Body className="space-y-4">
          {attempt.answers.map((answer, index) => (
            <div
              key={index}
              className={cn(
                'p-4 border-2 rounded-xl',
                answer.isCorrect ? 'border-green-200 bg-green-50/30' : 'border-red-200 bg-red-50/30'
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                  answer.isCorrect ? 'bg-green-500' : 'bg-red-500'
                )}>
                  {answer.isCorrect ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : (
                    <XCircle className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 mb-2">
                    <span className="font-medium mr-2">第{index + 1}题</span>
                    {answer.questionTitle}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      您的答案：{Array.isArray(answer.userAnswer) ? answer.userAnswer.join(', ') : answer.userAnswer}
                    </span>
                    {!answer.isCorrect && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                        正确答案：{Array.isArray(answer.correctAnswer) ? answer.correctAnswer.join(', ') : answer.correctAnswer}
                      </span>
                    )}
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      得分：{answer.score}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ChallengeResultPage;
