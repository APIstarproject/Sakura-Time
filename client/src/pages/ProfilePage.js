import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  CircularProgress,
  Grid,
  Switch,
  FormControlLabel
} from '@mui/material';
import axios from 'axios';

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      navigate('/login');
      return;
    }

    fetchUserProfile(userId, token);
  }, [navigate]);

  const fetchUserProfile = async (userId, token) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data);
      setFavorites(response.data.favorites || []);
    } catch (error) {
      console.error('获取用户信息失败:', error);
      setMessage('获取用户信息失败');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    try {
      setSaving(true);
      await axios.put(
        `http://localhost:3000/api/users/${userId}`,
        {
          firstName: user.firstName,
          lastName: user.lastName,
          region: user.region,
          notificationPreferences: user.notificationPreferences
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('个人信息更新成功');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('更新失败:', error);
      setMessage('更新失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Typography color="error">无法加载用户信息</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#e91e63', mb: 3 }}>
          👤 个人中心
        </Typography>

        {message && <Alert severity={message.includes('成功') ? 'success' : 'error'} sx={{ mb: 2 }}>{message}</Alert>}

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  基本信息
                </Typography>
                <Box component="form" onSubmit={handleUpdateProfile} sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="用户名"
                    value={user.username}
                    disabled
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="邮箱"
                    type="email"
                    value={user.email}
                    disabled
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="名字"
                    value={user.firstName || ''}
                    onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="姓氏"
                    value={user.lastName || ''}
                    onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="地区"
                    value={user.region || ''}
                    onChange={(e) => setUser({ ...user, region: e.target.value })}
                    margin="normal"
                    placeholder="例如：东京、京都"
                  />

                  <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3, mb: 2 }}>
                    通知偏好设置
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={user.notificationPreferences?.bloomReminder || false}
                        onChange={(e) => setUser({
                          ...user,
                          notificationPreferences: {
                            ...user.notificationPreferences,
                            bloomReminder: e.target.checked
                          }
                        })}
                      />
                    }
                    label="开花提醒"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={user.notificationPreferences?.weatherAlerts || false}
                        onChange={(e) => setUser({
                          ...user,
                          notificationPreferences: {
                            ...user.notificationPreferences,
                            weatherAlerts: e.target.checked
                          }
                        })}
                      />
                    }
                    label="天气警报"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={user.notificationPreferences?.newLocations || false}
                        onChange={(e) => setUser({
                          ...user,
                          notificationPreferences: {
                            ...user.notificationPreferences,
                            newLocations: e.target.checked
                          }
                        })}
                      />
                    }
                    label="新增地点通知"
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    type="submit"
                    disabled={saving}
                    sx={{ mt: 3 }}
                  >
                    {saving ? '保存中...' : '保存修改'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  📊 用户统计
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    收藏数: <strong>{favorites.length}</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    账户状态: <strong>活跃</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    加入时间: <strong>
                      {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                    </strong>
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {favorites.length > 0 && (
              <Card sx={{ borderRadius: 2, mt: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    ❤️ 我的收藏
                  </Typography>
                  {favorites.map((location) => (
                    <Box
                      key={location._id}
                      sx={{
                        p: 1,
                        backgroundColor: '#f5f5f5',
                        borderRadius: 1,
                        mb: 1
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {location.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {location.prefecture} {location.city}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default ProfilePage;
