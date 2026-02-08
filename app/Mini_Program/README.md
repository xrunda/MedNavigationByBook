<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 安和健康 - 智能导诊小程序

基于《物理诊断学》教材的智能导诊系统，通过5轮标准化问诊流程，为患者提供科室推荐和就诊建议。

## 功能特性

- **智能导诊**: 基于19种常见症状的教材级问诊流程
- **5轮问诊**: 主诉→现病史→加重/缓解→伴随症状→补充信息
- **急诊拦截**: 自动识别急诊指征，立即给出急救建议
- **科室推荐**: 根据症状分析推荐合适的就诊科室
- **本地运行**: 无需后端服务器，完全本地运行

## 本地运行

**环境要求:** Node.js 16+

### 1. 安装依赖
```bash
cd app/Mini_Program
npm install
```

### 2. 配置环境变量
复制 `.env.local.example` 为 `.env.local`:
```bash
cp .env.local.example .env.local
```

默认配置已启用本地 skill 模式（无需后端）:
```
VITE_USE_LOCAL_SKILL=true
```

### 3. 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:5173 即可使用

## 使用说明

1. 点击首页"问问安和 AI"开始问诊
2. 按提示提供姓名、手机号、症状等信息
3. 根据AI的5轮问题逐步描述病情
4. 获得科室推荐和就诊建议
5. 点击"查看详情"查看完整导诊报告

## 技术架构

- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **AI Engine**: 本地 Medical Navigation Skill（基于教材知识库）
- **State Management**: React Hooks
- **Routing**: React Router

## 项目结构

```
app/Mini_Program/
├── pages/              # 页面组件
│   ├── Chat.tsx       # AI问诊页面
│   ├── ConsultationResult.tsx  # 导诊结果页
│   └── ...
├── services/
│   ├── aiService.ts           # AI服务接口
│   └── localSkillService.ts   # 本地skill实现
├── types/
│   └── consultation.ts        # 类型定义
└── ...
```

## 支持的19种症状

发热、胸痛、腹痛、头痛、咳嗽、呼吸困难、咯血、发绀、心悸、黄疸、呕血与便血、恶心呕吐、腹泻、尿频尿急尿痛、血尿、少尿无尿、水肿、意识障碍、热性惊厥

## 免责声明

本系统提供的导诊建议仅供参考，不构成临床诊断。请务必到正规医疗机构就诊，由医生完成病史采集、体格检查及辅助检查后做出诊断与治疗。如有紧急情况，请立即拨打120。
