// pages/login/login.js
import { userStore } from '../../utils/user-store';

Page({
  data: {
    isAgreed: false,
    isDevMode: getApp().globalData.isDevMode
  },

  onLoad() {
    // 开发环境下跳过权限检查
    if (this.data.isDevMode) return;
    
    // 生产环境的权限检查
    wx.getSetting({
      success: (res) => {
        this.setData({ canGetPhoneNumber: res.authSetting['scope.phoneNumber'] || false });
      }
    });
  },

  // 统一登录处理方法
  handleLogin() {
    if (!this.data.isAgreed) {
      wx.showToast({ title: '请先同意协议', icon: 'none' });
      return;
    }

    if (this.data.isDevMode) {
      this.devModeLogin();
    } else {
      this.realLogin();
    }
  },

  // 开发模式登录
  async devModeLogin() {
    wx.showLoading({ title: '开发模式登录中...' });
    
    try {
      // 使用模拟用户数据
      const mockUser = {
        id: 'dev_' + Math.random().toString(36).substr(2, 9),
        name: '测试用户',
        ptsBalance: '100',
        profilePic: '/images/usr_icon.png',
        phoneNumber: '138​12345678'
      };
      
      await userStore.update(mockUser);
      
      wx.hideLoading();
      this.navigateAfterLogin();
      
      wx.showToast({
        title: '开发模式登录成功',
        icon: 'success'
      });
    } catch (error) {
      this.handleLoginError(error);
    }
  },

  // 生产环境登录
  realLogin() {
    wx.showModal({
      title: '需要手机号授权',
      content: '请在真机体验版中测试完整功能',
      showCancel: false
    });
  },

  // 获取手机号按钮点击
  getPhoneNumber(e) {
    if (this.data.isDevMode) return;
    
    if (e.detail.errMsg === "getPhoneNumber:ok") {
      this.processLogin(e.detail);
    } else {
      this.handleLoginError(e.detail);
    }
  },

  // 其他方法保持不变...
  toggleAgree() {
    this.setData({ isAgreed: !this.data.isAgreed });
  },

  navigateAfterLogin() {
    const pages = getCurrentPages();
    if (pages.length > 1) {
      wx.navigateBack();
    } else {
      wx.switchTab({ url: '/pages/home/home' });
    }
  },

  handleLoginError(error) {
    console.error('登录失败:', error);
    wx.showToast({ title: '登录失败', icon: 'none' });
  }
});