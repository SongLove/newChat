<template>
  <div class="userspace">
    <head-tab
      :title="$route.query.user_name"
      @back="$router.go(-1)"
      :back="true"
    >
      <div slot="headright">右边</div>
    </head-tab>
    <qyq-content
      :qyqList="tQyqList"
      @afreshQyq="getUserQyq"
    />
    <van-button
      @click="goChatRecord($route.query)"
      class="recordBtn"
      type="primary"
      size="large"
    >发消息</van-button>
  </div>
</template>
<script>
import qyqContent from "../../components/qyqContent";
export default {
  name: "userspace",
  created() {
    this.getUserQyq();
    this.getUserInfo();
  },
  components: {
    qyqContent
  },
  data() {
    return {
      tQyqList: [] // 用户动态列表
    };
  },
  // computed: {
  //   showRecordBtn() {
  //     console.log(this.$route.query.user_id, this.$store.state.userInfo._id);
  //     return this.$route.query.user_id != this.$store.state.userInfo._id;
  //   }
  // },
  methods: {
    goChatRecord(param) {
      this.$router.push({
        path: "/chat",
        query: {
          chatwithid: param.user_id,
          chatwith: param.user_name
        }
      });
    },
    getUserQyq() {
      this.$api
        .sendTQyqList({ writer: this.$route.query.user_id })
        .then(({ data }) => {
          console.log("返回的用户动态；", data);
          this.tQyqList = data;
        });
    },
    // 获取当前用户
    getUserInfo() {
      this.$api.sendUserInfo({ _id: this.$route.query.user_id }).then(res => {
        console.log("个人空间：", res);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.userspace {
  z-index: 10;
}
</style>


