import axios from './axios' // 倒入 api

/* 将所有接口统一起来便于维护
 * 如果项目很大可以将 url 独立成文件，接口分成不同的模块
 * 此处的数据依然来自 Easy Mock
 */

// 单独倒出
export const sendMessage = data => {
  console.log(data)
  return axios({
    url: '/chat/chatwith',
    method: 'post',
    data
  })
}

export const mock = params => {
  return axios({
    url: '/chat/mock',
    method: 'get',
    params
  })
}

// 默认全部倒出
// 根绝需要进行  
export default {
  sendMessage,
  mock
}