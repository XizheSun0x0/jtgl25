// pages/home/home.js
import { userStore } from '../../utils/user-store';
Page({
  data: {
    autoplay: true,
    interval: 2000,
    homeTopBannerList: [
      {id: 0, image: '/images/home_top_swipper_1.png'}, 
      {id: 1, image: '/images/home_top_swipper_0.png'}
    ],
    homeGridItem: [
      {id: 0, image: '/images/home_grid_0.png', name: '模拟线路', price: '9', availableAmount: '1'},
      {id: 1, image: '/images/home_grid_1.png', name: '模拟商品', price: '8', availableAmount: '0'}
    ],
    userInfo: null
  },

  onLoad() {
    this.initData();
    this.setupUserListener();
    this.initInventory();
  },

  // 初始化库存状态
  async initInventory() {
    const inventory = userStore.getInventory();
    this.setData({
      homeGridItem: this.data.homeGridItem.map(item => ({
        ...item,
        availableAmount: inventory.find(i => i.id === item.id)?.availableAmount || 0
      }))
    });
  },

  initData() {
    this.setData({ 
      userInfo: userStore.get(),
      // 初始化时标记可购买状态
      homeGridItem: this.data.homeGridItem.map(item => ({
        ...item,
        canPurchase: parseInt(item.availableAmount) > 0
      }))
    });
  },

  setupUserListener() {
    this.unsubscribe = userStore.subscribe((userInfo) => {
      this.setData({ userInfo });
    });
  },

  async onRedeem(e) {
    const itemId = e.currentTarget.dataset.id;
    const selectedItem = this.data.homeGridItem.find(item => item.id == itemId);
    
    // 1. 基础验证
    if (!selectedItem) {
      wx.showToast({ title: '商品不存在', icon: 'none' });
      return;
    }

    // 2. 库存检查
    if (parseInt(selectedItem.availableAmount) <= 0) {
      wx.showModal({
        title: '库存不足',
        content: '该商品已售罄，请选择其他商品',
        showCancel: false,
        confirmText: '知道了'
      });
      return;
    }

    // 3. 积分检查
    const userBalance = parseInt(this.data.userInfo.ptsBalance);
    const itemPrice = parseInt(selectedItem.price);
    
    if (userBalance < itemPrice) {
      wx.showModal({
        title: '积分不足',
        content: `需要 ${itemPrice} 积分\n当前积分: ${userBalance}`,
        confirmText: '去赚积分',
        success: (res) => {
          if (res.confirm) {
            wx.switchTab({ url: '/pages/user/user' });
          }
        }
      });
      return;
    }

    // 4. 确认兑换
    wx.showModal({
      title: '确认兑换',
      content: `确定花费 ${itemPrice} 积分兑换【${selectedItem.name}】吗？`,
      success: async (res) => {
        if (res.confirm) {
          await this.processRedeem(itemId, itemPrice);
        }
      }
    });
  },

  // 修改兑换逻辑
  async processRedeem(itemId, itemPrice) {
    wx.showLoading({ title: '处理中...' });
    
    try {
      // 1. 检查库存
      const currentItem = this.data.homeGridItem.find(i => i.id === itemId);
      if (currentItem.availableAmount <= 0) {
        throw new Error('库存不足');
      }

      // 2. 更新积分
      await userStore.update(user => ({
        ptsBalance: String(parseInt(user.ptsBalance) - itemPrice)
      }));

      // 3. 更新库存（本地+持久化）
      const newAmount = currentItem.availableAmount - 1;
      await userStore.updateInventory(itemId, newAmount);
      
      this.setData({
        [`homeGridItem[${itemId}].availableAmount`]: newAmount
      });

      // 4. 添加交易记录
      await userStore.addTransaction({
        product_id: itemId,
        product_name: currentItem.name,
        points: itemPrice
      });

      wx.showToast({ title: '兑换成功', icon: 'success' });
      
    } catch (error) {
      wx.showToast({ title: error.message, icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  },

  updateItemStock(itemId) {
    this.setData({
      homeGridItem: this.data.homeGridItem.map(item => {
        if (item.id == itemId) {
          const newAmount = parseInt(item.availableAmount) - 1;
          return {
            ...item,
            availableAmount: String(newAmount),
            canPurchase: newAmount > 0 // 更新可购买状态
          };
        }
        return item;
      })
    });
  },

  onUnload() {
    this.unsubscribe?.();
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {
    // console.log(this.data.userInfo)
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {
    // 取消监听
    this.unsubscribe?.();
  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  }
})