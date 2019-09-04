const Router = require('koa-router')
const router = new Router()
const ModelDB = require('../db')
const chatrelationSchema = require('../db/model')['chatrelation']

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
  let newContent = await chatcontent.save(ctx.request.body)
  console.log('创建一个新的聊天内容', newContent)
  // 将当前用户与此用户的聊天记录保存
  let res = await chatrelation.query({
    $or: [{
      userA: user_id,
      userB: chatwith_id
    }, {
      userB: user_id,
      userA: chatwith_id
    }]
  })
  console.log('查找是否聊过天', res)
  // 如果与此用户没有聊天记录 将加入聊天列表，有则更新最新的内容
  if (res) {
    let chatContent = res.chatContent
    chatContent.unshift(newContent._id)
    // 更新聊天内容
    await chatrelation.updateOne({
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
    await chatrelation.save({
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
  ctx.response.body = responseData
  console.log('返回值：', ctx.response.body)
})

// 获取当前用户与其用户的聊天记录
router.get('/chatrecord', async (ctx, next) => {
  let { user_id, chatwith_id } = ctx.query
  let responseData
  /**
   * 两个用户进行记录查询，进行组合查询，
   * chatrelationSchema 集合中chatContent字段 关联到chatcontent 
   * 进行 chatcontent集合中的user_id与chatwith_id查询，两个字段都是关联这user集合
   * 所以chatContent 字段就会输出 查询过后的chatcontent集合
   */
  await chatrelationSchema.findOne({
    $or: [{
      userA: user_id,
      userB: chatwith_id
    }, {
      userB: user_id,
      userA: chatwith_id
    }]
  }).populate(['chatcontent', {
    path: 'chatContent',
    populate: { path: 'chatwith_id' }
  }, {
      path: 'chatContent',
      populate: { path: 'user_id' }
    }]).then(res => {
      // 有记录
      if (res) {
        responseData = {
          code: 200,
          data: res.chatContent,
          msg: `${user_id} 与 ${chatwith_id} 的聊天记录`
        }
      } else {
        responseData = {
          code: -1,
          msg: '暂无聊天记录'
        }
      }
    })

  console.log(`${user_id} 与 ${chatwith_id} 的聊天记录`, responseData.data)
  ctx.response.body = responseData
})

// 获取当前用户的聊天列表
router.get('/chatList', async (ctx, next) => {
  let { user_id } = ctx.query
  await chatrelationSchema
    .find({
      $or: [{
        userA: user_id
      }, {
        userB: user_id
      }]
    })
    .populate(['chatContent',
      {
        path: 'chatContent',
        populate: { path: 'chatwith_id' }
      }, {
        path: 'chatContent',
        populate: { path: 'user_id' }
      }]).then(res => {
        console.log('聊天列表', res)
        if (res) {
          let responseData
          let dataArr = []
          let unreadCount = 0
          res.forEach(item => {
            // 未读数量
            let oneItem = item.chatContent[0]
            item.chatContent.forEach(i => {
              if (!i.unread) unreadCount++
            })
            console.log('oneItem', oneItem.chatwith_id, oneItem.user_id, oneItem.chatwith_id._id, user_id)
            let userWith
            if (oneItem.chatwith_id._id == user_id) {
              userWith = oneItem.user_id
            } else {
              userWith = oneItem.chatwith_id
            }
            responseData = {
              addTime: oneItem.addTime,
              chatWith: userWith,
              content: oneItem.content,
              unreadCount
            }
            dataArr.push(responseData)
            unreadCount = 0
          })

          ctx.response.body = {
            code: 200,
            data: dataArr,
            msg: `${user_id} 用户的聊天列表`
          }
        } else {
          ctx.response.body = {
            code: -1,
            msg: `${user_id} 用户聊天列表未空`
          }
        }
      })
})

router.get('/mock', async (ctx, next) => {
  console.log('mock', ctx.query)
  ctx.response.body = {
    ddd: 'ssss'
  }
})

module.exports = router.routes()