/**
 * 是否已登录
 * @param {*} ctx 
 * @returns 
 */
function isLogin(ctx){
    return ctx.session.isLogin;
}

module.exports = {
    isLogin: isLogin
}