import React, { useState } from 'react';
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
  Tabs,
  Tab
} from '@mui/material';
import axios from 'axios';

function LoginPage({ setIsAuthenticated, setUserName }) {
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 登录表单状态
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  // 注册表单状态
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      const response = await axios.post('http://localhost:3000/api/users/login', {
        email: loginForm.email,
        password: loginForm.password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user.id);
      localStorage.setItem('userName', response.data.user.username);

      setIsAuthenticated(true);
      setUserName(response.data.user.username);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || '登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      if (registerForm.password !== registerForm.confirmPassword) {
        setError('两次输入的密码不一致');
        return;
      }

      setLoading(true);
      setError('');

      const response = await axios.post('http://localhost:3000/api/users/register', {
        username: registerForm.username,
        email: registerForm.email,
        password: registerForm.password,
        firstName: registerForm.firstName,
        lastName: registerForm.lastName
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user.id);
      localStorage.setItem('userName', response.data.user.username);

      setIsAuthenticated(true);
      setUserName(response.data.user.username);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || '注册失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 5 }}>
        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', color: '#e91e63', mb: 3 }}>
              樱花时刻
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)}>
              <Tab label="登录" />
              <Tab label="注册" />
            </Tabs>

            {tabIndex === 0 ? (
              <Box component="form" onSubmit={handleLoginSubmit} sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  label="邮箱"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="密码"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  margin="normal"
                  required
                />
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  type="submit"
                  disabled={loading}
                  sx={{ mt: 3 }}
                >
                  {loading ? '登录中...' : '登录'}
                </Button>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleRegisterSubmit} sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  label="用户名"
                  value={registerForm.username}
                  onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="邮箱"
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="密码"
                  type="password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="确认密码"
                  type="password"
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="名字（可选）"
                  value={registerForm.firstName}
                  onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="姓氏（可选）"
                  value={registerForm.lastName}
                  onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                  margin="normal"
                />
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  type="submit"
                  disabled={loading}
                  sx={{ mt: 3 }}
                >
                  {loading ? '注册中...' : '注册'}
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default LoginPage;
