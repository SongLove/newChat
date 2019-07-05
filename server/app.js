const Koa = require('koa')
// const Router = require('koa-router')
const config = require('./config')
const ModelDB = require('./db')
const app = new Koa()
const router = require('koa-router')()
const server = require('http').createServer(app.callback())
const socketHandler = require('./socket')
const bodyParser = require('koa-bodyparser')// 处理post请求，把 koa2 上下文的表单数据解析到


app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  console.log(`${ctx.method}`, `${ctx.url}`);
  if (ctx.method == 'OPTIONS') {
    ctx.body = 200;
  } else {
    await next();
  }
});

// 划分模块
router.use('/upload', require('./routers/upload'))
router.use('/chat', require('./routers/chat'))
router.use('/profile', require('./routers/profile'))
router.use('/qyq', require('./routers/qyq'))


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
    let { from_user, to_user, messge, addTime, avater, _id } = obj
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
          messge,
          addTime,
          avater,
          _id
        },
        msg: `${from_user} 发过来的消息`
      })
    })
  })
})

app.use(bodyParser())
app.use(router.routes()).use(router.allowedMethods())

server.listen(3300, () => {
  console.log('server listenIng on port: ' + config.serverUrl)
})