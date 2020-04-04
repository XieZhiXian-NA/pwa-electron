const Koa = require('koa')
const Router = require('koa-router')
const cors = require('koa2-cors')
const app = new Koa()
const router = new Router()
app.use(cors({
    origin: function (ctx) {
        return ctx.headers.origin; 
    }
}))
router.get('/api/getUser',async ctx=>{
    ctx.body={
        data:'123445'
    }
})
app.use(router.routes())
app.listen(3000,()=>{
    console.log('服务器启动在3000端口')
})