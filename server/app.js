const Koa = require('koa')
// const Router = require('koa-router')
const config = require('./config')
const ModelDB = require('./db')
const app = new Koa()
const server = require('http').createServer(app.callback())

const io = require('socket.io')(server)
// 连接 socket
io.on('connection', socket => {
  console.log('socket 连接成功')
  const socketId = socket.id
  // 监听用户登录
  socket.on('login', async (obj) => {
    let { user_name } = obj
    let data = await new ModelDB('user').query({ user_name })
    if (!data) {
      socket.send('login', {
        cmd: 'login',
        code: 1,
        data: [],
        msg: '账户不存在'
      })
    }
    let data2 = await new ModelDB('user').query(obj)
    socket.send('login', {
      cmd: 'login',
      code: 200,
      data: data2,
      msg: '登录成功'
    })
  })
})


server.listen(3300, () => {
  console.log('server listenIng on port: ' + config.serverUrl)
})