
var PostModel = require("./PostModel");
var mongoose = require('mongoose');
var utils = require("../utils");
var db_utils = require("../db/DBHelper");

/**
 * 返回帖子列表
 * @param {*} ctx 
 */
function list(ctx){
    var page = ctx.request.query.page || 1;
    var pageSize = ctx.request.query.pageSize || 10;
    // console.log("page:" + page);
    return db_utils.pageQuery(page, pageSize, PostModel, '', {}, {createDate:'desc'}, function($page) {
        if(!$page){
            ctx.response.body = utils.Result("failed", "获取失败", null);
        } else {
            // console.log(utils.Result("success", "获取成功", db_utils.pageDataFormat(page,$page.pageCount, pageSize, $page.results)));
            ctx.response.body = utils.Result("success", "获取成功",  $page.results);
        }


    });

}

/**
 * 根据eth地址获取对应的Post队列
 * @param {*} ctx 
 * @returns 
 */
function getListByEthAddress(ctx){
    var eth_address = ctx.params.id;
    return PostModel.find({user_eth_address: eth_address}).then((data) => {
        if(data.length > 0){
            ctx.response.body = utils.Result("success", "获取成功", data);
        } else {
            ctx.response.body = utils.Result("failed", "数据为空", null);
        }
    });
    // ctx.response.body = {"eth_address": eth_address};
}

/**
 * 新增帖子
 * @param {*} ctx 
 */
function add(ctx){
    // console.log("add 方法调用");
    const body = ctx.request.body;
    console.log(body.eth_address);
    var eth_address = body.user_eth_address;
    var post = new PostModel({
        user_eth_address : eth_address, 
        title: body.title, nft: body.nft, 
        message: body.message,
        hot: 0,
        staking: 0,
        parentID: body.parentID,
        createDate: new Date()
    });
    // console.log("add 方法调用 Post");
    return post.save().then((p)=>{
        if(p){
            ctx.response.body = utils.Result("success", "保存成功", null);
        } else {
            ctx.response.body = utils.Result("failed", "保存失败", null);
        }
   
    });

}

function updateHotNumber(ctx){
    var body = ctx.request.body;
    var eth_address = body.user_eth_address;


}


exports.add = add;
exports.list = list;
exports.getListByEthAddress = getListByEthAddress;

