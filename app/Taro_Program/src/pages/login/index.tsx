import { View, Button, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.scss';

const Login = () => {
  const handleLogin = () => {
    Taro.switchTab({ url: '/pages/dashboard/index' });
  };

  const handleDemo = () => {
    Taro.switchTab({ url: '/pages/dashboard/index' });
  };

  return (
    <View className="login-container">
      <View className="decorative-bg">
        <View className="circle circle-1"></View>
        <View className="circle circle-2"></View>
      </View>

      <View className="content-wrapper">
        <View className="header-section">
          <View className="logo-container">
            <Text className="logo-icon">🏥</Text>
          </View>
          
          <Text className="title">安和健康</Text>
          <Text className="subtitle">AI 健康助手 | 慢病长程管理</Text>

          <View className="illustration">
            <Text className="illustration-icon">⚕️</Text>
          </View>
        </View>

        <View className="action-section">
          <Button 
            className="primary-btn"
            onClick={handleLogin}
          >
            <Text className="btn-text">微信一键登录</Text>
          </Button>

          <Button 
            className="secondary-btn"
            onClick={handleDemo}
          >
            <Text className="btn-text">试用演示 (不保存数据)</Text>
          </Button>

          <View className="footer-text">
            <Text className="agreement-text">
              登录即代表您同意我们的用户协议和隐私政策
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Login;
