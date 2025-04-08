Page({
  data: {
    showPrivacyPopup : true,
    rememberMe: true, // 默认勾选"记住我"
  },

  onLoad() {
  },

  // 登录按钮点击事件
  handleLogin() {
    wx.switchTab({
      url: '/pages/home/home' // 必须用switchTab跳转TabBar页面
    });
  },

  // 切换"记住我"状态
  toggleRemember() {
    this.setData({
      rememberMe: !this.data.rememberMe
    });
  }
})
