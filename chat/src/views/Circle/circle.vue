<template>
  <div class="circle">
    <head-tab title="朋友圈" @back="$router.go(-1)" :back="true" />
    <!-- 动态内容 -->
    <qyq-content :qyqList="qyqList" @afreshQyq="getQyqList" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import QyqContent from "../../components/qyqContent";
export default {
  name: "circlefriends",
  created() {
    this.getQyqList();
  },
  computed: {
    ...mapState(["userInfo"])
  },
  components: {
    QyqContent
  },
  data() {
    return {
      qyqList: []
    };
  },
  methods: {
    getQyqList() {
      this.$api.sendQyqList().then(({ data }) => {
        console.log("动态列表: ", data);
        this.qyqList = data;
        this.$previewRefresh();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.circle {
  z-index: 12;
  bottom: 0;
}
</style>
