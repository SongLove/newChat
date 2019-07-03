const mongoose = require('./mongoose')
const Schema = mongoose.Schema

// 用户
const userSchema = new Schema({
  user_name: String,
  pass_word: String,
  avater: {
    type: String,
    default: 'https://www.jq22.com/tx/24.png'
  },
  signature: {
    type: String,
    default: '这个人很懒，什么都没写'
  }
})


// 聊天内容
const chatContentSchema = new Schema({
  // 接收者
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  // 发送者
  chatwith_id: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  addTime: {
    type: Date,
    default: Date.now
  },
  // 此次消息内容
  content: {
    type: String
  },
  // 是否已读
  unread: {
    type: Boolean,
    default: true
  }
})

// 存放每个用户的socket id
const idtodiSchema = new Schema({
  user_name: String,
  socket_id: String
})

// 存放用户之间的聊天记录
const chatRelationSchema = new Schema({
  // 当前用户
  userA: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  userB: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  chatContent: [{
    type: Schema.Types.ObjectId,
    ref: 'chatcontent'
  }]
})

const userModel = mongoose.model('user', userSchema)
const idtoidModel = mongoose.model('idtoid', idtodiSchema)
const chatContentModel = mongoose.model('chatcontent', chatContentSchema)
const chatRelationModel = mongoose.model('chatrelation', chatRelationSchema)


const modelS = {
  user: userModel,
  idtoid: idtoidModel,
  chatcontent: chatContentModel,
  chatrelation: chatRelationModel
}

module.exports = modelS