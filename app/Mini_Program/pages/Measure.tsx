import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: '周一', sbp: 120, dbp: 80 },
  { name: '周二', sbp: 125, dbp: 82 },
  { name: '周三', sbp: 118, dbp: 78 },
  { name: '周四', sbp: 128, dbp: 85 },
  { name: '周五', sbp: 122, dbp: 80 },
  { name: '周六', sbp: 130, dbp: 86 },
  { name: '周日', sbp: 126, dbp: 84 },
];

const Measure = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background-light min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 pt-8 pb-4 bg-background-light sticky top-0 z-10">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">测量记录</h1>
        <button className="flex items-center gap-1.5 text-primary text-sm font-semibold hover:opacity-80">
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          绑定设备
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 hide-scrollbar">
        {/* Horizontal Cards */}
        <section className="mt-2 pl-6">
           <div className="flex gap-4 overflow-x-auto hide-scrollbar pr-6 pb-4">
             {/* BP Card */}
             <div className="min-w-[200px] w-[200px] p-5 rounded-2xl bg-white shadow-sm border border-slate-100 flex flex-col justify-between h-[180px]">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-rose-500 bg-rose-50 p-1.5 rounded-full text-sm">favorite</span>
                    <span className="text-sm font-medium text-slate-600">血压</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-slate-900 tracking-tight">118/78</span>
                    <span className="text-xs text-slate-500 font-medium">mmHg</span>
                  </div>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">正常</span>
                  </div>
                </div>
                {/* Simulated Sparkline */}
                <div className="h-8 w-full flex items-end gap-1 opacity-60">
                   <div className="w-1/6 bg-rose-200 h-[40%] rounded-t-sm"></div>
                   <div className="w-1/6 bg-rose-300 h-[60%] rounded-t-sm"></div>
                   <div className="w-1/6 bg-rose-200 h-[50%] rounded-t-sm"></div>
                   <div className="w-1/6 bg-rose-400 h-[80%] rounded-t-sm"></div>
                   <div className="w-1/6 bg-rose-200 h-[45%] rounded-t-sm"></div>
                   <div className="w-1/6 bg-primary h-[65%] rounded-t-sm"></div>
                </div>
             </div>
             
             {/* Glucose Card */}
             <div className="min-w-[200px] w-[200px] p-5 rounded-2xl bg-white shadow-sm border border-slate-100 flex flex-col justify-between h-[180px]">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-blue-500 bg-blue-50 p-1.5 rounded-full text-sm">water_drop</span>
                    <span className="text-sm font-medium text-slate-600">血糖</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-slate-900 tracking-tight">5.4</span>
                    <span className="text-xs text-slate-500 font-medium">mmol/L</span>
                  </div>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">空腹</span>
                  </div>
                </div>
                <div className="h-8 w-full relative">
                  <svg className="w-full h-full stroke-blue-500 fill-none stroke-2" preserveAspectRatio="none" viewBox="0 0 100 40">
                     <path d="M0 30 C 20 30, 30 10, 50 15 C 70 20, 80 5, 100 10"></path>
                  </svg>
                </div>
             </div>
           </div>
        </section>

        {/* Quick Record Grid */}
        <section className="px-6 mt-4">
           <h2 className="text-lg font-bold text-slate-900 mb-4 tracking-tight">快速记录</h2>
           <div className="grid grid-cols-2 gap-4">
              {[
                { label: '血压', icon: 'favorite', color: 'rose' },
                { label: '血糖', icon: 'water_drop', color: 'blue' },
                { label: '睡眠', icon: 'bedtime', color: 'indigo' },
                { label: '体重', icon: 'monitor_weight', color: 'orange' }
              ].map((item, i) => (
                <button key={i} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 active:scale-95 transition-transform group">
                   <div className={`w-12 h-12 rounded-full bg-${item.color}-50 flex items-center justify-center text-${item.color}-500 group-hover:bg-${item.color}-100 transition-colors`}>
                     <span className="material-symbols-outlined">{item.icon}</span>
                   </div>
                   <div className="flex flex-col items-start">
                      <span className="text-sm font-bold text-slate-900">{item.label}</span>
                      <span className="text-xs text-primary font-medium mt-0.5">记录 +</span>
                   </div>
                </button>
              ))}
           </div>
        </section>

        {/* Recent Trends */}
        <section className="px-6 mt-8 mb-6">
           <div className="flex items-center justify-between mb-4">
             <h2 className="text-lg font-bold text-slate-900 tracking-tight">近期趋势</h2>
             <div className="flex bg-slate-200 rounded-lg p-0.5">
               <button className="px-3 py-1 rounded-md text-xs font-semibold bg-white text-primary shadow-sm">近7天</button>
               <button className="px-3 py-1 rounded-md text-xs font-medium text-slate-500 hover:text-slate-700">近30天</button>
             </div>
           </div>
           
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-primary"></div>
                   <span className="text-sm font-medium text-slate-500">收缩压</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-primary/30"></div>
                   <span className="text-sm font-medium text-slate-500">舒张压</span>
                </div>
             </div>
             
             <div className="h-48 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={data}>
                   <defs>
                     <linearGradient id="colorSbp" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#3182ed" stopOpacity={0.2}/>
                       <stop offset="95%" stopColor="#3182ed" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                   <Tooltip />
                   <Area type="monotone" dataKey="sbp" stroke="#3182ed" strokeWidth={3} fillOpacity={1} fill="url(#colorSbp)" />
                   <Area type="monotone" dataKey="dbp" stroke="#93c5fd" strokeWidth={3} fillOpacity={0} fill="url(#colorSbp)" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
           </div>
        </section>
      </main>
    </div>
  );
};

export default Measure;