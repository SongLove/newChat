<template>
  <transition name="slide">
    <div class="loginbox p-f">
      <!-- 登录 -->
      <van-cell-group>
        <van-field
          v-model="username"
          required
          clearable
          label="用户名"
          right-icon="question-o"
          placeholder="请输入用户名"
          @click-right-icon="$toast('question')"
        />

        <van-field v-model="password" type="password" label="密码" placeholder="请输入密码" required/>
        <van-button @click="sendLogin" :loading="loading" type="primary" loading-text="登录中...">
          登  录
        </van-button>
      </van-cell-group>
      <!-- 注册 -->
      <div>注册</div>
    </div>
  </transition>
</template>
<script>
import Socket from '../../utils/socket'
export default {
  name: 'login',
  data () {
    return {
      username: '',
      password: '',
      loading: false
    }
  },
  created () {
    Socket.Instance.on('login', this.login)
  },
  methods: {
    login({data}) {
      console.log(data, '登录')
    },
    sendLogin() {
      console.log('发送')
      Socket.Instance.send({
        cmd: 'login',
        user_name: this.username,
        pass_word: this.password
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.loginbox {
  top: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  background: #ff0;
  .slide-enter-active,
  .slide-leave-active {
    transition: all 0.3s;
  }
  .slide-enter,
  .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
}
</style>


