import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Trophy, Clock, Target, ChevronRight, Star } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { challengeLevels } from '../../data/challenges';
import { useUserStore } from '../../store/useUserStore';
import { useChallengeStore } from '../../store/useChallengeStore';
import { cn, formatTime } from '../../utils/helpers';

const ChallengeLobbyPage = () => {
  const { userProgress } = useUserStore();
  const { getLevelBestScore } = useChallengeStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Noto Serif SC', serif" }}>
          闯关审校
        </h2>
        <p className="text-gray-500 mt-1">限时闯关挑战，检验综合编制能力</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <Card.Body className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">已通过关卡</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userProgress.unlockedLevels.length - 1}/{challengeLevels.length}
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">最高得分</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.max(...challengeLevels.map((level) => getLevelBestScore(level.id).score), 0)}
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">总答题数</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userProgress.totalChallengesCompleted}
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      <div className="space-y-4">
        {challengeLevels.map((level, index) => {
          const isUnlocked = userProgress.unlockedLevels.includes(level.id);
          const bestScore = getLevelBestScore(level.id);
          const isPassed = bestScore.correctRate >= level.passingScore;

          return (
            <Card
              key={level.id}
              hoverable={isUnlocked}
              className={cn(
                'transition-all duration-200',
                !isUnlocked && 'opacity-60'
              )}
            >
              <Card.Body className="p-6">
                <div className="flex items-center gap-6">
                  <div className={cn(
                    'w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0',
                    isUnlocked
                      ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                      : 'bg-gray-200'
                  )}>
                    {isUnlocked ? (
                      <span className="text-2xl font-bold text-white">第{index + 1}关</span>
                    ) : (
                      <Lock className="w-7 h-7 text-gray-400" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{level.name}</h3>
                      {isPassed && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          已通过
                        </span>
                      )}
                      {!isUnlocked && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                          未解锁
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{level.description}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4" />
                        {level.questionIds.length} 道题
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTime(level.timeLimit * 60)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        及格分 {level.passingScore}%
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {bestScore.timestamp > 0 && (
                      <div className="text-right">
                        <p className="text-sm text-gray-500">最高得分</p>
                        <p className="text-2xl font-bold text-amber-600">{bestScore.score}</p>
                      </div>
                    )}
                    {isUnlocked ? (
                      <Link to={`/challenge/${level.id}`}>
                        <Button
                          variant={isPassed ? 'secondary' : 'primary'}
                          size="md"
                          icon={<ChevronRight className="w-4 h-4" />}
                        >
                          {isPassed ? '再次挑战' : '开始挑战'}
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        variant="ghost"
                        size="md"
                        disabled
                        icon={<Lock className="w-4 h-4" />}
                      >
                        完成前一关解锁
                      </Button>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          );
        })}
      </div>

      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <Card.Body className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-amber-900 mb-2">闯关说明</h3>
              <ul className="space-y-2 text-sm text-amber-800">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></span>
                  每关有规定的答题时间，超时自动提交
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></span>
                  达到及格分数即可解锁下一关
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></span>
                  每道题提交后即时显示正确答案和解析
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></span>
                  错误题目自动收录到错题本，方便复习
                </li>
              </ul>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ChallengeLobbyPage;
