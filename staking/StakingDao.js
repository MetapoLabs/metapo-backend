var StakingModel = require("./StakeModel");
var utils = require("../utils");
var db_utils = require("../db/DBHelper");
var loginUtils = require("../login/LoginUtils");
var stakingUtils = require("./stakingUtils");


async function add(ctx){

    var body = ctx.request.body;
    var postId = body.postId;
    console.log("postid:" + postId);
    
    if(!loginUtils.isLogin){
        ctx.response.body = utils.Result("failed", "未登录", null);
    }

    if(!ctx.session.usermodel){
        ctx.response.body = utils.Result("failed", "用户未同步数据", null);
    }

    var total_assert = ctx.session.usermodel.blance_number;
    var curr_stake_num = await stakingUtils.get_total_staking_num(body.user_eth_address);
    if((curr_stake_num + body.staking) > total_assert){
        ctx.response.body = utils.Result("failed", "质押失败", null);
        return;
    }

    var model = new StakingModel({ user_eth_address:body.user_eth_address, post: body.postID, staking:body.staking,  createDate:new Date()});

    var result = await model.save();
    if(result){
        ctx.response.body = utils.Result("success", "质押成功", null);
    } else{
        ctx.response.body = utils.Result("failed", "质押失败", null);
    }

}

async function remove(ctx){
    var id = ctx.request.query.id;
    var user_eth_address = ctx.request.query.user_eth_address;

    var result = await StakingModel.deleteOne({_id: id}).exec();
    if(result.deletedCount > 0){
        ctx.response.body = utils.Result("success", "移除成功", null);
    } else {
        ctx.response.body = utils.Result("success", "移除失败", null);
    }
  
}

function getStakingList(ctx){
    var query = ctx.request.query;
    var page = query.page;
    var pageSize = query.pageSize;

    return db_utils.pageQuery(page, pageSize, StakingModel, 'post', {user_eth_address:query.user_eth_address}, {createDate:'desc'}, function($page) {
        if(!$page){
            ctx.response.body = utils.Result("failed", "获取失败", null);
        } else {
            // console.log(utils.Result("success", "获取成功", db_utils.pageDataFormat(page,$page.pageCount, pageSize, $page.results)));
            ctx.response.body = utils.Result("success", "获取成功",  $page.results);
        }
    });

}

module.exports = {
    add: add,
    remove: remove,
    list: getStakingList
}
