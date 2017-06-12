//index.js
//获取应用实例
var util = require('../../utils/util');
var toast = require('../toast/index')
var app = getApp()
var types = ['default', 'primary', 'warn']
var pageObject = {
	data: {
		motto: 'Hello World',
		userInfo: {},
        refreshLoading: false,
        plain: false,
		disabled: false,
        smallWaitNumber: 0,
        smallNumber: 0,
        loading: false,
        pass_status: false,
        mediumWaitNumber: 0,
        mediumNumber: 0,
        Mediumloading: false,
        Medium_pass_status: false,
        bigWaitNumber: 0,
        bigNumber: 0,
        bigloading: false,
        big_pass_status: false,
        isTake: false,
        address: '',
        longtitude: '',
        latitude: '',
        descTextNum: 0,
        businessName: '',
        address: '',
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
                        toast.showToast({
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
                        toast.showToast({
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
                toast.showToast({
                    title: '开通失败，原因：' + res.msg,
                    icon: '../../image/error.png',
                    duration: 3000,
                });
            }
        })


    },
    formSubmit: function(e) {
        // console.log('form发生了submit事件，携带数据为：', e.detail.value)
		let data = JSON.stringify(e.detail.value)
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
                that.getBusinessInfo();
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
    callNumber: function () {
        // 发送叫号请求
        var that = this;
        let data = {
            businessId: wx.getStorageSync('businessInfo').businessId,
            number: this.data.smallNumber
        }
        app.func.req('/takeNum/callNum', data, 'GET', function (res) {
            if (res.code != -1){
                wx.showToast({
                    title: '叫号成功',
                    icon: 'success',
                    duration: 2000
                })
            }else {
                wx.showToast({
                    title: '叫号失败，原因：'+res.msg,
                    icon: 'warn',
                    duration: 2000
                })
            }
        })
    },
    passNumber: function () {
        // 发送过号请求
        var that = this;
        let data = {
            businessId: wx.getStorageSync('businessInfo').businessId,
            number: this.data.smallNumber
        }
        app.func.req('/takeNum/passNum', data, 'GET', function (res) {
            if (res.code != -1){
                wx.showToast({
                    title: '过号成功',
                    icon: 'success',
                    duration: 2000
                })
            }else {
                wx.showToast({
                    title: '过号失败，原因：'+res.msg,
                    icon: 'warn',
                    duration: 2000
                })
            }
            that.getBusinessInfo();
        })
    },
    callNumberMedium () {
        // 发送叫号请求
        var that = this;
        let data = {
            businessId: wx.getStorageSync('businessInfo').businessId,
            number: this.data.mediumNumber
        }
        app.func.req('/takeNum/callNum', data, 'GET', function (res) {
            if (res.code != -1){
                wx.showToast({
                    title: '叫号成功',
                    icon: 'success',
                    duration: 2000
                })
            }else {
                toast.showToast({
                    title: '叫号失败，原因：'+res.msg,
                    icon: 'warn',
                    duration: 2000
                })
            }
        })
    },
    passNumberMedium () {
        // 发送过号请求
        var that = this;
        let data = {
            businessId: wx.getStorageSync('businessInfo').businessId,
            number: this.data.mediumNumber
        }
        app.func.req('/takeNum/passNum', data, 'GET', function (res) {
            if (res.code != -1){
                wx.showToast({
                    title: '过号成功',
                    icon: 'success',
                    duration: 2000
                })
            }else {
                toast.showToast({
                    title: '过号失败，原因：'+res.msg,
                    icon: 'warn',
                    duration: 2000
                })
            }
            that.getBusinessInfo();
        })
    },
    getBusinessInfo: function () {
        // 获取商家信息和排队信息
        var that = this;
        app.func.req('/business/getUserBusiness', {}, 'GET', function (res) {
            let data = res.data;
            console.error(res)
            if (res.code != -1){
                // 显示商家信息即可
                wx.setStorageSync('businessInfo', data.business);
                let smallQue = data.queue.smallQue
                let mediumQue = data.queue.mediumQue
                let bigQue = data.queue.bigQue
                // 显示商家信息页面    bigQue
                that.setData({
                    smallWaitNumber: smallQue.length,
                    smallNumber: smallQue.length == 0 ? 0 : smallQue[0].number,
                    mediumWaitNumber: mediumQue.length,
                    mediumNumber: mediumQue.length == 0 ? 0 : mediumQue[0].number,
                    bigWaitNumber: bigQue.length,
                    bigNumber: bigQue.length == 0 ? 0 : bigQue[0].number,
                    isTake: data.business.isTake,
                    businessImage: data.business.businessImage,
                    businessName: data.business.name,
                    address: data.business.address
                })
                console.info("smallQue: "+data.queue.smallQue.length)
                // 如果没有人排队，则不能点击过号和叫号按钮
                if (data.queue.bigQue.length == 0){
                    that.setData({
                        big_pass_status: true
                    })
                }else {
                    that.setData({
                        big_pass_status: false
                    })
                }
                if (data.queue.mediumQue.length == 0){
                    that.setData({
                        Medium_pass_status: true
                    })
                }else {
                    that.setData({
                        Medium_pass_status: false
                    })
                }
                if (data.queue.smallQue.length == 0){
                    that.setData({
                        pass_status: true
                    })
                }else {
                    that.setData({
                        pass_status: false
                    })
                }
            }else {
                toast.showToast({
                    title: '系统错误' + res.mesg,
                    icon: '../../image/error.png',
                    duration: 3000
                })
            }
            that.setData({refreshLoading: false})
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
    refreshClick: function () {
        this.setData({refreshLoading: true})
        this.getBusinessInfo()
    },
	onLoad: function () {
		console.log('首页页面加载')
		var that = this
        wx.showLoading({
            mask: true,
            title: '小蕨努力加载中...'
        })
        app.isLogin()
        this.getBusinessInfo()
        wx.hideLoading()
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
