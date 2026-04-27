const mongoose = require('mongoose');

const weatherDataSchema = new mongoose.Schema({
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CherryBlossom',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  temperature: {
    min: Number,
    max: Number,
    avg: Number
  },
  humidity: Number,
  precipitation: Number,
  windSpeed: Number,
  windDirection: String,
  cloudCover: Number,
  uvIndex: Number,
  visibility: Number,
  pressure: Number,
  source: String, // 气象数据来源
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 复合索引用于快速查询
weatherDataSchema.index({ locationId: 1, date: -1 });

module.exports = mongoose.model('WeatherData', weatherDataSchema);
