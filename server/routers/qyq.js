const Router = require('koa-router')
const Models = require('../db/model')
const ModelDB = require('../db')
const router = new Router()

// 动态列表
router.get('/qyqlist', async (ctx, next) => {
  let responseData
  await Models['qyq'].find(ctx.query)
    .populate(['writer', 'comments']).then(res => {
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

router.get('/', async (ctx, next) => {
  
})

// 用户动态列表
router.get('/tqyqlist', async (ctx, next) => {
  let responseData
  await Models['qyq'].find(ctx.query)
    .populate(['writer', 'comments']).then(res => {
      console.log('qyq 组合查询', res)
      if (res) {
        responseData = {
          code: 200,
          data: res.reverse(),
          msg: '用户的动态列表'
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

// 评论或者回复动态
router.post('/qyqcomment', async (ctx, next) => {
  // 先新建个评论集合
  await new ModelDB('comment').save(ctx.request.body).then((res) => {
    if (res) {
      // 新建评论后去查找动态
      new ModelDB('qyq').query(res.qyq).then((qyq) => {
        // 将当前动态的评论id 加入 进行集合更新
        let comments = qyq.comments
        comments.unshift(res._id)
        new ModelDB('qyq').updateOne({
          _id: qyq._id
        }, {
            comments
          }).then((updateQyq) => {
            console.log('更新后的 qyq: ', updateQyq)
          })
      })
    }
    ctx.response.body = {
      code: 200,
      msg: '评论成功'
    }
  })
})

module.exports = router.routes()