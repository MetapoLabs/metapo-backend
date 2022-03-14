
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LoginUserSchema = new Schema({
    user_eth_address: String, //用户钱包地址
    random_nonce: String, //签名验证的随机值
    last_login_date: { type: Date, default: Date.now }, //最后登录时间
    balance:String, //查询所有渠道的USDT,USDC,DAI
    blance_number: Number, //美元总和
    update_balance_date: Date //余额最后的同步时间
});

var UserModel = mongoose.model('User', LoginUserSchema);

module.exports = UserModel;