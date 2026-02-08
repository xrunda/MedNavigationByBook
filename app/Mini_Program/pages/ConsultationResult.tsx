import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { ConsultationResult } from '../types/consultation';

const ConsultationResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state?.result as ConsultationResult | undefined;

  if (!result) {
    return (
      <div className="bg-background-light min-h-screen flex flex-col items-center justify-center p-5">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">error_outline</span>
          <h2 className="text-xl font-bold text-slate-700 mb-2">暂无问诊结果</h2>
          <p className="text-slate-500 mb-4">请先完成问诊流程</p>
          <button 
            onClick={() => navigate('/chat')}
            className="bg-primary text-white px-6 py-2 rounded-lg font-semibold"
          >
            开始问诊
          </button>
        </div>
      </div>
    );
  }

  const { patientInfo, chiefComplaint, summary, diagnosisThinking, departmentRecommendation } = result;

  const urgencyConfig = {
    emergency: { color: 'red', label: '立即急诊', position: '87.5%' },
    urgent: { color: 'orange', label: '尽快就诊（24小时内）', position: '62.5%' },
    routine: { color: 'blue', label: '普通门诊', position: '37.5%' },
  };

  const config = urgencyConfig[departmentRecommendation.urgency];

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

        {/* Patient Info Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 opacity-90"></div>
            <div className="relative p-6 text-white flex flex-col min-h-[200px] justify-between">
                <div className="flex items-center gap-2 opacity-90">
                    <span className="material-symbols-outlined text-[20px]">medical_services</span>
                    <span className="text-sm font-semibold uppercase tracking-wider">患者信息</span>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                    <p className="font-medium leading-relaxed">
                      {patientInfo.name}，{patientInfo.age}岁{patientInfo.gender === 'male' ? '男' : '女'}
                    </p>
                    <p className="text-sm opacity-90">
                      主诉：{chiefComplaint.symptom}，持续{chiefComplaint.duration}
                    </p>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                    {summary.mainPoints.slice(0, 2).map((point, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                          <div className="mt-0.5 rounded-full bg-white/20 p-1">
                            <span className="material-symbols-outlined text-[16px]">check</span>
                          </div>
                          <p className="font-medium leading-relaxed text-sm">{point}</p>
                      </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Risk Level */}
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900">风险等级</h3>
                <span className={`inline-flex items-center gap-1 rounded-full bg-${config.color}-50 px-2.5 py-0.5 text-xs font-bold text-${config.color}-700 ring-1 ring-inset ring-${config.color}-600/10`}>
                   <span className="relative flex h-2 w-2 mr-1">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${config.color}-400 opacity-75`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 bg-${config.color}-500`}></span>
                   </span>
                   {departmentRecommendation.urgencyLabel}
                </span>
            </div>
            <div>
                <p className="text-2xl font-bold tracking-tight text-slate-900">{config.label}</p>
                <p className="text-sm text-slate-500 mt-1">{departmentRecommendation.reason}</p>
            </div>
            
            <div className="mt-2 flex flex-col gap-2">
                <div className="relative h-3 w-full rounded-full bg-slate-100 overflow-hidden flex">
                    <div className="w-1/4 h-full bg-green-400"></div>
                    <div className="w-1/4 h-full bg-yellow-400"></div>
                    <div className="w-1/4 h-full bg-orange-400"></div> 
                    <div className="w-1/4 h-full bg-red-400"></div>
                </div>
                <div className="relative w-full h-4">
                    <div className="absolute flex flex-col items-center top-[-6px]" style={{ left: config.position, transform: 'translateX(-50%)' }}>
                        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-slate-800"></div>
                    </div>
                    <div className="flex justify-between w-full text-[10px] text-slate-400 uppercase font-medium mt-1 px-1">
                        <span>低风险</span>
                        <span className="ml-8">中</span>
                        <span className={`font-bold ml-6 text-${config.color}-600`}>{config.label}</span>
                        <span>极高</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Possible Conditions */}
        {diagnosisThinking.possibleConditions.length > 0 && (
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <h3 className="text-base font-semibold text-slate-900 mb-4">可能疾病方向</h3>
            <div className="space-y-3">
              {diagnosisThinking.possibleConditions.map((condition, idx) => (
                <div key={idx} className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${
                      condition.priority === 'high' ? 'bg-orange-500' : 
                      condition.priority === 'medium' ? 'bg-yellow-500' : 'bg-slate-400'
                    }`}></span>
                    <span className="font-semibold text-slate-800">{condition.name}</span>
                  </div>
                  <p className="text-xs text-slate-600 ml-4">{condition.evidence.join('；')}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Checks */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <h3 className="text-base font-semibold text-slate-900 mb-4">建议检查</h3>
          <div className="flex flex-wrap gap-2">
            {departmentRecommendation.suggestedChecks.map((check, idx) => (
              <span key={idx} className="text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full">
                {check}
              </span>
            ))}
          </div>
        </div>

        {/* Precautions */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <h3 className="text-base font-semibold text-slate-900 mb-4">就诊前注意事项</h3>
          <ul className="space-y-2">
            {departmentRecommendation.precautions.map((precaution, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                {precaution}
              </li>
            ))}
          </ul>
        </div>

        {/* Warning Signs */}
        <div className="rounded-2xl bg-red-50 border border-red-200 p-5">
          <h3 className="text-base font-semibold text-red-800 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined">warning</span>
            需立即就医的情况
          </h3>
          <ul className="space-y-2">
            {departmentRecommendation.warningSigns.map((warning, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-red-700">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></span>
                {warning}
              </li>
            ))}
          </ul>
        </div>

        {/* Department */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">推荐科室</p>
                    <h3 className="text-xl font-bold text-slate-900">{departmentRecommendation.department}</h3>
                </div>
                <div className="flex size-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <span className="material-symbols-outlined text-[32px]">{departmentRecommendation.icon || 'medical_services'}</span>
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

        {/* Disclaimer */}
        <div className="rounded-2xl bg-yellow-50 border border-yellow-200 p-4">
          <p className="text-xs text-yellow-800 leading-relaxed">
            <strong>声明：</strong>以上仅为基于问诊信息的导诊建议与诊断思路分析，<strong>不构成临床诊断</strong>。
            请务必在医疗机构由医生完成病史采集、体格检查及辅助检查后做出诊断与治疗。如有紧急情况，请立即拨打120。
          </p>
        </div>
      </main>

      <div className="fixed bottom-0 z-10 w-full max-w-md bg-white/90 backdrop-blur-lg border-t border-slate-100 p-4 pb-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
         <div className="flex flex-col gap-3">
             <button 
               onClick={() => window.print()}
               className="flex w-full items-center justify-center rounded-xl bg-primary h-12 text-base font-bold text-white shadow-md hover:bg-blue-600 active:scale-[0.98] transition-all"
             >
                 <span className="material-symbols-outlined mr-2 text-[20px]">summarize</span>
                 生成小结
             </button>
             <button 
               onClick={() => navigate('/plan')}
               className="flex w-full items-center justify-center rounded-xl bg-white border border-slate-200 h-12 text-base font-semibold text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all"
             >
                 加入随访计划
             </button>
         </div>
      </div>
    </div>
  );
};

export default ConsultationResult;