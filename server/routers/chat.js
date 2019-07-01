const ChatContent = require

const Router = require('koa-router')
const router = new Router()

// 发送对话
router.post('/chatwith', async (ctx, next) => {
  console.log('chatwith', ctx.request.body)
  ctx.response.body = {
    aa: '111'
  }
})
router.get('/mock', async(ctx, next) =>{
  console.log('mock', ctx.query)
  ctx.response.body = {
    ddd: 'ssss'
  }
})

module.exports = router.routes()