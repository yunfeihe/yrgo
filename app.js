import regeneratorRuntime from '/utils/regenerator-runtime/runtime.js';

const utils = require('./utils/utils.js');

const {
  api
} = require('./config.js');

const {
  log,
  wxLogin,
  wxRequest,
  wxGetSetting,
  wxGetUserInfo
} = utils;

const STUDENT = 0;
const TEACHER = 1;

App({
  onLaunch() {
    this.initLoginUserInfo();
  },
  getUserInfoSync() {
    return this.globalData.userInfo;
  },
  async login() {
    let wxCode = await wxLogin();
    let loginRes = await wxRequest({
      url: api.login,
      method: 'POST',
    });  //向服务器请求登陆
    log('login end loginRes', loginRes.data);
    return loginRes.data;
  },
  async setUserInfo(info) {
    try {
      if (this.globalData.userInfo === null) {
        this.globalData.userInfo = {};
      }
      Object.assign(this.globalData.userInfo, info);
    } catch(err) {
      throw err;
    }
    log('globalData.userInfo', this.globalData.userInfo);
  },
  async initLoginUserInfo() {
    let settingRes = await wxGetSetting();
    if(settingRes.authSetting['scope.userInfo']) {
      let raw = (await wxGetUserInfo()).userInfo;
      let userInfo = {};
      Object.assign(userInfo, raw);
      // await this.setUserInfo(userInfo);
      this.globalData.hasUserInfo = true;
      
      const loginData = await this.login();
      if (loginData && loginData.code === 0) {
        wx.setStorageSync('session', loginData.data.session);
        userInfo.isLogined = true;
        userInfo.session = loginData.data.session;
        Object.assign(userInfo, loginData.data.userInfo); //isBinded是服务器直接传过来
      } else {
        wx.showToast({
          title: '登陆失败',
          icon: 'none',
        });
      }
      await this.setUserInfo(userInfo);
      log('initLoginUserInfo end');
    } else {
      wx.showToast({
        title: "请登陆",
        icon: 'none',
        duration: 2000,
      })
      log('initLoginUserInfo not authed');
    }
  },
  globalData:{
    userInfo: null,
    hasUserInfo: false,
  }
})