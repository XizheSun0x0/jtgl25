// utils/user-store.js
class UserStore {
  constructor() {
    this._data = null;
    this._observers = new Set();
    this._init();
  }

  // 统一的观察者订阅方法
  subscribe(callback) {
    this._observers.add(callback);
    return () => this._observers.delete(callback);
  }

  async _init() {
    try {
      const { data } = await wx.getStorage({ key: 'userInfo' });
      this._data = data || this._getDefaultData();
    } catch {
      this._data = this._getDefaultData();
    }
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
}

export const userStore = new UserStore();