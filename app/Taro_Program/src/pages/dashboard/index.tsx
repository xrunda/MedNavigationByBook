import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import './index.scss';

const Dashboard = () => {
  const [userName] = useState('张奶奶');

  const tabBarPages = [
    '/pages/dashboard/index',
    '/pages/measure/index', 
    '/pages/report/index',
    '/pages/plan/index',
    '/pages/user-profile/index'
  ];

  const navigateTo = (url) => {
    if (tabBarPages.includes(url)) {
      Taro.switchTab({ url });
    } else {
      Taro.navigateTo({ url });
    }
  };

  const quickActions = [
    { icon: '📊', label: '报告解读', link: '/pages/report/index' },
    { icon: '❤️', label: '记血压', link: '/pages/measure/index' },
    { icon: '💧', label: '记血糖', link: '/pages/measure/index' },
    { icon: '💊', label: '用药打卡', link: '/pages/plan/index' },
  ];

  return (
    <ScrollView scrollY className="dashboard-container">
      <View className="header">
        <View className="header-left">
          <View className="logo-box">
            <Text className="logo-icon">🏥</Text>
          </View>
          <Text className="app-name">安和健康</Text>
        </View>
        <View className="header-right">
          <View className="notification-btn">
            <Text>🔔</Text>
            <View className="badge"></View>
          </View>
          <View className="user-info" onClick={() => navigateTo('/pages/user-profile/index')}>
            <Text className="user-name">{userName}</Text>
          </View>
        </View>
      </View>

      <View className="content">
        <View className="status-card">
          <View className="status-header">
            <View className="status-indicator">
              <View className="pulse"></View>
              <Text className="status-label">健康状态</Text>
            </View>
            <Text className="status-value">平稳</Text>
            <Text className="status-time">更新于: 10分钟前</Text>
          </View>

          <View className="status-metrics">
            <View className="metric">
              <Text className="metric-label">心率</Text>
              <Text className="metric-value">72 bpm</Text>
            </View>
            <View className="metric metric-divider">
              <Text className="metric-label">血氧</Text>
              <Text className="metric-value">98%</Text>
            </View>
            <View className="metric">
              <Text className="metric-label">体温</Text>
              <Text className="metric-value">36.6°</Text>
            </View>
          </View>
        </View>

        <View className="quick-actions">
          <ScrollView scrollX className="actions-scroll">
            {quickActions.map((action, index) => (
              <View 
                key={index}
                className="action-btn"
                onClick={() => navigateTo(action.link)}
              >
                <Text className="action-icon">{action.icon}</Text>
                <Text className="action-label">{action.label}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View className="ai-assistant-card">
          <View className="ai-header">
            <Text className="ai-title">🤖 AI导诊助手</Text>
            <Text className="ai-subtitle">身体不舒服?让AI帮你分析</Text>
          </View>
          <Button 
            className="ai-btn"
            onClick={() => navigateTo('/pages/chat/index')}
          >
            <Text className="ai-btn-text">问问安和 AI</Text>
          </Button>
        </View>

        <View className="features-grid">
          <View className="feature-item" onClick={() => navigateTo('/pages/measure/index')}>
            <Text className="feature-icon">📈</Text>
            <Text className="feature-title">健康数据</Text>
            <Text className="feature-desc">记录血压/血糖</Text>
          </View>
          <View className="feature-item" onClick={() => navigateTo('/pages/plan/index')}>
            <Text className="feature-icon">📝</Text>
            <Text className="feature-title">健康计划</Text>
            <Text className="feature-desc">用药/运动提醒</Text>
          </View>
          <View className="feature-item" onClick={() => navigateTo('/pages/report/index')}>
            <Text className="feature-icon">📄</Text>
            <Text className="feature-title">报告解读</Text>
            <Text className="feature-desc">AI智能分析</Text>
          </View>
          <View className="feature-item" onClick={() => navigateTo('/pages/health-profile/index')}>
            <Text className="feature-icon">📋</Text>
            <Text className="feature-title">健康档案</Text>
            <Text className="feature-desc">个人健康信息</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Dashboard;
