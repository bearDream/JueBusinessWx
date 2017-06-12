//index.js
//获取应用实例
var toast = require('../toast/index')
var util = require('../../utils/util');
var app = getApp()
var types = ['default', 'primary', 'warn']
var pageObject = {
	data: {
        userInfo: {}
	},
    getBusinessInfo() {
        // 获取用户信息之后，判断该用户是否注册过商家
        const that = this;
        app.func.req('/business/getUserBusiness', {}, 'GET', res => {
            console.info(res)
            if (res === false) {
                toast.showToast({
                    title: '网络连接失败',
                    icon: '../../image/error.png',
                    duration: 3000,
                });
            } else if (res.code != -1) {
                    // 该用户已经开通了商家，则将页面跳转到index/index
                    wx.switchTab({
                        url: '../index/index',
                    });
                } else {
                    // 该用户还没有开通商家，则将页面跳转到addBusinessForm/index
                    wx.redirectTo({
                        url: '../addBusinessForm/index',
                    });
                }
        }, res => {
            console.info('.....出错啦');
            console.info(res);
        });
    },
	onLoad: function () {
		var that = this
        app.isLogin(function () {
            app.login(function (res) {
                var res = res
                app.getUserInfo(function(userInfo){
                    that.setData({
                        userInfo: userInfo
                    })
                    if (res.code == 2) {
                        // 用户未登录，需要注册
                        var userinfo = that.data.userInfo
                        userinfo['openid'] = res.data
                        app.func.req('/mini/register', userinfo, 'POST', res => {
                            console.info(res)
                            app.login(res => {
                                app.getUserInfo(userInfo => {
                                    that.setData({
                                        userInfo: userInfo
                                    })
                                    that.getBusinessInfo();
                                })
                            })
                        })
                    }else {
                        that.getBusinessInfo();
                    }
                })
            })
        }, function (userInfo) {
            console.info(userInfo)
        })
        wx.hideLoading();
	}
}
Page(pageObject)
