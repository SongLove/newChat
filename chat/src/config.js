const isDev = process.env.NODE_ENV === 'development' ? true : false

const config = {
  API_URL: isDev ? '/api/' : 'http://www.tanggeek.top/chat/api/',
}

export default {
  method: 'post',
  // 基础url前缀
  baseURL: config.API_URL,
  // 请求头信息
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
  // 参数
  data: {},
  // 设置超时时间
  timeout: 10000,
  // 携带凭证
  withCredentials: false,
  // 返回数据类型
  responseType: 'json',
  socketUrl: isDev ? 'ws://127.0.0.1:3300' : 'ws://www.tanggeek.top:3300'
}