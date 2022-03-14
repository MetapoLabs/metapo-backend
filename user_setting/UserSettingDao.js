var SettingModel = require("./UserSettingModel");
var mongoose = require('mongoose');
var utils = require("../utils");
// const erc20Utils = require("../erc20/erc20_utils");
/**
 * 保存用户设置信息
 * @param {*} ctx 
 * @returns 
 */
async function saveSetting(ctx){
    var body = ctx.request.body;
    var eth_address = body.user_eth_address;
    console.log("eth_address" + eth_address);
    var setting = await SettingModel.findOneAndUpdate({user_eth_address: eth_address}, { name : body.name, background: body.background}).exec();
    // console.log(setting);
    if(setting){
        ctx.response.body = utils.Result("success", "保存成功", null);
    } else {
        setting = new SettingModel({user_eth_address: eth_address, name : body.name, background: body.background});
        // console.log(setting);
        return setting.save().then((s)=>{
            if(s){
                ctx.response.body = utils.Result("success", "保存成功", null);
            } else {
                ctx.response.body = utils.Result("failed", "保存失败", null);
            }
            
        });
    }
   

}

async function getSetting(ctx){
    var query = ctx.request.query;
    var user_eth_address = query.user_eth_address;
    console.log(user_eth_address);

    // erc20Utils.getBalanceOfAllNet("0x28C6c06298d514Db089934071355E5743bf21d60").then(function(result){
    //     console.log("result");
    //     console.log(result);
    // });
    
    var model = await SettingModel.findOne({user_eth_address: user_eth_address}).exec();
    if(model){
        ctx.response.body = utils.Result("success", "获取成功", model);
    } else {
        ctx.response.body = utils.Result("failed", "获取失败", null);
    }
}

exports.saveSetting = saveSetting;
exports.getSetting = getSetting;