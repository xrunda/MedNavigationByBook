import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-light pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background-light/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-xl">medical_services</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">安和健康</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <button 
              onClick={() => navigate('/user-profile')}
              className="flex items-center gap-2 pl-1 pr-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm"
            >
              <img 
                src="https://picsum.photos/100" 
                alt="User" 
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-sm font-medium text-slate-700">张奶奶</span>
              <span className="material-symbols-outlined text-sm text-slate-400">expand_more</span>
            </button>
          </div>
        </div>
      </header>

      <main className="px-4 pt-4 flex flex-col gap-6">
        {/* Status Card */}
        <section>
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100 p-5">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-green-50 rounded-full blur-2xl"></div>
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">健康状态</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">平稳</h2>
                <p className="text-sm text-slate-500">更新于: 10分钟前</p>
              </div>
              <button className="group flex items-center gap-1 pl-4 pr-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all border border-slate-200">
                <span className="text-sm font-medium text-slate-700 group-hover:text-primary transition-colors">详情</span>
                <span className="material-symbols-outlined text-lg text-slate-400 group-hover:text-primary transition-colors">chevron_right</span>
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center">
                <span className="text-xs text-slate-400">心率</span>
                <span className="font-bold text-slate-700">72 <span className="text-xs font-normal text-slate-400">bpm</span></span>
              </div>
              <div className="flex flex-col items-center border-l border-r border-slate-100">
                <span className="text-xs text-slate-400">血氧</span>
                <span className="font-bold text-slate-700">98%</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-slate-400">体温</span>
                <span className="font-bold text-slate-700">36.6°</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x hide-scrollbar">
            {[
              { icon: 'description', label: '报告解读', color: 'text-primary', link: '/report' },
              { icon: 'favorite', label: '记血压', color: 'text-red-500', link: '/measure' },
              { icon: 'water_drop', label: '记血糖', color: 'text-blue-500', link: '/measure' },
              { icon: 'medication', label: '用药打卡', color: 'text-orange-500', link: '/plan' },
            ].map((action, i) => (
              <button 
                key={i}
                onClick={() => navigate(action.link)}
                className="snap-start flex-shrink-0 flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-full shadow-sm active:scale-95 transition-transform"
              >
                <span className={`material-symbols-outlined ${action.color} text-[20px]`}>{action.icon}</span>
                <span className="text-sm font-medium whitespace-nowrap">{action.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Bento Grid */}
        <section className="grid grid-cols-2 gap-3 h-64">
          <div 
            onClick={() => navigate('/chat')}
            className="col-span-2 sm:col-span-1 row-span-2 bg-gradient-to-br from-primary to-blue-600 rounded-2xl p-5 text-white shadow-lg shadow-blue-200 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
            <div className="absolute top-4 right-4 bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <span className="material-symbols-outlined text-white">smart_toy</span>
            </div>
            <div className="relative z-10 mt-2">
              <span className="inline-block px-2 py-1 bg-white/20 rounded text-[10px] font-semibold mb-2 backdrop-blur-md">AI 助手</span>
              <h3 className="text-2xl font-bold leading-tight mb-1">问问安和 AI</h3>
              <p className="text-blue-100 text-sm opacity-90">“我感觉头有点痛...”</p>
            </div>
            <button className="relative z-10 bg-white text-primary text-sm font-bold py-2.5 px-4 rounded-xl mt-4 w-fit shadow-sm hover:bg-blue-50 transition-colors">
              开始对话
            </button>
          </div>

          <div 
            onClick={() => navigate('/measure')}
            className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:border-primary/30 transition-colors cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">monitor_heart</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-900">健康测量</h3>
              <p className="text-xs text-slate-500 mt-1">记录体征数据</p>
            </div>
          </div>

          <div 
            onClick={() => navigate('/plan')}
            className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:border-primary/30 transition-colors cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">assignment</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-900">健康计划</h3>
              <p className="text-xs text-slate-500 mt-1">每日任务</p>
            </div>
          </div>
        </section>

        {/* Today's Briefing */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">今日简报</h3>
            <button className="text-primary text-sm font-medium hover:underline">查看历史</button>
          </div>
          <div className="grid grid-cols-1 gap-3">
             {/* Sleep */}
             <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-500 p-1.5 bg-indigo-50 rounded-lg">bedtime</span>
                  <span className="text-sm font-medium text-slate-600">睡眠</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-xl font-bold text-slate-900">7<span className="text-sm font-medium text-slate-500">小时</span> 20<span className="text-sm font-medium text-slate-500">分</span></span>
                  <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                    <span className="material-symbols-outlined text-[10px] mr-0.5">arrow_upward</span> 10%
                  </span>
                </div>
             </div>
             
             {/* Steps */}
             <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-orange-500 p-1.5 bg-orange-50 rounded-lg">directions_walk</span>
                  <span className="text-sm font-medium text-slate-600">步数</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-xl font-bold text-slate-900">4,520</span>
                  <span className="flex items-center text-xs font-medium text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                    <span className="material-symbols-outlined text-[10px] mr-0.5">arrow_downward</span> 5%
                  </span>
                </div>
             </div>

             {/* BP */}
             <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-500 p-1.5 bg-red-50 rounded-lg">favorite</span>
                  <span className="text-sm font-medium text-slate-600">血压</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-xl font-bold text-slate-900">118/78</span>
                  <span className="text-xs text-slate-400 font-medium">mmHg</span>
                </div>
             </div>
          </div>
        </section>

        {/* Recent */}
        <section className="pb-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">最近动态</h3>
          <div className="bg-white rounded-xl border border-slate-100 divide-y divide-slate-100">
            <div className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined">medication</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">晨间用药</p>
                <p className="text-xs text-slate-500">氨氯地平 5mg • 已服用</p>
              </div>
              <span className="text-xs text-slate-400">8:00 AM</span>
            </div>
            
            <div className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0">
                <span className="material-symbols-outlined">check_circle</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">健康计划完成</p>
                <p className="text-xs text-slate-500">晨练散步 • 30分钟</p>
              </div>
              <span className="text-xs text-slate-400">9:30 AM</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;