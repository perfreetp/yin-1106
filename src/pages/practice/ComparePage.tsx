import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, GitCompare, AlertCircle, Lightbulb } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { comparisonItems } from '../../data/comparisons';
import { cn } from '../../utils/helpers';

const ComparePage = () => {
  const { id } = useParams<{ id: string }>();
  const comparison = comparisonItems.find((c) => c.id === id);

  if (!comparison) {
    return (
      <div className="text-center py-16">
        <GitCompare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">对比案例不存在</h3>
        <Link to="/practice">
          <Button variant="ghost">返回练习列表</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/practice" className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            <GitCompare className="w-6 h-6 text-teal-600" />
            {comparison.regionA} vs {comparison.regionB} 写法对比
          </h1>
          <p className="text-gray-500 mt-1">同一事项不同地区写法对比</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <Card.Header className="bg-blue-50/50">
            <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              {comparison.regionA}写法
            </h3>
          </Card.Header>
          <Card.Body>
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed bg-gray-50 p-4 rounded-xl">
              {comparison.contentA}
            </pre>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header className="bg-teal-50/50">
            <h3 className="text-lg font-bold text-teal-900 flex items-center gap-2">
              <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
              {comparison.regionB}写法
            </h3>
          </Card.Header>
          <Card.Body>
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed bg-gray-50 p-4 rounded-xl">
              {comparison.contentB}
            </pre>
          </Card.Body>
        </Card>
      </div>

      <Card>
        <Card.Header>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            差异点分析
          </h3>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            {comparison.differences.map((diff, index) => (
              <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h4 className="font-medium text-gray-900">{diff.field}</h4>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-700 mb-3">{diff.description}</p>
                  <div className={cn(
                    'p-4 rounded-xl',
                    'bg-teal-50 border border-teal-100'
                  )}>
                    <p className="text-xs text-teal-700 font-medium mb-1">💡 改进建议</p>
                    <p className="text-sm text-teal-800">{diff.suggestion}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>

      <div className="flex justify-end gap-3">
        <Link to="/practice">
          <Button variant="ghost">返回练习</Button>
        </Link>
        <Link to="/rules">
          <Button variant="primary">学习相关规则</Button>
        </Link>
      </div>
    </div>
  );
};

export default ComparePage;
