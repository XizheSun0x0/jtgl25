// app.js
App({
  globalData: {
    userInfo: null,
    hasAgreedPrivacy: false, // 新增隐私协议状态
    watchUserInfo: null,
    isDevMode: true // 设置为 false 则禁用开发模式
  },

  onLaunch() {
    this.checkLoginStatus();
  },

  // 检查登录状态
  checkLoginStatus() {
    const that = this;
    
    // 1. 检查本地缓存
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        that.globalData.userInfo = res.data;
        that.checkPrivacyAgreement();
      },
      fail() {
        that.gotoLoginPage();
      }
    });
  },

  // 检查隐私协议
  checkPrivacyAgreement() {
    wx.getStorage({
      key: 'hasAgreedPrivacy',
      success: (res) => {
        this.globalData.hasAgreedPrivacy = res.data;
        if (!res.data) {
          this.gotoPrivacyCheck();
        }
      },
      fail: () => {
        this.gotoPrivacyCheck();
      }
    });
  },

  // 跳转登录页
  gotoLoginPage() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },

  // 跳转隐私协议确认页
  gotoPrivacyCheck() {
    wx.navigateTo({
      url: '/pages/privacy-check/privacy-check'
    });
  },

  // 在app.js的App({})内部添加:
watchUserInfo: null,

setGlobalUserInfo(userInfo) {
  this.globalData.userInfo = userInfo;
  if (this.watchUserInfo) {
    this.watchUserInfo(userInfo);
  }
}
});