// utils/user-store.js
class UserStore {

  constructor() {
    this._data = null;
    this._transactions = []; // 确保初始化为数组
    this._observers = new Set();
    this._inventory = []; // 新增库存管理
    this._initInventory();
    this._init();
  }

  async _init() {
    try {
      // 初始化用户数据
      const { data } = await wx.getStorage({ key: 'userInfo' });
      this._data = data || this._getDefaultData();
      
      // 初始化交易记录
      const { data: transactions } = await wx.getStorage({ key: 'transactions' });
      this._transactions = transactions || [];
    } catch (error) {
      console.error('初始化失败:', error);
      this._data = this._getDefaultData();
      this._transactions = [];
    }
  }

  async _initInventory() {
    try {
      const { data } = await wx.getStorage({ key: 'inventory' });
      this._inventory = data || this._getDefaultInventory();
    } catch {
      this._inventory = this._getDefaultInventory();
    }
  }

  _getDefaultInventory() {
    return [
      {id: 0, availableAmount: 1}, // 默认库存
      {id: 1, availableAmount: 0}
    ];
  }

  // 统一的观察者订阅方法
  subscribe(callback) {
    this._observers.add(callback);
    return () => this._observers.delete(callback);
  }

  _getDefaultData() {
    return {
      id: '1111',
      name: '金桐',
      ptsBalance: '10',
      profilePic: '/images/usr_icon.png',
      phoneNumber: '13812345678'
    };
  }

  get() {
    return this._data || this._getDefaultData();
  }

  async update(updater) {
    const newData = typeof updater === 'function' 
      ? updater(this._data) 
      : updater;
    
    this._data = { ...this._data, ...newData };
    
    await wx.setStorage({
      key: 'userInfo',
      data: this._data
    });
    
    this._notify();
  }

  _notify() {
    this._observers.forEach(cb => cb(this._data));
  }

  async signIn() {
    const today = new Date().toDateString();
    const lastSignDate = wx.getStorageSync('lastSignDate');
    
    if (lastSignDate === today) return false;
    
    await this.update(user => ({
      ptsBalance: String(parseInt(user.ptsBalance) + 1)
    }));
    
    wx.setStorageSync('lastSignDate', today);
    return true;
  }

  async _initTransactions() {
    try {
      const { data } = await wx.getStorage({ key: 'transactions' });
      this._transactions = data || [];
    } catch {
      this._transactions = [];
    }
  }

  // 添加交易记录（修复版）
  async addTransaction(transaction) {
    if (!transaction || typeof transaction !== 'object') {
      throw new Error('无效的交易记录');
    }

    // 确保有必要的字段
    const completeTransaction = {
      id: Date.now().toString(),
      exchange_time: new Date().toLocaleString(),
      ...transaction
    };

    this._transactions = [completeTransaction, ...this._transactions];
    
    try {
      await wx.setStorage({
        key: 'transactions',
        data: this._transactions
      });
      this._notify();
    } catch (error) {
      console.error('保存交易记录失败:', error);
      throw error;
    }
  }

  getTransactions() {
    return [...this._transactions]; // 返回副本
  }

  // 更新库存
  async updateInventory(itemId, newAmount) {
    this._inventory = this._inventory.map(item => 
      item.id === itemId ? {...item, availableAmount: newAmount} : item
    );
    
    await wx.setStorage({
      key: 'inventory',
      data: this._inventory
    });
  }

  // 获取库存
  getInventory() {
    return [...this._inventory];
  }

}

export const userStore = new UserStore();