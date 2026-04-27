const mongoose = require('mongoose');

const cherryBlossomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      index: '2dsphere'
    }
  },
  prefecture: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  description: String,
  bloomStartDate: Date,
  bloomPeakDate: Date,
  bloomEndDate: Date,
  bloomProbability: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  currentStatus: {
    type: String,
    enum: ['未开放', '初开', '开花中', '满开', '落花', '未知'],
    default: '未知'
  },
  temperature: {
    type: Number,
    default: null
  },
  humidity: {
    type: Number,
    default: null
  },
  visitorsCount: {
    type: Number,
    default: 0
  },
  photoUrl: String,
  website: String,
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 创建 2dsphere 地理索引
cherryBlossomSchema.index({ 'location': '2dsphere' });

module.exports = mongoose.model('CherryBlossom', cherryBlossomSchema);
