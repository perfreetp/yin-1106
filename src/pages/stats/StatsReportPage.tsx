import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Printer, Share2, Trophy, Target, Clock, Calendar, TrendingUp, Award, AlertTriangle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useStatsStore } from '../../store/useStatsStore';
import { useUserStore } from '../../store/useUserStore';
import { cn, formatDate } from '../../utils/helpers';

const StatsReportPage = () => {
  const { generateReport, getOverallStats } = useStatsStore();
  const { userProgress } = useUserStore();

  const report = generateReport();
  const overallStats = getOverallStats();

  const hours = Math.floor(overallStats.totalTime / 60);
  const minutes = overallStats.totalTime % 60;

  const gradeColor = {
    '优秀': 'text-green-600 bg-green-100',
    '良好': 'text-blue-600 bg-blue-100',
    '合格': 'text-amber-600 bg-amber-100',
    '待提升': 'text-red-600 bg-red-100',
  }[report.overall.grade] || 'text-gray-600 bg-gray-100';

  const handleExport = () => {
    const reportContent = `
政务服务事项清单编制培训报告
生成时间：${formatDate(Date.now())}

一、基本信息
学员：${userProgress.userId || '培训学员'}
累计学习时长：${hours > 0 ? hours + '小时' + minutes + '分钟' : minutes + '分钟'}
完成练习数：${overallStats.totalExercises} 道
平均正确率：${overallStats.averageCorrectRate}%
连续学习天数：${overallStats.streakDays} 天

二、综合评定
综合评级：${report.overall.grade}
综合得分：${report.overall.totalScore} 分

三、能力维度得分
${report.skillScores.map((score) => `- ${score.knowledgePoint}：${score.score} 分 (${score.level})`).join('\n')}

四、优势分析
${report.strengths.length > 0 ? report.strengths.map((s, i) => `${i + 1}. ${s}`).join('\n') : '暂无数据'}

五、薄弱点分析
${report.weaknesses.length > 0 ? report.weaknesses.map((w, i) => `${i + 1}. ${w}`).join('\n') : '暂无数据'}

六、提升建议
${report.improvementPlan.map((item, i) => `${i + 1}. ${item}`).join('\n')}

七、培训结论
${report.conclusion}

政务服务事项清单编制演练平台
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `培训报告_${formatDate(Date.now()).replace(/\//g, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/stats" className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Noto Serif SC', serif" }}>
              培训考核报告
            </h2>
            <p className="text-gray-500 mt-1">生成于 {formatDate(Date.now())}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="md" icon={<Printer className="w-4 h-4" />}>
            打印
          </Button>
          <Button variant="ghost" size="md" icon={<Share2 className="w-4 h-4" />}>
            分享
          </Button>
          <Button variant="primary" size="md" icon={<Download className="w-4 h-4" />} onClick={handleExport}>
            导出报告
          </Button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 rounded-2xl p-8 text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <p className="text-blue-100 text-sm mb-1">综合评级</p>
            <div className={cn(
              'inline-block px-4 py-2 rounded-xl text-2xl font-bold',
              gradeColor
            )}>
              {report.overall.grade}
            </div>
          </div>
          <div>
            <p className="text-blue-100 text-sm mb-1">综合得分</p>
            <p className="text-3xl font-bold">{report.overall.totalScore}分</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm mb-1">完成练习</p>
            <p className="text-3xl font-bold">{overallStats.totalExercises}题</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm mb-1">学习时长</p>
            <p className="text-3xl font-bold">{hours > 0 ? `${hours}h${minutes}m` : `${minutes}m`}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <Card.Header>
            <h3 className="text-lg font-bold text-gray-900">能力维度得分</h3>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              {report.skillScores.map((skill, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center',
                        skill.score >= 80 ? 'bg-green-100' :
                        skill.score >= 60 ? 'bg-amber-100' : 'bg-red-100'
                      )}>
                        <span className={cn(
                          'text-sm font-bold',
                          skill.score >= 80 ? 'text-green-600' :
                          skill.score >= 60 ? 'text-amber-600' : 'text-red-600'
                        )}>
                          {skill.score}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{skill.knowledgePoint}</p>
                        <p className="text-xs text-gray-500">{skill.description}</p>
                      </div>
                    </div>
                    <span className={cn(
                      'px-3 py-1 text-xs font-medium rounded-full',
                      skill.level === '熟练' ? 'bg-green-100 text-green-700' :
                      skill.level === '良好' ? 'bg-blue-100 text-blue-700' :
                      skill.level === '一般' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    )}>
                      {skill.level}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-1000',
                        skill.score >= 80 ? 'bg-green-500' :
                        skill.score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                      )}
                      style={{ width: `${skill.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>

        <div className="space-y-6">
          <Card>
            <Card.Header>
              <h3 className="text-lg font-bold text-gray-900">学习统计</h3>
            </Card.Header>
            <Card.Body className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Target className="w-5 h-5 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">平均正确率</p>
                  <p className="text-lg font-bold text-gray-900">{overallStats.averageCorrectRate}%</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Calendar className="w-5 h-5 text-purple-500" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">连续学习</p>
                  <p className="text-lg font-bold text-gray-900">{overallStats.streakDays} 天</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Clock className="w-5 h-5 text-amber-500" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">累计时长</p>
                  <p className="text-lg font-bold text-gray-900">{hours > 0 ? `${hours}h${minutes}m` : `${minutes}m`}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Trophy className="w-5 h-5 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">通关数</p>
                  <p className="text-lg font-bold text-gray-900">{overallStats.passedChallenges}/{overallStats.totalChallenges}</p>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h3 className="text-lg font-bold text-gray-900">能力标签</h3>
            </Card.Header>
            <Card.Body>
              <div className="flex flex-wrap gap-2">
                {report.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={cn(
                      'px-3 py-1.5 text-sm font-medium rounded-full',
                      tag.type === 'strength' ? 'bg-green-100 text-green-700' :
                      tag.type === 'weakness' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    )}
                  >
                    {tag.text}
                  </span>
                ))}
              </div>
            </Card.Body>
          </Card>
        </div>
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
            {report.strengths.length > 0 ? (
              <ul className="space-y-3">
                {report.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                    <Award className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-800">{strength}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Target className="w-12 h-12 mx-auto mb-3" />
                <p>完成更多练习后展示优势分析</p>
              </div>
            )}
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-bold text-gray-900">薄弱点分析</h3>
            </div>
          </Card.Header>
          <Card.Body>
            {report.weaknesses.length > 0 ? (
              <ul className="space-y-3">
                {report.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl">
                    <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800">{weakness}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Award className="w-12 h-12 mx-auto mb-3" />
                <p>太棒了！暂无明显薄弱点</p>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>

      <Card>
        <Card.Header>
          <h3 className="text-lg font-bold text-gray-900">个性化提升计划</h3>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            {report.improvementPlan.map((plan, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">{index + 1}</span>
                </div>
                <p className="text-purple-800">{plan}</p>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h3 className="text-lg font-bold text-gray-900">培训结论</h3>
        </Card.Header>
        <Card.Body>
          <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-blue-100">
            <p className="text-gray-700 leading-relaxed text-lg" style={{ fontFamily: "'Noto Serif SC', serif" }}>
              {report.conclusion}
            </p>
          </div>
        </Card.Body>
        <Card.Footer className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <p>政务服务事项清单编制演练平台</p>
            <p>报告生成时间：{formatDate(Date.now())}</p>
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default StatsReportPage;
