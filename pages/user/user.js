const regeneratorRuntime = require('../../utils/regenerator-runtime/runtime.js');

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    hasUserInfo: false,
  },
  async handleGetUserInfo(evt) {
    await app.initLoginUserInfo();
    this.setData({
      userInfo: app.getUserInfoSync(),
      hasUserInfo: true,
    })
  },
  onLoad() {
    console.log('app.globalData', app.globalData);
    if(app.globalData && app.globalData.hasUserInfo) {
      this.setData({
        userInfo: app.getUserInfoSync(),
        hasUserInfo: app.globalData.hasUserInfo,
      })
    }
  },
})