const Koa = require('koa')
// const Router = require('koa-router')
const config = require('./config')
const ModelDB = require('./db')
const app = new Koa()
const router  = require('koa-router')()
const server = require('http').createServer(app.callback())
const socketHandler = require('./socket')


// 划分模块

router.use('/chat', require('./routers/chat'))

app.use(router.routes()).use(router.allowedMethods())


const io = require('socket.io')(server)
// 连接 socket
io.on('connection', socket => {
  console.log('socket 连接成功')
  // 监听用户登录

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
      const socket_id = socket.id
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
  socket.on('chat', async(obj) =>{

  })
})


server.listen(3300, () => {
  console.log('server listenIng on port: ' + config.serverUrl)
})