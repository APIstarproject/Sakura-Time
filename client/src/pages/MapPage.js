import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Box, Card, CardContent, Typography, CircularProgress, Button, TextField, Grid } from '@mui/material';
import L from 'leaflet';
import axios from 'axios';
import { Link } from 'react-router-dom';

// 修复 Leaflet 默认标记图标
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function MapPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [mapCenter, setMapCenter] = useState([37.5, 138]);

  useEffect(() => {
    fetchLocations();
  }, [selectedRegion]);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      let url = 'http://localhost:3000/api/cherries';
      if (selectedRegion) {
        url = `http://localhost:3000/api/cherries/location/${selectedRegion}`;
      }
      const response = await axios.get(url);
      setLocations(response.data);
    } catch (error) {
      console.error('获取位置失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    '未开放': '#999',
    '初开': '#ffb6d9',
    '开花中': '#ff69b4',
    '满开': '#ff1493',
    '落花': '#daa520',
    '未知': '#ccc'
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, color: '#e91e63', fontWeight: 'bold' }}>
        🗺️ 实时樱花位置地图
      </Typography>

      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <TextField
          label="按地区筛选"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          placeholder="例如：东京、京都"
          sx={{ flex: 1 }}
        />
        <Button variant="contained" color="primary" onClick={fetchLocations}>
          搜索
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ height: '600px', overflow: 'hidden', borderRadius: 2 }}>
              <MapContainer
                center={mapCenter}
                zoom={6}
                style={{ width: '100%', height: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> 贡献者'
                />
                {locations.map((location) => (
                  <Marker
                    key={location._id}
                    position={[
                      location.location.coordinates[1],
                      location.location.coordinates[0]
                    ]}
                    icon={L.circleMarker(
                      [
                        location.location.coordinates[1],
                        location.location.coordinates[0]
                      ],
                      {
                        radius: 8,
                        fillColor: statusColors[location.currentStatus],
                        color: '#fff',
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.8
                      }
                    )}
                  >
                    <Popup>
                      <Box sx={{ minWidth: '250px' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                          {location.name}
                        </Typography>
                        <Typography variant="body2">
                          位置: {location.prefecture} {location.city}
                        </Typography>
                        <Typography variant="body2">
                          状态: {location.currentStatus}
                        </Typography>
                        <Typography variant="body2">
                          开放概率: {location.bloomProbability}%
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ mt: 1 }}
                          component={Link}
                          to={`/location/${location._id}`}
                        >
                          查看详情
                        </Button>
                      </Box>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              📍 位置列表 ({locations.length})
            </Typography>
            <Box sx={{ maxHeight: '600px', overflowY: 'auto' }}>
              {locations.map((location) => (
                <Card key={location._id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {location.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {location.prefecture} {location.city}
                    </Typography>
                    <Box sx={{
                      display: 'inline-block',
                      mt: 1,
                      px: 1,
                      py: 0.5,
                      backgroundColor: statusColors[location.currentStatus],
                      color: '#fff',
                      borderRadius: 1,
                      fontSize: '0.75rem'
                    }}>
                      {location.currentStatus}
                    </Box>
                    <Button
                      variant="text"
                      size="small"
                      sx={{ mt: 1, display: 'block' }}
                      component={Link}
                      to={`/location/${location._id}`}
                    >
                      查看详情 →
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default MapPage;
