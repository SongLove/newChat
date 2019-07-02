// 用于用户的修改获取操作
const Router = require('koa-router')
const router = new Router()
const ModelDB = require('../db')

router.get('/userinfo', async (ctx, next) => {
  ctx.type = 'json'
  let responseData
  let { user_name } = ctx.query
  let data = await new ModelDB('user').query({ user_name })
  console.log('userinfo：' + data)
  if (data) {
    responseData = {
      code: 200,
      data: data,
      msg: '获取账户信息成功'
    }
  } else {
    responseData = {
      code: 0,
      data: [],
      msg: '账户不存在'
    }
  }
  ctx.response.body = responseData
})

module.exports = router.routes()