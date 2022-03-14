var StakingModel = require("./StakeModel");

async function remove_over_staking(diff_num, user_eth_address){
    if(diff_num == 0){
        return;
    }

    var total_num = diff_num;
    while(total_num > 0){
        var model = await StakingModel.find({
            user_eth_address: user_eth_address
        }).limit(1).sort({createDate: 1}).exec();

        if(model.length > 0){
            var num = model[0].staking;
            total_num -= num;
            console.log(model[0]._id);
            await StakingModel.deleteOne({_id: model[0]._id}).exec();
        }
    }


}

/**
 * 查询当前已经质押的总和
 * @param {*} user_eth_address 
 */
async function get_total_staking_num(user_eth_address){
    var total_number = await StakingModel.aggregate([
        {$match:{user_eth_address: user_eth_address, post :{"$ne":null, "$exists": true}}},
        {$group : {_id: "$post", staking_num : {$sum: "$staking"}}}
    ]).exec();
    return total_number[0].staking_num;
}

module.exports = {
    remove_over_staking: remove_over_staking,
    get_total_staking_num: get_total_staking_num
}

const db = require("../db/MongoDB");
db.connect();
remove_over_staking(1, "232131")