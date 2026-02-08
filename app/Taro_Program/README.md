# 安和健康 - Taro小程序版

基于《物理诊断学》教材的智能导诊系统Taro小程序版本，支持微信小程序、支付宝小程序等多端运行。

## 项目概述

本项目是将原React + Vite Web应用迁移到Taro框架的小程序版本，保留了完整的AI导诊功能和医疗知识库。

### 核心功能

- **智能导诊**: 基于19种常见症状的教材级问诊流程
- **5轮问诊**: 主诉→现病史→加重/缓解→伴随症状→补充信息
- **急诊拦截**: 自动识别急诊指征，立即给出急救建议
- **科室推荐**: 根据症状分析推荐合适的就诊科室
- **本地运行**: 内置医疗知识库，支持完全本地运行

## 技术栈

- **框架**: Taro 4.1.11
- **UI库**: @tarojs/components
- **语言**: TypeScript
- **样式**: SCSS
- **编译器**: Webpack5
- **AI引擎**: 本地Medical Navigation Skill（基于教材知识库）

## 项目结构

```
src/
├── app.ts                  # 应用入口
├── app.config.ts          # 全局配置
├── app.scss               # 全局样式
├── pages/                 # 页面目录
│   ├── login/            # 登录页
│   ├── dashboard/        # 首页
│   ├── chat/             # AI问诊页(核心)
│   ├── result/           # 导诊结果页
│   ├── measure/          # 健康数据测量
│   ├── report/           # 报告解读
│   ├── plan/             # 健康计划
│   ├── health-profile/   # 健康档案
│   └── user-profile/     # 个人中心
├── services/             # 服务层
│   ├── aiService.ts      # AI服务接口
│   └── localSkillService.ts  # 本地医疗知识库(1500+行)
├── types/                # TypeScript类型定义
│   └── consultation.ts   # 问诊相关类型
└── hooks/                # 自定义Hooks

```

## 开发指南

### 环境要求

- Node.js >= 16
- npm >= 7

### 安装依赖

```bash
cd app/Taro_Program
npm install
```

### 开发命令

```bash
# 微信小程序
npm run dev:weapp

# 支付宝小程序
npm run dev:alipay

# H5
npm run dev:h5
```

### 生产构建

```bash
# 微信小程序
npm run build:weapp

# 支付宝小程序
npm run build:alipay

# H5
npm run build:h5
```

## 配置说明

### 环境变量

在项目根目录的`.env`文件中配置:

```env
TARO_APP_USE_LOCAL_SKILL=true  # 使用本地技能服务
TARO_APP_AI_API_URL=/api/ai    # AI服务地址(可选)
```

### 小程序配置

修改`project.config.json`中的`appid`:

```json
{
  "appid": "your-appid-here"
}
```

## 关键迁移点

### Web -> Taro API转换

| Web API | Taro API |
|---------|----------|
| `fetch()` | `Taro.request()` |
| `localStorage` | `Taro.setStorageSync()` / `Taro.getStorageSync()` |
| `useNavigate()` | `Taro.navigateTo()` / `Taro.switchTab()` |
| `import.meta.env` | `process.env` |

### 组件转换

| HTML标签 | Taro组件 |
|----------|----------|
| `<div>` | `<View>` |
| `<input>` | `<Input>` |
| `<button>` | `<Button>` |
| `<img>` | `<Image>` |
| 滚动区域 | `<ScrollView>` |

### 样式适配

- Tailwind CSS → SCSS
- px单位 → rpx单位(1px = 2rpx in 750设计稿)
- 使用内联样式或CSS模块

## 支持的19种症状

发热、胸痛、腹痛、头痛、咳嗽、呼吸困难、咯血、发绀、心悸、黄疸、呕血与便血、恶心呕吐、腹泻、尿频尿急尿痛、血尿、少尿无尿、水肿、意识障碍、热性惊厥

## 免责声明

本系统提供的导诊建议仅供参考，不构成临床诊断。请务必到正规医疗机构就诊，由医生完成病史采集、体格检查及辅助检查后做出诊断与治疗。如有紧急情况，请立即拨打120。

## 开发状态

### 已完成

- ✅ 项目框架搭建
- ✅ 服务层迁移(aiService, localSkillService)
- ✅ 核心页面迁移(Login, Dashboard, Chat, Result)
- ✅ 类型定义迁移
- ✅ 环境变量配置
- ✅ TabBar配置

### 待完善

- ⏳ 完善Measure/Report/Plan等业务页面
- ⏳ 添加图标资源
- ⏳ 编译测试与功能验证
- ⏳ 小程序平台适配测试

## License

MIT
