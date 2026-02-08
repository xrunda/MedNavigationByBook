import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-slate-200 pb-safe pt-1 px-2 z-50">
      <div className="flex justify-around items-end h-16 pb-2">
        {/* Item 1: Home */}
        <Link to="/dashboard" className={`flex flex-col items-center gap-1 p-1 w-full transition-colors ${isActive('/dashboard') ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}>
          <span className={`material-symbols-outlined text-[24px] ${isActive('/dashboard') ? 'filled' : ''}`}>home_health</span>
          <span className="text-[10px] font-medium">首页</span>
        </Link>
        
        {/* Item 2: Measure */}
        <Link to="/measure" className={`flex flex-col items-center gap-1 p-1 w-full transition-colors ${isActive('/measure') ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}>
          <span className={`material-symbols-outlined text-[24px] ${isActive('/measure') ? 'filled' : ''}`}>receipt_long</span>
          <span className="text-[10px] font-medium">测量</span>
        </Link>

        {/* Item 3: AI Chat - Floating */}
        <div className="relative w-full flex flex-col items-center justify-end h-full pointer-events-none">
           <Link to="/chat" className="absolute -top-10 flex flex-col items-center group pointer-events-auto">
              <div className="flex items-center justify-center w-14 h-14 bg-primary rounded-full shadow-glow text-white border-[4px] border-white transform group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[28px]">spa</span>
              </div>
              <span className={`text-[10px] font-medium mt-1 ${isActive('/chat') ? 'text-primary' : 'text-slate-400'}`}>AI 助手</span>
           </Link>
           {/* Invisible spacer */}
           <div className="w-14"></div>
        </div>

        {/* Item 4: Plan */}
        <Link to="/plan" className={`flex flex-col items-center gap-1 p-1 w-full transition-colors ${isActive('/plan') ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}>
          <span className={`material-symbols-outlined text-[24px] ${isActive('/plan') ? 'filled' : ''}`}>assignment</span>
          <span className="text-[10px] font-medium">计划</span>
        </Link>

        {/* Item 5: Profile */}
        <Link to="/user-profile" className={`flex flex-col items-center gap-1 p-1 w-full transition-colors ${isActive('/user-profile') ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}>
          <span className={`material-symbols-outlined text-[24px] ${isActive('/user-profile') ? 'filled' : ''}`}>person</span>
          <span className="text-[10px] font-medium">我的</span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNav;