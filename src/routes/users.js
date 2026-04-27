const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 用户注册
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;
    
    // 检查用户是否已存在
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: '该邮箱已被注册' });
    }
    
    user = new User({
      username,
      email,
      password,
      firstName,
      lastName
    });
    
    await user.save();
    
    // 生成JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 用户登录
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }
    
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }
    
    // 更新最后登录时间
    user.lastLogin = Date.now();
    await user.save();
    
    // 生成JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取用户信息
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('favorites');
    
    if (!user) {
      return res.status(404).json({ error: '用户未找到' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 更新用户信息
router.put('/:userId', async (req, res) => {
  try {
    const { firstName, lastName, region, notificationPreferences } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { firstName, lastName, region, notificationPreferences },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: '用户未找到' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 添加收藏
router.post('/:userId/favorites/:cherrySiteId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: '用户未找到' });
    }
    
    if (!user.favorites.includes(req.params.cherrySiteId)) {
      user.favorites.push(req.params.cherrySiteId);
      await user.save();
    }
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 移除收藏
router.delete('/:userId/favorites/:cherrySiteId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: '用户未找到' });
    }
    
    user.favorites = user.favorites.filter(
      id => id.toString() !== req.params.cherrySiteId
    );
    await user.save();
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 获取用户收藏
router.get('/:userId/favorites', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('favorites');
    
    if (!user) {
      return res.status(404).json({ error: '用户未找到' });
    }
    
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
