# Sakura-Time
一个基于 React 和 Node.js 的樱花开放预测系统，提供实时樱花开放状态和预测信息。

システム名称：
リアルタイムの桜開花状況と予測情報を提供するReactおよびNode.jsベースのシステム
説明：このシステムは、ReactとNode.jsを基盤とし、リアルタイムの桜開花状況と予測情報を提供します。気象データ（例：冬季の低温期間、春の気温上昇速度）やAIアルゴリズム（過去1200年の開花記録や衛星リモートセンシングデータを統合）を活用し、ユーザーに正確な開花日や満開日を予測します。また、地域ごとの開花マップ（例：東京3月22日開花予想）や確率表示（例：3月25日開花確率70%）機能も搭載しています
## 功能特点

- 实时显示樱花观赏地点
- 地图可视化
- 开花预测图表
- 实时天气数据
- 响应式设计

## 技术栈

- 前端：React, Material-UI, Leaflet, Chart.js
- 后端：Node.js, Express, MongoDB
- 部署：Docker, Docker Compose

## 本地开发

1. 克隆项目
```bash
git clone https://github.com/kemomi/SakuraTime.git
cd SakuraTime
```

2. 安装依赖
```bash
# 安装后端依赖
npm install

# 安装前端依赖
cd client
npm install
cd ..
```

3. 启动开发服务器
```bash
# 启动后端服务
npm run dev

# 启动前端服务（新终端）
cd client
npm run client
```

## Docker 部署

1. 构建镜像
```bash
docker-compose build
```

2. 启动服务
```bash
docker-compose up -d
```

3. 查看日志
```bash
docker-compose logs -f
```

## 环境变量

创建 `.env` 文件并设置以下变量：

```env
MONGODB_URI=mongodb://127.0.0.1:27017/sakura
PORT=3000
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT
# Sakura-Time
