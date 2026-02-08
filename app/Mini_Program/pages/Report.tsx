import React from 'react';
import { useNavigate } from 'react-router-dom';

const Report = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background-light min-h-screen flex flex-col">
      <header className="flex items-center justify-between bg-white px-4 py-3 shadow-sm sticky top-0 z-10">
        <button 
           onClick={() => navigate(-1)}
           className="flex items-center justify-center p-2 rounded-full hover:bg-slate-100 text-slate-900"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-slate-900 tracking-tight">报告解读</h1>
        <button className="flex items-center justify-center p-2 rounded-full hover:bg-slate-100 text-slate-900">
          <span className="material-symbols-outlined text-2xl">more_horiz</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 hide-scrollbar">
         {/* Identified Report Card */}
         <div className="px-4 py-4">
           <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-soft border border-slate-100">
             <div className="flex-1">
               <div className="flex items-center gap-2 mb-1">
                 <span className="material-symbols-outlined text-primary text-xl">verified_user</span>
                 <h2 className="text-base font-bold text-slate-900">已识别报告</h2>
               </div>
               <p className="text-xs text-slate-500 mb-3">2页 • 加密传输</p>
               <button className="text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors">
                  查看原件
               </button>
             </div>
             <div className="relative w-20 h-20 rounded-lg bg-slate-200 overflow-hidden shadow-sm">
                <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-400 text-3xl">description</span>
                </div>
             </div>
           </div>
         </div>

         {/* Key Abnormalities */}
         <section className="px-4 pb-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                 <span className="material-symbols-outlined text-orange-500">warning</span>
                 关键异常
              </h3>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">3项</span>
            </div>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 -mx-4 px-4 snap-x">
               {/* Card 1 */}
               <div className="snap-center min-w-[160px] flex-1 bg-white rounded-xl p-4 shadow-soft border border-slate-100 flex flex-col gap-3">
                 <div className="flex justify-between items-start">
                   <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                     <span className="material-symbols-outlined text-lg">water_drop</span>
                   </div>
                   <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-600">偏高</span>
                 </div>
                 <div>
                   <p className="text-sm font-medium text-slate-500">总胆固醇</p>
                   <p className="text-xl font-bold text-slate-900 mt-0.5">6.2 <span className="text-xs font-normal text-slate-400">mmol/L</span></p>
                 </div>
               </div>
               
               {/* Card 2 */}
               <div className="snap-center min-w-[160px] flex-1 bg-white rounded-xl p-4 shadow-soft border border-slate-100 flex flex-col gap-3">
                 <div className="flex justify-between items-start">
                   <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                     <span className="material-symbols-outlined text-lg">sunny</span>
                   </div>
                   <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-600">偏低</span>
                 </div>
                 <div>
                   <p className="text-sm font-medium text-slate-500">维生素 D</p>
                   <p className="text-xl font-bold text-slate-900 mt-0.5">18 <span className="text-xs font-normal text-slate-400">ng/mL</span></p>
                 </div>
               </div>
            </div>
         </section>

         {/* Details */}
         <section className="px-4 py-4">
           <h3 className="text-base font-bold text-slate-900 mb-3 px-1">指标详情</h3>
           <div className="flex flex-col gap-3">
              <div className="bg-white rounded-xl p-4 shadow-soft border border-slate-100">
                 <div className="flex justify-between items-start mb-2">
                   <div>
                     <h4 className="text-sm font-bold text-slate-900">尿酸</h4>
                     <p className="text-xs text-slate-500">参考值: 208-428 umol/L</p>
                   </div>
                   <div className="text-right">
                     <span className="text-lg font-bold text-slate-900">520</span>
                     <span className="ml-1 inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-600">偏高</span>
                   </div>
                 </div>
                 <div className="mt-2 p-3 bg-slate-50 rounded-lg flex gap-3 items-start">
                    <span className="material-symbols-outlined text-primary text-lg mt-0.5 shrink-0">smart_toy</span>
                    <p className="text-xs leading-relaxed text-slate-600">
                      <span className="font-semibold text-primary">AI 洞察:</span> 数值略高。可能与近期摄入海鲜或红肉等高嘌呤食物有关。
                    </p>
                 </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-soft border border-slate-100">
                 <div className="flex justify-between items-start mb-2">
                   <div>
                     <h4 className="text-sm font-bold text-slate-900">血红蛋白</h4>
                     <p className="text-xs text-slate-500">参考值: 130-175 g/L</p>
                   </div>
                   <div className="text-right">
                     <span className="text-lg font-bold text-slate-900">145</span>
                     <span className="ml-1 inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-600">正常</span>
                   </div>
                 </div>
              </div>
           </div>
         </section>

         {/* Actions */}
         <section className="px-4 pb-6">
           <h3 className="text-base font-bold text-slate-900 mb-3 px-1">行动建议</h3>
           <div className="flex gap-4 items-center bg-white p-4 rounded-xl shadow-soft border border-slate-100 mb-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                 <span className="material-symbols-outlined">restaurant</span>
              </div>
              <div className="flex-1">
                 <h4 className="text-sm font-bold text-slate-900">饮食调整</h4>
                 <p className="text-xs text-slate-500 mt-1">减少海鲜和红肉摄入。多吃低嘌呤蔬菜。</p>
              </div>
              <span className="material-symbols-outlined text-slate-300">chevron_right</span>
           </div>
         </section>
      </main>
      
      {/* Footer Actions */}
      <footer className="absolute bottom-0 w-full bg-white border-t border-slate-100 p-4 pb-6 z-20 shadow-lg max-w-md">
         <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm font-semibold hover:bg-slate-50">
               <span className="material-symbols-outlined text-primary text-xl">smart_toy</span>
               询问 AI
            </button>
            <button className="flex-[1.5] flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30 hover:bg-blue-600">
               加入健康计划
            </button>
         </div>
      </footer>
    </div>
  );
};

export default Report;