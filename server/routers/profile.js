// 用于用户的修改获取操作
const Router = require('koa-router')
const router = new Router()
const ModelDB = require('../db')

const userModel = new ModelDB('user')

router.get('/userinfo', async (ctx, next) => {
  ctx.type = 'json'
  let responseData
  let data = await userModel.query(ctx.query)
  console.log('userinfo：', ctx.query)
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

// 修改用户信息
router.post('/alterinfo', async (ctx, next) => {
  let { user_id, alter } = ctx.request.body
  await userModel.updateOne({ _id: user_id }, alter).then((res) => {
    if (res) {
      ctx.response.body = {
        code: 200,
        msg: '修改用户信息成功'
      }
    }
  })
})

module.exports = router.routes()