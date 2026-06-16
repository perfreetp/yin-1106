import { Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, AlertTriangle, Award, BookOpen, Target } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useStatsStore } from '../../store/useStatsStore';
import { cn } from '../../utils/helpers';

const StatsProfilePage = () => {
  const { getWeaknessAnalysis, getStrengthAnalysis, getImprovementSuggestions } = useStatsStore();

  const weaknesses = getWeaknessAnalysis();
  const strengths = getStrengthAnalysis();
  const suggestions = getImprovementSuggestions();

  const radarData = [
    { subject: '受理条件', A: 100 - (weaknesses.find(w => w.knowledgePoint === '受理条件编制')?.errorRate || 0), fullMark: 100 },
    { subject: '申请材料', A: 100 - (weaknesses.find(w => w.knowledgePoint === '申请材料编制')?.errorRate || 0), fullMark: 100 },
    { subject: '法定依据', A: 100 - (weaknesses.find(w => w.knowledgePoint === '法定依据引用')?.errorRate || 0), fullMark: 100 },
    { subject: '办理时限', A: 100 - (weaknesses.find(w => w.knowledgePoint === '办理时限设置')?.errorRate || 0), fullMark: 100 },
    { subject: '材料减免', A: 100 - (weaknesses.find(w => w.knowledgePoint === '材料减免情形')?.errorRate || 0), fullMark: 100 },
    { subject: '通用规范', A: 100 - (weaknesses.find(w => w.knowledgePoint === '通用规范')?.errorRate || 0), fullMark: 100 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/stats" className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            能力画像
          </h2>
          <p className="text-gray-500 mt-1">全方位分析您的知识点掌握情况</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <Card.Header>
            <h3 className="text-lg font-bold text-gray-900">能力雷达图</h3>
          </Card.Header>
          <Card.Body>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar
                    name="掌握程度"
                    dataKey="A"
                    stroke="#1E40AF"
                    fill="#1E40AF"
                    fillOpacity={0.3}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <h3 className="text-lg font-bold text-gray-900">综合评估</h3>
          </Card.Header>
          <Card.Body className="space-y-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
              <div className="text-5xl font-bold text-blue-700" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                {strengths.length >= 4 ? '优秀' : strengths.length >= 2 ? '良好' : '需努力'}
              </div>
              <p className="text-gray-600 mt-2">综合能力评级</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-xl text-center">
                <div className="text-2xl font-bold text-green-600">{strengths.length}</div>
                <p className="text-sm text-green-700 mt-1">优势知识点</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl text-center">
                <div className="text-2xl font-bold text-amber-600">{weaknesses.length}</div>
                <p className="text-sm text-amber-700 mt-1">薄弱知识点</p>
              </div>
            </div>

            {suggestions.length > 0 && (
              <div className="p-4 bg-purple-50 rounded-xl">
                <h4 className="font-medium text-purple-900 mb-2">提升建议</h4>
                <ul className="space-y-2">
                  {suggestions.slice(0, 3).map((suggestion, index) => (
                    <li key={index} className="text-sm text-purple-700 flex items-start gap-2">
                      <span className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-bold text-gray-900">优势分析</h3>
            </div>
          </Card.Header>
          <Card.Body>
            {strengths.length > 0 ? (
              <div className="space-y-4">
                {strengths.map((strength, index) => (
                  <div
                    key={index}
                    className="p-4 bg-green-50 border border-green-100 rounded-xl hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Award className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{strength.knowledgePoint}</h4>
                          <p className="text-xs text-gray-500">已练习 {strength.questionCount} 题</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">{Math.round(100 - strength.errorRate)}%</p>
                        <p className="text-xs text-gray-500">正确率</p>
                      </div>
                    </div>
                    <div className="h-2 bg-green-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all duration-500"
                        style={{ width: `${100 - strength.errorRate}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-green-700 mt-3">
                      {strength.suggestion}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                <Target className="w-12 h-12 mb-3" />
                <p>暂无优势分析</p>
                <p className="text-sm mt-1">完成更多练习后查看</p>
              </div>
            )}
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-bold text-gray-900">薄弱点分析</h3>
            </div>
          </Card.Header>
          <Card.Body>
            {weaknesses.length > 0 ? (
              <div className="space-y-4">
                {weaknesses.map((weakness, index) => (
                  <div
                    key={index}
                    className="p-4 bg-amber-50 border border-amber-100 rounded-xl hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                          <AlertTriangle className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{weakness.knowledgePoint}</h4>
                          <p className="text-xs text-gray-500">已练习 {weakness.questionCount} 题</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn(
                          'text-lg font-bold',
                          weakness.errorRate >= 40 ? 'text-red-600' : 'text-amber-600'
                        )}>
                          {Math.round(weakness.errorRate)}%
                        </p>
                        <p className="text-xs text-gray-500">错误率</p>
                      </div>
                    </div>
                    <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          weakness.errorRate >= 40 ? 'bg-red-500' : 'bg-amber-500'
                        )}
                        style={{ width: `${weakness.errorRate}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-amber-700 mt-3">
                      {weakness.suggestion}
                    </p>
                    <Link to="/rules">
                      <Button variant="ghost" size="sm" className="mt-3 w-full">
                        <BookOpen className="w-4 h-4 mr-2" />
                        去学习
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                <Award className="w-12 h-12 mb-3" />
                <p>暂无薄弱点</p>
                <p className="text-sm mt-1">继续保持！</p>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>

      <Card>
        <Card.Header>
          <h3 className="text-lg font-bold text-gray-900">知识点详情</h3>
        </Card.Header>
        <Card.Body>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">知识点</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">练习次数</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">错误次数</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">正确率</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">掌握程度</th>
                </tr>
              </thead>
              <tbody>
                {[...weaknesses, ...strengths].map((stat, index) => {
                  const correctRate = 100 - stat.errorRate;
                  return (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{stat.knowledgePoint}</td>
                      <td className="py-3 px-4 text-sm text-center text-gray-600">{stat.questionCount}</td>
                      <td className="py-3 px-4 text-sm text-center text-gray-600">
                        {Math.round(stat.questionCount * stat.errorRate / 100)}
                      </td>
                      <td className={cn(
                        'py-3 px-4 text-sm text-center font-bold',
                        correctRate >= 80 ? 'text-green-600' :
                        correctRate >= 60 ? 'text-amber-600' : 'text-red-600'
                      )}>
                        {correctRate.toFixed(1)}%
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={cn(
                          'px-3 py-1 text-xs font-medium rounded-full',
                          correctRate >= 80 ? 'bg-green-100 text-green-700' :
                          correctRate >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                        )}>
                          {correctRate >= 80 ? '熟练' : correctRate >= 60 ? '一般' : '待加强'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default StatsProfilePage;
