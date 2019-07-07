import * as types from './mutation-types'

const mutations = {
  [types.SET_USERINFO](state, userInfo) {
    localStorage.setItem('USERINFO', JSON.stringify(userInfo))
    state.userInfo = userInfo
  },
  [types.SET_CHATLIST](state, chatList) {
    state.chatList = chatList
  }
}

export default mutations