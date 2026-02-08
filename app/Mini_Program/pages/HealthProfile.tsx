import React from 'react';
import { useNavigate } from 'react-router-dom';

const HealthProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background-light min-h-screen flex flex-col pb-24">
      <header className="sticky top-0 z-50 bg-background-light/90 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <button 
           onClick={() => navigate(-1)}
           className="p-1 rounded-full hover:bg-slate-100"
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-bold text-slate-900">健康档案</h1>
        <button className="flex items-center gap-1 text-primary text-sm font-semibold">
          <span className="material-symbols-outlined text-[18px]">group</span>
          切换家人
        </button>
      </header>

      <main className="flex-1 px-4 py-6 flex flex-col gap-6">
        {/* Profile Card */}
        <section className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4">
              <button className="text-primary p-2 rounded-full hover:bg-primary/10 transition-colors">
                 <span className="material-symbols-outlined text-[20px]">edit</span>
              </button>
           </div>
           <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                 <img src="https://picsum.photos/150" alt="Profile" className="w-16 h-16 rounded-full object-cover ring-4 ring-primary/10" />
                 <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                 <h2 className="text-xl font-bold text-slate-900">张奶奶</h2>
                 <p className="text-sm text-slate-500 mt-0.5">更新于: 2023-10-25</p>
              </div>
           </div>
           <div className="grid grid-cols-3 divide-x divide-slate-100 bg-slate-50 rounded-lg py-4">
              <div className="text-center px-2">
                 <p className="text-xs text-slate-500 mb-1">年龄</p>
                 <p className="text-lg font-bold text-slate-900">68</p>
              </div>
              <div className="text-center px-2">
                 <p className="text-xs text-slate-500 mb-1">身高</p>
                 <p className="text-lg font-bold text-slate-900">162<span className="text-xs font-normal ml-0.5 text-slate-400">cm</span></p>
              </div>
              <div className="text-center px-2">
                 <p className="text-xs text-slate-500 mb-1">体重</p>
                 <p className="text-lg font-bold text-slate-900">58<span className="text-xs font-normal ml-0.5 text-slate-400">kg</span></p>
              </div>
           </div>
        </section>

        {/* History */}
        <section className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
           <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                 <span className="material-symbols-outlined text-red-500">medical_services</span>
                 <h3 className="text-base font-bold text-slate-900">病史与过敏</h3>
              </div>
              <span className="material-symbols-outlined text-primary text-[20px] cursor-pointer">edit</span>
           </div>
           <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">高血压 (二级)</span>
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">2型糖尿病</span>
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                 <span className="material-symbols-outlined text-[14px] mr-1">warning</span> 青霉素过敏
              </span>
           </div>
        </section>

        {/* Meds */}
        <section className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
           <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                 <span className="material-symbols-outlined text-orange-500">pill</span>
                 <h3 className="text-base font-bold text-slate-900">在用药物</h3>
              </div>
              <span className="material-symbols-outlined text-primary text-[20px] cursor-pointer">add_circle</span>
           </div>
           <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                 <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm text-primary">
                       <span className="material-symbols-outlined">medication</span>
                    </div>
                    <div>
                       <p className="text-sm font-bold text-slate-900">阿司匹林</p>
                       <p className="text-xs text-slate-500">100mg / 片</p>
                    </div>
                 </div>
                 <div className="flex flex-col items-end gap-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700">每日1次</span>
                    <span className="text-[10px] text-slate-500">饭后</span>
                 </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                 <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm text-primary">
                       <span className="material-symbols-outlined">vaccines</span>
                    </div>
                    <div>
                       <p className="text-sm font-bold text-slate-900">二甲双胍</p>
                       <p className="text-xs text-slate-500">0.5g / 片</p>
                    </div>
                 </div>
                 <div className="flex flex-col items-end gap-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700">每日2次</span>
                    <span className="text-[10px] text-slate-500">随餐</span>
                 </div>
              </div>
           </div>
        </section>
        
        {/* Timeline */}
        <section className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
           <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                 <span className="material-symbols-outlined text-primary">history_edu</span>
                 <h3 className="text-base font-bold text-slate-900">就诊记录</h3>
              </div>
              <button className="text-sm text-primary font-medium hover:underline">查看全部</button>
           </div>
           <div className="relative pl-2">
              <div className="absolute top-2 bottom-4 left-[15px] w-0.5 bg-slate-200"></div>
              
              <div className="relative pl-8 mb-6 group">
                 <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-blue-50 border-2 border-white flex items-center justify-center z-10 shadow-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-primary/20"></div>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-xs font-semibold text-primary mb-0.5">2023年10月15日</span>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">年度体检</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">血压控制尚可。空腹血糖略高。建议控制饮食。</p>
                    <div className="mt-2">
                       <button 
                          onClick={() => navigate('/report')}
                          className="flex items-center gap-1 text-[10px] bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-600 transition-colors"
                       >
                          <span className="material-symbols-outlined text-[12px]">description</span>
                          查看报告
                       </button>
                    </div>
                 </div>
              </div>

              <div className="relative pl-8 group">
                 <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-slate-50 border-2 border-white flex items-center justify-center z-10 shadow-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-500 mb-0.5">2023年8月1日</span>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">门诊随访</h4>
                    <p className="text-xs text-slate-500">自述头晕。调整处方。</p>
                 </div>
              </div>
           </div>
        </section>
      </main>

      {/* Floating Action */}
      <div className="fixed bottom-6 left-0 right-0 px-4 flex justify-center z-40 pointer-events-none max-w-md mx-auto">
         <button className="pointer-events-auto bg-primary hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30 rounded-full px-6 py-3 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
            <span className="material-symbols-outlined">add</span>
            <span className="font-bold text-sm">上传报告</span>
         </button>
      </div>
    </div>
  );
};

export default HealthProfile;