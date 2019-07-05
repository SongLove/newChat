<template>
  <div class="home">
    <head-tab title="home" />
    <article>
      <div v-for="(qyq, index) in qyqList" :key="index" class="qyq flex dir-row p-r">
        <!-- 头像 -->
        <img @click="goUserSpace(qyq.writer._id, qyq.writer.user_name)" class="qyq-avater" :src="qyq.writer.avater" />
        <!-- 动态内容 -->
        <div class="qyq-msgbox">
          <p @click="goUserSpace(qyq.writer._id, qyq.writer.user_name)" class="qyq-name">{{qyq.writer.user_name}}</p>
          <p class="qyq-content">{{qyq.content}}</p>
          <!-- 是否带图片 -->
          <ul class="qyq-pimgs"></ul>
        </div>
        <!--如果是当前用户的动态 显示删除按钮-->
        <i v-if="qyq.writer._id == userInfo._id" class="iconfont icon-guanbi qyq-close p-ab"></i>
      </div>
    </article>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'home',
  created() {
    this.getQyqList()
  },
  computed: {
    ...mapState(['userInfo'])
  },
  data() {
    return {
      qyqList: []
    }
  },
  methods: {
    getQyqList() {
      this.$api.sendQyqList().then(({ data }) => {
        console.log('动态列表: ', data)
        this.qyqList = data
      })
    },
    // 进入用户空间
    goUserSpace(user_id,user_name) {
      this.$router.push({
        path: '/userspace',
        query: {
          user_id,
          user_name
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.qyq {
  margin-top: 10px;
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
  &-content {
    font-size: $msgSize;
  }
  &-close {
    right: 10px;
  }
}
</style>
