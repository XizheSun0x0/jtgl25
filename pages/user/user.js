// pages/user/user.js
import { userStore } from '../../utils/user-store';
const util = require('../../utils/util');

Page({
  data: {
    hasSignedToday: false,
    exchange_records: [
      {id: '11', product_id: '1', product_name: '模拟商品1', points: '100', exchange_time: util.formatTime(new Date())},
      {id: '12', product_id: '2', product_name: '模拟商品2', points: '50', exchange_time: util.formatTime(new Date(Date.now() - 3600000))},
      {id: '13', product_id: '3', product_name: '模拟商品3', points: '200', exchange_time: util.formatTime(new Date(Date.now() - 86400000))}
    ],
    displayedTransactions: [],
    searchKeyword: '',
    isLoading: false
  },

  onLoad() {
    // 初始化数据
    this.setData({ 
      userInfo: userStore.get() 
    });
    
    // 订阅变更
    this.unsubscribe = userStore.subscribe(userInfo => {
      this.setData({ userInfo });
    });
  },

  onUnload() {
    this.unsubscribe?.();
  },

  checkSignStatus() {
    const today = new Date().toDateString();
    this.setData({
      hasSignedToday: wx.getStorageSync('lastSignDate') === today
    });
  },

  async handleSign() {
    if (this.data.hasSignedToday) return;
    
    const success = await userStore.signIn();
    if (success) {
      wx.showToast({ title: '签到成功+1积分', icon: 'success' });
      this.setData({ hasSignedToday: true });
    }
  },

  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          userStore.update(null);
          wx.reLaunch({ url: '/pages/login/login' });
        }
      }
    });
  },

  /*交易记录 */
  // 初始化交易记录
  initTransactions() {
    // 模拟从后端获取数据
    const mockData = [
    {id: '11', product_id: '1', product_name: '模拟商品1', points: '100', exchange_time: util.formatTime(new Date())},
    {id: '12', product_id: '2', product_name: '模拟商品2', points: '50', exchange_time: util.formatTime(new Date(Date.now() - 3600000))},
    {id: '13', product_id: '3', product_name: '模拟商品3', points: '200', exchange_time: util.formatTime(new Date(Date.now() - 86400000))},
    {id: '14', product_id: '4', product_name: '测试商品4', points: '150', exchange_time: util.formatTime(new Date(Date.now() - 172800000))},
    {id: '15', product_id: '5', product_name: '模拟商品5', points: '80', exchange_time: util.formatTime(new Date(Date.now() - 259200000))},
    {id: '16', product_id: '6', product_name: '测试商品6', points: '120', exchange_time: util.formatTime(new Date(Date.now() - 345600000))}
  ];
  
  this.setData({
    allTransactions: mockData,
    displayedTransactions: mockData.slice(0, this.data.pageSize)
  });
},

  // 加载更多交易记录
  loadMoreTransactions() {
    if (!this.data.hasMore || this.data.isLoading) return;
    
    this.setData({ isLoading: true });
    
    // 模拟网络请求延迟
    setTimeout(() => {
      const nextPage = this.data.currentPage + 1;
      const startIndex = (nextPage - 1) * this.data.pageSize;
      const newTransactions = this.data.allTransactions.slice(startIndex, startIndex + this.data.pageSize);
      
      if (newTransactions.length > 0) {
        this.setData({
          displayedTransactions: [...this.data.displayedTransactions, ...newTransactions],
          currentPage: nextPage
        });
      } else {
        this.setData({ hasMore: false });
      }
      
      this.setData({ isLoading: false });
    }, 800);
  },

  // 处理搜索输入
  handleSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value.trim() });
  },

  // 处理搜索确认
  handleSearchConfirm() {
    if (!this.data.searchKeyword) {
      this.resetSearch();
      return;
    }
    
    this.setData({ isLoading: true });
    
    // 1. 先在本地搜索
    const localResults = this.searchLocalTransactions(this.data.searchKeyword);
    
    if (localResults.length > 0) {
      this.setData({
        displayedTransactions: localResults,
        isLoading: false,
        hasMore: false
      });
    } else {
      // 2. 本地没有结果，去后端搜索
      this.searchRemoteTransactions(this.data.searchKeyword);
    }
  },

  // 本地搜索方法（修正后）
  searchLocalTransactions(keyword) {
    if (!keyword.trim()) return this.data.allTransactions;
    
    const lowerKeyword = keyword.toLowerCase();
    return this.data.allTransactions.filter(item => 
      item.product_name.toLowerCase().includes(lowerKeyword)
    );
  },

  // 远程搜索方法（修正后）
  searchRemoteTransactions(keyword) {
    wx.showLoading({
      title: '搜索中...',
    });
    
    // 模拟API请求
    setTimeout(() => {
      wx.hideLoading();
      
      // 这里应该是真实的API调用
      // wx.request({
      //   url: 'your-api-url',
      //   data: { keyword },
      //   success: (res) => {
      //     this.handleSearchResults(res.data);
      //   },
      //   fail: () => {
      //     this.handleSearchResults([]);
      //   }
      // });
      
      // 模拟无搜索结果的情况
      this.handleSearchResults([]);
    }, 1000);
  },

  // 处理搜索结果（修正后）
  handleSearchResults(results) {
    this.setData({
      displayedTransactions: results,
      isLoading: false,
      hasMore: false
    });
    
    // 如果没有结果，显示提示
    if (results.length === 0) {
      wx.showToast({
        title: '没有找到相关交易',
        icon: 'none',
        duration: 2000
      });
    }
  },

  // 重置搜索（修正后）
  resetSearch() {
    this.setData({
      displayedTransactions: this.data.allTransactions.slice(0, this.data.pageSize),
      searchKeyword: '',
      currentPage: 1,
      hasMore: true
    });
  },
  /*交易记录 */

  /*签到模块*/
  checkSignStatus() {
    const lastSignDate = wx.getStorageSync('lastSignDate');
    const today = new Date().toDateString();
    this.setData({
      hasSignedToday: lastSignDate === today
    });
  },

  handleSign: function() {
    if (this.data.hasSignedToday) return;
    
    const today = new Date().toDateString();
    
    this.setData({
      hasSignedToday: true
    });
    
    wx.setStorageSync('lastSignDate', today);
    
    const newPoints = parseInt(this.data.userInfo.ptsBalance) + 1;
    this.setData({
      'userInfo.ptsBalance': newPoints.toString()
    });

    wx.showToast({
      title: '签到成功+1积分',
      icon: 'success'
    });
  },
  /*签到模块*/

  /* other life circle */
  onReady() {},
  onShow() {},
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage() {}
  /* other life circle */
})