# 樱花时刻快速开始指南

## 最快的开始方式（Docker）

### 前置条件
- Docker & Docker Compose 已安装
- 足够的磁盘空间（约2GB）

### 步骤

1. **启动所有服务**
   ```bash
   docker-compose up -d
   ```

2. **初始化数据库**（第一次运行时）
   ```bash
   docker-compose exec backend npm run seed
   ```

3. **访问应用**
   ```
   http://localhost
   ```

4. **查看日志**
   ```bash
   docker-compose logs -f
   ```

5. **停止服务**
   ```bash
   docker-compose down
   ```

---

## 本地开发（推荐用于开发）

### 前置条件
- Node.js 18+
- MongoDB 6.0+
- npm 或 yarn

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/kemomi/SakuraTime.git
   cd SakuraTime
   ```

2. **配置环境变量**
   ```bash
   cat > .env << EOF
MONGODB_URI=mongodb://127.0.0.1:27017/sakura
PORT=3000
JWT_SECRET=dev-secret-key-change-in-production
NODE_ENV=development
EOF
   ```

3. **安装后端依赖**
   ```bash
   npm install
   ```

4. **安装前端依赖**
   ```bash
   cd client
   npm install
   cd ..
   ```

5. **启动 MongoDB**（如果未运行）
   ```bash
   # macOS (使用 Homebrew)
   brew services start mongodb-community
   
   # Windows (使用 Docker)
   docker run -d -p 27017:27017 --name mongodb mongo:6.0
   
   # Linux
   sudo systemctl start mongod
   ```

6. **初始化数据库**
   ```bash
   npm run seed
   ```

7. **启动开发服务器**

   **终端 1 - 后端服务**
   ```bash
   npm run dev
   ```
   输出应该显示：`樱花时刻服务运行在端口 3000`

   **终端 2 - 前端应用**
   ```bash
   cd client
   npm run client
   ```
   输出应该显示：`On Your Network: http://192.168.x.x:3000`

8. **打开浏览器**
   ```
   http://localhost:3000
   ```

---

## 常见问题

### Q: MongoDB 连接失败怎么办？

**A:** 检查 MongoDB 是否运行
```bash
# 测试连接
mongosh mongodb://127.0.0.1:27017/sakura
```

如果连接失败，使用 Docker 启动 MongoDB：
```bash
docker run -d -p 27017:27017 --name mongo mongo:6.0
```

### Q: 前端连接后端失败？

**A:** 检查后端是否运行在 3000 端口
```bash
curl http://localhost:3000/api/health
```

应该返回：`{"status":"OK","timestamp":"2024-..."}`

### Q: 如何修改数据库中的数据？

**A:** 使用 MongoDB GUI 工具
```bash
# 安装 MongoDB Compass (GUI工具)
# 连接到 mongodb://127.0.0.1:27017
```

### Q: 如何重置数据库？

**A:** 
```bash
# 删除所有数据
npm run seed
```

---

## 项目结构速览

```
sakura-time/
├── server.js              # 后端服务器
├── src/                   # 后端代码
│   ├── models/           # 数据库模型
│   ├── routes/           # API路由
│   └── utils/            # 工具函数
├── client/               # 前端 React 应用
│   └── src/
│       ├── pages/        # 页面组件
│       └── App.js        # 主应用
└── docker-compose.yml    # Docker 配置
```

---

## 开发工作流

### 添加新的 API 端点

1. **创建数据模型**
   ```bash
   # 在 src/models/ 中创建新模型
   vim src/models/MyModel.js
   ```

2. **创建路由**
   ```bash
   # 在 src/routes/ 中创建新路由
   vim src/routes/myroute.js
   ```

3. **在 server.js 中注册路由**
   ```javascript
   const myRoutes = require('./src/routes/myroute');
   app.use('/api/myroute', myRoutes);
   ```

4. **测试 API**
   ```bash
   curl http://localhost:3000/api/myroute
   ```

### 添加新的前端页面

1. **创建页面组件**
   ```bash
   vim client/src/pages/MyPage.js
   ```

2. **在 App.js 中添加路由**
   ```javascript
   import MyPage from './pages/MyPage';
   
   // 在 <Routes> 中添加
   <Route path="/mypage" element={<MyPage />} />
   ```

3. **在导航中添加链接**
   在 AppBar 中添加导航链接

---

## 部署到生产环境

### 使用 Docker Compose（推荐）

1. **更新环境变量**
   ```bash
   cat > .env << EOF
MONGODB_URI=mongodb://user:password@mongodb:27017/sakura?authSource=admin
PORT=3000
JWT_SECRET=your-secure-random-string-here
NODE_ENV=production
EOF
   ```

2. **构建镜像**
   ```bash
   docker-compose build
   ```

3. **启动服务**
   ```bash
   docker-compose up -d
   ```

4. **检查服务状态**
   ```bash
   docker-compose ps
   docker-compose logs -f
   ```

### 监控和维护

```bash
# 查看实时日志
docker-compose logs -f backend

# 重启服务
docker-compose restart backend

# 备份数据库
docker-compose exec mongodb mongodump --out /backup

# 恢复数据库
docker-compose exec mongodb mongorestore /backup
```

---

## 性能优化建议

1. **启用 MongoDB 索引** - 已在模型中配置
2. **启用 Gzip 压缩** - 已在 Nginx 中配置
3. **使用 CDN** - 为静态资源配置 CDN
4. **缓存策略** - 实现 Redis 缓存层

---

## 更新日志

### v1.0.0 (2024-04-27)
- ✅ 初始版本发布
- ✅ 核心功能完成
- ✅ Docker 支持
- ✅ 用户认证系统

---

## 获取帮助

- 📖 查看完整文档：[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
- 🐛 提交 Issue：https://github.com/kemomi/SakuraTime/issues
- 💬 讨论：https://github.com/kemomi/SakuraTime/discussions

---

**祝您使用樱花时刻愉快！** 🌸
