const mongoose = require('./mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  user_name: String,
  pass_word: String
})
const userModel = mongoose.model('user', userSchema)

const modelS = {
  user: userModel
}

module.exports = modelS