const models = require('../db/model')

module.exports = class socketHandler{
  static async saveUserSocketId(user_name,socket_id) {
    const Idtoid = models['idtoid']
    // 保存用户的id 和socketid
    await Idtoid.findOne({
      user_name
    }).then((res) => {
      if(!res) {
        new Idtoid({
          user_name,
          socket_id
        }).save().then(() => {})
      } else {
        Idtoid.updateOne({
          user_name
        }, {
          socket_id
        }).then(() => {})
      }
    })
  }
}