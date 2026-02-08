import React from 'react';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col bg-background-light overflow-hidden">
      {/* Header */}
      <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-slate-100 shadow-sm z-10">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-bold text-slate-900">AI 健康助手</h1>
        <button 
          onClick={() => navigate('/health-profile')}
          className="text-primary text-sm font-semibold"
        >
          小结
        </button>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 hide-scrollbar">
        <div className="flex justify-center w-full">
          <span className="text-xs text-slate-400 bg-slate-200/50 px-2 py-1 rounded-full">今天 上午 10:23</span>
        </div>

        {/* AI Message */}
        <div className="flex items-end gap-3 w-full">
          <div className="w-8 h-8 rounded-full bg-cover bg-center shadow-sm border border-white" style={{ backgroundImage: 'url(https://picsum.photos/100)' }}></div>
          <div className="flex flex-col gap-1 max-w-[80%]">
            <span className="text-xs text-slate-500 ml-1">安和助手</span>
            <div className="p-4 bg-primary-light rounded-[18px] rounded-tl-none text-slate-800 text-[15px] leading-relaxed shadow-sm">
               您好！我是您的安和健康助手。今天有什么可以帮您？
            </div>
          </div>
        </div>

        {/* User Message */}
        <div className="flex items-end gap-3 w-full justify-end">
          <div className="flex flex-col gap-1 items-end max-w-[80%]">
             <div className="p-4 bg-white rounded-[18px] rounded-tr-none text-slate-800 text-[15px] leading-relaxed shadow-sm border border-slate-100">
               我头痛两天了。
             </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
            <span className="material-symbols-outlined text-sm">person</span>
          </div>
        </div>

        {/* AI Structured Follow-up */}
        <div className="flex flex-col gap-2 w-full max-w-[85%] ml-[44px]">
          <div className="p-4 bg-primary-light rounded-[18px] rounded-bl-none text-slate-800 text-[15px] leading-relaxed shadow-sm mb-1">
            为了更准确地判断，请确认：
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
             <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
               <span className="material-symbols-outlined text-primary text-lg">help</span>
               症状持续时间？
             </h3>
             <div className="flex flex-wrap gap-2">
               <button className="flex-1 min-w-[100px] py-2 px-3 rounded-full bg-primary/10 hover:bg-primary hover:text-white text-primary text-xs font-medium transition-colors border border-primary/20">
                 &lt; 24 小时
               </button>
               <button className="flex-1 min-w-[100px] py-2 px-3 rounded-full bg-primary text-white text-xs font-medium shadow-sm shadow-primary/30 border border-primary">
                 1-3 天
               </button>
               <button className="flex-1 min-w-[100px] py-2 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition-colors">
                 &gt; 1 周
               </button>
             </div>
          </div>
        </div>

        {/* Risk Card */}
        <div className="mt-2 w-full max-w-[90%] mx-auto animate-fade-in-up">
          <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100">
             <div className="h-20 bg-gradient-to-r from-blue-600 to-primary p-4 flex flex-col justify-center relative">
               <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
                 仅供参考
               </div>
               <div className="flex items-center gap-2 text-white">
                 <span className="material-symbols-outlined text-yellow-300 filled">warning</span>
                 <h3 className="font-bold text-lg leading-tight">风险提示</h3>
               </div>
             </div>
             <div className="p-4">
               <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                 根据您的描述，可能是<strong className="text-slate-800">紧张性头痛</strong>。请密切观察症状。
               </p>
               <div className="flex gap-3">
                 <button 
                    onClick={() => navigate('/result')}
                    className="flex-1 bg-primary hover:bg-blue-600 text-white text-sm font-semibold py-2.5 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                 >
                   <span className="material-symbols-outlined text-[18px]">medical_services</span>
                   查看详情
                 </button>
                 <button className="flex-1 bg-slate-100 text-slate-700 text-sm font-medium py-2.5 rounded-lg transition-colors border border-slate-200">
                   自我护理
                 </button>
               </div>
             </div>
          </div>
        </div>
        <div className="h-4"></div>
      </main>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 p-2 pb-6 shrink-0 z-20">
        <div className="flex items-end gap-2 px-2">
           <button className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition-colors mb-[2px]">
             <span className="material-symbols-outlined text-[26px]">mic</span>
           </button>
           <div className="flex-1 bg-slate-100 rounded-[20px] min-h-[44px] flex items-center px-4 py-2 border border-transparent focus-within:border-primary/50 focus-within:bg-white transition-all">
             <textarea 
               className="w-full bg-transparent border-none outline-none text-[15px] placeholder-slate-400 text-slate-800 resize-none h-6 py-0 focus:ring-0 leading-6" 
               placeholder="描述您的症状..." 
               rows={1}
             ></textarea>
           </div>
           <button className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition-colors mb-[2px]">
             <span className="material-symbols-outlined text-[28px]">add_circle</span>
           </button>
           <button className="h-10 px-4 flex items-center justify-center rounded-full bg-primary hover:bg-blue-600 text-white shadow-md transition-all mb-[2px]">
             <span className="text-sm font-bold tracking-wide">发送</span>
           </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;