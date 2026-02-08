import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center overflow-hidden bg-background-light">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none -z-10 opacity-30">
        <div className="absolute -top-[10%] -right-[10%] w-[50vh] h-[50vh] rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute -bottom-[10%] -left-[10%] w-[40vh] h-[40vh] rounded-full bg-primary/5 blur-3xl"></div>
        <svg className="absolute top-[35%] left-0 w-full h-32 text-primary/10" preserveAspectRatio="none" viewBox="0 0 1200 120">
          <path d="M0,60 L200,60 L220,20 L240,100 L260,60 L350,60 L370,10 L390,110 L410,60 L600,60 L620,30 L640,90 L660,60 L1200,60" fill="none" stroke="currentColor" strokeWidth="2"></path>
        </svg>
      </div>

      <div className="w-full h-full min-h-screen flex flex-col justify-between p-8 relative z-10">
        <div className="flex-1 flex flex-col items-center justify-center pt-12 pb-8">
          {/* Logo */}
          <div className="w-24 h-24 mb-8 rounded-2xl bg-gradient-to-br from-white to-blue-50 shadow-soft flex items-center justify-center floating border border-primary/10">
            <span className="material-symbols-outlined text-primary text-5xl">medical_services</span>
          </div>
          
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight text-center mb-3">
            安和健康
          </h1>
          <h2 className="text-sm font-medium text-slate-500 text-center tracking-wide">
             AI 健康助手 | 慢病长程管理
          </h2>

          <div className="relative w-full h-48 mt-12 mb-4 flex items-center justify-center opacity-80">
            <svg fill="none" height="160" viewBox="0 0 200 160" width="200" xmlns="http://www.w3.org/2000/svg">
              <path d="M60 20C60 20 60 50 60 60C60 82.0914 77.9086 100 100 100C122.091 100 140 82.0914 140 60C140 50 140 20 140 20" stroke="#3182ed" strokeLinecap="round" strokeOpacity="0.2" strokeWidth="3"></path>
              <path d="M100 100V140" stroke="#3182ed" strokeLinecap="round" strokeOpacity="0.2" strokeWidth="3"></path>
              <circle cx="100" cy="148" r="10" stroke="#3182ed" strokeOpacity="0.2" strokeWidth="3"></circle>
              <path d="M50 20H70" stroke="#3182ed" strokeLinecap="round" strokeOpacity="0.2" strokeWidth="3"></path>
              <path d="M130 20H150" stroke="#3182ed" strokeLinecap="round" strokeOpacity="0.2" strokeWidth="3"></path>
            </svg>
          </div>
        </div>

        <div className="w-full flex flex-col gap-4 pb-8">
          <button 
            onClick={() => navigate('/dashboard')}
            className="group relative w-full h-14 bg-primary hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg font-semibold text-lg shadow-lg shadow-primary/20 transition-all duration-200 flex items-center justify-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10"></div>
            <span className="material-symbols-outlined text-2xl z-20">chat_bubble</span>
            <span className="z-20">微信一键登录</span>
          </button>

          <button 
             onClick={() => navigate('/dashboard')}
             className="w-full h-14 bg-transparent border border-slate-200 hover:border-primary/50 text-slate-600 hover:text-primary rounded-lg font-medium text-base transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <span>试用演示 (不保存数据)</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>

          <div className="mt-6 text-xs text-center text-slate-400 leading-relaxed max-w-xs mx-auto">
            <p>
              登录即代表您同意我们的 <a href="#" className="text-primary hover:underline">用户协议</a> 和 <a href="#" className="text-primary hover:underline">隐私政策</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;