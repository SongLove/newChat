const models = require('./model')

class Mongodb {
  constructor(modelName) {
    this.modelName = modelName
  }
  // 查询
  query(param = {}) {
    return new Promise((resolve, reject) => {
      console.log(param)
      models[this.modelName].findOne(param, (err, res) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  }
  //保存
  save(param) {
    return new Promise((resolve, reject) => {
      new models[this.modelName](param).save((err, res) => {
        if (err) reject(err)
        else resolve(res)
      })
    })
  }
}
module.exports = Mongodb