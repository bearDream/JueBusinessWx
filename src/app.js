// app.js
var http = require("./utils/http")
var toast = require('./pages/toast/index')
var uploader = require("./utils/upload")
App({
  onLaunch() {
    // 调用API从本地缓存中获取数据
    const logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
      try {
          wx.removeStorageSync('JSESSIONID')
      } catch (e) {
          console.info(e)
      }
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
            // 获取用户信息
            wx.getUserInfo({
                success(res) {
                    that.globalData.userInfo = res.userInfo;
                    typeof cb === 'function' && cb(that.globalData.userInfo);
                },
            });
        }
        wx.hideLoading()
    },
  login(cb) {
    const that = this;
      // 调用登录接口
      wx.login({
        success(res) {
          if (res.code) {
            http.req('/mini', {code: res.code}, 'GET', res => {
              // 将session写入storage
              wx.setStorageSync('thirdSession', res.data)
              typeof cb === 'function' && cb(res);
            })
          }
        },
        fail() {
            toast.showToast({
                title: '登录失败',
                icon: '../../image/error.png',
                duration: 2000
            })
        }
      });
    wx.hideLoading()
  },
  isLogin(cb1, cb2) {
      const that = this
      let thirdSession = wx.getStorageSync('thirdSession')
      if (thirdSession) {
          console.info(thirdSession)
          // 将该session发送到后台判断是否登录
          http.req('/mini/isLogin', {thirdSession: thirdSession}, 'GET', res => {
              // 将session写入storage
              if (res.code === -1) {
                  // 未登录，应该调用登录函数
                  typeof cb1 === 'function' && cb1();
                  return
              } else {
                // 获取用户信息
                wx.getUserInfo({
                    success(res) {
                        console.info(res)
                        that.globalData.userInfo = res.userInfo;
                        typeof cb2 === 'function' && cb2(that.globalData.userInfo);
                        return
                    },
                });
              }
          })
      }else {
          typeof cb1 === 'function' && cb1();
      }
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
