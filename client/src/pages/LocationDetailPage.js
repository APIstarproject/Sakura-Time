import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
  Button,
  IconButton,
  LinearProgress
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
  BarElement,
  Title,
  Tooltip,
  Legend
);

function LocationDetailPage() {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchLocationDetails();
  }, [id]);

  const fetchLocationDetails = async () => {
    try {
      setLoading(true);
      const [locationRes, predictionRes, weatherRes] = await Promise.all([
        axios.get(`http://localhost:3000/api/cherries/${id}`),
        axios.get(`http://localhost:3000/api/predictions/${id}`).catch(() => null),
        axios.get(`http://localhost:3000/api/weather/${id}`).catch(() => null)
      ]);

      setLocation(locationRes.data);
      if (predictionRes) setPrediction(predictionRes.data);
      if (weatherRes) setWeather(weatherRes.data);

      // 检查是否在收藏中
      const token = localStorage.getItem('token');
      if (token) {
        const userId = localStorage.getItem('userId');
        try {
          const favRes = await axios.get(
            `http://localhost:3000/api/users/${userId}/favorites`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setIsFavorite(favRes.data.some(fav => fav._id === id));
        } catch (err) {
          console.error('检查收藏失败:', err);
        }
      }
    } catch (error) {
      console.error('获取位置详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token) {
      alert('请先登录');
      return;
    }

    try {
      if (isFavorite) {
        await axios.delete(
          `http://localhost:3000/api/users/${userId}/favorites/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `http://localhost:3000/api/users/${userId}/favorites/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('更新收藏失败:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!location) {
    return <Typography color="error">无法加载位置信息</Typography>;
  }

  const statusColors = {
    '未开放': '#999',
    '初开': '#ffb6d9',
    '开花中': '#ff69b4',
    '满开': '#ff1493',
    '落花': '#daa520',
    '未知': '#ccc'
  };

  const temperatureChartData = weather ? {
    labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    datasets: [
      {
        label: '最高温度 (°C)',
        data: [15, 16, 17, 18, 19, 20, 21],
        borderColor: '#ff6b6b',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        tension: 0.4
      },
      {
        label: '最低温度 (°C)',
        data: [8, 9, 10, 11, 12, 13, 14],
        borderColor: '#4dabf7',
        backgroundColor: 'rgba(77, 171, 247, 0.1)',
        tension: 0.4
      }
    ]
  } : null;

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#e91e63' }}>
                    {location.name}
                  </Typography>
                  <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
                    📍 {location.prefecture} {location.city}
                  </Typography>
                  {location.description && (
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {location.description}
                    </Typography>
                  )}
                </Box>
                <IconButton onClick={handleToggleFavorite}>
                  {isFavorite ? (
                    <FavoriteIcon sx={{ color: '#e91e63', fontSize: '2rem' }} />
                  ) : (
                    <FavoriteBorderIcon sx={{ fontSize: '2rem' }} />
                  )}
                </IconButton>
              </Box>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ p: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                      当前状态
                    </Typography>
                    <Box
                      sx={{
                        display: 'inline-block',
                        mt: 1,
                        px: 1.5,
                        py: 0.5,
                        backgroundColor: statusColors[location.currentStatus],
                        color: '#fff',
                        borderRadius: 1,
                        fontWeight: 'bold'
                      }}
                    >
                      {location.currentStatus}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ p: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                      开花概率
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={location.bloomProbability}
                        sx={{
                          height: 8,
                          borderRadius: 5,
                          mb: 1,
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#e91e63'
                          }
                        }}
                      />
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {location.bloomProbability}%
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ p: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                      温度
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>
                      {location.temperature}°C
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ p: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                      湿度
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>
                      {location.humidity}%
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {prediction && (
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  📅 开花预测
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ p: 1.5, backgroundColor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      预计开花日期
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                      {formatDate(new Date(prediction.predictedBloomStart), 'MM月dd日', { locale: zhCN })}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 1.5, backgroundColor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      预计满开日期
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                      {formatDate(new Date(prediction.predictedBloomPeak), 'MM月dd日', { locale: zhCN })}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 1.5, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                      预测可信度
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={prediction.confidenceLevel}
                      sx={{
                        height: 8,
                        borderRadius: 5,
                        mt: 1,
                        mb: 1,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: prediction.confidenceLevel >= 75 ? '#4caf50' : '#ff9800'
                        }
                      }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {prediction.confidenceLevel}%
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {temperatureChartData && (
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  🌡️ 一周温度预报
                </Typography>
                <Line data={temperatureChartData} options={{ responsive: true }} />
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default LocationDetailPage;
