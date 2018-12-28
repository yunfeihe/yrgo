import regeneratorRuntime from '/regenerator-runtime/runtime.js';

const app = getApp();

module.exports = {
  async wxRequest(configObject) {
    return new Promise((resolve, reject) => {
      wx.request({
        ...configObject,
        success: function(res) {
          resolve(res);
        },
        fail: function(res) {
          reject(res);
        },
      })
    });
  },
  async wxLogin() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: function (res) {
          resolve(res);
        },
        fail: function (err) {
          reject(err);
        },
      })
    })
  },
  log(...args) {
    const isDebug = true;
    if(isDebug) {
      return console.log(...args);
    } else {

    }
  },
  async wxGetSetting() {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: function(res) {resolve(res)},
        fail: function(err) {reject(err)},
        complete: function(res) {},
      })
    })
  },
  async wxGetUserInfo() {
    return new Promise((resolve, reject) => {
      wx.getUserInfo({
        success: function(res) {resolve(res)},
        fail: function(res) {reject(res)},
      })
    });
  }
}