<template>
  <div>
    <p>111</p>
    <p>222</p>
    <van-cell-group>
      <van-field v-model="msgInp" center clearable placeholder="请输入消息内容">
        <van-button slot="button" size="small" @click="sendCat" type="primary">发送</van-button>
      </van-field>
    </van-cell-group>
  </div>
</template>

<script>
import Socket from '../../utils/socket'
import { mapState } from 'vuex'
export default {
  name: 'newschat',
  created() {
    // 收到的消息
    Socket.Instance.on('receiveMsg', this.receiveMsg)
    this.gettUserInfo()
  },
  computed: {
    ...mapState(['userInfo'])
  },
  data() {
    return {
      msgInp: '',
      tUserInfo: {} // 存放当前与其了解的用户信息
    }
  },
  methods: {
    gettUserInfo() {
      this.$api
        .sendUserInfo({ user_name: this.$route.query.chatwith })
        .then(({ data }) => {
          this.tUserInfo = data
          console.log(data)
        })
    },
    receiveMsg(data) {
      console.log(data, '收到的消息')
    },
    sendCat() {
      let obj = {
        chatwith_id: this.tUserInfo._id,
        user_id: this.userInfo._id,
        content: this.msgInp
      }

      this.$api.sendMessage(obj).then(res => {
        // 发送成功之后，向对方推送消息
        console.log(res)
        Socket.Instance.send({
          cmd: 'chat',
          param: {
            from_user: this.userInfo.user_name,
            to_user: this.tUserInfo.user_name,
            avater: this.userInfo.avater,
            addTime: Date.now(),
            _id: this.userInfo._id,
            messge: this.msgInp
          }
        })
        this.msgInp = ''
      })
      // this.$api.mock({bbb:'11'}).then((res) => {
      //   console.log('get', res)
      // })
    }
  }
}
</script>

<style>
</style>

