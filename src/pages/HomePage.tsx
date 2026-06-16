import { Link } from 'react-router-dom';
import { BookOpen, FileEdit, ShieldCheck, AlertCircle, BarChart3, TrendingUp, Clock, Award, Target } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useUserStore } from '../store/useUserStore';
import { useStatsStore } from '../store/useStatsStore';
import { useMistakesStore } from '../store/useMistakesStore';

const HomePage = () => {
  const { userProgress } = useUserStore();
  const { getOverallStats, getStrongPoints, getWeakPoints } = useStatsStore();
  const { getMistakeStats } = useMistakesStore();
  const overallStats = getOverallStats();
  const strongPoints = getStrongPoints();
  const weakPoints = getWeakPoints();
  const mistakeStats = getMistakeStats();

  const hours = Math.floor(overallStats.totalTime / 60);
  const minutes = overallStats.totalTime % 60;

  const modules = [
    {
      path: '/rules',
      title: '规则课堂',
      description: '学习清单编制核心规则，掌握标准规范',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      path: '/practice',
      title: '案例演练',
      description: '模拟编制练习，逐题即时纠错反馈',
      icon: FileEdit,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600',
    },
    {
      path: '/challenge',
      title: '闯关审校',
      description: '限时闯关挑战，检验综合编制能力',
      icon: ShieldCheck,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
    {
      path: '/mistakes',
      title: '错题本',
      description: '收录错误题目，针对性巩固提升',
      icon: AlertCircle,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
    },
    {
      path: '/stats',
      title: '成绩面板',
      description: '查看学习数据，生成能力画像',
      icon: BarChart3,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Noto Serif SC', serif" }}>
              政务服务事项清单编制演练平台
            </h1>
            <p className="text-blue-100 text-lg mb-6">
              规范化编制 · 仿真化演练 · 智能化纠错
            </p>
            <div className="flex gap-4">
              <Button variant="secondary" size="lg" as={Link} to="/practice">
                开始练习
              </Button>
              <Button variant="ghost" size="lg" className="bg-white/10 text-white border-white/20 hover:bg-white/20" as={Link} to="/rules">
                学习规则
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Award className="w-16 h-16 text-yellow-300" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{overallStats.totalExercises}</p>
                <p className="text-sm text-blue-100">完成练习</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{overallStats.averageCorrectRate}%</p>
                <p className="text-sm text-blue-100">正确率</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{hours > 0 ? `${hours}h${minutes}m` : `${minutes}m`}</p>
                <p className="text-sm text-blue-100">学习时长</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{overallStats.streakDays}</p>
                <p className="text-sm text-blue-100">连续天数</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((module) => (
          <Link key={module.path} to={module.path}>
            <Card hoverable className="h-full">
              <Card.Body className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${module.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <module.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{module.title}</h3>
                    <p className="text-sm text-gray-500">{module.description}</p>
                  </div>
                </div>
                {module.path === '/mistakes' && mistakeStats.unreviewed > 0 && (
                  <div className="mt-4 flex items-center gap-2">
                    <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                      {mistakeStats.unreviewed} 道待复习
                    </span>
                  </div>
                )}
                {module.path === '/challenge' && (
                  <div className="mt-4 flex items-center gap-2">
                    <span className="px-2 py-1 bg-amber-100 text-amber-600 text-xs font-medium rounded-full">
                      已解锁 {userProgress.unlockedLevels.length}/5 关
                    </span>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {strongPoints.length > 0 && (
          <Card>
            <Card.Header>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                能力优势
              </h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                {strongPoints.slice(0, 3).map((point, index) => (
                  <div key={point.knowledgePoint} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="text-sm text-gray-700">{point.knowledgePoint}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">{point.label}</span>
                      <span className="text-sm font-medium text-green-600">
                        {100 - point.errorRate}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        )}

        {weakPoints.length > 0 && (
          <Card>
            <Card.Header>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                待加强
              </h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                {weakPoints.slice(0, 3).map((point, index) => (
                  <div key={point.knowledgePoint} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="text-sm text-gray-700">{point.knowledgePoint}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-amber-600">
                        错误率 {point.errorRate}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/stats/profile">
                <Button variant="ghost" size="sm" fullWidth className="mt-4">
                  查看完整能力画像
                </Button>
              </Link>
            </Card.Body>
          </Card>
        )}
      </div>

      <Card>
        <Card.Header>
          <h3 className="text-lg font-bold text-gray-900">今日学习目标</h3>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">完成练习题</span>
                <span className="text-lg font-bold text-blue-600">
                  {Math.min(userProgress.todayExerciseCount, 5)}/5
                </span>
              </div>
              <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((userProgress.todayExerciseCount / 5) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            <div className="p-4 bg-teal-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">学习时长</span>
                <span className="text-lg font-bold text-teal-600">
                  {Math.min(userProgress.todayTimeSpent, 30)}/30分钟
                </span>
              </div>
              <div className="h-2 bg-teal-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((userProgress.todayTimeSpent / 30) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            <div className="p-4 bg-amber-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">复习错题</span>
                <span className="text-lg font-bold text-amber-600">
                  {Math.min(userProgress.todayMistakeReview, 3)}/3
                </span>
              </div>
              <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((userProgress.todayMistakeReview / 3) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default HomePage;
