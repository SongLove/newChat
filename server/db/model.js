const mongoose = require('./mongoose')
const Schema = mongoose.Schema

// 用户
const userSchema = new Schema({
  user_name: String,
  pass_word: String,
  avater: {
    type: String,
    default: 'http://systatic.tanggeek.top/chat/24.png'
  },
  cover: {
    type: String,
    default: 'http://y.gtimg.cn/music/photo_new/T003R300x300M000003IZaQY4TJcOC.jpg'
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
  }, chatContent
    : [{
      type: Schema.Types.ObjectId,
      ref: 'chatcontent'
    }]
})

// 动态
const qyqSchema = new Schema({
  // 用户
  writer: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  content: String,
  addTime: {
    type: Date,
    default: Date.now
  },
  uploadImg: { // 图片
    type: Array,
    default: []
  },
  agree: [{ // 点赞
    type: Schema.Types.ObjectId,
    ref: 'user'
  }],
  comments: [{// 评论
    type: Schema.Types.ObjectId,
    ref: 'comment'
  }]
})

// 动态评论
const commentSchema = new Schema({
  from: String,// 评论的用户
  to: String, // 指定回复的用户
  writer: String, // 这条动态的作者
  content: String, // 评价内容
  qyq: { // 这条动态的id
    type: Schema.Types.ObjectId,
    ref: 'qyq'
  },
  addTime: {
    type: Date,
    default: Date.now
  }
})

const userModel = mongoose.model('user', userSchema)
const idtoidModel = mongoose.model('idtoid', idtodiSchema)
const chatContentModel = mongoose.model('chatcontent', chatContentSchema)
const chatRelationModel = mongoose.model('chatrelation', chatRelationSchema)
const qyqModel = mongoose.model('qyq', qyqSchema)
const commentModel = mongoose.model('comment', commentSchema)


const modelS = {
  user: userModel,
  idtoid: idtoidModel,
  chatcontent: chatContentModel,
  chatrelation: chatRelationModel,
  qyq: qyqModel,
  comment: commentModel
}

module.exports = modelS