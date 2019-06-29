<template>
  <div class="mypage">
    <!-- 未登陆 -->
    <div class="nologin text-c">
      <img src="../../assets/logo.png">
      <div>
        <p>您还没有登录</p>
        <p>请先<router-link tag="span" to="/login">登录</router-link></p>
      </div>
    </div>
    <!-- 已登陆 -->
  </div>  
</template>

<script>
export default {
  name: 'mypage'
}
</script>

<style lang="scss" scoped>
.mypage{
  .nologin{
    
  }
}
</style>


