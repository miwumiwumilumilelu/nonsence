# 广告投放平台 (Ad Platform)

## 项目简介
这是一个基于Django和Vue.js的现代广告投放平台，提供广告管理、投放控制和数据统计功能。

## 功能特性
- 用户认证与授权
  - 用户注册和登录
  - JWT token认证
  - 权限管理（广告主/管理员）

- 广告管理
  - 创建和编辑广告
  - 广告素材上传
  - 广告预览
  - 广告审核流程
  - 广告状态控制（激活/暂停）

- 数据统计
  - 广告展示次数统计
  - 点击量统计
  - 预算控制
  - 投放时间管理

## 技术栈
### 后端
- Python 
- Django 4.2.7
- Django REST Framework
- PostgreSQL
- JWT认证

### 前端
- Vue.js
- Element Plus UI
- Axios
- Pinia
- Vue Router
- SASS/SCSS

## 开始使用

### 环境要求
- Python 
- Node.js 14+
- PostgreSQL

### 后端设置
1. 进入后端目录：
```bash
cd backend
```

2. 安装依赖：
```bash
pip install -r requirements.txt
```

3. 配置数据库：
```bash
python manage.py migrate
```

4. 创建超级用户：
```bash
python manage.py createsuperuser
```

5. 启动开发服务器：
```bash
python manage.py runserver
```

### 前端设置
1. 进入前端目录：
```bash
cd frontend
```

2. 安装依赖：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm run dev
```

## API文档
API文档可在开发服务器运行时访问：
- http://localhost:8000/api/docs/

## 主要功能说明

### 广告管理
- 创建广告：POST `/api/ads/ads/`
- 获取广告列表：GET `/api/ads/ads/`
- 更新广告：PATCH `/api/ads/ads/{id}/`
- 审核广告：POST `/api/ads/ads/{id}/review/`
- 激活广告：POST `/api/ads/ads/{id}/activate/`
- 暂停广告：POST `/api/ads/ads/{id}/pause/`

### 用户管理
- 用户注册：POST `/api/users/register/`
- 用户登录：POST `/api/users/login/`
- 修改密码：POST `/api/users/change_password/`

## 开发团队
- 后端开发：[Your Name]
- 前端开发：[Your Name]

## 许可证
MIT License
