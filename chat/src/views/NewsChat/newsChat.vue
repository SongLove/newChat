<template>
  <div>
    <head-tab title="消息" />
    <scroll>
      <div>
        <div
          v-for="(item, index) in chatList"
          @click="goChatRecord(item)"
          :key="index"
          class="chat p-re flex jb dir-r"
        >
          <img class="chat-avater" v-lazy="item.chatWith.avater" />
          <article class="chat-msgbox">
            <p class="chat-name">{{item.chatWith.user_name}}</p>
            <div class="chat-msg flex ac jb">
              <div>{{item.content}}</div>
              <div>{{item.addTime | weekTime}}</div>
            </div>
          </article>
          <van-tag
            size="medium"
            class="chat-status p-ab"
            round
            v-show="item.unreadCount"
            type="danger"
          >{{item.unreadCount}}</van-tag>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import Socket from '../../utils/socket'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'newschat',
  created() {
    // 收到的消息
    Socket.Instance.on('receiveMsg', this.receiveMsg)
    this.getChatList()
  },
  computed: {
    ...mapState(['userInfo', 'chatList'])
  },
  data() {
    return {
      msgInp: '',
      tUserInfo: {} // 存放当前与其了解的用户信息
    }
  },
  methods: {
    ...mapActions(['actChatList']),
    receiveMsg({ data }) {
      this.getChatList()
    },
    getChatList() {
      this.actChatList({ user_id: this.userInfo._id })
    },
    goChatRecord(param) {
      this.$router.push({
        path: '/chat',
        query: {
          chatwithid: param.chatWith._id,
          chatwith: param.chatWith.user_name
        }
      })
    }
  },
  destroyed() {
    console.log('deactivated')
    Socket.Instance.off('receiveMsg', this.receiveMsg)
  }
}
</script>

<style lang="scss" scoped>
.chat {
  width: 100%;
  padding: 10px 0;
  &-status {
    display: block;
    right: 0;
    padding: 1px 4px;
    top: 15px;
  }
  &-avater {
    width: 50px;
    height: 50px;
    margin-right: 10px;
    border-radius: 5px;
  }
  &-name {
    font-size: $nameSize;
    width: 80%;
    margin-bottom: 5px;
  }
  &-msgbox {
    flex: 1;
  }
  &-msg {
    padding-bottom: 5px;
    font-size: $msgSize;
    border-bottom: 1px solid #f0f4f7;
    .ellipsis2{
      display: inline-block;
      width: 80%;
    }
  }
}
</style>


