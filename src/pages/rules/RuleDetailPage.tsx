import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, AlertTriangle, CheckCircle, FileEdit, BookOpen } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useRulesStore } from '../../store/useRulesStore';
import { usePracticeStore } from '../../store/usePracticeStore';
import { exercises } from '../../data/exercises';
import { cn, getExerciseTypeLabel } from '../../utils/helpers';
import { RuleCategory } from '../../types';

const categoryLabels: Record<RuleCategory, string> = {
  acceptance_condition: '受理条件编制',
  application_material: '申请材料编制',
  legal_basis: '法定依据引用',
  time_limit: '办理时限设置',
  reduction: '材料减免情形',
  general: '通用规范',
};

const categoryColors: Record<RuleCategory, string> = {
  acceptance_condition: 'from-blue-500 to-blue-600',
  application_material: 'from-teal-500 to-teal-600',
  legal_basis: 'from-purple-500 to-purple-600',
  time_limit: 'from-amber-500 to-amber-600',
  reduction: 'from-green-500 to-green-600',
  general: 'from-gray-500 to-gray-600',
};

const RuleDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getRuleById, toggleFavorite, isFavorite } = useRulesStore();
  const { setCurrentExercise } = usePracticeStore();

  const rule = getRuleById(id || '');
  const relatedExercises = exercises.filter((e) => rule?.relatedExercises.includes(e.id));

  if (!rule) {
    return (
      <div className="text-center py-16">
        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">规则不存在</h3>
        <Link to="/rules">
          <Button variant="ghost">返回规则列表</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/rules" className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <span className={cn(
              'inline-block px-2 py-1 text-xs font-medium rounded-md mb-2',
              'bg-blue-50 text-blue-700'
            )}>
              {categoryLabels[rule.category]}
            </span>
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Noto Serif SC', serif" }}>
              {rule.title}
            </h1>
          </div>
        </div>
        <button
          onClick={() => toggleFavorite(rule.id)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          <Star
            className={cn(
              'w-5 h-5',
              isFavorite(rule.id) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'
            )}
          />
          <span className="text-sm text-gray-700">
            {isFavorite(rule.id) ? '已收藏' : '收藏'}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <Card.Header>
              <h3 className="text-lg font-bold text-gray-900">规则说明</h3>
            </Card.Header>
            <Card.Body>
              <p className="text-gray-700 leading-relaxed">{rule.description}</p>
              {rule.keyPoints && rule.keyPoints.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">核心要点</h4>
                  <ul className="space-y-2">
                    {rule.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                常见错误
              </h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                {rule.commonMistakes.map((mistake, index) => (
                  <div key={index} className="p-4 bg-red-50 border border-red-100 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-red-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-red-700 font-medium">{mistake.description}</p>
                        {mistake.example && (
                          <p className="text-sm text-red-600 mt-2 font-mono bg-red-100/50 p-3 rounded-lg">
                            ❌ 错误示例：{mistake.example}
                          </p>
                        )}
                        {mistake.correction && (
                          <p className="text-sm text-green-700 mt-2 font-mono bg-green-100/50 p-3 rounded-lg">
                            ✅ 正确写法：{mistake.correction}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                正确示例
              </h3>
            </Card.Header>
            <Card.Body>
              <div className="bg-green-50 border border-green-100 rounded-xl p-6">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                  {rule.correctExample}
                </pre>
              </div>
              {rule.explanation && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-sm text-blue-700">
                    <span className="font-medium">解析：</span>
                    {rule.explanation}
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <Card.Header>
              <h3 className="text-lg font-bold text-gray-900">规则信息</h3>
            </Card.Header>
            <Card.Body className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">难度等级</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map((level) => (
                    <div
                      key={level}
                      className={cn(
                        'w-2 h-2 rounded-full',
                        level <= rule.difficulty ? 'bg-amber-500' : 'bg-gray-200'
                      )}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">知识点</span>
                <span className="text-sm font-medium text-gray-900">{rule.knowledgePoint}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">关联练习</span>
                <span className="text-sm font-medium text-blue-600">{rule.relatedExercises.length} 道</span>
              </div>
            </Card.Body>
          </Card>

          {relatedExercises.length > 0 && (
            <Card>
              <Card.Header>
                <h3 className="text-lg font-bold text-gray-900">关联练习</h3>
              </Card.Header>
              <Card.Body className="space-y-3">
                {relatedExercises.map((exercise) => (
                  <Link
                    key={exercise.id}
                    to={`/practice/${exercise.id}`}
                    onClick={() => setCurrentExercise(exercise.id)}
                    className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-md">
                            {getExerciseTypeLabel(exercise.type)}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                          {exercise.title}
                        </p>
                      </div>
                      <FileEdit className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                    </div>
                  </Link>
                ))}
              </Card.Body>
            </Card>
          )}

          <div className={`p-6 bg-gradient-to-br ${categoryColors[rule.category]} rounded-xl text-white`}>
            <h3 className="font-bold mb-2">准备好练习了吗？</h3>
            <p className="text-sm text-white/80 mb-4">
              通过实际练习巩固这条规则的要点
            </p>
            {relatedExercises.length > 0 ? (
              <Link to={`/practice/${relatedExercises[0].id}`}>
                <Button variant="ghost" size="sm" fullWidth className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  开始练习
                </Button>
              </Link>
            ) : (
              <Link to="/practice">
                <Button variant="ghost" size="sm" fullWidth className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  前往练习
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuleDetailPage;
