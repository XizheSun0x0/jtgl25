// 模拟数据库
const users = [];

export default {
  // 注册
  register(userInfo) {
    const user = {
      id: Date.now().toString(),
      name: userInfo.nickName,
      profilePic: userInfo.avatarUrl,
      ptsBalance: 10, // 新用户默认10积分
      phoneNumber: '',
      openid: `mock_openid_${Math.random().toString(36).slice(2)}`
    };
    users.push(user);
    return Promise.resolve(user);
  },

  // 登录
  login(openid) {
    const user = users.find(u => u.openid === openid);
    return Promise.resolve(user || null);
  }
};