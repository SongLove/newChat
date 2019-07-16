<template>
  <div class="chatbox">
    <head-tab :title="$route.query.chatwith" @back="back" :back="true">
      <div slot="headright">右边</div>
    </head-tab>
    <div class="chatbox-content">
      <scroll ref="scroll" :data="dataList" :scrollToEndFlag="true">
        <div id="chat-messages">
          <template v-for="(item, index) in dataList">
            <template v-if="colConf[index]">
              <div class="message right" :key="index">
                <img :src="item.user_id.avater" />
                <div class="bubble">
                  {{item.content}}
                  <div class="corner"></div>
                  <span>{{item.addTime}}</span>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="message left" :key="index">
                <img :src="item.chatwith_id.avater" />
                <div class="bubble">
                  {{item.content}}
                  <div class="corner"></div>
                  <span>{{item.addTime}}</span>
                </div>
              </div>
            </template>
          </template>
        </div>
      </scroll>
    </div>
    <van-cell-group class="chatbox-postmsg p-ab">
      <van-field v-model="msgInp" center clearable placeholder="请输入消息内容">
        <van-button slot="button" size="small" @click="sendCat" type="primary">发送</van-button>
      </van-field>
    </van-cell-group>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Socket from '../../utils/socket'
export default {
  name: 'chat',
  created() {
    this.gettUserInfo()
    Socket.Instance.on('receiveMsg', this.receiveMsg)
  },
  computed: {
    ...mapState(['userInfo']),
    colConf() {
      let colConf = {}
      this.dataList.forEach((item, index) => {
        colConf[index] = item.user_id._id == this.userInfo._id
      })
      return colConf
    }
  },
  data() {
    return {
      dataList: [],
      tUserInfo: {},
      msgInp: ''
    }
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    // 接收别人发过来的消息
    receiveMsg({ data, msg }) {
      console.log('发过过来的消息：', data, msg)
      let This = this
      this.dataList.push({
        user_id: This.tUserInfo,
        chatwith_id: This.tUserInfo,
        content: data.content,
        addTime: data.addTime,
        unread: true
      })
    },
    sendCat() {
      let obj = {
        chatwith_id: this.tUserInfo._id,
        user_id: this.userInfo._id,
        content: this.msgInp
      }

      this.$api.sendMessage(obj).then(({ data }) => {
        // 发送成功之后，向对方推送消息
        let This = this
        this.dataList.push({
          user_id: This.userInfo,
          chatwith_id: This.tUserInfo,
          content: data.content,
          addTime: data.addTime,
          unread: data.unread
        })
        console.log(this.$refs.scroll)
        Socket.Instance.send({
          cmd: 'chat',
          param: {
            from_user: this.userInfo.user_name,
            to_user: this.tUserInfo.user_name,
            avater: this.userInfo.avater,
            _id: this.userInfo._id,
            content: this.msgInp
          }
        })

        this.msgInp = ''
      })
    },
    gettUserInfo() {
      this.$api
        .sendUserInfo({ _id: this.$route.query.chatwithid })
        .then(({ data }) => {
          this.tUserInfo = data
          this.getChatRecord()
          console.log(data)
        })
    },
    getChatRecord() {
      // 查找当前用户与其用户的聊天记录
      let obj = {
        chatwith_id: this.$route.query.chatwithid,
        user_id: this.userInfo._id
      }
      this.$api.sendChatRecord(obj).then(({ data }) => {
        console.log('全部聊天记录', data)
        if (data) {
          this.dataList = data.reverse()
        }
      })
    }
  },
  deactivated() {
    this.dataList = []
  }
}
</script>

<style lang="scss" scoped>
.chatbox {
  bottom: 0;
  background: #fff;
  z-index: 11;
  &-postmsg {
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 12;
    border-top: 1px solid #ddd;
  }
  &-content {
    position: absolute;
    top: 45px;
    left: 0;
    right: 0;
    bottom: 55px;
    width: 100%;
  }
}

#chat-messages.animate {
  opacity: 1;
  margin-top: 0;
}

#chat-messages label {
  color: #aab8c2;
  font-weight: 600;
  font-size: 12px;
  text-align: center;
  margin: 15px 0;
  width: 100%;
  display: block;
}
.message::after {
  content: ' ';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
#chat-messages div.message {
  clear: both;
  margin-top: 10px;
  padding-bottom: 30px;
}

#chat-messages div.message.right {
}
#chat-messages div.message.right .bubble span {
  right: 0;
}
#chat-messages div.message.left .bubble span {
  left: 0;
}

#chat-messages .message img {
  float: left;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  margin: 20px 10px 0 10px;
}

#chat-messages div.message.right img {
  float: right;
}

.message .bubble {
  background: #ddd;
  font-size: 13px;
  font-weight: 600;
  padding: 12px 13px;
  border-radius: 5px 5px 5px 0;
  color: #8495a3;
  position: relative;
  float: left;
  max-width: 80%;
}

#chat-messages div.message.right .bubble {
  float: right;
  border-radius: 5px 5px 0 5px;
}
#chat-messages div.message.right .bubble::after {
  content: ' ';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

.bubble .corner {
  position: absolute;
  width: 7px;
  height: 7px;
  left: -5px;
  bottom: 0;
}

div.message.right .corner {
  left: auto;
  right: -5px;
}

.bubble span {
  color: #aab8c2;
  font-size: 11px;
  position: absolute;
  bottom: -22px;
}

#sendmessage {
  height: 60px;
  border-top: 1px solid #e7ebee;
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  background: #000;
}

#sendmessage input {
  background: #000;
  margin: 21px 0 0 21px;
  border: 0;
  padding: 0;
  font-size: 14px;
  font-family: open sans, sans-serif;
  font-weight: 400px;
  color: #aab8c2;
}

#sendmessage input:focus {
  outline: 0;
}

#sendmessage button {
  width: 30px;
  height: 30px;
  position: absolute;
  right: 15px;
  top: 23px;
  border: 0;
}

#sendmessage button:hover {
  cursor: pointer;
  background-position: 0 0;
}

#sendmessage button:focus {
  outline: 0;
}

#close {
  position: absolute;
  top: 8px;
  opacity: 0.8;
  right: 10px;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

#close:hover {
  opacity: 1;
}

.cx,
.cy {
  background: #000;
  position: absolute;
  width: 0;
  top: 15px;
  right: 15px;
  height: 3px;
  -webkit-transition: all 250ms ease-in-out;
  -moz-transition: all 250ms ease-in-out;
  -ms-transition: all 250ms ease-in-out;
  -o-transition: all 250ms ease-in-out;
  transition: all 250ms ease-in-out;
}

.cx.s1,
.cy.s1 {
  right: 0;
  width: 20px;
  -webkit-transition: all 100ms ease-out;
  -moz-transition: all 100ms ease-out;
  -ms-transition: all 100ms ease-out;
  -o-transition: all 100ms ease-out;
  transition: all 100ms ease-out;
}

.cy.s2 {
  -ms-transform: rotate(50deg);
  -webkit-transform: rotate(50deg);
  transform: rotate(50deg);
  -webkit-transition: all 100ms ease-out;
  -moz-transition: all 100ms ease-out;
  -ms-transition: all 100ms ease-out;
  -o-transition: all 100ms ease-out;
  transition: all 100ms ease-out;
}

.cy.s3 {
  -ms-transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
  -webkit-transition: all 100ms ease-out;
  -moz-transition: all 100ms ease-out;
  -ms-transition: all 100ms ease-out;
  -o-transition: all 100ms ease-out;
  transition: all 100ms ease-out;
}

.cx.s1 {
  right: 0;
  width: 20px;
  -webkit-transition: all 100ms ease-out;
  -moz-transition: all 100ms ease-out;
  -ms-transition: all 100ms ease-out;
  -o-transition: all 100ms ease-out;
  transition: all 100ms ease-out;
}

.cx.s2 {
  -ms-transform: rotate(140deg);
  -webkit-transform: rotate(140deg);
  transform: rotate(140deg);
  -webkit-transition: all 100ms ease-out;
  -moz-transition: all 100ms ease-out;
  -ms-transition: all 100ease-out;
  -o-transition: all 100ms ease-out;
  transition: all 100ms ease-out;
}

.cx.s3 {
  -ms-transform: rotate(135deg);
  -webkit-transform: rotate(135deg);
  transform: rotate(135deg);
  -webkit-transition: all 100ease-out;
  -moz-transition: all 100ms ease-out;
  -ms-transition: all 100ms ease-out;
  -o-transition: all 100ms ease-out;
  transition: all 100ms ease-out;
}
</style>


