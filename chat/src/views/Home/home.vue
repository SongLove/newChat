<template>
  <div class="home">
    <head-tab title="home" />
    <!-- 动态内容 -->
    <scroll>
      <qyq-content :qyqList="qyqList" @afreshQyq="getQyqList" />
    </scroll>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import QyqContent from '../../components/qyqContent'
export default {
  name: 'home',
  created() {
    this.getQyqList()
  },
  computed: {
    ...mapState(['userInfo'])
  },
  components: {
    QyqContent
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
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
