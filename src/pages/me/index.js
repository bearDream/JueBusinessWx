//index.js
//获取应用实例
const toast = require('../toast/index');
var util = require('../../utils/util');
console.log(util);
var ajaxurl = require('../../utils/url');
console.log(ajaxurl);
var app = getApp()
Page({
	data: {
		motto: 'Hello World',
		userInfo: {},
		name: '外婆味道',
		avatar: 'http://7xqsim.com1.z0.glb.clouddn.com/LibitLogo.jpg'
	},
    currentTakeTap: function (e) {
		console.info(e)
        toast.showToast({
            title: '暂未开放',
            icon: '../../image/error.png',
            duration: 3000,
        });
    },
    vouchersTap: function (e) {
        console.info(e)
        toast.showToast({
            title: '暂未开放',
            icon: '../../image/error.png',
            duration: 3000,
        });
    },
    dayOrderTap: function (e) {
		console.info(e)
        toast.showToast({
            title: '暂未开放',
            icon: '../../image/error.png',
            duration: 3000,
        });
    },
	//事件处理函数
	bindViewTap: function() {
		wx.navigateTo({
			url: '../logs/logs'
		})
	},
	onLoad: function () {
		console.log('onLoad')
		var that = this
        app.getUserInfo((userInfo) => {
            // 更新数据
            console.info(userInfo);
            that.setData({
                userInfo,
            });
        });
	}
})
/*
// 请别再ES5模式下写ES6代码, uglify压缩不支持
function pro(msg) {
	return new Promise((resolve,reject) => {
		setTimeout(() => {
			resolve(msg)
		},1000)
	})
}*/
