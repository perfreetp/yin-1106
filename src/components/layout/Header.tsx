import { Bell, Search, HelpCircle } from 'lucide-react';

const Header = ({ title }: { title: string }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Noto Serif SC', serif" }}>
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="搜索规则、练习..."
            className="pl-10 pr-4 py-2 w-64 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
          <HelpCircle className="w-5 h-5" />
        </button>

        <div className="h-8 w-px bg-gray-200"></div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">学习进度</span>
          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-teal-500 rounded-full" style={{ width: '65%' }}></div>
          </div>
          <span className="text-sm font-medium text-blue-600">65%</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
