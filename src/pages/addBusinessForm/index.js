//index.js
//获取应用实例
var util = require('../../utils/util');
var app = getApp()
var types = ['default', 'primary', 'warn']
var pageObject = {
	data: {
		motto: 'Hello World',
		userInfo: {},
        loading: false,
        plain: false,
		disabled: false,
        waitNumber: 0,
        number: 0,
        isTake: false,
        pass_status: false,
        address: '',
        longtitude: '',
        latitude: '',
        descTextNum: 0,
        businessImage: '',
        businessImgNum: 0,
        businessCarouselNum: 0,
        businessCarouselImage: '',
        businessImage_button_show: true,
        businessCarouselImage_button_show: true,
        businessImagefile: [],
        businessCarouselImagefile: []
	},
	//事件处理函数
	bindViewTap: function() {
		wx.navigateTo({
			url: '../logs/logs'
		})
	},
    getLocation: function () {
	    var that = this;
        wx.getLocation({
            type: 'gcj02', //返回可以用于wx.openLocation的经纬度
            success: function(res) {
                var latitude = res.latitude
                var longitude = res.longitude
                wx.chooseLocation({
                    latitude: latitude,
                    longitude: longitude,
                    scale: 28,
                    fail: function (e) {
                        console.info(e)
                        console.info('fail')
                        wx.showToast({
                            title: '选择位置失败',
                            icon: 'cancel',
                            duration: 2000
                        })
                    },
                    success: function (e) {
                        console.info(e)
                        if (e.errMsg === "chooseLocation:ok") {
                            console.info('ok')
                            var name = e.name;
                            var address = e.address;
                            var latitude = e.latitude;
                            var longitude = e.longitude;
                            that.setData({
                                address: name,
                                longtitude: longitude,
                                latitude: latitude
                            })
                        }
                    },
                    cancel: function (e) {
                        wx.showToast({
                            title: '已取消选择位置',
                            icon: 'cancel',
                            duration: 2000
                        })
                    }
                })
            }
        })
    },
    previewImage: function(e){
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: this.data.files // 需要预览的图片http链接列表
        })
    },
    getImage: function () {
	    var that = this;
	    console.info(this.data.businessImagefile)
	    if (this.data.businessImagefile[0]!=null){
            wx.showToast({
                title: '形象图只需要一张哦~',
                icon: 'info',
                duration: 2000
            })
        }else{
            wx.chooseImage({
                success: function(res) {
                    console.info(res.tempFilePaths)
                    that.setData({
                        businessImagefile: that.data.businessImagefile.concat(res.tempFilePaths)
                    });
                    var tempFilePaths = res.tempFilePaths
                    app.uploader.upload(tempFilePaths[0],'business',function (res) {
                        console.info(res)
                        var data = JSON.parse(res)
                        console.info(data)
                        that.setData({
                            businessImage: data.data,
                            businessImage_button_show: false,
                            businessImgNum: 1
                        })
                    })
                }
            })
        }
    },
    getCarouselImages: function () {
        var that = this;
        console.info(this.data.businessCarouselImagefile)
        if (this.data.businessCarouselImagefile.length >= 4){
            wx.showToast({
                title: '幻灯片最多上传四张哦~',
                icon: 'info',
                duration: 2000
            })
        }else{
            wx.chooseImage({
                success: function(res) {
                    console.info(res.tempFilePaths)
                    that.setData({
                        businessCarouselImagefile: that.data.businessCarouselImagefile.concat(res.tempFilePaths)
                    });
                    var tempFilePaths = res.tempFilePaths
                    app.uploader.upload(tempFilePaths[0],'business',function (res) {
                        console.info(res)
                        var data = JSON.parse(res)
                        console.info(data)
                        that.setData({
                            businessCarouselImage: data.data + "|" + that.data.businessCarouselImage
                        })
                        // 当上传了有四张图片的时候则隐藏上传按钮
                        if (that.data.businessCarouselImagefile.length == 4){
                            that.setData({
                                businessCarouselImage_button_show: false
                            })
                        }
                        // 更新当前拥有几张图片的数字
                        that.setData({
                            businessCarouselNum: that.data.businessCarouselImagefile.length
                        })
                    })
                }
            })
        }
    },
    openTakeChange: function (e){
        let status = e.detail.value===true ? 1 : 0;
        let data = {
            businessId: wx.getStorageSync('businessInfo').businessId,
            isTake: status
        }
        // 状态变化将发送请求给后台修改商家是否开启取号的状态
        app.func.req('/business', data, 'PUT', function (res) {
            if (res.code != -1){
                wx.showToast({
                    title: '操作成功',
                    icon: 'success',
                    duration: 2000
                })
            }else {
                wx.showToast({
                    title: '开通失败，原因：'+res.msg,
                    icon: 'warn',
                    duration: 2000
                })
            }
        })


    },
    formSubmit: function(e) {
        // console.log('form发生了submit事件，携带数据为：', e.detail.value)
		let data = e.detail.value
        console.info(data)
        var that = this;
        app.func.req('/business', data, 'POST', function (res) {
            console.info('.....................')
            console.info(res)
            if (res.code != -1){
                wx.showToast({
                    title: '入驻成功，快去开放你的取号功能吧',
                    icon: 'success',
                    duration: 2000
                })
                wx.reLaunch({
                    url: '../index/index'
                })
            }else {
                wx.showToast({
                    title: '入驻失败，原因：'+res.msg,
                    icon: 'error',
                    duration: 2000
                })
			}
        })
    },
    formReset: function() {
        console.log('form发生了reset事件')
    },
    getBusinessInfo: function () {
        // 获取用户信息之后，判断该用户是否注册过商家
        var that = this;
        app.func.req('/business/getUserBusiness', {}, 'GET', function (res) {
            let data = res.data;
            if (res.code != -1){
                // 显示商家信息即可
                wx.setStorageSync('businessInfo', data.business);
                // 显示商家信息页面
                that.setData({
                    is_show: true,
                    waitNumber: data.waitNumber,
                    number: data.number,
                    isTake: data.business.isTake
                })
                // 如果没有人排队，则不能点击过号和叫号按钮
                if (data.waitNumber == 0){
                    that.setData({
                        pass_status: true
                    })
                }else {
                    that.setData({
                        pass_status: false
                    })
                }
            }else {
                // 显示入驻商家表单页面
                that.setData({
                    is_show: false
                })
            }
        })
    },
    computeTextNum: function (e) {
        let text = e.detail.value;
        var len = 0;
        for (var i=0; i<text.length; i++) {
            if (text.charCodeAt(i)>127 || text.charCodeAt(i)==94) {
                len += 2;
            } else {
                len ++;
            }
        }
        this.setData({
            descTextNum: len
        })
    },
	onLoad: function () {
		console.log('onLoad')
		var that = this
        // wx.showLoading({
        //     mask: true,
        //     title: '小蕨努力加载中...'
        // })
		app.getUserInfo(function(userInfo){
			//更新数据
			that.setData({
				userInfo:userInfo
			})
            that.getBusinessInfo();
        })
        wx.hideLoading();
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
