import React from 'react';
import { useNavigate } from 'react-router-dom';

const Plan = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background-light min-h-screen flex flex-col pb-24">
      <header className="flex items-center justify-between p-6 pb-2 bg-background-light sticky top-0 z-10">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">我的计划</h1>
        <button className="text-primary hover:text-blue-600 font-semibold text-sm flex items-center gap-1">
          <span>调整目标</span>
          <span className="material-symbols-outlined text-lg">tune</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col gap-6 p-6 pt-2">
        {/* Goal Card */}
        <section className="bg-white rounded-xl shadow-soft overflow-hidden relative p-5 flex flex-col gap-5">
           <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
           <div className="flex items-start justify-between relative z-10">
             <div className="flex flex-col gap-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold w-fit">
                   <span className="material-symbols-outlined text-sm">favorite</span> 血压控制
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-2">8周健康计划</h2>
                <p className="text-slate-500 text-sm">将收缩压稳定在120以下</p>
             </div>
             <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="transform -rotate-90 w-12 h-12">
                   <circle className="text-slate-100" cx="24" cy="24" fill="transparent" r="20" stroke="currentColor" strokeWidth="4"></circle>
                   <circle className="text-primary" cx="24" cy="24" fill="transparent" r="20" stroke="currentColor" strokeDasharray="125.6" strokeDashoffset="81.64" strokeWidth="4"></circle>
                </svg>
                <span className="absolute text-[10px] font-bold text-primary">35%</span>
             </div>
           </div>
           
           <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                 <span className="text-sm font-medium text-slate-900">第 3 周 <span className="text-slate-500 font-normal">/ 共8周</span></span>
                 <span className="text-xs text-slate-500">第一阶段还剩 12 天</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-primary rounded-full w-[35%]"></div>
              </div>
           </div>
        </section>

        {/* Tasks */}
        <section className="flex flex-col gap-4">
           <div className="flex items-center justify-between px-1">
             <h3 className="text-lg font-bold text-slate-900">今日任务</h3>
             <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">10月24日</span>
           </div>
           
           <div className="flex flex-col gap-3">
              {[
                { title: '服用赖诺普利 10mg', sub: '08:00 AM • 随餐服用', done: true, icon: 'medication', color: 'green' },
                { title: '测量血压', sub: '午餐前', done: false, icon: 'monitor_heart', color: 'blue' },
                { title: '户外散步', sub: '目标20分钟 • 中等配速', done: false, icon: 'directions_walk', color: 'orange' },
              ].map((task, i) => (
                <div key={i} className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-transparent hover:border-primary/20 transition-all cursor-pointer group">
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 ${task.done ? 'bg-primary border-primary' : 'border-slate-300'} mr-4`}>
                    {task.done && <span className="material-symbols-outlined text-white text-sm">check</span>}
                  </div>
                  <div className="flex-1">
                    <p className={`text-base font-semibold ${task.done ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{task.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{task.sub}</p>
                  </div>
                  <div className={`w-8 h-8 rounded-full bg-${task.color}-50 flex items-center justify-center`}>
                    <span className={`material-symbols-outlined text-${task.color}-500 text-lg`}>{task.icon}</span>
                  </div>
                </div>
              ))}
           </div>
        </section>

        {/* Weekly Review */}
        <section className="mt-2">
           <div className="flex items-center justify-between px-1 mb-3">
              <h3 className="text-lg font-bold text-slate-900">周报回顾</h3>
              <button className="text-xs font-medium text-primary hover:underline">历史记录</button>
           </div>
           <div className="bg-white rounded-xl shadow-soft p-5">
              <div className="flex items-center justify-between mb-6">
                 <div>
                    <p className="text-sm text-slate-500">平均收缩压</p>
                    <div className="flex items-baseline gap-2 mt-1">
                       <h4 className="text-3xl font-bold text-slate-900">128<span className="text-sm font-normal text-slate-500 ml-1">mmHg</span></h4>
                       <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                         <span className="material-symbols-outlined text-[14px] mr-0.5">trending_down</span> -2%
                       </span>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-sm text-slate-500">波动情况</p>
                    <p className="text-sm font-medium text-slate-900 mt-1">平稳</p>
                 </div>
              </div>
              <div className="h-24 w-full flex items-end justify-between gap-2 pt-4 border-t border-dashed border-slate-100">
                 {[40, 60, 45, 80, 55, 30, 40].map((h, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 w-full h-full justify-end group">
                       <div style={{height: `${h}%`}} className={`w-full max-w-[14px] rounded-t-sm transition-all ${i === 3 ? 'bg-primary shadow-glow' : 'bg-slate-200 group-hover:bg-primary/40'}`}></div>
                       <span className={`text-[10px] ${i === 3 ? 'font-bold text-slate-900' : 'text-slate-400'}`}>
                         {['一','二','三','四','五','六','日'][i]}
                       </span>
                    </div>
                 ))}
              </div>
           </div>
        </section>
      </main>
    </div>
  );
};

export default Plan;