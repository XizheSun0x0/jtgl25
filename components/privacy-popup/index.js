Component({

  properties: {
    checked: Boolean
  },

  methods: {
    toggleCheck() {
      this.setData({
        checked: !this.data.checked
      })
      this.triggerEvent('change', { value: this.data.checked })
    },

    // 同意协议（永久记录）
    agreePrivacy() {
      wx.setStorageSync('hasAgreedPrivacy', true); // 持久化存储
      this.triggerEvent('agree');
    },
    
    // 不同意退出
    exitMiniProgram() {
      wx.clearStorageSync(); // 清空所有记录
      wx.exitMiniProgram();
    }
  }
})