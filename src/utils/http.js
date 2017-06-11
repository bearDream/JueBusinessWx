/**
 * Created by soft01 on 2017/5/24.
 */

var API_URL1 = 'http://localhost:8888/api/mobile';
var API_URL2 = 'https://wx.business.chiprincess.cn/api/mobile';

var server = null;
// es6 版本
if(NODE_ENV === 'dev') {
    server = API_URL1;
} else if(NODE_ENV === 'production') {
    server = API_URL2;
}

console.info(server)

function req(url,data,method,cb,fail){
    wx.showLoading({
        mask: true,
        title: '小蕨努力加载中...'
    })
    wx.request({
        url: server + url,
        data: data,
        method: method,
        header: {'Content-Type': 'application/json'},
        success: function(res){
            wx.hideLoading();
            return typeof cb == "function" && cb(res.data)
        },
        fail: function(data){
            wx.hideLoading();
            return typeof fail == "function" && fail(data)
        }
    })
}


module.exports = {
    req: req
}