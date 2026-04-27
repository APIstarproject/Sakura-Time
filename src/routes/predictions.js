const express = require('express');
const router = express.Router();
const Prediction = require('../models/Prediction');
const CherryBlossom = require('../models/CherryBlossom');

// 获取樱花的开花预测
router.get('/:cherrySiteId', async (req, res) => {
  try {
    const { cherrySiteId } = req.params;
    
    const prediction = await Prediction.findOne({ cherrySiteId })
      .populate('cherrySiteId');
    
    if (!prediction) {
      return res.status(404).json({ error: '未找到预测数据' });
    }
    
    res.json(prediction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建开花预测
router.post('/', async (req, res) => {
  try {
    const prediction = new Prediction(req.body);
    await prediction.save();
    res.status(201).json(prediction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 更新开花预测
router.put('/:id', async (req, res) => {
  try {
    const prediction = await Prediction.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    ).populate('cherrySiteId');
    
    if (!prediction) {
      return res.status(404).json({ error: '未找到预测数据' });
    }
    
    res.json(prediction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 获取所有预测（支持过滤）
router.get('/', async (req, res) => {
  try {
    const { minConfidence, algorithm } = req.query;
    
    let query = {};
    if (minConfidence) {
      query.confidenceLevel = { $gte: parseInt(minConfidence) };
    }
    if (algorithm) {
      query.algorithm = algorithm;
    }
    
    const predictions = await Prediction.find(query)
      .populate('cherrySiteId')
      .sort({ confidenceLevel: -1 });
    
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取区域预测
router.get('/region/:prefecture', async (req, res) => {
  try {
    const { prefecture } = req.params;
    
    // 先获取该地区的所有樱花地点
    const cherries = await CherryBlossom.find({ prefecture });
    const cherryIds = cherries.map(c => c._id);
    
    // 然后获取这些地点的预测
    const predictions = await Prediction.find({
      cherrySiteId: { $in: cherryIds }
    }).populate('cherrySiteId');
    
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取最高置信度的预测
router.get('/top/confident', async (req, res) => {
  try {
    const { limit } = req.query;
    const maxResults = parseInt(limit) || 10;
    
    const topPredictions = await Prediction.find()
      .populate('cherrySiteId')
      .sort({ confidenceLevel: -1 })
      .limit(maxResults);
    
    res.json(topPredictions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
