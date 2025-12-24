# 部署指南

本文档介绍如何将「智能选科助手」部署到 Vercel 或 Cloudflare Pages，供国内用户访问。

## 📋 部署前准备

### 1. 获取 DeepSeek API Key

1. 访问 [DeepSeek Platform](https://platform.deepseek.com/api_keys)
2. 登录或注册账号
3. 创建新的 API Key
4. 保存 API Key（后续配置需要）

### 2. 准备代码仓库

将项目推送到 GitHub/GitLab/Bitbucket 等代码托管平台。

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <你的仓库地址>
git push -u origin main
```

---

## 🚀 方案一：部署到 Vercel（推荐）

### 优势
- 部署简单，自动化程度高
- 国内访问速度较快
- 免费额度充足
- 支持自定义域名

### 部署步骤

#### 1. 导入项目

1. 访问 [Vercel](https://vercel.com)
2. 使用 GitHub/GitLab 账号登录
3. 点击「New Project」
4. 选择你的代码仓库
5. 点击「Import」

#### 2. 配置构建设置

Vercel 会自动检测到 Vite 项目，默认配置如下：

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

这些配置已在 `vercel.json` 中预设，无需手动修改。

#### 3. 配置环境变量

在 Vercel 项目设置中添加环境变量：

1. 进入项目 → Settings → Environment Variables
2. 添加以下变量：
   - **Name**: `DEEPSEEK_API_KEY`
   - **Value**: 你的 DeepSeek API Key
   - **Environment**: 选择 Production, Preview, Development

#### 4. 部署

点击「Deploy」按钮，等待部署完成（通常 1-2 分钟）。

#### 5. 访问应用

部署成功后，Vercel 会提供一个 `.vercel.app` 域名，可以直接访问。

### 自定义域名（可选）

1. 进入项目 → Settings → Domains
2. 添加你的自定义域名
3. 按照提示配置 DNS 记录

---

## 🌐 方案二：部署到 Cloudflare Pages

### 优势
- 全球 CDN 加速
- 国内访问速度优秀
- 免费额度充足
- 安全性高

### 部署步骤

#### 1. 创建项目

1. 访问 [Cloudflare Pages](https://pages.cloudflare.com)
2. 登录 Cloudflare 账号
3. 点击「Create a project」
4. 连接你的 Git 仓库

#### 2. 配置构建设置

在构建配置页面填写：

- **Framework preset**: Vite
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/`（默认）

#### 3. 配置环境变量

在「Environment variables」部分添加：

- **Variable name**: `DEEPSEEK_API_KEY`
- **Value**: 你的 DeepSeek API Key

#### 4. 部署

点击「Save and Deploy」，等待部署完成（通常 2-3 分钟）。

#### 5. 访问应用

部署成功后，Cloudflare 会提供一个 `.pages.dev` 域名。

### 自定义域名（可选）

1. 进入项目 → Custom domains
2. 添加你的域名
3. 按照提示配置 DNS 记录

---

## 🇨🇳 国内访问优化

### 1. API 访问问题

**优势**：DeepSeek API 在国内可以直接访问，无需代理！

DeepSeek 是国内 AI 服务，访问速度快且稳定。如果遇到访问问题：
- 检查 API Key 是否有效
- 确认账户余额充足
- 查看 [DeepSeek 文档](https://api-docs.deepseek.com/zh-cn/) 了解更多

### 2. 域名选择

- **Vercel**: `.vercel.app` 域名在国内访问较稳定
- **Cloudflare Pages**: `.pages.dev` 域名在国内访问速度快
- **自定义域名**: 推荐使用国内备案的域名，访问速度最佳

### 3. CDN 加速

如果使用自定义域名，建议：
- 使用国内 CDN 服务（如阿里云、腾讯云）
- 或使用 Cloudflare 的 CDN（国内节点较多）

---

## 🔄 更新部署

### Vercel
每次推送代码到 Git 仓库，Vercel 会自动重新部署。

### Cloudflare Pages
每次推送代码到 Git 仓库，Cloudflare Pages 会自动重新部署。

### 手动触发部署
- **Vercel**: 进入项目 → Deployments → 点击「Redeploy」
- **Cloudflare Pages**: 进入项目 → Deployments → 点击「Retry deployment」

---

## 🐛 常见问题

### 1. 构建失败

**检查**：
- 确保 `package.json` 中的依赖版本正确
- 查看构建日志中的错误信息
- 本地运行 `npm run build` 测试

### 2. 环境变量未生效

**检查**：
- 确保环境变量名称正确：`DEEPSEEK_API_KEY`
- 重新部署项目使环境变量生效
- 查看 `vite.config.ts` 中的环境变量配置

### 3. API 调用失败

**检查**：
- 确保 DeepSeek API Key 有效
- 检查 API 配额是否用尽（访问 [DeepSeek Platform](https://platform.deepseek.com/)）
- 查看浏览器控制台的网络请求
- DeepSeek API 在国内可直接访问，无需代理

---

## 📊 监控与分析

### Vercel Analytics
- 进入项目 → Analytics
- 查看访问量、性能指标等

### Cloudflare Analytics
- 进入项目 → Analytics
- 查看流量、性能、安全指标

---

## 🔒 安全建议

1. **API Key 保护**
   - 不要在代码中硬编码 API Key
   - 使用环境变量管理敏感信息
   - 定期轮换 API Key

2. **访问控制**
   - 考虑添加访问密码或用户认证
   - 限制 API 调用频率

3. **数据隐私**
   - 不要记录用户的个人敏感信息
   - 遵守数据保护法规

---

## 📞 技术支持

如有问题，请：
1. 查看部署平台的官方文档
2. 检查项目的 GitHub Issues
3. 联系项目维护者

---

## 🎉 部署完成

恭喜！你的智能选科助手已成功部署。现在可以分享链接给其他用户使用了。

**下一步**：
- 测试所有功能是否正常
- 配置自定义域名（可选）
- 设置监控和分析
- 收集用户反馈并持续改进
