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
    }
    wx.hideLoading()
  },
  getLogin () {
      wx.checkSession({
          success: function(){
              //session 未过期，并且在本生命周期一直有效
              console.info('已经登陆了。。。')
          },
          fail: function(){
              //登录态过期
              wx.login({
                  success: function(res) {
                      if (res.code){
                          http.req('/mini', {
                              code: res.code
                          }, 'GET', res => {
                              console.info(res)
                          })
                          wx.getUserInfo({
                              success(res) {
                                  console.info('获取用户信息')
                                  console.info(res)
                                  that.globalData.userInfo = res.userInfo;
                                  typeof cb === 'function' && cb(that.globalData.userInfo);
                              },
                          });
                      }
                  },
              });
          }
      })
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
