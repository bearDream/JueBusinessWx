var API_URL1 = 'http://localhost:8088/api';
var API_URL2 = 'https://wx.business.chiprincess.cn';

var server = null;
// es6 版本
if(NODE_ENV === 'dev') {
	server = API_URL1;
} else if(NODE_ENV === 'production') {
	server = API_URL2;
}
console.info(server)
module.exports = server;