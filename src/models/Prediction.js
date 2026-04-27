const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  cherrySiteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CherryBlossom',
    required: true
  },
  predictedBloomStart: {
    type: Date,
    required: true
  },
  predictedBloomPeak: {
    type: Date,
    required: true
  },
  predictedBloomEnd: Date,
  confidenceLevel: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  algorithm: {
    type: String,
    enum: ['ML-Model-v1', 'ML-Model-v2', 'Traditional'],
    default: 'ML-Model-v1'
  },
  weatherFactors: {
    avgWinterTemp: Number,
    springTempRate: Number,
    totalChillingHours: Number,
    recentDaylight: Number
  },
  historicalData: {
    averageBloomDate: Date,
    standardDeviation: Number,
    samplesCount: Number
  },
  satelliteData: {
    ndviIndex: Number,
    lastScanDate: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

module.exports = mongoose.model('Prediction', predictionSchema);
