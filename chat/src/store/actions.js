import * as types from './mutation-types'
import axios from '../api/interface'


export const actChatList = function ({ commit }, param) {
  axios.sendChatList(param)
    .then(({ data }) => {
      console.log("当前用户聊天列表", data);
      let unread = false
      data.forEach(item => {
        if (item.unreadCount) {
          unread = true
        }
      });
      commit(types.SET_NEWMSG, unread)
      commit(types.SET_CHATLIST, data)
    });
}