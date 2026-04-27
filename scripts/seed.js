const mongoose = require('mongoose');
const CherryBlossom = require('../src/models/CherryBlossom');
const Prediction = require('../src/models/Prediction');
require('dotenv').config();

const sampleData = [
  {
    name: '上野恩赐公园',
    location: {
      type: 'Point',
      coordinates: [139.7725, 37.7793] // 东京
    },
    prefecture: '东京',
    city: '台东区',
    description: '日本最著名的樱花观赏地，拥有约1200棵樱花树',
    bloomStartDate: new Date('2024-03-25'),
    bloomPeakDate: new Date('2024-04-02'),
    bloomEndDate: new Date('2024-04-10'),
    bloomProbability: 95,
    currentStatus: '开花中',
    temperature: 18,
    humidity: 65,
    photoUrl: 'https://example.com/ueno.jpg',
    website: 'https://www.uenozoo.org/'
  },
  {
    name: '京都哲学之道',
    location: {
      type: 'Point',
      coordinates: [135.7831, 35.0116] // 京都
    },
    prefecture: '京都',
    city: '左京区',
    description: '全长2km的运河沿岸，樱花树成行',
    bloomStartDate: new Date('2024-03-28'),
    bloomPeakDate: new Date('2024-04-05'),
    bloomEndDate: new Date('2024-04-12'),
    bloomProbability: 92,
    currentStatus: '满开',
    temperature: 16,
    humidity: 70,
    photoUrl: 'https://example.com/kyoto.jpg',
    website: 'https://www.kyoto.travel/'
  },
  {
    name: '大阪城公园',
    location: {
      type: 'Point',
      coordinates: [135.5261, 34.6872] // 大阪
    },
    prefecture: '大阪',
    city: '中央区',
    description: '拥有约3000棵樱花树的日本最大樱花公园',
    bloomStartDate: new Date('2024-04-01'),
    bloomPeakDate: new Date('2024-04-08'),
    bloomEndDate: new Date('2024-04-15'),
    bloomProbability: 90,
    currentStatus: '初开',
    temperature: 17,
    humidity: 68,
    photoUrl: 'https://example.com/osaka.jpg',
    website: 'https://www.osakacastlepark.jp/'
  },
  {
    name: '弘前樱花公园',
    location: {
      type: 'Point',
      coordinates: [140.6357, 40.6063] // 青森
    },
    prefecture: '青森',
    city: '弘前市',
    description: '拥有约2600棵樱花树，日本三大樱花地之一',
    bloomStartDate: new Date('2024-04-20'),
    bloomPeakDate: new Date('2024-04-27'),
    bloomEndDate: new Date('2024-05-05'),
    bloomProbability: 88,
    currentStatus: '未开放',
    temperature: 12,
    humidity: 72,
    photoUrl: 'https://example.com/hirosaki.jpg',
    website: 'https://www.hirosaki-kanko.or.jp/'
  },
  {
    name: '高田城遗址公园',
    location: {
      type: 'Point',
      coordinates: [138.9197, 37.5427] // 新潟
    },
    prefecture: '新潟',
    city: '上越市',
    description: '拥有约4000棵樱花树，日本最大规模',
    bloomStartDate: new Date('2024-04-15'),
    bloomPeakDate: new Date('2024-04-23'),
    bloomEndDate: new Date('2024-05-01'),
    bloomProbability: 87,
    currentStatus: '未开放',
    temperature: 14,
    humidity: 70,
    photoUrl: 'https://example.com/takada.jpg',
    website: 'https://www.joetsu-kanko.or.jp/'
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('已连接到 MongoDB');

    // 清空现有数据
    await CherryBlossom.deleteMany({});
    await Prediction.deleteMany({});
    console.log('已清空现有数据');

    // 插入樱花地点
    const cherries = await CherryBlossom.insertMany(sampleData);
    console.log(`已插入 ${cherries.length} 个樱花地点`);

    // 创建预测数据
    const predictions = cherries.map((cherry, index) => ({
      cherrySiteId: cherry._id,
      predictedBloomStart: cherry.bloomStartDate,
      predictedBloomPeak: cherry.bloomPeakDate,
      predictedBloomEnd: cherry.bloomEndDate,
      confidenceLevel: 85 + Math.random() * 15,
      algorithm: ['ML-Model-v1', 'ML-Model-v2', 'Traditional'][index % 3],
      weatherFactors: {
        avgWinterTemp: -2 + Math.random() * 3,
        springTempRate: 0.5 + Math.random() * 1,
        totalChillingHours: 800 + Math.random() * 400,
        recentDaylight: 12 + Math.random() * 2
      },
      historicalData: {
        averageBloomDate: new Date(cherry.bloomPeakDate),
        standardDeviation: 3 + Math.random() * 5,
        samplesCount: 30 + Math.floor(Math.random() * 50)
      },
      satelliteData: {
        ndviIndex: 0.6 + Math.random() * 0.2,
        lastScanDate: new Date()
      }
    }));

    await Prediction.insertMany(predictions);
    console.log(`已插入 ${predictions.length} 个预测数据`);

    console.log('数据库初始化完成！');
    process.exit(0);
  } catch (error) {
    console.error('数据库初始化失败:', error);
    process.exit(1);
  }
}

seedDatabase();
