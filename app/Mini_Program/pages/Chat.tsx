import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { aiService } from '../services/aiService';
import { localSkillService } from '../services/localSkillService';
import type { 
  ChatMessage, 
  ConsultationResult, 
  ConsultationRound,
  EmergencyData 
} from '../types/consultation';

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentRound, setCurrentRound] = useState<ConsultationRound>('registration');
  const [showResult, setShowResult] = useState(false);
  const [consultationResult, setConsultationResult] = useState<ConsultationResult | null>(null);
  
  // 使用 ref 保存 sessionId，确保在异步操作中也能获取最新值
  const sessionIdRef = useRef<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // 创建新会话
    const newSessionId = localSkillService.createSession();
    sessionIdRef.current = newSessionId;
    
    const welcomeMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      content: '您好，我是您的智能导诊助手。为了给您提供准确的导诊建议，我需要了解一些基本信息：\n\n1. 您的姓名和手机号\n2. 您今天最主要的不舒服是什么？（如肚子疼、胸口疼、头疼、发烧、咳嗽等）\n3. 大概持续多久了？\n4. 您的年龄和性别？\n\n请尽可能完整地描述。',
      timestamp: Date.now(),
      type: 'structured',
      structuredData: {
        round: 'registration',
        questionType: 'text',
        question: '患者登记与主诉',
        description: '请提供您的姓名、手机号、主要症状、持续时间、年龄和性别',
      },
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
      type: 'text',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const currentSessionId = sessionIdRef.current;
      
      if (!currentSessionId) {
        throw new Error('Session not initialized');
      }

      const response = await aiService.sendMessage({
        sessionId: currentSessionId,
        currentRound,
        userInput: content.trim(),
        previousMessages: messages,
      });

      if (response.success && response.message) {
        setMessages(prev => [...prev, response.message!]);
        
        if (response.message.structuredData?.round) {
          setCurrentRound(response.message.structuredData.round);
        }

        if (response.message.type === 'result' && response.result) {
          setConsultationResult(response.result);
          setShowResult(true);
        }

        if (response.message.type === 'emergency') {
          setShowResult(true);
        }
      } else {
        const errorMessage: ChatMessage = {
          id: `msg_${Date.now()}`,
          role: 'assistant',
          content: '抱歉，处理您的请求时出现了问题。请稍后再试。',
          timestamp: Date.now(),
          type: 'text',
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Send message error:', error);
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: '抱歉，网络连接出现问题。请检查网络后重试。',
        timestamp: Date.now(),
        type: 'text',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    sendMessage(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.role === 'user';
    
    if (isUser) {
      return (
        <div key={message.id} className="flex items-end gap-3 w-full justify-end">
          <div className="flex flex-col gap-1 items-end max-w-[80%]">
            <div className="p-4 bg-white rounded-[18px] rounded-tr-none text-slate-800 text-[15px] leading-relaxed shadow-sm border border-slate-100">
              {message.content}
            </div>
            <span className="text-[10px] text-slate-400">{formatTime(message.timestamp)}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 flex-shrink-0">
            <span className="material-symbols-outlined text-sm">person</span>
          </div>
        </div>
      );
    }

    if (message.type === 'emergency' && message.emergencyData) {
      return (
        <div key={message.id} className="flex flex-col gap-2 w-full">
          <div className="flex items-end gap-3">
            <div className="w-8 h-8 rounded-full bg-cover bg-center shadow-sm border border-white flex-shrink-0" style={{ backgroundImage: 'url(https://picsum.photos/100)' }}></div>
            <span className="text-xs text-slate-500">安和助手</span>
          </div>
          <EmergencyCard data={message.emergencyData} />
        </div>
      );
    }

    if (message.type === 'result' && message.resultData) {
      return (
        <div key={message.id} className="flex flex-col gap-2 w-full">
          <div className="flex items-end gap-3">
            <div className="w-8 h-8 rounded-full bg-cover bg-center shadow-sm border border-white flex-shrink-0" style={{ backgroundImage: 'url(https://picsum.photos/100)' }}></div>
            <span className="text-xs text-slate-500">安和助手</span>
          </div>
          <ResultCard 
            result={message.resultData} 
            onViewDetails={() => navigate('/result', { state: { result: message.resultData } })}
          />
        </div>
      );
    }

    if (message.type === 'structured' && message.structuredData) {
      return (
        <div key={message.id} className="flex flex-col gap-2 w-full max-w-[85%]">
          <div className="flex items-end gap-3">
            <div className="w-8 h-8 rounded-full bg-cover bg-center shadow-sm border border-white flex-shrink-0" style={{ backgroundImage: 'url(https://picsum.photos/100)' }}></div>
            <div className="flex flex-col gap-1 max-w-[calc(100%-44px)]">
              <span className="text-xs text-slate-500 ml-1">安和助手</span>
              <div className="p-4 bg-primary-light rounded-[18px] rounded-tl-none text-slate-800 text-[15px] leading-relaxed shadow-sm whitespace-pre-wrap">
                {message.content}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={message.id} className="flex items-end gap-3 w-full">
        <div className="w-8 h-8 rounded-full bg-cover bg-center shadow-sm border border-white flex-shrink-0" style={{ backgroundImage: 'url(https://picsum.photos/100)' }}></div>
        <div className="flex flex-col gap-1 max-w-[80%]">
          <span className="text-xs text-slate-500 ml-1">安和助手</span>
          <div className="p-4 bg-primary-light rounded-[18px] rounded-tl-none text-slate-800 text-[15px] leading-relaxed shadow-sm whitespace-pre-wrap">
            {message.content}
          </div>
          <span className="text-[10px] text-slate-400 ml-1">{formatTime(message.timestamp)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-background-light overflow-hidden">
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

      <main className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 hide-scrollbar">
        {messages.length > 0 && (
          <div className="flex justify-center w-full">
            <span className="text-xs text-slate-400 bg-slate-200/50 px-2 py-1 rounded-full">
              今天 {formatTime(messages[0].timestamp)}
            </span>
          </div>
        )}

        {messages.map((message) => renderMessage(message))}

        {isLoading && (
          <div className="flex items-end gap-3 w-full">
            <div className="w-8 h-8 rounded-full bg-cover bg-center shadow-sm border border-white flex-shrink-0" style={{ backgroundImage: 'url(https://picsum.photos/100)' }}></div>
            <div className="flex flex-col gap-1 max-w-[80%]">
              <span className="text-xs text-slate-500 ml-1">安和助手</span>
              <div className="p-4 bg-primary-light rounded-[18px] rounded-tl-none shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      <div className="bg-white border-t border-slate-200 p-2 pb-6 shrink-0 z-20">
        <div className="flex items-end gap-2 px-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition-colors mb-[2px]">
            <span className="material-symbols-outlined text-[26px]">mic</span>
          </button>
          <div className="flex-1 bg-slate-100 rounded-[20px] min-h-[44px] flex items-center px-4 py-2 border border-transparent focus-within:border-primary/50 focus-within:bg-white transition-all">
            <textarea 
              ref={textareaRef}
              className="w-full bg-transparent border-none outline-none text-[15px] placeholder-slate-400 text-slate-800 resize-none h-6 py-0 focus:ring-0 leading-6" 
              placeholder="描述您的症状..." 
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading || showResult}
            ></textarea>
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition-colors mb-[2px]">
            <span className="material-symbols-outlined text-[28px]">add_circle</span>
          </button>
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading || showResult}
            className="h-10 px-4 flex items-center justify-center rounded-full bg-primary hover:bg-blue-600 text-white shadow-md transition-all mb-[2px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-sm font-bold tracking-wide">发送</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface EmergencyCardProps {
  data: EmergencyData;
}

const EmergencyCard: React.FC<EmergencyCardProps> = ({ data }) => {
  return (
    <div className="w-full max-w-[90%] mx-auto">
      <div className="bg-white rounded-2xl overflow-hidden shadow-md border-2 border-red-500">
        <div className="h-20 bg-gradient-to-r from-red-600 to-red-500 p-4 flex flex-col justify-center relative">
          <div className="absolute top-2 right-2 bg-white text-red-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
            紧急情况
          </div>
          <div className="flex items-center gap-2 text-white">
            <span className="material-symbols-outlined text-white filled">emergency</span>
            <h3 className="font-bold text-lg leading-tight">急诊建议</h3>
          </div>
        </div>
        <div className="p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-800 font-medium">{data.description}</p>
          </div>
          
          <h4 className="font-semibold text-slate-800 mb-2 text-sm">请立即采取以下措施：</h4>
          <ol className="space-y-2 mb-4">
            {data.immediateActions.map((action, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="flex-shrink-0 w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                {action}
              </li>
            ))}
          </ol>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              <strong>重要声明：</strong>本系统检测到可能危及生命的紧急情况，请立即拨打120或前往最近的医院急诊科！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ResultCardProps {
  result: ConsultationResult;
  onViewDetails: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, onViewDetails }) => {
  const { departmentRecommendation, diagnosisThinking } = result;
  
  const urgencyColors = {
    emergency: 'from-red-600 to-red-500',
    urgent: 'from-orange-500 to-orange-400',
    routine: 'from-blue-600 to-primary',
  };

  const urgencyBgColors = {
    emergency: 'bg-red-50 border-red-200',
    urgent: 'bg-orange-50 border-orange-200',
    routine: 'bg-blue-50 border-blue-200',
  };

  return (
    <div className="w-full max-w-[90%] mx-auto">
      <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100">
        <div className={`h-20 bg-gradient-to-r ${urgencyColors[departmentRecommendation.urgency]} p-4 flex flex-col justify-center relative`}>
          <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
            导诊结果
          </div>
          <div className="flex items-center gap-2 text-white">
            <span className="material-symbols-outlined text-white filled">medical_services</span>
            <h3 className="font-bold text-lg leading-tight">{departmentRecommendation.department}</h3>
          </div>
        </div>
        
        <div className="p-4">
          <div className={`${urgencyBgColors[departmentRecommendation.urgency]} border rounded-lg p-3 mb-4`}>
            <p className="text-sm font-medium text-slate-800">{departmentRecommendation.urgencyLabel}</p>
            <p className="text-xs text-slate-600 mt-1">{departmentRecommendation.reason}</p>
          </div>

          {diagnosisThinking.possibleConditions.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-slate-800 mb-2 text-sm">可能疾病方向</h4>
              <div className="space-y-2">
                {diagnosisThinking.possibleConditions.slice(0, 2).map((condition, index) => (
                  <div key={index} className="bg-slate-50 rounded-lg p-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        condition.priority === 'high' ? 'bg-orange-500' : 
                        condition.priority === 'medium' ? 'bg-yellow-500' : 'bg-slate-400'
                      }`}></span>
                      <span className="font-medium text-slate-800 text-sm">{condition.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4">
            <h4 className="font-semibold text-slate-800 mb-2 text-sm">建议检查</h4>
            <div className="flex flex-wrap gap-2">
              {departmentRecommendation.suggestedChecks.slice(0, 3).map((check, index) => (
                <span key={index} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                  {check}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={onViewDetails}
              className="flex-1 bg-primary hover:bg-blue-600 text-white text-sm font-semibold py-2.5 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">medical_services</span>
              查看详情
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
