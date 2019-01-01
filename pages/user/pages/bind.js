const utils = require('../../../utils/utils.js');
const regeneratorRuntime = require('../../../utils/regenerator-runtime/runtime.js');
const config = require('../../../config.js');

const {
  log,
  wxRequest,
} = utils;

// pages/user/pages/bind.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sid: '1709102003',
    password: '180457',
  },
  async handleBind(evt) {
    wx.showLoading({
      title: '绑定中',
    });
    const params = {
      sid: this.data.sid,
      password: this.data.password,
    };
    const bindRes = (await wxRequest({
      url: config.api.bind,
      method: 'POST',
    })).data;
    wx.hideLoading();
    if(bindRes.code === 0) {
      wx.navigateBack({});
      wx.showToast({
        title: '绑定成功',
      });
    } else {
      wx.showToast({
        title: '绑定失败',
        icon: 'none',
      });
    }
    
    log('bindRes', bindRes);
  },
  handleReset(evt) {
    this.setData({
      sid: '',
      password: '',
    })
  },
  handleChange(evt) {
    log('evt', evt);
    let name = evt.target.id;
    let value = evt.detail.detail.value;
    this.setData({
      [name]: value,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})