import React from 'react';
import { useNavigate } from 'react-router-dom';

const ConsultationResult = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background-light min-h-screen flex flex-col">
      <header className="sticky top-0 z-20 flex items-center justify-between bg-white/90 backdrop-blur-md px-4 py-3 border-b border-slate-100">
        <button 
            onClick={() => navigate(-1)}
            className="flex w-10 h-10 items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-900"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-base font-bold leading-tight flex-1 text-center pr-10">问诊结果</h2>
      </header>

      <main className="flex-1 flex flex-col gap-5 p-5 pb-32">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 pt-2">建议与下一步</h1>

        {/* Conclusion Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 opacity-90"></div>
            <div className="relative p-6 text-white flex flex-col min-h-[200px] justify-between">
                <div className="flex items-center gap-2 opacity-90">
                    <span className="material-symbols-outlined text-[20px]">medical_services</span>
                    <span className="text-sm font-semibold uppercase tracking-wider">摘要</span>
                </div>
                <div className="mt-6 flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-full bg-white/20 p-1"><span className="material-symbols-outlined text-[16px]">check</span></div>
                        <p className="font-medium leading-relaxed">症状显示有急性胃炎倾向</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-full bg-white/20 p-1"><span className="material-symbols-outlined text-[16px]">water_drop</span></div>
                        <p className="font-medium leading-relaxed">关键在于补水以防脱水</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Risk Level */}
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900">风险等级</h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-bold text-orange-700 ring-1 ring-inset ring-orange-600/10">
                   <span className="relative flex h-2 w-2 mr-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                   </span>
                   中高风险
                </span>
            </div>
            <div>
                <p className="text-2xl font-bold tracking-tight text-slate-900">建议48小时内就医</p>
                <p className="text-sm text-slate-500 mt-1">基于症状判断，炎症可能加重。</p>
            </div>
            
            <div className="mt-2 flex flex-col gap-2">
                <div className="relative h-3 w-full rounded-full bg-slate-100 overflow-hidden flex">
                    <div className="w-1/4 h-full bg-green-400"></div>
                    <div className="w-1/4 h-full bg-yellow-400"></div>
                    <div className="w-1/4 h-full bg-orange-400"></div> 
                    <div className="w-1/4 h-full bg-red-400"></div>
                </div>
                <div className="relative w-full h-4">
                    <div className="absolute left-[62.5%] -translate-x-1/2 flex flex-col items-center top-[-6px]">
                        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-slate-800"></div>
                    </div>
                    <div className="flex justify-between w-full text-[10px] text-slate-400 uppercase font-medium mt-1 px-1">
                        <span>低风险</span>
                        <span className="ml-8">中</span>
                        <span className="text-orange-600 font-bold ml-6">高风险</span>
                        <span>极高</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Department */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">推荐科室</p>
                    <h3 className="text-xl font-bold text-slate-900">消化内科</h3>
                </div>
                <div className="flex size-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <span className="material-symbols-outlined text-[32px]">gastroenterology</span>
                </div>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex -space-x-2 overflow-hidden">
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://picsum.photos/50" alt=""/>
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://picsum.photos/51" alt=""/>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 ring-2 ring-white text-[10px] font-medium text-slate-500">+12</div>
                </div>
                <button className="flex cursor-pointer items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 transition-colors">
                    立即挂号
                    <span className="material-symbols-outlined ml-1 text-[18px]">calendar_month</span>
                </button>
            </div>
        </div>
      </main>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 z-10 w-full max-w-md bg-white/90 backdrop-blur-lg border-t border-slate-100 p-4 pb-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
         <div className="flex flex-col gap-3">
             <button className="flex w-full items-center justify-center rounded-xl bg-primary h-12 text-base font-bold text-white shadow-md hover:bg-blue-600 active:scale-[0.98] transition-all">
                 <span className="material-symbols-outlined mr-2 text-[20px]">summarize</span>
                 生成小结
             </button>
             <button className="flex w-full items-center justify-center rounded-xl bg-white border border-slate-200 h-12 text-base font-semibold text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all">
                 加入随访计划
             </button>
         </div>
      </div>
    </div>
  );
};

export default ConsultationResult;