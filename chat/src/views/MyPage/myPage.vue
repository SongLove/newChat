<template>
  <div class="mypage">
    <head-tab title="我" />
    <!-- 未登陆 -->
    <div v-if="!userInfo" class="nologin text-c">
      <img src="../../assets/logo.png" />
      <div>
        <p>您还没有登录</p>
        <p>
          请先
          <router-link tag="span" to="/login">登录</router-link>
        </p>
      </div>
    </div>
    <div v-else>
      <van-cell title="头像" is-link>
        <img class="user-avater" :src="userInfo.avater" />
        <!-- <van-uploader :after-read="afterRead" :max-count="1"  v-model="fileAvater" /> -->
        <input type="file" ref="file" @change="afterRead" accept="image/*" />
      </van-cell>
      <van-cell title="名字" is-link :value="userInfo.user_name" />
      <van-cell
        title="个性签名"
        is-link
        value-class="info-sign"
        @click="alterCotent('设置个性签名', 'signature', userInfo.signature)"
        :value="userInfo.signature"
      />
      <van-button type="danger" size="large" class="user-logout" @click="logOut">退出登录</van-button>
    </div>
    <!-- 修改内容 -->
    <van-popup v-model="showContent" position="bottom" :style="{ height: '30%' }" class="alter">
      <van-cell-group>
        <div class="flex alter-topbox jb">
          <van-icon @click="showContent = false" name="arrow-left" />
          <span class="alter-title">{{alterType}}</span>
          <van-button size="small" @click="submitContent" type="primary">确 定</van-button>
        </div>
        <van-field v-model="alterValueEnd" type="textarea" :focus="alterFocus" class="aa" autosize />
      </van-cell-group>
    </van-popup>
    <!-- <avater v-if="fileAvater" :img="fileAvater" /> -->
    <router-view @ok="ok" @cancel="cancel" />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { Dialog } from 'vant'
import Avater from './changeAvater'
export default {
  name: 'mypage',
  computed: {
    ...mapState(['userInfo'])
  },
  components: {
    Avater
  },
  data() {
    return {
      showContent: false, // 是否显示修改内容框
      alterType: '', // 修改类型
      alterValue: '', // 修改内容
      alterName: '', // 需要修改的字段
      alterValueEnd: '', //修改后的内容
      fileAvater: '',
      alterFocus: false // 选中
    }
  },
  // watch: {
  //   $route(to, from) {
  //     console.log(to, from)
  //     if (from.name === 'avater' && from.params.url) {
  //       // 上传图片
  //       let dataFrom = new FormData()
  //       let blod = this.dataURLtoBlob(from.params.url)
  //       let file = this.blobToFile(blod, 'avater')
  //       dataFrom.append('file', file)
  //       this.$api.sendUpImg(dataFrom).then(({ data }) => {
  //         console.log('回传的图片', data)
  //         this.changeAvater(data[0])
  //       })
  //     }
  //   }
  // },
  methods: {
    ok(val) {
      this.$router.go(-1)
      let dataFrom = new FormData()
      let blod = this.dataURLtoBlob(val)
      let file = this.blobToFile(blod, 'avater')
      dataFrom.append('file', file)
      this.$api.sendUpImg(dataFrom).then(({ data }) => {
        console.log('回传的图片', data)
        this.changeAvater(data[0])
      })
    },
    cancel() {
      this.$router.go(-1)
    },
    //将base64转换为blob
    dataURLtoBlob(dataurl) {
      var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    },
    //将blob转换为file
    blobToFile(theBlob, fileName) {
      theBlob.lastModifiedDate = new Date()
      theBlob.name = fileName
      return theBlob
    },
    afterRead(e) {
      let reader = new FileReader()
      let that = this
      reader.onload = (function(file) {
        return function(e) {
          that.$router.push({
            name: 'avater',
            params: {
              url: this.result
            }
          })
          that.fileAvater = this.result
        }
      })(e.target.files[0])
      reader.readAsDataURL(e.target.files[0])
    },
    getBase64(file) {
      var reader = new FileReader()
      let url
      reader.onload = function(e) {
        console.log(reader.result) //或者 e.target.result都是一样的，都是base64码
        url = reader.result
      }
      reader.readAsDataURL(file)
      return url
    },
    ...mapMutations(['set_userInfo']),
    // 退出登录
    logOut() {
      Dialog.confirm({
        title: '提示',
        message: '确认退出当前账号吗？'
      })
        .then(() => {
          // on confirm
          localStorage.removeItem('USERINFO')
          this.set_userInfo('')
        })
        .catch(() => {
          // on cancel
        })
    },
    alterCotent(type, alterName, value) {
      this.alterType = type
      this.alterValue = value
      this.alterName = alterName
      this.showContent = true
      setTimeout(() => {
        this.alterFocus = true
      }, 500)
    },
    // 修改头像
    changeAvater(url) {
      let obj = {
        user_id: this.userInfo._id,
        alter: {
          avater: url
        }
      }
      this.$toast.loading()
      this.$api.sendAlterInfo(obj).then(({ msg }) => {
        this.$api.sendUserInfo({ _id: this.userInfo._id }).then(({ data }) => {
          this.$toast({
            message: msg,
            dispatch: 700,
            onClose: () => {
              this.showContent = false
              this.set_userInfo(data)
              this.alterValueEnd = ''
            }
          })
        })
      })
    },
    // 修改内容
    submitContent() {
      if (!this.alterValueEnd) {
        this.showContent = false
        return
      }
      let obj = {
        user_id: this.userInfo._id,
        alter: {
          signature: this.alterValueEnd
            ? this.alterValueEnd
            : '这个人很懒，什么都没写'
        }
      }
      this.$toast.loading()
      this.$api.sendAlterInfo(obj).then(({ msg }) => {
        this.$api.sendUserInfo({ _id: this.userInfo._id }).then(({ data }) => {
          this.$toast({
            message: msg,
            dispatch: 700,
            onClose: () => {
              this.showContent = false
              this.set_userInfo(data)
              this.alterValueEnd = ''
            }
          })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.mypage {
  .nologin {
  }
}
.alter {
  &-topbox {
    padding: 10px;
  }
  &-title {
    font-size: $nameSize;
  }
}
.info {
  &-sign {
    flex: 0 0 70%;
  }
}
.user {
  background: #fff;
  padding: 10px;
  margin-bottom: 10px;
  &-avater {
    width: 40px;
    height: 40px;
  }
  &-name {
    font-size: $titSize;
  }
  &-sign {
    font-size: $msgSize;
  }
  &-logout {
    display: block;
    width: 80%;
    margin: 0 auto;
    margin-top: 20px;
  }
}
</style>


