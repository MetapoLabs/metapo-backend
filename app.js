// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
const Koa = require('koa');
const logger = require('koa-logger');
const router = require('@koa/router')();
const koaBody = require('koa-body');
const router_config = require("./router-config");
const db = require("./db/MongoDB");
const session = require('koa-session');

// 创建一个Koa对象表示web app本身:
const app = new Koa();

app.keys = ['bbs'];
const CONFIG = {
   key: 'koa:sess',   //cookie key (default is koa:sess)
   maxAge: 86400000,  // cookie的过期时间 maxAge in ms (default is 1 days)
   overwrite: true,  //是否可以overwrite    (默认default true)
   httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
   signed: true,   //签名默认true
   rolling: false,  //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
   renew: false,  //(boolean) renew session when session is nearly expired,
};
app.use(session(CONFIG, app));

// app.use(async (ctx, next) => {
//     console.log(`${ctx.request.method} ${ctx.request.url}`); // 打印URL
//     await next(); // 调用下一个middleware
// });

// app.use(async (ctx, next) => {
//     const start = new Date().getTime(); // 当前时间
//     await next(); // 调用下一个middleware
//     const ms = new Date().getTime() - start; // 耗费时间
//     console.log(`Time: ${ms}ms`); // 打印耗费时间
// });

// app.use(async (ctx, next) => {
//     await next();
//     ctx.response.type = 'text/html';
//     ctx.response.body = '<h1>Hello, koa2!</h1>';
// });

app.use(logger());
app.use(koaBody());

router.get('/', list);
router_config.registerRouter(router);
app.use(router.routes());

function list(ctx){
    ctx.body =  {"name":"lee"};
}

db.connect();

// 在端口3000监听:
app.listen(3000);
console.log('app started at port 3000...');