const models = require('./model')

class Mongodb {
  constructor(modelName) {
    this.modelName = modelName
  }
  // 查询 只返回一条数据
  query(param = {}) {
    return new Promise((resolve, reject) => {
      console.log('query param',param)
      models[this.modelName].findOne(param, (err, res) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  }
  // 任何查询
  find(param = {}) {
    return new Promise((resolve, reject) => {
      console.log(param)
      models[this.modelName].find(param, (err, res) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  }
  //保存
  async save(param) {
    return new Promise((resolve, reject) => {
      new models[this.modelName](param).save((err, res) => {
        if (err) reject(err)
        else resolve(res)
      })
    })
  }
  // 更新数据
  updateOne(param, update) {
    // 查找
    let whereStr = param
    // 更新的字段以及字段
    let updateStr = { $set: update }
    return new Promise((resolve, reject) => {
      models[this.modelName].updateOne(whereStr, updateStr, (err, res) => {
        if (err) reject(err)
        else resolve(res)
      })
    })
  }

  // 组合查询
  populate(param) {
    return new Promise((reslove, reject) => {
      models[this.modelName].populate(param, (err, res) => {
        if (err) reject(err)
        else reslove(res)
      })
    })
  }
}

module.exports = Mongodb