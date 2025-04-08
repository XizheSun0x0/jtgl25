// pages/home/home.js
Page({

  /**
   * Page initial data
   */
  data: {
    autoplay: true,
    interval: 2000,
    duration: 500,

    homeTopBannerList :  [{id : 0, image : '/images/home_top_swipper_1.png'}, {id : 1, image : '/images/home_top_swipper_0.png'}],

    homeGridItem : [{id : 0, image : '/images/home_grid_0.png', name : '模拟线路', price : '99', availableAmount : '166'},
    {id : 1, image : '/images/home_grid_1.png', name : '模拟商品', price : '88', availableAmount : '99'}]
  },

  getDemoItems(){
    const initailtem = this.data.homeGridItem;
    const lastItem = initailtem[initailtem.length - 1];

    let nextId = lastItem.id;
    const appandedItems = Array(8).fill(null).reduce((acc)=>{
      acc.push({
        ...lastItem,
        id : ++nextId,
      });
      return acc;
    }, []);
    this.setData({homeGridItem : [...initailtem, ...appandedItems]});
  },

  getSwiperList(){

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    this.getSwiperList();
    this.getDemoItems();
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