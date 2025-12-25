# 🌳 智能选科系统 (The Tree - Smart Subject Selection)

<div align="center">

**基于 AI 的高中生选科决策支持系统**

[![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF.svg)](https://vitejs.dev/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-orange.svg)](https://ai.google.dev/)

</div>

## 📖 项目简介

智能选科系统是一个面向高中生的科学选科决策支持平台，通过整合学生的**成绩数据**、**兴趣爱好**和**职业倾向测试**（Holland 测试），利用 Google Gemini AI 提供个性化的选科建议和职业规划路径。

### 核心价值

- 🎯 **数据驱动**：基于多次考试成绩的综合分析
- 🧠 **AI 智能**：利用 Gemini AI 生成个性化推荐方案
- 📊 **科学测评**：整合 Holland 职业兴趣测试
- 🎨 **现代界面**：流畅的用户体验和精美的可视化报告

## ✨ 核心功能

### 1. 多维度数据采集
- **基本信息**：姓名、性别等基础资料
- **成绩录入**：支持多次考试记录，包含总分、排名、各科成绩
- **兴趣探索**：感兴趣的学科、专业方向、职业领域
- **特长记录**：特殊才能和优势领域

### 2. Holland 职业测试
- 完整的 RIASEC 六维度职业兴趣测评
- 自动计算 Holland 代码（如 IRS、AES 等）
- 可视化展示职业倾向分布

### 3. AI 智能分析
- 基于 Gemini AI 的深度分析
- 生成 3 套选科组合方案（高、中、低匹配度）
- 每套方案包含：
  - 推荐科目组合
  - 匹配度评分
  - 详细推荐理由
  - 对应专业方向
  - 职业发展路径

### 4. 可视化报告
- 成绩趋势图表（基于 Recharts）
- Holland 测试雷达图
- 选科方案对比分析
- 完整的 PDF 导出功能

### 5. 管理员统计
- 用户使用数据统计
- 选科趋势分析
- 系统使用情况监控

## 🛠️ 技术栈

- **前端框架**：React 19.2 + TypeScript 5.8
- **构建工具**：Vite 6.2
- **图表库**：Recharts 3.6
- **AI 服务**：Google Gemini API
- **样式方案**：Tailwind CSS（内联样式）

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd the-tree---smart-subject-selection
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**

   复制 `.env.example` 为 `.env.local`：
   ```bash
   cp .env.example .env.local
   ```

   在 `.env.local` 中设置你的 Gemini API Key：
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **访问应用**

   打开浏览器访问：`http://localhost:5173`

### 构建生产版本

```bash
npm run build
```

构建产物将生成在 `dist/` 目录。

### 预览生产版本

```bash
npm run preview
```

## 📁 项目结构

```
the-tree---smart-subject-selection/
├── components/              # React 组件
│   ├── Layout.tsx          # 布局组件
│   ├── StepIntro.tsx       # 引导页
│   ├── StepGrades.tsx      # 成绩录入
│   ├── StepInterests.tsx   # 兴趣录入
│   ├── StepHolland.tsx     # Holland 测试
│   ├── LoadingAnalysis.tsx # 加载动画
│   ├── Report.tsx          # 分析报告
│   └── AdminDashboard.tsx  # 管理员面板
├── services/               # 服务层
│   └── geminiService.ts    # Gemini AI 接口
├── App.tsx                 # 主应用组件
├── types.ts                # TypeScript 类型定义
├── constants.ts            # 常量配置
└── index.tsx               # 应用入口

```

## 📚 更多文档

- [项目详细文档](./PROJECT_OVERVIEW.md) - 包含系统架构、流程图和详细功能说明
- [部署指南](./DEPLOYMENT.md) - Vercel 部署说明

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

**🤖 Powered by Google Gemini AI**
