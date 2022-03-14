const recoverPersonalSignature = require("eth-sig-util").recoverPersonalSignature;
const bufferToHex = require('ethereumjs-util').bufferToHex;

const erc20Utils = require("../erc20/erc20_utils");
const stakingUtils = require("../staking/stakingUtils");

var mongoose = require('mongoose');
var utils = require("../utils");
var db_utils = require("../db/DBHelper");
var UserModel = require("./LoginUserModel");


function login(ctx){
    if(ctx.session.isLogin){
        ctx.response.body = "已登录";
    } else {
        var nonce = getRandomNonce().toString();
        // var nonce = "1234567890";
        ctx.session.nonce = nonce;
        ctx.response.body = utils.Result("success", "You need to sign the nonce data", {"nonce": nonce});
    }
}

function auth(ctx){
    if(ctx.session.isLogin || ctx.session.nonce == undefined){
        ctx.response.status = 403;
        return
    }

    var body = ctx.request.body;
    var user_eth_address = body.user_eth_address;
    var signature = body.signMessage;
    var nonce = ctx.session.nonce;
    console.log("nonce" + nonce);
    var msgBufferHex = bufferToHex(Buffer.from(nonce, 'utf8'));
    var decrypt_address = recoverPersonalSignature({
        data: msgBufferHex,
		sig: signature,
    });

    if(user_eth_address.toLowerCase() === decrypt_address.toLowerCase()){
        //验证成功后，开始同步用户的资产数据
        syncUserData(ctx, user_eth_address);

        ctx.session.isLogin = true;
        ctx.response.body = utils.Result("success", "login success", null);
    } else {
        ctx.session.isLogin = false;
        ctx.response.body = utils.Result("failed", "auth failed", null);
    }


}

function isLogin(){
    if(ctx.session.isLogin){
        ctx.response.body = utils.Result("success", "login success", null);
    } else {
        ctx.response.body = utils.Result("failed", "login failed", null);
    }
}


function getRandomNonce(){
   return Math.floor(Math.random() * 1000000);
}

async function syncUserData(ctx, user_eth_address){
    var token_result = await erc20Utils.getBalanceOfAllNet(user_eth_address);
    var total_us = parseInt(erc20Utils.calculate_property(token_result));

    var lastDate = new Date();

    var user_model = await UserModel.findByIdAndUpdate({user_eth_address: user_eth_address}, {last_login_date: lastDate, balance: JSON.stringify(token_result), blance_number: total_us, update_balance_date: lastDate}).exec();
    if(!user_model){
        user_model = new UserModel({user_eth_address: user_eth_address,last_login_date: lastDate, balance: JSON.stringify(token_result), blance_number: total_us, update_balance_date: lastDate});
        user_model.save();
    }
    ctx.session.usermodel = user_model;
    
    //解决质押数量不一致
    var total_staking = await stakingUtils.get_total_staking_num(user_eth_address);
    var diff = total_us - total_staking;
    if(diff < 0){
        await stakingUtils.remove_over_staking(-diff, user_eth_address);
    }

}

module.exports = {
    login:login,
    auth:auth,
    isLogin: isLogin
}