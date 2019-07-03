import * as types from './mutation-types'

const mutations = {
  [types.SET_USERINFO](state, userInfo) {
    state.userInfo = userInfo
  },
  [types.SET_CHATLIST](state, chatList) {
    state.chatList = chatList
  }
}

export default mutations