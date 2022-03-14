var PostDao = require("./post/PostDao");
var SettingDao = require("./user_setting/UserSettingDao");
var stakingDao = require("./staking/StakingDao");
var loginDao = require("./login/LoginDao");

function registerRouter (router){
    router.get('/post/list', PostDao.list);
    router.post('/post/add', PostDao.add);
    router.get('/post/getListByEthAddress/:id', PostDao.getListByEthAddress);

    router.post("/setting/save", SettingDao.saveSetting);
    router.get("/setting/get", SettingDao.getSetting);

    router.post("/staking/add", stakingDao.add);
    router.all("/staking/remove", stakingDao.remove);
    router.all("/staking/list", stakingDao.list);

    //登录相关接口
    router.post("/login", loginDao.login);
    router.post("/login/auth", loginDao.auth);
    router.get("/login/islogin", loginDao.isLogin);

    console.log("Post路由注册成功");
}

exports.registerRouter = registerRouter;