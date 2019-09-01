let path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '././' : '/',
  devServer: {
    port: 8888, // �?口号
    host: 'localhost',
    https: false,
    open: false, // 配置�?否自动启动浏览器
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3300/', //对应�?己的接口
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('components', resolve('src/components')) // key,value�?行定义，比�??.set('@@', resolve('src/components'))
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
            rootValue: 20, // 换算的基�?
            selectorBlackList: ['weui', 'mu'], // 忽略�?换�?�则匹配�?
            propList: ['*']
          })
        ]
      }
    }
  }
}