
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
    user_eth_address: String,
    title: String,
    nft: String,
    message: String,
    hot: Number,
    staking: Number,
    parentID: String,
    createDate: Date,
    tags: [String]
});

var PostModel = mongoose.model('Post', PostSchema);

module.exports = PostModel;