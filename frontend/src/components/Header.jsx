import { ChevronDown, Globe, Menu } from 'lucide-react';

const Header = ({ onMenuClick, onOpenSocialLinks }) => {

  return (
    <header className="bg-transparent px-4 lg:px-6 py-3.5 flex items-center justify-between backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-400 hover:text-white hover:bg-white/5 p-2 rounded-lg transition-all duration-200"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-white text-lg lg:text-xl font-bold tracking-tight">7anish</h1>
        <button className="text-gray-400 hover:text-white hover:bg-white/5 p-1.5 rounded-lg transition-all duration-200">
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex items-center gap-1 lg:gap-3 relative">
        <button 
          onClick={onOpenSocialLinks}
          className="text-gray-400 hover:text-white hover:bg-white/5 p-1.5 lg:p-2 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1 lg:gap-2"
          aria-label="Social links"
        >
          <span className='-translate-y-0.5'>Connect</span>
          <Globe className="w-4 h-4 lg:w-5 lg:h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
