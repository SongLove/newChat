const models = require('./model')

class Mongodb {
  constructor(modelName) {
    this.modelName = modelName
  }
  // 查询
  query(param = {}) {
    return new Promise((resolve, reject) => {
      models[this.modelName].find(param, (err, res) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  }
  //保存
}
module.exports = Mongodb