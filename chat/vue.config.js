let path = require('path')
function resolve(dir) {
  console.log(__dirname)
  return path.join(__dirname, dir)
}

module.exports = {
  devServer: {
    port: 8888, // 端口号
    host: 'localhost',
    https: false,
    open: false // 配置是否自动启动浏览器
  },
  // proxy: {
  //   '/api': {
  //     target: 'http://127.0.0.1:8100/', //对应自己的接口
  //     changeOrigin: true,
  //     ws: true,
  //     pathRewrite: {
  //       '^/api': ''
  //     }
  //   }
  // },
  chainWebpack: config => {
    config.resolve.alias
      .set('components', resolve('src/components')) // key,value自行定义，比如.set('@@', resolve('src/components'))
    const oneOfsMap = config.module.rule('scss').oneOfs.store
    oneOfsMap.forEach(item => {
      item
        .use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({
          // Or array of paths
          resources: ['./src/assets/styles/vars.scss']
        })
        .end()
    })
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-pxtorem')({
            minPixelValue: 2,
            rootValue: 20, // 换算的基数
            selectorBlackList: ['weui', 'mu'], // 忽略转换正则匹配项
            propList: ['*']
          })
        ]
      }
    }
  }
}