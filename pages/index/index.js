Page({
  onShow() {
    // 检查是否登录（示例用本地存储判断）
    const isLoggedIn = wx.getStorageSync('token');
    if (!isLoggedIn) {
      wx.redirectTo({
        url: '/pages/login/login'
      });
    }
  }
})