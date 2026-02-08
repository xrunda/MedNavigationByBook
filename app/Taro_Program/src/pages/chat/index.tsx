import { View, Text, ScrollView, Input, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState, useRef, useEffect } from 'react';
import { aiService } from '../../services/aiService';
import { localSkillService } from '../../services/localSkillService';
import { ChatMessage, ConsultationResult, ConsultationRound } from '../../types/consultation';
import './index.scss';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentRound, setCurrentRound] = useState('registration');
  const [consultationResult, setConsultationResult] = useState(null);
  
  const sessionIdRef = useRef('');
  const scrollViewId = useRef('');

  useEffect(() => {
    const newSessionId = localSkillService.createSession();
    sessionIdRef.current = newSessionId;
    
    const welcomeMessage = {
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
    if (messages.length > 0) {
      const lastMsgId = `msg-${messages.length - 1}`;
      scrollViewId.current = lastMsgId;
    }
  }, [messages]);

  const sendMessage = async (content) => {
    if (!content.trim() || isLoading) return;

    const userMessage = {
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
        setMessages(prev => [...prev, response.message]);
        
        if (response.message.structuredData.round) {
          setCurrentRound(response.message.structuredData.round);
        }

        if (response.message.type === 'result' && response.result) {
          setConsultationResult(response.result);
          Taro.setStorageSync('lastConsultationResult', JSON.stringify(response.result));
          setTimeout(() => {
            Taro.redirectTo({ url: '/pages/result/index' });
          }, 1500);
        }

        if (response.message.type === 'emergency') {
          Taro.showModal({
            title: '⚠️ 紧急提醒',
            content: response.message.emergencyData.description || '检测到紧急症状，请立即就医！',
            confirmText: '我知道了',
            showCancel: false,
          });
        }
      } else {
        const errorMessage = {
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
      const errorMessage = {
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

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleBack = () => {
    Taro.showModal({
      title: '确认退出',
      content: '退出会话将清空当前对话记录，确定要退出吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.navigateBack();
        }
      }
    });
  };

  return (
    <View className="chat-container">
      <View className="chat-header">
        <View className="header-back" onClick={handleBack}>
          <Text>⬅️</Text>
        </View>
        <Text className="header-title">AI导诊助手</Text>
        <View className="header-placeholder"></View>
      </View>

      <ScrollView 
        scrollY
        scrollIntoView={scrollViewId.current}
        className="messages-container"
        scrollWithAnimation
      >
        {messages.map((message, index) => {
          const isUser = message.role === 'user';
          
          return (
            <View 
              key={message.id} 
              id={`msg-${index}`}
              className={`message-wrapper ${isUser ? 'message-user' : 'message-assistant'}`}
            >
              {!isUser && (
                <View className="avatar avatar-assistant">
                  <Text>🤖</Text>
                </View>
              )}
              
              <View className="message-content-wrapper">
                <View className={`message-bubble ${isUser ? 'bubble-user' : 'bubble-assistant'}`}>
                  {message.type === 'emergency' && message.emergencyData && (
                    <View className="emergency-card">
                      <Text className="emergency-title">⚠️ 紧急提醒</Text>
                      <Text className="emergency-desc">{message.emergencyData.description}</Text>
                      <View className="emergency-actions">
                        {message.emergencyData.immediateActions.map((action, idx) => (
                          <Text key={idx} className="emergency-action">• {action}</Text>
                        ))}
                      </View>
                    </View>
                  )}
                  
                  <Text className="message-text">{message.content}</Text>
                  
                  {message.type === 'result' && (
                    <View className="result-hint">
                      <Text className="result-hint-text">✓ 导诊完成，正在跳转到结果页...</Text>
                    </View>
                  )}
                </View>
                
                <Text className="message-time">{formatTime(message.timestamp)}</Text>
              </View>
              
              {isUser && (
                <View className="avatar avatar-user">
                  <Text>👤</Text>
                </View>
              )}
            </View>
          );
        })}
        
        {isLoading && (
          <View className="message-wrapper message-assistant">
            <View className="avatar avatar-assistant">
              <Text>🤖</Text>
            </View>
            <View className="message-content-wrapper">
              <View className="message-bubble bubble-assistant">
                <View className="typing-indicator">
                  <View className="typing-dot"></View>
                  <View className="typing-dot"></View>
                  <View className="typing-dot"></View>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View className="input-container">
        <Input
          className="message-input"
          value={inputValue}
          onInput={(e) => setInputValue(e.detail.value)}
          placeholder="请描述您的症状..."
          disabled={isLoading}
          confirmType="send"
          onConfirm={handleSend}
        />
        <Button 
          className="send-btn"
          onClick={handleSend}
          disabled={!inputValue.trim() || isLoading}
        >
          <Text className="send-btn-text">{isLoading ? '...' : '发送'}</Text>
        </Button>
      </View>
    </View>
  );
};

export default Chat;
