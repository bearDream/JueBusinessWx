// app.js
var http = require("./utils/http")
var uploader = require("./utils/upload")
App({
  onLaunch() {
    // 调用API从本地缓存中获取数据
    const logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
    wx.showLoading({
        mask: true,
        title: '小蕨努力加载中...'
    })
  },
  getUserInfo(cb) {
    const that = this;
    if (this.globalData.userInfo) {
      typeof cb === 'function' && cb(this.globalData.userInfo);
    } else {
      // 调用登录接口
      wx.login({
        success() {
          wx.getUserInfo({
            success(res) {
              console.info('获取用户信息')
                console.info(res)
              that.globalData.userInfo = res.userInfo;
              typeof cb === 'function' && cb(that.globalData.userInfo);
            },
          });
        },
      });
    }
    wx.hideLoading()
  },
  globalData: {
    userInfo: null,
  },
  func:{
      req:http.req
  },
  uploader:{
      upload: uploader.upload
  }
});
