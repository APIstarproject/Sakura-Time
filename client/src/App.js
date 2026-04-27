import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Box, Button } from '@mui/material';
import MapPage from './pages/MapPage';
import PredictionPage from './pages/PredictionPage';
import LocationDetailPage from './pages/LocationDetailPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserName = localStorage.getItem('userName');
    if (token) {
      setIsAuthenticated(true);
      setUserName(storedUserName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setIsAuthenticated(false);
    setUserName(null);
  };

  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="sticky" sx={{ background: 'linear-gradient(135deg, #e91e63 0%, #f57c00 100%)' }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              🌸 樱花时刻 (Sakura Time)
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {isAuthenticated ? (
                <>
                  <Typography variant="body1" sx={{ alignSelf: 'center' }}>
                    欢迎，{userName}
                  </Typography>
                  <Button color="inherit" href="/profile">
                    个人中心
                  </Button>
                  <Button color="inherit" onClick={handleLogout}>
                    退出
                  </Button>
                </>
              ) : (
                <Button color="inherit" href="/login">
                  登录
                </Button>
              )}
            </Box>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ flex: 1, py: 3 }}>
          <Routes>
            <Route path="/" element={<MapPage />} />
            <Route path="/predictions" element={<PredictionPage />} />
            <Route path="/location/:id" element={<LocationDetailPage />} />
            <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} setUserName={setUserName} />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </Container>

        <Box component="footer" sx={{ 
          backgroundColor: '#f5f5f5', 
          padding: '20px', 
          textAlign: 'center',
          borderTop: '1px solid #ddd'
        }}>
          <Typography variant="body2" color="textSecondary">
            © 2024 樱花时刻。提供最准确的樱花开放预测信息。
          </Typography>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
