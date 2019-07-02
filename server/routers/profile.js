// 用于用户的修改获取操作
const Router = require('koa-router')
const router = new Router()
const ModelDB = require('../db')

router.get('/userinfo', async (ctx, next) => {
  ctx.type = 'json'
  let { user_name } = ctx.query
  let data = await new ModelDB('user').query({ user_name })
  console.log('userinfo：' + data)
  if (data) {
    ctx.response.body = {
      code: 200,
      data: data,
      msg: '获取账户信息成功'
    }
  } else {
    ctx.response.body = {
      code: 0,
      data: [],
      msg: '账户不存在'
    }
  }
})

module.exports = router.routes()