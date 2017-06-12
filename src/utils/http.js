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
    // 刚启动的时候取出存储起来的  JSESSIONID
    wx.showLoading({
        mask: true,
        title: '小蕨努力加载中...'
    })
    if (method == 'GET'){
        const thirdSession = wx.getStorageSync('thirdSession')
        var session_id = wx.getStorageSync('JSESSIONID');//本地取存储的sessionID
        if (session_id != "" && session_id != null) {
            var header = { 'content-type': 'application/json', 'Cookie': session_id, 'thirdSession': thirdSession }
        } else {
            var header = { 'content-type': 'application/json', 'thirdSession': thirdSession }
        }
        wx.request({
            url: server + url,
            data: data,
            method: method,
            header: header,
            success: function(res){
                if (session_id == "" || session_id == null) {
                    wx.setStorageSync('JSESSIONID', res.header['Set-Cookie'].split(';')[0]) //如果本地没有就说明第一次请求 把返回的session id 存入本地
                }
                wx.hideLoading();
                return typeof cb == "function" && cb(res.data)
            },
            fail: function(data){
                wx.hideLoading();
                return typeof fail == "function" && fail(data)
            }
        })
    }else {
        // POST请求
        const thirdSession = wx.getStorageSync('thirdSession')
        var session_id = wx.getStorageSync('JSESSIONID');//本地取存储的sessionID
        if (session_id != "" && session_id != null) {
            var header = { 'content-type': 'application/x-www-form-urlencoded', 'Cookie': session_id, 'thirdSession': thirdSession }
        } else {
            var header = { 'content-type': 'application/x-www-form-urlencoded', 'thirdSession': thirdSession }
        }
        wx.request({
            url: server + url,
            data: data,
            method: method,
            header: header,
            success: function(res){
                if (session_id == "" || session_id == null) {
                    wx.setStorageSync('JSESSIONID', res.header['Set-Cookie'].split(';')[0]) //如果本地没有就说明第一次请求 把返回的session id 存入本地
                }
                wx.hideLoading();
                return typeof cb == "function" && cb(res.data)
            },
            fail: function(data){
                wx.hideLoading();
                return typeof fail == "function" && fail(data)
            }
        })
    }
}


module.exports = {
    req: req
}