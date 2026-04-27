import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
  LinearProgress,
  Button,
  Chip
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import axios from 'axios';
import { formatDate } from 'date-fns';
import { zhCN } from 'date-fns/locale';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function PredictionPage() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('high-confidence');

  useEffect(() => {
    fetchPredictions();
  }, [filter]);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      let url = 'http://localhost:3000/api/predictions';
      if (filter === 'high-confidence') {
        url += '?minConfidence=75';
      }
      const response = await axios.get(url);
      setPredictions(response.data);
    } catch (error) {
      console.error('获取预测失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'success';
    if (confidence >= 75) return 'info';
    if (confidence >= 60) return 'warning';
    return 'error';
  };

  const chartData = {
    labels: predictions.slice(0, 10).map(p => p.cherrySiteId?.name || '未知'),
    datasets: [
      {
        label: '置信度 (%)',
        data: predictions.slice(0, 10).map(p => p.confidenceLevel),
        borderColor: '#e91e63',
        backgroundColor: 'rgba(233, 30, 99, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, color: '#e91e63', fontWeight: 'bold' }}>
        📊 樱花开放预测
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
        <Chip
          label="高置信度（75%+）"
          onClick={() => setFilter('high-confidence')}
          variant={filter === 'high-confidence' ? 'filled' : 'outlined'}
          color="primary"
        />
        <Chip
          label="所有预测"
          onClick={() => setFilter('all')}
          variant={filter === 'all' ? 'filled' : 'outlined'}
          color="primary"
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  置信度分布
                </Typography>
                <Line data={chartData} options={{ responsive: true }} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  预测统计
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    总预测数: <strong>{predictions.length}</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    平均置信度: <strong>
                      {predictions.length > 0
                        ? (predictions.reduce((sum, p) => sum + p.confidenceLevel, 0) / predictions.length).toFixed(1)
                        : 0
                      }%
                    </strong>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              📋 预测详情
            </Typography>
            {predictions.map((prediction) => (
              <Card key={prediction._id} sx={{ mb: 2, borderRadius: 2 }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {prediction.cherrySiteId?.name || '未知位置'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {prediction.cherrySiteId?.prefecture} {prediction.cherrySiteId?.city}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2">
                        <strong>预测开花日期:</strong>
                      </Typography>
                      <Typography variant="body2">
                        {formatDate(new Date(prediction.predictedBloomStart), 'MM月dd日', { locale: zhCN })}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2">
                        <strong>预测满开日期:</strong>
                      </Typography>
                      <Typography variant="body2">
                        {formatDate(new Date(prediction.predictedBloomPeak), 'MM月dd日', { locale: zhCN })}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ flex: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={prediction.confidenceLevel}
                            sx={{
                              height: 10,
                              borderRadius: 5,
                              backgroundColor: '#e0e0e0',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: prediction.confidenceLevel >= 75 ? '#4caf50' : '#ff9800'
                              }
                            }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: '45px' }}>
                          {prediction.confidenceLevel}%
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default PredictionPage;
