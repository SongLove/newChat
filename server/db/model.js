const mongoose = require('./mongoose')
const Schema = mongoose.Schema

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

const chatContentSchema = new Schema({
  // 接收者
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  // 发送者
  chatWith: {
    type: Schema.Types.ObjectId
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

const idtodiSchema = new Schema({
  user_name: String,
  socket_id: String
})

const userModel = mongoose.model('user', userSchema)
const idtoidModel = mongoose.model('idtoid', idtodiSchema)


const modelS = {
  user: userModel,
  idtoid: idtoidModel
}

module.exports = modelS