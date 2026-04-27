const express = require('express');
const router = express.Router();
const CherryBlossom = require('../models/CherryBlossom');

// 获取所有樱花观赏地点
router.get('/', async (req, res) => {
  try {
    const { latitude, longitude, distance } = req.query;
    
    let query = {};
    
    // 如果提供了坐标，进行地理查询
    if (latitude && longitude && distance) {
      query = {
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            $maxDistance: parseInt(distance) || 50000 // 默认50km
          }
        }
      };
    }
    
    const cherries = await CherryBlossom.find(query).limit(100);
    res.json(cherries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取单个樱花地点详情
router.get('/:id', async (req, res) => {
  try {
    const cherry = await CherryBlossom.findById(req.params.id);
    if (!cherry) {
      return res.status(404).json({ error: '未找到该樱花地点' });
    }
    res.json(cherry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建新的樱花地点（管理员）
router.post('/', async (req, res) => {
  try {
    const { name, latitude, longitude, prefecture, city, description } = req.body;
    
    const cherry = new CherryBlossom({
      name,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      prefecture,
      city,
      description
    });
    
    await cherry.save();
    res.status(201).json(cherry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 更新樱花地点信息
router.put('/:id', async (req, res) => {
  try {
    const cherry = await CherryBlossom.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastUpdated: Date.now() },
      { new: true }
    );
    if (!cherry) {
      return res.status(404).json({ error: '未找到该樱花地点' });
    }
    res.json(cherry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 删除樱花地点
router.delete('/:id', async (req, res) => {
  try {
    const cherry = await CherryBlossom.findByIdAndDelete(req.params.id);
    if (!cherry) {
      return res.status(404).json({ error: '未找到该樱花地点' });
    }
    res.json({ message: '樱花地点已删除' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取特定地区的樱花地点
router.get('/location/:prefecture', async (req, res) => {
  try {
    const { prefecture } = req.params;
    const cherries = await CherryBlossom.find({ prefecture });
    res.json(cherries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
