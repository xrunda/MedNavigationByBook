import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background-light min-h-screen flex flex-col pb-8">
      <header className="sticky top-0 z-50 bg-background-light/90 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100">
           <span className="material-symbols-outlined text-slate-900">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-bold text-slate-900">个人中心</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 px-4 py-6 space-y-6">
        {/* Profile Header */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex flex-col items-center relative overflow-hidden">
           <div className="absolute top-0 w-full h-24 bg-gradient-to-b from-primary/10 to-transparent left-0"></div>
           <div className="relative z-10 mb-4">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-200">
                 <img src="https://picsum.photos/200" alt="Alex" className="w-full h-full object-cover"/>
              </div>
              <button className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1.5 shadow-md border-2 border-white">
                 <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
           </div>
           <div className="text-center z-10">
              <h2 className="text-xl font-bold text-slate-900 mb-1">Alex Chen</h2>
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                 <span className="material-symbols-outlined text-[16px]">format_quote</span>
                 <span>预防胜于治疗</span>
              </div>
           </div>
        </div>

        {/* Management */}
        <div className="flex flex-col gap-3">
           <h3 className="text-xs font-semibold text-slate-500 px-2 uppercase tracking-wider">管理</h3>
           <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 divide-y divide-slate-100">
              <button className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors group text-left">
                 <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 text-primary">
                    <span className="material-symbols-outlined">diversity_1</span>
                 </div>
                 <div className="flex-1">
                    <p className="text-slate-900 font-medium">家庭成员</p>
                 </div>
                 <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">chevron_right</span>
              </button>
              <button className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors group text-left">
                 <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 text-primary">
                    <span className="material-symbols-outlined">smartphone</span>
                 </div>
                 <div className="flex-1">
                    <p className="text-slate-900 font-medium">设备管理</p>
                    <p className="text-xs text-slate-500 mt-0.5">iPhone 14 Pro, Apple Watch</p>
                 </div>
                 <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">chevron_right</span>
              </button>
           </div>
        </div>

        {/* Security */}
        <div className="flex flex-col gap-3">
           <h3 className="text-xs font-semibold text-slate-500 px-2 uppercase tracking-wider">安全</h3>
           <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100">
              <button className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors group text-left">
                 <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-50 text-green-600">
                    <span className="material-symbols-outlined">verified_user</span>
                 </div>
                 <div className="flex-1">
                    <div className="flex items-center gap-2">
                       <p className="text-slate-900 font-medium">数据与隐私</p>
                       <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">受保护</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">管理导出与授权</p>
                 </div>
                 <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">chevron_right</span>
              </button>
           </div>
        </div>
        
        {/* Support */}
        <div className="flex flex-col gap-3">
           <h3 className="text-xs font-semibold text-slate-500 px-2 uppercase tracking-wider">支持</h3>
           <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 divide-y divide-slate-100">
              <button className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors group text-left">
                 <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-50 text-orange-500">
                    <span className="material-symbols-outlined">notifications</span>
                 </div>
                 <div className="flex-1">
                    <p className="text-slate-900 font-medium">消息通知</p>
                 </div>
                 <div className="w-11 h-6 bg-primary rounded-full relative">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                 </div>
              </button>
              <button className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors group text-left">
                 <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-50 text-purple-500">
                    <span className="material-symbols-outlined">help</span>
                 </div>
                 <div className="flex-1">
                    <p className="text-slate-900 font-medium">帮助与反馈</p>
                 </div>
                 <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">chevron_right</span>
              </button>
           </div>
        </div>
        
        <div className="flex flex-col items-center justify-center pt-4 opacity-60">
           <p className="text-xs text-slate-500">安和健康 v1.2.0</p>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;