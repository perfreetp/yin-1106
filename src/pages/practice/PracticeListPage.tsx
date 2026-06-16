import { Link } from 'react-router-dom';
import { FileEdit, Filter, Shuffle, GitCompare, ChevronRight, Clock } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { usePracticeStore } from '../../store/usePracticeStore';
import { exercises, exerciseCategories } from '../../data/exercises';
import { Difficulty, ExerciseType, ExerciseCategoryId } from '../../types';
import { cn, getExerciseTypeLabel, getDifficultyColor } from '../../utils/helpers';

const categoryLabels: Record<ExerciseCategoryId, string> = {
  'ec-1': '受理条件',
  'ec-2': '申请材料',
  'ec-3': '法定依据',
  'ec-4': '承诺时限',
  'ec-5': '材料减免',
};

const categoryColors: Record<ExerciseCategoryId, string> = {
  'ec-1': 'from-blue-500 to-blue-600',
  'ec-2': 'from-teal-500 to-teal-600',
  'ec-3': 'from-purple-500 to-purple-600',
  'ec-4': 'from-amber-500 to-amber-600',
  'ec-5': 'from-green-500 to-green-600',
};

const typeLabels: Record<ExerciseType, string> = {
  acceptance_condition: '受理条件',
  application_material: '申请材料',
  legal_basis: '法定依据',
  time_limit: '承诺时限',
  reduction: '材料减免',
  material_reduction: '材料减免',
  comparison: '地区对比',
};

const PracticeListPage = () => {
  const {
    category,
    difficulty,
    getFilteredExercises,
    setCategory,
    setDifficulty,
    setCurrentExercise,
    getRandomExercise,
  } = usePracticeStore();

  const filteredExercises = getFilteredExercises();

  const categories = exerciseCategories.map((cat) => ({
    key: cat.id as ExerciseCategoryId,
    label: cat.name,
    count: exercises.filter((e) => e.categoryId === cat.id).length,
  }));

  const handleRandomExercise = () => {
    const randomExercise = getRandomExercise();
    if (randomExercise) {
      setCurrentExercise(randomExercise.id);
      window.location.href = `/practice/${randomExercise.id}`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            案例演练
          </h2>
          <p className="text-gray-500 mt-1">模拟编制练习，逐题即时纠错反馈</p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" size="md" icon={<GitCompare className="w-4 h-4" />} as={Link} to="/practice/compare/1">
            地区对比
          </Button>
          <Button variant="secondary" size="md" icon={<Shuffle className="w-4 h-4" />} onClick={handleRandomExercise}>
            随机抽题
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <Card
            key={cat.key}
            hoverable
            onClick={() => setCategory(category === cat.key ? 'all' : cat.key)}
            className={cn(
              'transition-all duration-200',
              category === cat.key && 'ring-2 ring-blue-500 border-blue-500'
            )}
          >
            <Card.Body className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${categoryColors[cat.key]} rounded-lg flex items-center justify-center`}>
                  <FileEdit className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{cat.label}</p>
                  <p className="text-xs text-gray-500">{cat.count} 道题</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-500">难度：</span>
            <div className="flex gap-2">
              <button
                onClick={() => setDifficulty('all')}
                className={cn(
                  'px-3 py-1.5 text-sm rounded-lg transition-all duration-200',
                  difficulty === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                全部
              </button>
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={cn(
                    'px-3 py-1.5 text-sm rounded-lg transition-all duration-200',
                    difficulty === d
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {d === 'easy' ? '简单' : d === 'medium' ? '中等' : '困难'}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          共 {filteredExercises.length} 道练习题
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.map((exercise) => (
          <Card key={exercise.id} hoverable className="group">
            <Card.Body className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${categoryColors[exercise.categoryId as ExerciseCategoryId]} rounded-lg flex items-center justify-center`}>
                    <FileEdit className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className={cn(
                      'inline-block px-2 py-0.5 text-xs font-medium rounded-md mb-1',
                      getDifficultyColor(exercise.difficulty)
                    )}>
                      {exercise.difficulty === 'easy' ? '简单' : exercise.difficulty === 'medium' ? '中等' : '困难'}
                    </span>
                    <p className="text-xs text-gray-500">{typeLabels[exercise.type]}</p>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                {exercise.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                {exercise.description || exercise.question.substring(0, 80) + '...'}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-400">
                    预计 {exercise.estimatedTime} 分钟
                  </span>
                </div>
                <Link
                  to={`/practice/${exercise.id}`}
                  onClick={() => setCurrentExercise(exercise.id)}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  开始练习
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileEdit className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">未找到相关练习</h3>
          <p className="text-gray-500">请尝试调整分类或难度筛选</p>
        </div>
      )}
    </div>
  );
};

export default PracticeListPage;
