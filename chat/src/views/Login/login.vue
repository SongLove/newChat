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

        <van-field v-model="password" type="password" label="密码" placeholder="请输入密码" required />
        <van-button @click="sendLogin" :loading="loading" type="primary" loading-text="登录中...">登 录</van-button>
      </van-cell-group>
      <!-- 注册 -->
      <div>
        注册
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

          <van-field v-model="password" type="password" label="密码" placeholder="请输入密码" required />
          <van-button
            @click="sendRegister"
            :loading="loading"
            type="primary"
            loading-text="注册中..."
          >注 册</van-button>
        </van-cell-group>
      </div>
    </div>
  </transition>
</template>
<script>
import Socket from '../../utils/socket'
import { mapMutations } from 'vuex'
export default {
  name: 'login',
  data() {
    return {
      username: '',
      password: '',
      loading: false
    }
  },
  created() {
    Socket.Instance.on('login', this.login)
    Socket.Instance.on('register', this.login)
  },
  methods: {
    ...mapMutations([
      'set_userInfo'
    ]),
    login({ data, msg }) {
      console.log(data, '登录')
      if (data) {
        this.set_userInfo(data)
        localStorage.setItem('USERINFO', JSON.stringify(data))
        this.$toast.success({
          message: msg,
          duration: 1000,
          onClose: () => {
            this.$router.push({ path: '/mypage' })
          }
        })
      }
    },
    register({ data }) {
      console.log(data, '注册')
      this.sendLogin()
    },
    sendRegister() {
      Socket.Instance.send({
        cmd: 'register',
        param: {
          user_name: this.username,
          pass_word: this.password
        }
      })
    },
    sendLogin() {
      Socket.Instance.send({
        cmd: 'login',
        param: {
          user_name: this.username,
          pass_word: this.password
        }
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


