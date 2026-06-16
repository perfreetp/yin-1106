import { Link } from 'react-router-dom';
import { AlertCircle, Search, Filter, Trash2, RotateCcw, CheckCircle, ChevronRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useMistakesStore } from '../../store/useMistakesStore';
import { ErrorType } from '../../types';
import { cn, getErrorTypeLabel, formatDate } from '../../utils/helpers';

const errorTypeLabels: Record<ErrorType, string> = {
  missing_keyword: '关键词缺失',
  format_error: '格式错误',
  legal_basis_mismatch: '法定依据不匹配',
  time_limit_error: '时限设置错误',
  reduction_invalid: '减免情形无效',
  content_incomplete: '内容不完整',
};

const errorTypeColors: Record<ErrorType, string> = {
  missing_keyword: 'bg-red-100 text-red-700',
  format_error: 'bg-orange-100 text-orange-700',
  legal_basis_mismatch: 'bg-purple-100 text-purple-700',
  time_limit_error: 'bg-amber-100 text-amber-700',
  reduction_invalid: 'bg-blue-100 text-blue-700',
  content_incomplete: 'bg-teal-100 text-teal-700',
};

const MistakesPage = () => {
  const {
    mistakes,
    filterType,
    filterSource,
    searchKeyword,
    getFilteredMistakes,
    getMistakeStats,
    setFilterType,
    setFilterSource,
    setSearchKeyword,
    markAsReviewed,
    deleteMistake,
    clearAllMistakes,
    retryMistake,
  } = useMistakesStore();

  const filteredMistakes = getFilteredMistakes();
  const stats = getMistakeStats();

  const handleRetry = (mistakeId: string, sourceId: string, sourceType: 'practice' | 'challenge') => {
    retryMistake(mistakeId);
    if (sourceType === 'practice') {
      window.location.href = `/practice/${sourceId}`;
    } else {
      window.location.href = `/challenge/${sourceId}`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            错题本
          </h2>
          <p className="text-gray-500 mt-1">收录错误题目，针对性巩固提升</p>
        </div>
        {mistakes.length > 0 && (
          <Button
            variant="ghost"
            size="md"
            icon={<Trash2 className="w-4 h-4" />}
            onClick={() => {
              if (confirm('确定要清空所有错题吗？此操作不可恢复。')) {
                clearAllMistakes();
              }
            }}
          >
            清空错题
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <Card.Body className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-500">总错题数</p>
              </div>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.unreviewed}</p>
                <p className="text-xs text-gray-500">待复习</p>
              </div>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.reviewed}</p>
                <p className="text-xs text-gray-500">已复习</p>
              </div>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.bySource.practice}</p>
                <p className="text-xs text-gray-500">练习错题</p>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="搜索错题..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Filter className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-500">类型：</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as ErrorType | 'all')}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">全部类型</option>
            {Object.entries(errorTypeLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value as 'practice' | 'challenge' | 'all')}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">全部来源</option>
            <option value="practice">案例演练</option>
            <option value="challenge">闯关审校</option>
          </select>
        </div>
      </div>

      {Object.entries(stats.byType).filter(([_, count]) => count > 0).length > 0 && (
        <Card>
          <Card.Body className="p-4">
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.byType)
                .filter(([_, count]) => count > 0)
                .map(([type, count]) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(filterType === type ? 'all' : type as ErrorType)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                      filterType === type
                        ? 'bg-blue-600 text-white'
                        : errorTypeColors[type as ErrorType]
                    )}
                  >
                    {errorTypeLabels[type as ErrorType]} ({count})
                  </button>
                ))}
            </div>
          </Card.Body>
        </Card>
      )}

      {filteredMistakes.length > 0 ? (
        <div className="space-y-4">
          {filteredMistakes.map((mistake) => (
            <Card key={mistake.id} hoverable className={cn(
              'transition-all duration-200',
              mistake.reviewed && 'opacity-60'
            )}>
              <Card.Body className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
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
                      <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-gray-100 text-gray-600">
                        {mistake.knowledgePoint}
                      </span>
                      {mistake.reviewed && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-green-100 text-green-700">
                          已复习
                        </span>
                      )}
                      {mistake.retryCount > 0 && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-blue-100 text-blue-700">
                          重做 {mistake.retryCount} 次
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/mistakes/${mistake.id}`}
                      className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200"
                    >
                      {mistake.questionTitle}
                    </Link>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                      {mistake.explanation}
                    </p>
                    <p className="text-xs text-gray-400 mt-3">
                      收录时间：{formatDate(mistake.timestamp)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<RotateCcw className="w-4 h-4" />}
                      onClick={() => handleRetry(mistake.id, mistake.sourceId, mistake.type)}
                    >
                      重做
                    </Button>
                    {!mistake.reviewed && (
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<CheckCircle className="w-4 h-4" />}
                        onClick={() => markAsReviewed(mistake.id)}
                      >
                        标记已复习
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Trash2 className="w-4 h-4" />}
                      onClick={() => deleteMistake(mistake.id)}
                    >
                      删除
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">太棒了！没有错题</h3>
          <p className="text-gray-500 mb-6">继续保持，您已经掌握了所有知识点</p>
          <Link to="/practice">
            <Button variant="primary">去做练习</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MistakesPage;
