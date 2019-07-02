const Router = require('koa-router')
const router = new Router()
const ModelDB = require('../db')

// 当前聊天记录
const chatcontent = new ModelDB('chatcontent')
// 当前用户的聊天列表
const chatrelation = new ModelDB('chatrelation')


// 发送对话
router.post('/chatwith', async (ctx, next) => {
  console.log('chatwith', ctx.request.body)
  let { user_id, chatwith_id } = ctx.request.body
  let responseData
  // 聊天内容
  await chatcontent.save(ctx.request.body).then(newContent => {
    console.log('创建一个新的聊天内容', newContent)
    // 将当前用户与此用户的聊天记录保存
    chatrelation.query({
      $or: [{
        userA: user_id,
        userB: chatwith_id
      }, {
        userB: user_id,
        userA: chatwith_id
      }]
    }).then(res => {
      console.log('查找是否聊过天', res)
      // 如果与此用户没有聊天记录 将加入聊天列表，有则更新最新的内容
      if (res) {
        let chatContent = res.chatContent
        chatContent.unshift(newContent._id)
        // 更新聊天内容
        chatrelation.updateOne({
          _id: res._id
        }, {
            chatContent
          }).then(() => {
            console.log('跟新完成')
            responseData = {
              code: 200,
              data: newContent,
              msg: '更新完成'
            }
          })
      } else {
        chatrelation.save({
          userA: user_id,
          userB: chatwith_id,
          chatContent: [newContent]
        }).then(() => {
          console.log('新聊天记录创建完成')
          responseData = {
            code: 200,
            data: newContent,
            msg: '创建完成'
          }
        })
      }
    })
  })
  ctx.response.body = responseData
})
router.get('/mock', async (ctx, next) => {
  console.log('mock', ctx.query)
  ctx.response.body = {
    ddd: 'ssss'
  }
})

module.exports = router.routes()