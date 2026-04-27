# 樱花时刻（Sakura Time）项目结构

```
sakura-time/
├── 📄 README.md                 # 项目文档
├── 📄 package.json              # 后端依赖配置
├── 📄 server.js                 # 后端服务器入口
├── 📄 Dockerfile                # Docker镜像配置
├── 📄 docker-compose.yml        # Docker Compose配置
├── 📄 nginx.conf                # Nginx反向代理配置
├── 📄 .env                      # 环境变量（开发用）
├── 📄 .gitignore                # Git忽略文件
│
├── 📁 src/                      # 后端源代码
│   ├── 📁 models/               # 数据库模型
│   │   ├── CherryBlossom.js     # 樱花地点模型
│   │   ├── Prediction.js        # 开花预测模型
│   │   ├── User.js              # 用户模型
│   │   └── WeatherData.js       # 天气数据模型
│   │
│   ├── 📁 routes/               # API路由
│   │   ├── cherries.js          # 樱花地点路由
│   │   ├── predictions.js       # 预测数据路由
│   │   ├── weather.js           # 天气数据路由
│   │   └── users.js             # 用户认证路由
│   │
│   ├── 📁 utils/                # 工具函数
│   │   ├── dateUtils.js         # 日期工具函数
│   │   └── geoUtils.js          # 地理工具函数
│   │
│   └── 📁 middleware/           # 中间件（待实现）
│       └── auth.js              # 身份验证中间件
│
├── 📁 client/                   # 前端项目
│   ├── 📄 package.json          # 前端依赖配置
│   ├── 📄 public/
│   │   └── index.html           # HTML模板
│   │
│   └── 📁 src/                  # React源代码
│       ├── 📄 index.js          # React应用入口
│       ├── 📄 App.js            # 主应用组件
│       │
│       ├── 📁 pages/            # 页面组件
│       │   ├── MapPage.js       # 地图页面
│       │   ├── PredictionPage.js    # 预测页面
│       │   ├── LocationDetailPage.js# 位置详情页
│       │   ├── LoginPage.js     # 登录注册页
│       │   └── ProfilePage.js   # 个人资料页
│       │
│       ├── 📁 components/       # 可复用组件（待实现）
│       │   └── ...
│       │
│       └── 📁 utils/            # 前端工具（待实现）
│           └── api.js           # API调用库
│
├── 📁 scripts/                  # 脚本文件
│   └── seed.js                  # 数据库初始化脚本
│
└── 📁 docs/                     # 文档目录（待实现）
    ├── API.md                   # API文档
    ├── ARCHITECTURE.md          # 架构设计文档
    └── DEPLOYMENT.md            # 部署指南
```

## 项目功能

### 核心功能
- 🌸 **实时樱花位置地图** - 显示全日本樱花观赏地点
- 📊 **开花预测系统** - AI算法预测樱花开花日期
- 🌡️ **天气数据集成** - 实时天气信息
- 👤 **用户个人中心** - 管理收藏和通知偏好
- 📱 **响应式设计** - 完美适配各类设备

### 技术栈

#### 后端
- **Node.js + Express** - Web服务框架
- **MongoDB** - NoSQL数据库
- **Mongoose** - MongoDB对象模型
- **JWT** - 用户认证

#### 前端
- **React 18** - UI框架
- **Material-UI** - 组件库
- **React Leaflet** - 地图可视化
- **Chart.js** - 数据图表
- **Axios** - HTTP客户端

#### 部署
- **Docker** - 容器化
- **Docker Compose** - 多容器编排
- **Nginx** - 反向代理

## 快速开始

### 开发环境

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd sakura-time
   ```

2. **安装后端依赖**
   ```bash
   npm install
   ```

3. **安装前端依赖**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **配置环境变量**
   ```bash
   # 复制.env文件并修改配置
   cp .env.example .env
   ```

5. **启动 MongoDB**
   ```bash
   # 使用 Docker
   docker run -d -p 27017:27017 mongo:6.0
   ```

6. **初始化数据库**
   ```bash
   npm run seed
   ```

7. **启动开发服务器**
   ```bash
   # 终端1 - 后端
   npm run dev
   
   # 终端2 - 前端
   cd client
   npm run client
   ```

### Docker 部署

1. **构建镜像**
   ```bash
   docker-compose build
   ```

2. **启动服务**
   ```bash
   docker-compose up -d
   ```

3. **访问应用**
   ```
   http://localhost
   ```

## API 端点

### 樱花地点
- `GET /api/cherries` - 获取所有樱花地点
- `GET /api/cherries/:id` - 获取地点详情
- `POST /api/cherries` - 创建新地点
- `PUT /api/cherries/:id` - 更新地点
- `DELETE /api/cherries/:id` - 删除地点

### 预测数据
- `GET /api/predictions` - 获取所有预测
- `GET /api/predictions/:id` - 获取预测详情
- `POST /api/predictions` - 创建预测

### 天气数据
- `GET /api/weather/:locationId` - 获取天气数据
- `POST /api/weather` - 添加天气记录

### 用户认证
- `POST /api/users/register` - 用户注册
- `POST /api/users/login` - 用户登录
- `GET /api/users/:userId` - 获取用户信息

## 环境变量

```env
MONGODB_URI=mongodb://127.0.0.1:27017/sakura
PORT=3000
JWT_SECRET=your-secret-key-here
NODE_ENV=development
WEATHER_API_KEY=your-weather-api-key
```

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

MIT License - 详见 LICENSE 文件

## 联系方式

- 邮箱: contact@sakuratime.com
- 网站: https://sakuratime.com

---

**注意:** 此项目仍在开发中，欢迎提交 Issue 和 Pull Request！
