<template>
  <div>
    <head-tab title="消息" />
    <scroll>
      <div>
        <div
          v-for="(item, index) in chatList"
          @click="goChatRecord(item)"
          :key="index"
          class="chat flex ac jb dir-r"
        >
          <img
            class="chat-avater"
            :src="item.chatWith.avater"
          />
          <article class="chat-msgbox">
            <p class="chat-name">{{item.chatWith.user_name}}</p>
            <p class="chat-msg">{{item.content}}</p>
          </article>
          <div class="chat-status status"></div>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import Socket from "../../utils/socket";
import { mapState, mapMutations } from "vuex";
export default {
  name: "newschat",
  created() {
    // 收到的消息
    Socket.Instance.on("receiveMsg", this.receiveMsg);
    this.getChatList();
  },
  computed: {
    ...mapState(["userInfo", "chatList"])
  },
  data() {
    return {
      msgInp: "",
      tUserInfo: {} // 存放当前与其了解的用户信息
    };
  },
  methods: {
    ...mapMutations(["set_chatList"]),
    getChatList() {
      this.$api
        .sendChatList({ user_id: this.userInfo._id })
        .then(({ data }) => {
          console.log("当前用户聊天列表", data);
          this.set_chatList(data);
        });
    },
    goChatRecord(param) {
      this.$router.push({
        path: "/chat",
        query: {
          chatwithid: param.chatWith._id,
          chatwith: param.chatWith.user_name
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.chat {
  width: 100%;
  padding: 10px 0;
  &-avater {
    width: 50px;
    height: 50px;
    margin-right: 10px;
    border-radius: 5px;
  }
  &-name {
    font-size: $nameSize;
    margin-bottom: 5px;
  }
  &-msgbox {
    flex: 1;
    margin-right: 10px;
  }
  &-msg {
    padding-bottom: 5px;
    font-size: $msgSize;
    border-bottom: 1px solid #000;
  }
}
</style>


