const express = require('express');
const router = express.Router();
const WeatherData = require('../models/WeatherData');
const CherryBlossom = require('../models/CherryBlossom');

// 获取特定位置的天气数据
router.get('/:locationId', async (req, res) => {
  try {
    const { locationId } = req.params;
    const { days } = req.query;
    
    const lookbackDays = parseInt(days) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - lookbackDays);
    
    const weatherData = await WeatherData.find({
      locationId,
      date: { $gte: startDate }
    }).sort({ date: -1 });
    
    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取当前天气
router.get('/:locationId/current', async (req, res) => {
  try {
    const { locationId } = req.params;
    
    const cherry = await CherryBlossom.findById(locationId);
    if (!cherry) {
      return res.status(404).json({ error: '地点未找到' });
    }
    
    const currentWeather = await WeatherData.findOne({
      locationId
    }).sort({ date: -1 });
    
    res.json({
      location: cherry,
      weather: currentWeather
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建天气数据记录
router.post('/', async (req, res) => {
  try {
    const weatherData = new WeatherData(req.body);
    await weatherData.save();
    res.status(201).json(weatherData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 批量创建天气数据
router.post('/batch', async (req, res) => {
  try {
    const { data } = req.body;
    const result = await WeatherData.insertMany(data);
    res.status(201).json({ count: result.length, data: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 获取预报数据（7天）
router.get('/:locationId/forecast', async (req, res) => {
  try {
    const { locationId } = req.params;
    
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    
    const forecast = await WeatherData.find({
      locationId,
      date: { $gte: now, $lte: futureDate }
    }).sort({ date: 1 });
    
    res.json(forecast);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
