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
export default {
  name: 'newschat',
  created() {
    // 收到的消息
    Socket.Instance.on('receiveMsg', this.receiveMsg)
  },
  data() {
    return {
      msgInp: ''
    }
  },
  methods: {
    receiveMsg(data) {
      console.log(data, '收到的消息')
    },
    sendCat() {
      this.$api.sendMessage({aa: '111'}).then((res) => {
        console.log(res)
      })
      this.$api.mock({bbb:'11'}).then((res) => {
        console.log('get', res)
      })
    }
  }
}
</script>

<style>
</style>

