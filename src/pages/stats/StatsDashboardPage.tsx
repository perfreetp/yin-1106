import { Link } from 'react-router-dom';
import { BarChart3, Trophy, Target, Clock, TrendingUp, Calendar, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useStatsStore } from '../../store/useStatsStore';
import { useUserStore } from '../../store/useUserStore';
import { cn, formatDate } from '../../utils/helpers';

const StatsDashboardPage = () => {
  const { getOverallStats, getLatestScores, getWeeklyTrend } = useStatsStore();
  const { userProgress } = useUserStore();
  const overallStats = getOverallStats();
  const latestScores = getLatestScores(5);
  const weeklyTrend = getWeeklyTrend();

  const hours = Math.floor(overallStats.totalTime / 60);
  const minutes = overallStats.totalTime % 60;

  const chartData = userProgress.knowledgePointStats.map((stat) => ({
    name: stat.knowledgePoint.length > 6 ? stat.knowledgePoint.slice(0, 6) + '...' : stat.knowledgePoint,
    正确率: Math.round(100 - stat.errorRate),
    练习次数: stat.questionCount,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            成绩面板
          </h2>
          <p className="text-gray-500 mt-1">查看学习数据，追踪学习进度</p>
        </div>
        <div className="flex gap-3">
          <Link to="/stats/profile">
            <Button variant="ghost" size="md">
              能力画像
            </Button>
          </Link>
          <Link to="/stats/report">
            <Button variant="primary" size="md">
              生成培训报告
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <Card.Body className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{overallStats.totalExercises}</p>
            <p className="text-sm text-gray-500 mt-1">完成练习</p>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className={cn(
                'w-5 h-5',
                overallStats.averageCorrectRate >= 80 ? 'text-green-500' : overallStats.averageCorrectRate >= 60 ? 'text-amber-500' : 'text-red-500'
              )} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{overallStats.averageCorrectRate}%</p>
            <p className="text-sm text-gray-500 mt-1">平均正确率</p>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{hours > 0 ? `${hours}h${minutes}m` : `${minutes}m`}</p>
            <p className="text-sm text-gray-500 mt-1">累计学习时长</p>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{overallStats.streakDays}</p>
            <p className="text-sm text-gray-500 mt-1">连续学习天数</p>
          </Card.Body>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <Card.Header>
            <h3 className="text-lg font-bold text-gray-900">知识点掌握情况</h3>
          </Card.Header>
          <Card.Body>
            {chartData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Bar dataKey="正确率" fill="#1E40AF" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-400">
                暂无数据，完成练习后查看
              </div>
            )}
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <h3 className="text-lg font-bold text-gray-900">最近成绩</h3>
          </Card.Header>
          <Card.Body>
            {latestScores.length > 0 ? (
              <div className="space-y-3">
                {latestScores.map((score) => (
                  <div key={score.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {score.type === 'exercise' ? '练习' : score.type === 'challenge' ? '闯关' : '考试'}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(score.timestamp)}</p>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        'text-lg font-bold',
                        score.correctRate >= 80 ? 'text-green-600' :
                        score.correctRate >= 60 ? 'text-amber-600' : 'text-red-600'
                      )}>
                        {score.score}分
                      </p>
                      <p className="text-xs text-gray-500">{score.correctRate}%</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                暂无成绩记录
              </div>
            )}
          </Card.Body>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <Card.Header>
            <h3 className="text-lg font-bold text-gray-900">本周学习趋势</h3>
          </Card.Header>
          <Card.Body>
            {weeklyTrend.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCorrectRate" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1E40AF" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#1E40AF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="correctRate"
                      stroke="#1E40AF"
                      fillOpacity={1}
                      fill="url(#colorCorrectRate)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                暂无数据，完成练习后查看
              </div>
            )}
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <h3 className="text-lg font-bold text-gray-900">学习详情</h3>
          </Card.Header>
          <Card.Body className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-blue-700">闯关进度</span>
                <span className="text-sm font-bold text-blue-700">
                  {overallStats.passedChallenges}/{overallStats.totalChallenges}
                </span>
              </div>
              <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{
                    width: overallStats.totalChallenges > 0
                      ? `${(overallStats.passedChallenges / overallStats.totalChallenges) * 100}%`
                      : '0%'
                  }}
                ></div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-amber-700">今日目标</span>
                <span className="text-sm font-bold text-amber-700">
                  {Math.min(userProgress.todayExerciseCount, 5)}/5
                </span>
              </div>
              <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((userProgress.todayExerciseCount / 5) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            <Link to="/stats/profile" className="block">
              <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200 text-center">
                <BarChart3 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">查看能力画像</p>
                <p className="text-xs text-gray-500 mt-1">了解您的优势和薄弱点</p>
              </div>
            </Link>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default StatsDashboardPage;
