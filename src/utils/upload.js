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

function upload(tempFilePaths,type,cb,err){
    wx.showLoading({
        mask: true,
        title: '小薇努力上传中...'
    })
    const thirdSession = wx.getStorageSync('thirdSession')
    var session_id = wx.getStorageSync('JSESSIONID');//本地取存储的sessionID
    if (session_id != "" && session_id != null) {
        var header = {'Cookie': session_id, 'thirdSession': thirdSession }
    } else {
        var header = {'thirdSession': thirdSession }
    }
    wx.uploadFile({
        url: server + "/upload/singleUpload", //仅为示例，非真实的接口地址
        filePath: tempFilePaths,
        name: 'file',
        header: header,
        formData:{
            "type": type
        },
        success: function(res){
            wx.hideLoading();
            var data = res.data;
            return typeof cb == "function" && cb(res.data)
        },
        fail: function(res){
            wx.hideLoading();
            return typeof err == "function" && err(res)
        }
    })
}


module.exports = {
    upload: upload
}