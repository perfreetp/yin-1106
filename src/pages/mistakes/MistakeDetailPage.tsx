import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle, CheckCircle, RotateCcw, Trash2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useMistakesStore } from '../../store/useMistakesStore';
import { cn, getErrorTypeLabel, formatDate } from '../../utils/helpers';
import { ErrorType } from '../../types';

const errorTypeColors: Record<ErrorType, string> = {
  missing_keyword: 'bg-red-100 text-red-700',
  format_error: 'bg-orange-100 text-orange-700',
  legal_basis_mismatch: 'bg-purple-100 text-purple-700',
  time_limit_error: 'bg-amber-100 text-amber-700',
  reduction_invalid: 'bg-blue-100 text-blue-700',
  content_incomplete: 'bg-teal-100 text-teal-700',
};

const MistakeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getMistakeById, markAsReviewed, markMistakeCorrect, markAsMastered, deleteMistake, retryMistake, initMistakes } = useMistakesStore();

  const mistake = getMistakeById(id || '');

  if (!mistake) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">错题记录不存在</h3>
        <Link to="/mistakes">
          <Button variant="ghost">返回错题本</Button>
        </Link>
      </div>
    );
  }

  const handleRetry = () => {
    retryMistake(mistake.id);
    if (mistake.type === 'practice') {
      window.location.href = `/practice/${mistake.sourceId}`;
    } else {
      window.location.href = `/challenge/${mistake.sourceId}`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/mistakes" className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={cn(
                'px-2 py-0.5 text-xs font-medium rounded-md',
                errorTypeColors[mistake.errorType]
              )}>
                {getErrorTypeLabel(mistake.errorType)}
              </span>
              <span className={cn(
                'px-2 py-0.5 text-xs font-medium rounded-md',
                mistake.type === 'practice' ? 'bg-teal-100 text-teal-700' : 'bg-amber-100 text-amber-700'
              )}>
                {mistake.type === 'practice' ? '案例演练' : '闯关审校'}
              </span>
              {mistake.mastered ? (
                <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-emerald-100 text-emerald-700 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  已掌握
                </span>
              ) : (
                <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-orange-100 text-orange-700">
                  待复习
                </span>
              )}
              {mistake.reviewed && !mistake.mastered && (
                <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-green-100 text-green-700">
                  已复习
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Noto Serif SC', serif" }}>
              {mistake.questionTitle}
            </h1>
          </div>
        </div>
        <div className="flex gap-2">
          {!mistake.reviewed && (
            <Button
              variant="ghost"
              size="md"
              icon={<CheckCircle className="w-4 h-4" />}
              onClick={() => markAsReviewed(mistake.id)}
            >
              标记已复习
            </Button>
          )}
          <Button
            variant="ghost"
            size="md"
            icon={<Trash2 className="w-4 h-4" />}
            onClick={() => {
              if (confirm('确定要删除这道错题吗？')) {
                deleteMistake(mistake.id);
                window.location.href = '/mistakes';
              }
            }}
          >
            删除
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <Card.Header>
              <h3 className="text-lg font-bold text-gray-900">题目信息</h3>
            </Card.Header>
            <Card.Body>
              <div className="bg-red-50 border border-red-100 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-900 font-medium">【{mistake.knowledgePoint}】</p>
                    <p className="text-red-700 mt-2">{mistake.questionContent}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <h4 className="font-medium text-red-900 mb-2 flex items-center gap-2">
                    <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-xs font-bold">✗</span>
                    您的答案
                  </h4>
                  <pre className="whitespace-pre-wrap text-sm text-red-700 font-mono leading-relaxed">
                    {mistake.userAnswer}
                  </pre>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                    <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold">✓</span>
                    正确答案
                  </h4>
                  <pre className="whitespace-pre-wrap text-sm text-green-700 font-mono leading-relaxed">
                    {mistake.correctAnswer}
                  </pre>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h3 className="text-lg font-bold text-gray-900">错误解析</h3>
            </Card.Header>
            <Card.Body>
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                <p className="text-amber-800 leading-relaxed">{mistake.explanation}</p>
              </div>

              {mistake.errorDetails && mistake.errorDetails.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">具体问题</h4>
                  <ul className="space-y-2">
                    {mistake.errorDetails.map((error, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-red-600">{index + 1}</span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-700">{error.message}</p>
                          {error.suggestion && (
                            <p className="text-sm text-green-600 mt-1">💡 建议：{error.suggestion}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <Card.Header>
              <h3 className="text-lg font-bold text-gray-900">错题信息</h3>
            </Card.Header>
            <Card.Body className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">收录时间</span>
                <span className="text-sm font-medium text-gray-900">{formatDate(mistake.timestamp)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">知识点</span>
                <span className="text-sm font-medium text-gray-900">{mistake.knowledgePoint}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">得分</span>
                <span className="text-sm font-bold text-red-600">{mistake.score} 分</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">重做次数</span>
                <span className="text-sm font-medium text-gray-900">{mistake.retryCount} 次</span>
              </div>
              {mistake.correctRetryCount > 0 && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">连续做对</span>
                  <span className="text-sm font-bold text-emerald-600">{mistake.correctRetryCount} 次 🔥</span>
                </div>
              )}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-500">状态</span>
                <span className={cn(
                  'px-2 py-0.5 text-xs font-medium rounded-md',
                  mistake.mastered ? 'bg-emerald-100 text-emerald-700' : 
                  mistake.reviewed ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                )}>
                  {mistake.mastered ? '已掌握 ✓' : mistake.reviewed ? '已复习' : '待复习'}
                </span>
              </div>
              {!mistake.mastered && (
                <div className="pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    icon={<CheckCircle className="w-4 h-4" />}
                    onClick={() => {
                      markAsMastered(mistake.sourceId, mistake.type);
                    }}
                    className="text-emerald-700 hover:bg-emerald-50"
                  >
                    标记为已掌握
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h3 className="text-lg font-bold text-gray-900">学习建议</h3>
            </Card.Header>
            <Card.Body>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>仔细对比您的答案与正确答案的差异</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>理解解析中提到的编制规则要点</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>点击重做按钮再次练习，检验掌握程度</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>在规则课堂中复习相关知识点</span>
                </li>
              </ul>
            </Card.Body>
            <Card.Footer className="space-y-3">
              <Button
                variant="primary"
                size="md"
                fullWidth
                icon={<RotateCcw className="w-4 h-4" />}
                onClick={handleRetry}
              >
                重做此题
              </Button>
              <Link to="/rules">
                <Button variant="ghost" size="md" fullWidth>
                  复习相关规则
                </Button>
              </Link>
            </Card.Footer>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MistakeDetailPage;
