const Koa = require('koa')
// const Router = require('koa-router')
const config = require('./config')
const ModelDB = require('./db')
const app = new Koa()
const router = require('koa-router')()
const server = require('http').createServer(app.callback())
const socketHandler = require('./socket')
const bodyParser = require('koa-bodyparser')// 处理post请求，把 koa2 上下文的表单数据解析到
// const koaBody = require('koa-body')
const Schema = require('./db/model')

app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  console.log(`${ctx.method}`, `${ctx.url}`);
  if (ctx.method == 'OPTIONS') {
    ctx.response.body = 200;
  } else {
    await next();
  }
});
//app.use(koaBody({ multipart: true }))
app.use(bodyParser())
// 划分模块
router.use('/upload', require('./routers/upload'))
router.use('/chat', require('./routers/chat'))
router.use('/profile', require('./routers/profile'))
router.use('/qyq', require('./routers/qyq'))
router.use('/search', require('./routers/search'))


const io = require('socket.io')(server)
// 连接 socket
io.on('connection', socket => {
  console.log('socket 连接成功')
  // 监听用户登录
  const socket_id = socket.id
  socket.on('login', async (obj) => {
    let { user_name } = obj
    let data = await new ModelDB('user').query({ user_name })
    console.log(data)
    if (!data) {
      socket.emit('message', {
        cmd: 'login',
        code: 1,
        data: [],
        msg: '账户不存在'
      })
    } else {
      console.log('login socketid', socket.id)
      await socketHandler.saveUserSocketId(user_name, socket_id)
      let data2 = await new ModelDB('user').query(obj)
      socket.emit('message', {
        cmd: 'login',
        code: 200,
        data: data2,
        msg: '登录成功'
      })
    }
  })
  // 监听用户注册
  socket.on('register', async (obj) => {
    let { user_name } = obj
    let data = await new ModelDB('user').query({ user_name })
    if (data) {
      socket.emit('message', {
        cmd: 'register',
        code: 0,
        data: [],
        msg: '账号已经存在'
      })
    } else {
      await new ModelDB('user').save(obj).then(res => {
        console.log('还没加入')
      })
      let data = await new ModelDB('user').query(obj)
      console.log('注册：', obj, data)
      socket.emit('message', {
        cmd: 'register',
        code: 200,
        data: data,
        msg: '注册成功'
      })
    }
  })

  // 监听用户发送的消息
  socket.on('chat', async (obj) => {
    console.log('socket chat: ' + JSON.stringify(obj))
    let { from_user, to_user, content, avater, _id } = obj
    let Idtoid = new ModelDB('idtoid')
    Idtoid.query({
      user_name: to_user
    }).then(res => {
      // 向对方推送发送的消息
      console.log('to socket_id: ', res.socket_id)
      io.to(res.socket_id).emit('message', {
        cmd: 'receiveMsg',
        code: 200,
        data: {
          from_user,
          content,
          addTime: Date.now(),
          avater,
          _id
        },
        msg: `${from_user} 发过来的消息`
      })
    })
  })

  // 监听用户已读消息
  socket.on('read', async (obj) => {
    const { readAll, read_id, user_id, chatwith_id } = obj
    /**
     * 两个用户进行记录查询，进行组合查询，
     * chatrelationSchema 集合中chatContent字段 关联到chatcontent 
     * 进行 chatcontent集合中的user_id与chatwith_id查询，两个字段都是关联这user集合
     * 所以chatContent 字段就会输出 查询过后的chatcontent集合
     * 然后进行所有数据 替换
     */
    await Schema['chatrelation'].findOne({
      $or: [{
        userA: user_id,
        userB: chatwith_id
      }, {
        userB: user_id,
        userA: chatwith_id
      }, { unread: false }]
    }).populate(['chatcontent', {
      path: 'chatContent',
      populate: { path: 'chatwith_id' }
    }, {
        path: 'chatContent',
        populate: { path: 'user_id' }
      }]).then(res => {
        if (readAll) {
          console.log(res, 'res')
          res.chatContent.forEach(item => {
            new ModelDB('chatcontent').updateOne({ _id: item._id }, { unread: true })
          })
        } else {
          new ModelDB('chatcontent').updateOne({ _id: read_id }, { unread: true })
        }
      })
  })
})
app.use(router.routes())
server.listen(config.serverUrl, () => {
  console.log('server listenIng on port: ' + config.serverUrl)
})