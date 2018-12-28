// pages/tools/tools.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigator: [
      {
        id:1,
        title: '查询课表',
        path: '/home/home',
      },
      {
        id: 2,
        title: '查询课表',
        path: '/home/home',
      },
      {
        id: 3,
        title: '查询课表',
        path: '/home/home',
      },
      {
        id: 4,
        title: '查询课表',
        path: '/home/home',
      }
    ],
    cnavigator: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const navigator = this.data.navigator;
    const result = [];
    let temp = [];
    navigator.forEach((value, index) => {
      if(temp.length === 3) {
        result.push(temp);
        temp = [];
      }
      temp.push(value);
    });
    if (temp.length !== 0) result.push(temp);
    this.setData({
      cnavigator: result,
    })
    console.log('result', result); 
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