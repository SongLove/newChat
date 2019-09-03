const Router = require('koa-router')
const Models = require('../db/model')
const ModelDB = require('../db')
const router = new Router()

let responseData

router.get('/', async (ctx, next) => {
  const { search, type } = ctx.query
  if (search) {
    if (type === 'user') {
      await Models['user'].find({ user_name: new RegExp(search) })
        .then(res => {
          responseData = res
        })
    } else if (type === 'circle') {
      await Models['qyq'].find({ content: new RegExp(search) }).populate(['writer', 'comments'])
        .then(res => {
          responseData = res
        })
    }
  } else {
    responseData = []
  }
  ctx.response.body = {
    code: 200,
    data: responseData,
    msg: '搜索到的结果'
  }
})


module.exports = router.routes()