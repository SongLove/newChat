import axios from './axios' // 倒入 api

/* 将所有接口统一起来便于维护
 * 如果项目很大可以将 url 独立成文件，接口分成不同的模块
 * 此处的数据依然来自 Easy Mock
 */

// 单独发送聊天记录
export const sendMessage = data => {
  return axios({
    url: '/chat/chatwith',
    method: 'post',
    data
  })
}


// 查找当前用户与其用户的聊天记录
export const sendChatRecord = params => {
  return axios({
    url: '/chat/chatrecord',
    method: 'get',
    params
  })
}

// 查找当前用户的聊天列表
export const sendChatList = params => {
  return axios({
    url: '/chat/chatlist',
    method: 'get',
    params
  })
}

// 用户信息
export const sendUserInfo = params => {
  return axios({
    url: '/profile/userinfo',
    method: 'get',
    params
  })
}

// 修改用户信息
export const sendAlterInfo = data => {
  return axios({
    url: '/profile/alterInfo',
    method: 'post',
    data
  })
}

// 发表动态
export const sendUpQyq = data => {
  return axios({
    url: '/upload/upqyq',
    method: 'post',
    data
  })
}
// 图片上传
export const sendUpImg = data => {
  return axios({
    url: '/upload/upimg',
    method: 'post',
    data
  })
}

// 取所有动态 动态大厅
export const sendQyqList = params => {
  return axios({
    url: '/qyq/qyqlist',
    method: 'get',
    params
  })
}

// 取所有动态 动态大厅
export const sendTQyqList = params => {
  return axios({
    url: '/qyq/tqyqlist',
    method: 'get',
    params
  })
}


// 评论动态
export const sendComment = data => {
  return axios({
    url: '/qyq/qyqcomment',
    method: 'post',
    data
  })
}


// 默认全部倒出
// 根绝需要进行  
export default {
  sendMessage,
  sendUserInfo,
  sendAlterInfo,
  sendChatRecord,
  sendUpQyq,
  sendUpImg,
  sendQyqList,
  sendTQyqList,
  sendChatList,
  sendComment
}