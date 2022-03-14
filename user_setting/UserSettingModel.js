var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SettingSchema = new Schema({
    user_eth_address: String,
    name: String,
    background: String
});

const SettingModel = mongoose.model('UserSetting', SettingSchema);

module.exports = SettingModel;