//index.js
//获取应用实例
var util = require('../../utils/util');
var app = getApp()
var types = ['default', 'primary', 'warn']
var pageObject = {
	data: {
	},
    getBusinessInfo: function () {
        // 获取用户信息之后，判断该用户是否注册过商家
        var that = this;
        app.func.req('/business/getUserBusiness', {}, 'GET', function (res) {
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
        })
    },
	onLoad: function () {
		var that = this
        wx.showLoading({
            mask: true,
            title: '小蕨努力加载中...'
        })
		app.getUserInfo(function(userInfo){
			//更新数据
            console.info(userInfo)
			that.setData({
				userInfo: userInfo
			})
            console.info(wx.getStorageSync('businessInfo'))
            wx.hideLoading();
            that.getBusinessInfo();
        })
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
