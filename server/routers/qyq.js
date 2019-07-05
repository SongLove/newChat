const Router = require('koa-router')
const Models = require('../db/model')
const ModelDB = require('../db')
const router = new Router()

router.get('/qyqlist', async (ctx, next) => {
  let responseData
  await Models['qyq'].find(ctx.query)
    .populate(['writer']).then(res => {
      console.log('qyq 组合查询', res)
      if (res) {
        responseData = {
          code: 200,
          data: res.reverse(),
          msg: '所有用户动态'
        }
      } else {
        responseData = {
          code: -1,
          msg: '暂无动态'
        }
      }
    })
  ctx.response.body = responseData
})

module.exports = router.routes()