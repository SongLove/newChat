<template>
  <div class="chatwith p-f">
    <head-tab :title="$route.query.chatwith" :back="true">
      <div slot="headright">右边</div>
    </head-tab>
    <ul class="chat">
      <li v-for="(item, index) in dataList" :key="index">{{item.content}}</li>
      <li></li>
    </ul>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'chat',
  created() {
    this.getChatRecord()
  },
  computed: {
    ...mapState(['userInfo'])
  },
  data() {
    return {
      dataList: []
    }
  },
  methods: {
    getChatRecord() {
      // 查找当前用户与其用户的聊天记录
      let obj = {
        chatwith_id: this.$route.query.chatwithid,
        user_id: this.userInfo._id
      }
      this.$api.sendChatRecord(obj).then(({ data }) => {
        console.log('全部聊天记录', data)
        this.dataList = data.reverse()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.chatwith {
  top: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  background: #ff0;
}
</style>


