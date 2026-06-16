import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Filter, BookOpen, ChevronRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useRulesStore } from '../../store/useRulesStore';
import { RuleCategory } from '../../types';
import { cn, getExerciseTypeLabel } from '../../utils/helpers';

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

const categoryBgColors: Record<RuleCategory, string> = {
  acceptance_condition: 'bg-blue-50',
  application_material: 'bg-teal-50',
  legal_basis: 'bg-purple-50',
  time_limit: 'bg-amber-50',
  reduction: 'bg-green-50',
  general: 'bg-gray-50',
};

const RulesListPage = () => {
  const { rules, searchKeyword, category, getFilteredRules, setSearchKeyword, setCategory, toggleFavorite, isFavorite } = useRulesStore();
  const filteredRules = getFilteredRules();

  const categories = Object.entries(categoryLabels).map(([key, label]) => ({
    key: key as RuleCategory,
    label,
    count: rules.filter((r) => r.category === key).length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            规则课堂
          </h2>
          <p className="text-gray-500 mt-1">学习清单编制核心规则，掌握标准规范和常见错误</p>
        </div>
        <div className="flex gap-3">
          <Link to="/rules/favorites">
            <Button variant="ghost" size="md" icon={<Star className="w-4 h-4" />}>
              我的收藏
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="搜索规则、关键词..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-500">分类：</span>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setCategory('all')}
              className={cn(
                'px-3 py-1.5 text-sm rounded-lg transition-all duration-200',
                category === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              全部
            </button>
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={cn(
                  'px-3 py-1.5 text-sm rounded-lg transition-all duration-200',
                  category === cat.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRules.map((rule) => (
          <Card key={rule.id} hoverable className="group">
            <Card.Body className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${categoryColors[rule.category]} rounded-xl flex items-center justify-center shadow-md`}>
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(rule.id);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <Star
                    className={cn(
                      'w-5 h-5 transition-colors duration-200',
                      isFavorite(rule.id) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                    )}
                  />
                </button>
              </div>

              <div className="mb-3">
                <span className={cn(
                  'inline-block px-2 py-1 text-xs font-medium rounded-md',
                  categoryBgColors[rule.category],
                  'text-gray-700'
                )}>
                  {categoryLabels[rule.category]}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                {rule.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                {rule.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {rule.relatedExercises.length} 道关联练习
                  </span>
                </div>
                <Link to={`/rules/${rule.id}`} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
                  查看详情
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {filteredRules.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">未找到相关规则</h3>
          <p className="text-gray-500">请尝试调整搜索关键词或分类筛选</p>
        </div>
      )}
    </div>
  );
};

export default RulesListPage;
