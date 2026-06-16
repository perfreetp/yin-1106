import { Link } from 'react-router-dom';
import { ArrowLeft, Star, BookOpen, Trash2, ChevronRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useRulesStore } from '../../store/useRulesStore';
import { rules } from '../../data/rules';
import { cn } from '../../utils/helpers';
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

const categoryBgColors: Record<RuleCategory, string> = {
  acceptance_condition: 'bg-blue-50',
  application_material: 'bg-teal-50',
  legal_basis: 'bg-purple-50',
  time_limit: 'bg-amber-50',
  reduction: 'bg-green-50',
  general: 'bg-gray-50',
};

const FavoritesPage = () => {
  const { favorites, toggleFavorite } = useRulesStore();
  const favoriteRuleIds = favorites.map((f) => f.targetId);
  const favoriteRules = rules.filter((rule) => favoriteRuleIds.includes(rule.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/rules" className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: "'Noto Serif SC', serif" }}>
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              我的收藏
            </h1>
            <p className="text-gray-500 mt-1">已收藏 {favoriteRules.length} 条规则</p>
          </div>
        </div>
      </div>

      {favoriteRules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteRules.map((rule) => (
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
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors duration-200 group/btn"
                  >
                    <Trash2 className="w-5 h-5 text-gray-300 group-hover/btn:text-red-500 transition-colors duration-200" />
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
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-10 h-10 text-yellow-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">还没有收藏的规则</h3>
          <p className="text-gray-500 mb-6">在规则详情页点击收藏按钮，保存您认为重要的规则</p>
          <Link to="/rules">
            <Button variant="primary">
              去浏览规则
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
