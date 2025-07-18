# nonsence

## ⭐⭐⭐ 项目简介

nonsence 是一个专为广告主和平台管理员打造的高效互联网广告投放与管理平台，集广告购买、数据可视化、社区交流于一体，助力广告主精准投放、提升转化。

### 🎯 核心功能

- **广告主中心**：广告购买、管理、充值、数据分析、素材管理一站式完成
- **管理员中心**：广告/发票审核、用户管理、平台数据可视化，保障平台安全高效
- **数据可视化**：多维度广告数据、充值、发票等统计分析，图表一目了然
- **社区讨论**：广告主交流、经验分享、问题互助，打造活跃社区氛围
- **API文档**：完整的接口文档，支持开发者集成和扩展

## 🧠 技术选型

### 前端

- **语言及框架**：JavaScript + React 19.1.0
- **构建工具**：Create React App
- **UI组件**：自定义组件库，响应式设计
- **数据请求**：Axios
- **特效库**：TSParticles（粒子动画效果）
- **样式**：CSS3 + 渐变背景 + 动画效果

#### 前端架构

1. **界面层**：
   - 用户与系统交互的直接接口
   - 包括表单输入、数据展示、交互反馈等
   - 使用组件化设计，保持UI一致性

2. **网络层**：
   - 基于Axios的API请求处理
   - 实现登录认证与状态管理
   - 广告操作导航与数据仪表盘展示

3. **应用模块**：
   - **广告主门户(Advertiser Portal)**：广告创建、充值、数据看板、素材管理
   - **管理员门户(Admin Portal)**：广告审核、用户管理、平台统计、发票管理

### 后端

- **语言及框架**：TypeScript + Node.js
- **云服务**：Laf云函数（Serverless架构）
- **API接口**：RESTful API设计
- **数据库**：MongoDB（用户管理、广告数据、消息系统）
- **部署平台**：Sealos云平台

#### 后端架构

1. **服务层**：
   - 广告投放服务（buyAd.ts, myAds.ts, adsReview.ts）
   - 用户认证服务（loginOrRegister.ts, register.ts）
   - 数据分析服务（platformStats.ts）
   - 素材管理服务（material.ts）
   - 消息系统服务（message.ts, replyMessage.ts, queryMessages.ts）

2. **数据层**：
   - MongoDB数据持久化
   - 云函数API集成
   - 数据安全与验证

### 项目结构

```
nonsence/
├── web/                    # 前端React应用
│   ├── public/            # 静态资源
│   │   ├── favicon.ico    # 网站图标
│   │   ├── image.png      # 图片资源
│   │   ├── index.html     # HTML入口文件
│   │   ├── logo192.png    # 小尺寸Logo
│   │   ├── logo512.png    # 大尺寸Logo
│   │   ├── manifest.json  # PWA配置文件
│   │   └── robots.txt     # 爬虫配置
│   ├── src/               # 源代码
│   │   ├── App.js         # 主应用组件
│   │   ├── App.css        # 应用样式
│   │   ├── index.js       # 入口文件
│   │   ├── index.css      # 全局样式
│   │   ├── Navbar.js      # 导航栏组件
│   │   ├── Navbar.css     # 导航栏样式
│   │   ├── Footer.js      # 页脚组件
│   │   ├── Footer.css     # 页脚样式
│   │   ├── Home.js        # 首页组件
│   │   ├── Home.css       # 首页样式
│   │   ├── About.js       # 关于页面组件
│   │   ├── About.css      # 关于页面样式
│   │   ├── Login.css      # 登录页面样式
│   │   ├── Cases.js       # 案例页面组件
│   │   ├── Cases.css      # 案例页面样式
│   │   ├── Contact.js     # 联系页面组件
│   │   ├── Contact.css    # 联系页面样式
│   │   ├── MessageBoard.js # 留言板组件
│   │   ├── MessageBoard.css # 留言板样式
│   │   ├── ClientCenter.js # 客户中心组件
│   │   ├── ClientCenter.css # 客户中心样式
│   │   ├── AdminCenter.js  # 管理员中心组件
│   │   ├── ApiDoc.js      # API文档组件
│   │   ├── ApiDoc.css     # API文档样式
│   │   ├── reportWebVitals.js # 性能监控
│   │   ├── service-worker.js # PWA服务工作者
│   │   ├── serviceWorkerRegistration.js # PWA注册
│   │   └── setupTests.js  # 测试配置
│   └── package.json       # 前端依赖配置
├── server/                # 后端API服务
│   ├── adsReview.ts       # 广告审核接口
│   ├── auditMessage.ts    # 消息审核接口
│   ├── buyAd.ts           # 广告购买接口
│   ├── invoiceHistory.ts  # 发票历史接口
│   ├── loginOrRegister.ts # 用户认证接口
│   ├── material.ts        # 素材管理接口
│   ├── message.ts         # 消息系统接口
│   ├── myAds.ts           # 我的广告接口
│   ├── platformStats.ts   # 平台统计接口
│   ├── queryMessages.ts   # 消息查询接口
│   ├── recharge.ts        # 充值功能接口
│   ├── rechargeHistory.ts # 充值历史接口
│   ├── register.ts        # 注册功能接口
│   ├── replyMessage.ts    # 回复消息接口
│   └── userAdmin.ts       # 用户管理接口
├── package.json          # 项目根依赖配置
└── README.md             # 项目说明文档
```

## 🚀 快速开始

### 环境要求

- Node.js 16+
- npm 或 yarn
- 现代浏览器（支持ES6+）

### 安装依赖

```bash
# 安装前端依赖
cd web
npm install

# 安装后端依赖
cd ../server
npm install
```

### 启动项目

```bash
# 启动前端开发服务器
cd web
npm start

# 启动后端服务器
cd ../server
npm start
```

访问 `http://localhost:3000` 查看前端应用。

## 🍟 功能特性

### 🎨 用户界面

- **现代化设计**：淡紫色渐变背景，玻璃拟态卡片效果
- **动画效果**：波浪动画、粒子背景、卡片悬停效果
- **响应式布局**：支持PC端和移动端自适应
- **一致性设计**：统一的视觉风格和交互体验

### 👥 用户系统

- **双角色登录**：广告主和管理员独立登录系统
- **权限管理**：基于角色的访问控制
- **用户注册**：新用户注册和验证流程

### 📊 广告管理

- **广告投放**：创建、编辑、投放广告
- **素材管理**：广告素材上传和管理
- **数据统计**：投放效果数据分析
- **广告审核**：管理员审核广告内容

### 💰 财务系统

- **在线充值**：支持多种充值方式
- **发票管理**：发票申请和历史记录
- **消费记录**：详细的消费明细

### 💬 社区功能

- **消息系统**：用户间消息交流
- **讨论区**：广告主经验分享
- **问题反馈**：用户意见和建议收集

## 🎉 项目开发者

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/miwumiwumilumilelu.png" width="100" alt="manbin"><br>
      <b>manbin</b><br>
      Backend Dev & API Design<br>
      System Architecture
    </td>
    <td align="center">
      <img src="https://github.com/Koreyoshi01.png" width="100" alt="Koreyoshi01"><br>
      <b>Koreyoshi01</b><br>
      Frontend Developer<br>
      UI/UX Design
    </td>
    <td align="center">
      <img src="https://github.com/9100my.png" width="100" alt="9100my"><br>
      <b>9100my</b><br>
      Product Manager<br>
      Business Logic & Documentation
    </td>
    <td align="center">
      <img src="https://github.com/cold122.png" width="100" alt="cold122"><br>
      <b>cold</b><br>
      Quality Assurance<br>
      Testing & Integration
    </td>
  </tr>
</table>

## 📱 页面展示

### � 首页
- 平台介绍和功能概览
- 粒子动画背景效果
- 快速导航入口

### 🔐 用户认证
- 广告主和管理员双登录入口
- 美观的玻璃拟态登录界面
- 安全的用户验证机制

### 📢 广告管理
- 广告案例展示页面
- 广告创建和编辑界面
- 实时数据统计dashboard

### 💬 社区交流
- 消息讨论区
- 用户互动功能
- 经验分享平台

### 📚 开发者支持
- 完整的API文档
- 接口示例和参数说明
- 开发者友好的文档结构

## 🌟 特色亮点

- **🎨 现代化UI设计**：采用淡紫色渐变主题，视觉效果优雅
- **⚡ 高性能前端**：React 19 + 优化的组件架构
- **🔧 完善的API**：RESTful设计，支持完整的CRUD操作
- **📱 响应式设计**：完美适配PC端和移动端
- **🛡️ 安全可靠**：完善的用户认证和权限管理
- **🚀 易于部署**：支持云平台一键部署

## 📄 许可证

MIT License

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📞 联系我们

- 📧 邮箱：938770761@qq.com
- 📱 电话：18099338216
- 🏫 地址：华中科技大学软件学院1101

---

*nonsence - 让广告投放更简单，让数据分析更直观！*
