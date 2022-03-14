var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StakeSchema = new Schema({
    user_eth_address: String,
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    staking: Number,
    createDate: Date
});

var StakeModel = mongoose.model('Staking', StakeSchema);

module.exports = StakeModel;