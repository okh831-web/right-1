
import React from 'react';
import { Home, Edit3, Image as ImageIcon } from 'lucide-react';
import { ViewType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  onGoHome: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange, onGoHome }) => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 glass-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 rounded-full shadow-lg shadow-blue-100">
                <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></div>
                <h1 className="text-white text-sm md:text-base font-black tracking-tight">
                  말씀에 <span className="text-pink-200">영감</span>을 더하다
                </h1>
            </div>
            <button 
                onClick={onGoHome}
                className="w-10 h-10 rounded-full bg-white/50 border border-white flex items-center justify-center hover:bg-white transition-all shadow-sm group"
            >
              <Home className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
            </button>
          </div>

          <div className="flex space-x-2 md:space-x-3">
            <button 
              onClick={() => onViewChange(ViewType.SUMMARY_CARD)}
              className={`flex items-center space-x-2 px-4 md:px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold transition-all ${
                activeView === ViewType.SUMMARY_CARD 
                  ? 'bg-white text-pink-500 shadow-md border border-pink-50' 
                  : 'bg-white/40 text-gray-500 hover:bg-white hover:text-pink-400'
              }`}
            >
              <Edit3 className={`w-4 h-4 ${activeView === ViewType.SUMMARY_CARD ? 'text-pink-500' : 'text-pink-300'}`} />
              <span className="hidden sm:inline">전도용 요약카드</span>
              <span className="sm:hidden">요약카드</span>
            </button>
            <button 
              onClick={() => onViewChange(ViewType.INFOGRAPHIC)}
              className={`flex items-center space-x-2 px-4 md:px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold transition-all ${
                activeView === ViewType.INFOGRAPHIC 
                  ? 'bg-white text-emerald-600 shadow-md border border-emerald-50' 
                  : 'bg-white/40 text-gray-500 hover:bg-white hover:text-emerald-500'
              }`}
            >
              <ImageIcon className={`w-4 h-4 ${activeView === ViewType.INFOGRAPHIC ? 'text-emerald-500' : 'text-emerald-300'}`} />
              <span className="hidden sm:inline">인포그래픽</span>
              <span className="sm:hidden">인포그래픽</span>
            </button>
          </div>
        </div>
      </header>
      <main className="flex-grow pt-0">
        {children}
      </main>
    </div>
  );
};

export default Layout;
