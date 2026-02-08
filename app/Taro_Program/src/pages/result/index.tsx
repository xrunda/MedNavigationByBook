import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState, useEffect } from 'react';
import { ConsultationResult } from '../../types/consultation';
import './index.scss';

const Result = () => {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const savedResult = Taro.getStorageSync('lastConsultationResult');
    if (savedResult) {
      try {
        setResult(JSON.parse(savedResult));
      } catch (e) {
        console.error('Failed to parse result', e);
      }
    }
  }, []);

  const handleBack = () => {
    Taro.switchTab({ url: '/pages/dashboard/index' });
  };

  if (!result) {
    return (
      <View className="result-container">
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <ScrollView scrollY className="result-container">
      <View className="result-header">
        <Text className="result-title">导诊结果</Text>
        <Text className="result-patient">{result.patientInfo.name}</Text>
      </View>

      <View className="result-content">
        <View className="section">
          <Text className="section-title">主诉</Text>
          <Text className="section-text">{result.chiefComplaint.symptom}</Text>
        </View>

        <View className="section department-section">
          <Text className="section-title">推荐科室</Text>
          <View className="department-card">
            <Text className="department-name">{result.departmentRecommendation.department}</Text>
            <Text className="department-reason">{result.departmentRecommendation.reason}</Text>
          </View>
        </View>

        <View className="section">
          <Text className="section-title">建议检查</Text>
          {result.departmentRecommendation.suggestedChecks.map((check, idx) => (
            <Text key={idx} className="list-item">• {check}</Text>
          ))}
        </View>

        <View className="section">
          <Text className="section-title">注意事项</Text>
          {result.departmentRecommendation.precautions.map((item, idx) => (
            <Text key={idx} className="list-item">• {item}</Text>
          ))}
        </View>
      </View>

      <View className="result-footer">
        <Button className="back-btn" onClick={handleBack}>
          <Text className="btn-text">返回首页</Text>
        </Button>
      </View>
    </ScrollView>
  );
};

export default Result;
