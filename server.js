const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 数据库连接
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB 已连接'))
.catch(err => console.error('MongoDB 连接错误:', err));

// 路由导入
const cherriesRoutes = require('./src/routes/cherries');
const weatherRoutes = require('./src/routes/weather');
const predictionsRoutes = require('./src/routes/predictions');
const usersRoutes = require('./src/routes/users');

// 路由挂载
app.use('/api/cherries', cherriesRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/predictions', predictionsRoutes);
app.use('/api/users', usersRoutes);

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: '内部服务器错误',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`樱花时刻服务运行在端口 ${PORT}`);
});
