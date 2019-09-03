const Router = require('koa-router')
const Models = require('../db/model')
const ModelDB = require('../db')
const router = new Router()
const multiparty = require('multiparty')
const OSS = require('ali-oss')

// oss 配置
const client = new OSS({
  region: 'oss-cn-beijing',
  accessKeyId: 'LTAITDtkCFvi5Ln6', //自定义项
  accessKeySecret: 'U5dkkcDaJ6NiF56bpo18kpsfxV7ajh' //自定义项
})

const uploadFile = async (req) => {
  let alioss_upfile = () => {
    return new Promise((resolve, reject) => {
      // 上传多文件 使用multiparty
      let form = new multiparty.Form({
        encoding: 'utf-8',
        keepExtensions: true // 保留后缀
      })

      form.parse(req, async function (err, fields, files) {
        let data = []
        console.log(files)
        if (JSON.stringify(files) === '{}') {
          resolve()
        } else {
          for (let f of files.file) {
            let date = new Date()
            let time = '' + date.getFullYear() + (date.getMonth() + 1) + date.getDate()
            let filepath = 'chat/' + time + '/' + date.getTime()
            // 文件后缀
            let [fileext] = [f.originalFilename.split('.').pop(), f.originalFilename.split('.').shift()]
            let upfile = f.path
            let newfile = filepath + '.' + fileext
            client.useBucket('tanggeek')
            await client.put(newfile, upfile).then((results) => {
              data.push(results.url)
            }).catch((err) => {
              console.log(err)
            })
          }
          console.log('文件上传成功!', data)
          resolve(data)
        }
      })
    })
  }
  return await alioss_upfile()
}

router.post('/upimg', async (ctx, next) => {
  let responseData
  await uploadFile(ctx.req).then(data => {
    responseData = {
      code: 200,
      data
    }
  })
  ctx.type = 'json'
  ctx.response.body = responseData
})

router.post('/upqyq', async (ctx, next) => {
  await new ModelDB('qyq').save(ctx.request.body).then(() => {
    ctx.response.body = {
      code: 200,
      msg: '成功发表动态'
    }
  })
})

module.exports = router.routes()