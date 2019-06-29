const mongoose = require('mongoose')
const config = require('../config/index')


// 连接数据库 ip域名 : 端口号[默认27017]/ 数据库
mongoose.connect(config.DB_URL, {useNewUrlParser:true})

mongoose.connection.on('connected', () => {
  console.log('Mongoose connection open to:' + config.DB_URL)
})

/**
 * 连接异常
 */
mongoose.connection.on('error', (error) => {
  console.log('Mongoose connection error:' + error)
})
/**
 * 连接断开
 */
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection disconnected')
})

module.exports = mongoose