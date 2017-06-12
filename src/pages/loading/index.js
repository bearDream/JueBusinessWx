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
    getBusinessInfo: function () {
        // 获取用户信息之后，判断该用户是否注册过商家
        var that = this;
        app.func.req('/business/getUserBusiness', {}, 'GET', function (res) {
            console.info(res)
            if (res === false) {
                toast.showToast({
                    title: '网络连接失败',
                    icon: '../../image/error.png',
                    duration: 3000
                })
            }else {
                if (res.code != -1){
                    // 该用户已经开通了商家，则将页面跳转到index/index
                    wx.reLaunch({
                        url: '../index/index'
                    })
                }else {
                    // 该用户还没有开通商家，则将页面跳转到addBusinessForm/index
                    wx.reLaunch({
                        url: '../addBusinessForm/index'
                    })
                }
            }
        }, function (res) {
            console.info('.....出错啦')
            console.info(res)
        })
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
                    console.error(that.data.userInfo)
                    if (res.code == 2) {
                        // 用户未登录，需要注册
                        console.info(res.data)
                        var userinfo = that.data.userInfo
                        userinfo['openid'] = res.data
                        console.info(userinfo)
                        app.func.req('/mini/register', userinfo, 'POST', res => {
                            console.info(res)
                        })
                    }
                    wx.hideLoading();
                    that.getBusinessInfo();
                })
                that.getBusinessInfo();
            })
        }, function (userInfo) {
            console.info(userInfo)
        })
        // app.getUserInfo(function(userInfo){
			// //更新数据
        //     console.info(userInfo)
			// that.setData({
			// 	userInfo: userInfo
			// })
        //     console.info(wx.getStorageSync('businessInfo'))
        //     wx.hideLoading();
        //     that.getBusinessInfo();
        // })
	}
}
Page(pageObject)
/*
// 请别再ES5模式下写ES6代码, uglify压缩不支持
function pro(msg) {
	return new Promise((resolve,reject) => {
		setTimeout(() => {
			resolve(msg)
		},1000)
	})
}*/
