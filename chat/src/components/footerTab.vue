<template>
  <ul class="footer flex ac jc text-c">
    <router-link class="link" tag="li" to="/">
      <span>
        <i class="iconfont icon-gerenxinxiyedianhuahaoma"></i>
      </span>
      <span>首页</span>
    </router-link>
    <router-link class="link" tag="li" to="/circle">
      <span>
        <i class="iconfont icon-gerenxinxiyedianhuahaoma"></i>
      </span>
      <span>朋友圈</span>
    </router-link>
    <router-link class="link" tag="li" to="/news">
      <span class="p-re">
        <i class="iconfont icon-liulanzhaopianyechakanxiangqing"></i>
        <i v-if="newMsg" class="dian p-ab"></i>
      </span>
      <span>消息</span>
    </router-link>
    <router-link class="link" tag="li" to="/upload">
      <span>
        <i class="iconfont icon-yijichengchangxin"></i>
      </span>
    </router-link>
    <router-link class="link" tag="li" to="/search">
      <span>
        <i class="iconfont icon-sousuo"></i>
      </span>
      <span>搜索</span>
    </router-link>
    <router-link class="link" tag="li" to="/mypage">
      <span>
        <i class="iconfont icon-gerenxinxiyebanzhurenlaoshi"></i>
      </span>
      <span>我的</span>
    </router-link>
  </ul>
</template>
<script>
import Socket from '../utils/socket'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'footertab',
  computed: {
    ...mapState(['newMsg', 'userInfo'])
  },
  mounted() {
    Socket.Instance.on('receiveMsg', this.receiveMsg)
  },
  methods: {
    receiveMsg({ data }) {
      // 如果不是自己的id 则不请求
      console.log(d, 'fooo')
      this.set_newMsg(true)
    },
    ...mapMutations(['set_newMsg'])
  }
}
</script>

<style lang="scss" scoped>
.footer {
  position: fixed;
  width: 100%;
  height: 55px;
  bottom: 0;
  padding: 10px 0;
  border-top: 1px solid #ddd;
  background: #fff;
  z-index: 10;
  .dian {
    width: 10px;
    height: 10px;
    right: 10px;
    top: -5px;
    display: inline-block;
    border-radius: 50%;
    background: #f00;
  }
  .link {
    width: 20%;
    height: 100%;
    display: flex;
    flex-direction: column;
    font-size: 14px;
  }
  .router-link-exact-active {
    color: $iconColor;
  }
}
</style>

