// index.js
// 获取应用实例
const toast = require('../toast/index');
const util = require('../../utils/util');
const app = getApp();
const types = ['default', 'primary', 'warn'];
const pageObject = {
	data: {
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
	onLoad() {
		const that = this;
        console.info(toast);
        app.getLogin();
        that.getBusinessInfo();
        // app.getUserInfo((userInfo) => {
			// // 更新数据
        //     console.info(userInfo);
			// that.setData({
			// 	userInfo,
			// });
        //     console.info(wx.getStorageSync('businessInfo'));
        //     wx.hideLoading();
        // });
	},
};
Page(pageObject);
/*
// 请别再ES5模式下写ES6代码, uglify压缩不支持
function pro(msg) {
	return new Promise((resolve,reject) => {
		setTimeout(() => {
			resolve(msg)
		},1000)
	})
}*/
