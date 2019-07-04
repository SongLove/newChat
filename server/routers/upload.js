const Router = require('koa-router')
const Models = require('../db/model')
const router = new Router()
const multiparty = require('multiparty')
const OSS = require('ali-oss')

// oss 配置
const client = new OSS({
  region: 'oss-cn-beijing',
  accessKeyId: 'LTAITDtkCFvi5Ln6', //自定义项
  accessKeySecret: 'U5dkkcDaJ6NiF56bpo18kpsfxV7ajh' //自定义项
})

router.post('/upqyq', async (ctx, next) => {
  let { user_id, content, dataFrom } = ctx.request.body
  console.log('发表动态', ctx.request.body)
  let alioss_upfile = () => {
    return new Promise((resolve, reject) => {
      // 上传多文件 使用multiparty
      let form = new multiparty.Form({
        encoding: 'utf-8',
        keepExtensions: true // 保留后缀
      })
      form.parse(dataFrom, async function (err, fields, files) {
        let data = []
        let model = Models['qyq']
        console.log('数据', files)

        for (let f of files.file) {
          let date = new Date()
          let time = '' + date.getFullYear() + (date.getMonth() + 1) + date.getDate()
          let filepath = 'slideshow/' + time + '/' + date.getTime()
          // 文件后缀
          let [fileext, fileName] = [f.originalFilename.split('.').pop(), f.originalFilename.split('.').shift()]
          let upfile = f.path
          let newfile = filepath + '.' + fileext
          let resultsRrl = ''
          client.useBucket('tanggeek')
          await client.put(newfile, upfile).then((results) => {
            console.log('文件上传成功!', results.url)
            resultsRrl = results.url
            data.push(results.url)
          }).catch((err) => {
            console.log(err)
          })
          let obj = {
            material_name: fileName,
            material_tyle: fileext,
            material_url: resultsRrl
          }
          await new model(obj)
        }
        ctx.type = 'json'
        ctx.response.body = {
          status: 200,
          data: data
        }
        resolve(next())
      })
    })
  }
  await alioss_upfile()
})

module.exports = router.routes()