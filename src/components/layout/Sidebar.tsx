import { NavLink } from 'react-router-dom';
import {
  BookOpen,
  FileEdit,
  ShieldCheck,
  AlertCircle,
  BarChart3,
  Home,
  Star,
} from 'lucide-react';
import { cn } from '../../utils/helpers';

const menuItems = [
  {
    path: '/',
    label: '首页',
    icon: Home,
    end: true,
  },
  {
    path: '/rules',
    label: '规则课堂',
    icon: BookOpen,
  },
  {
    path: '/practice',
    label: '案例演练',
    icon: FileEdit,
  },
  {
    path: '/challenge',
    label: '闯关审校',
    icon: ShieldCheck,
  },
  {
    path: '/mistakes',
    label: '错题本',
    icon: AlertCircle,
  },
  {
    path: '/stats',
    label: '成绩面板',
    icon: BarChart3,
  },
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
            <Star className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900" style={{ fontFamily: "'Noto Serif SC', serif" }}>
              清单编制
            </h1>
            <p className="text-xs text-gray-500">演练平台</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group',
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-teal-50 text-blue-700 font-medium shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )
              }
            >
              <item.icon
                className={cn(
                  'w-5 h-5 transition-colors duration-200',
                  'group-hover:scale-105 transition-transform duration-200'
                )}
              />
              <span className="text-sm">{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <Star className="w-4 h-4 text-yellow-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-700">收藏的规则</p>
              <p className="text-xs text-gray-500 mt-0.5">快速访问您收藏的优秀示例</p>
            </div>
          </div>
          <NavLink
            to="/rules/favorites"
            className="mt-3 block w-full text-center py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-200"
          >
            查看收藏
          </NavLink>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-blue-700">学</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">学员</p>
            <p className="text-xs text-gray-500">欢迎学习</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
