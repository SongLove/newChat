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
      <span>
        <i class="iconfont icon-liulanzhaopianyechakanxiangqing"></i>
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
export default {
  name: 'footertab'
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

