import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const pageTitles: Record<string, string> = {
  '/': '首页',
  '/rules': '规则课堂',
  '/rules/favorites': '我的收藏',
  '/practice': '案例演练',
  '/challenge': '闯关审校',
  '/mistakes': '错题本',
  '/stats': '成绩面板',
  '/stats/profile': '能力画像',
  '/stats/report': '培训报告',
};

const Layout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (pageTitles[path]) return pageTitles[path];
    if (path.startsWith('/rules/') && path !== '/rules/favorites') return '规则详情';
    if (path.startsWith('/practice/')) return '练习详情';
    if (path.startsWith('/challenge/')) return '闯关答题';
    if (path.startsWith('/mistakes/')) return '错题详情';
    return '清单编制演练平台';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <Header title={getPageTitle()} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
