// pages/privacy-check/privacy-check.js
const app = getApp();

Page({
  data: {
    isAgreed: false
  },

  // 同意协议
  handleAgree() {
    wx.setStorage({
      key: 'hasAgreedPrivacy',
      data: true,
      success: () => {
        app.globalData.hasAgreedPrivacy = true;
        wx.navigateBack();
      }
    });
  },

  // 查看协议
  viewPrivacy() {
    wx.navigateTo({
      url: '/pages/privacy/privacy'
    });
  }
});