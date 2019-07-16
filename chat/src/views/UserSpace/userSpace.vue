<template>
  <div class="userspace">
    <head-tab
      class="userspace-headtab headtab p-f"
      :title="$route.query.user_name"
      @back="$router.go(-1)"
      :back="true"
    >
      <transition slot="headright">
        <div @click="goChatRecord($route.query)" class="userspace-recordBtn">
          <span v-show="!isShowTopAvater">私 聊</span>
          <img v-show="isShowTopAvater" :src="userInfo.avater" />
        </div>
      </transition>
    </head-tab>
    <div class="userspace-bg-image" :style="bgStyle" ref="bgImage">
    </div>
    <div class="bg-layer" ref="bglayer"></div>
    <scroll
      class="p-f userspace-scroll"
      @scroll="scroll"
      :probe-type="probeType"
      :listenScroll="listenScroll"
      ref="scroll"
      :data="tQyqList"
      :pullup="true"
    >
      <div>
        <div class="userspace-filter p-ab flex ac ae dir-col">
          <img v-lazy="userInfo.avater" />
          <p>{{userInfo.signature}}</p>
        </div>
        <qyq-content class="userspace-qyq" :qyqList="tQyqList" @afreshQyq="getUserQyq" />
      </div>
    </scroll>
  </div>
</template>
<script>
import qyqContent from '../../components/qyqContent'
import { prefixStyle } from '../../utils/dom'

const RESERVED_HEIGHT = 40
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop')
export default {
  name: 'userspace',
  created() {
    this.getUserQyq()
    this.getUserInfo()
    this.probeType = 3
    this.listenScroll = true
  },
  components: {
    qyqContent
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.userInfo.cover})`
    }
  },
  data() {
    return {
      tQyqList: [], // 用户动态列表
      scrollY: 0,
      userInfo: {},
      isShowTopAvater: false // 是否显示右上角头像
    }
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
    // 把背景图片的高度设置到scroll的top
    this.$refs.scroll.$el.style.top = `${this.imageHeight}px`
  },
  methods: {
    scroll(pos) {
      this.scrollY = pos.y
    },
    goChatRecord(param) {
      this.$router.push({
        path: '/chat',
        query: {
          chatwithid: param.user_id,
          chatwith: param.user_name
        }
      })
    },
    getUserQyq() {
      this.$api
        .sendTQyqList({ writer: this.$route.query.user_id })
        .then(({ data }) => {
          console.log('返回的用户动态；', data)
          this.tQyqList = data
        })
    },
    // 获取当前用户
    getUserInfo() {
      this.$api
        .sendUserInfo({ _id: this.$route.query.user_id })
        .then(({ data }) => {
          this.userInfo = data
        })
    }
  },
  watch: {
    scrollY(newY) {
      // Math.max(this.minTranslateY, newY) 算出
      // newY的变化不能超过 this.minTranslateY 也就是背景图片的 -高度
      let tranlateY = Math.max(this.minTranslateY, newY)
      let zIndex = 0
      let scale = 1
      let blur = 0
      this.$refs.bglayer.style[transform] = `translate3d(0,${tranlateY}px,0)`
      const percent = Math.abs(newY / this.imageHeight)
      if (newY > 0) {
        scale = 1 + percent
        zIndex = 10
      } else {
        blur = Math.min(20 * percent, 20)
      }
      //this.$refs.filter.style[backdrop] = `blur(${blur}px)`
      // 也就是滚到图片顶部的时候
      if (newY < this.minTranslateY + 10) {
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
        // 设置头像到右上角
        this.$refs.scroll.$el.style.zIndex = 2
        this.isShowTopAvater = true
      } else {
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = '0px'
        this.$refs.scroll.$el.style.zIndex = 11
          this.isShowTopAvater = false
      }
      //  下拉的时候让 背景方法，上拉的时候scale 为1 不变
      this.$refs.bgImage.style.zIndex = zIndex
      this.$refs.bgImage.style[transform] = `scale(${scale})`
    }
  }
}
</script>
<style lang="scss" scoped>
.userspace {
  padding: 0;
  bottom: 0;
  z-index: 12;
  background: #fff;
  &-headtab {
    &.headtab {
      top: 0;
      z-index: 40;
      background: none;
      color: #fff;
      padding: 0 10px;
    }
  }
  &-recordBtn{
    width: 40px;
    height: 100%;
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      padding: 5px;
    }
  }
  &-bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;
  }
  &-qyq {
    padding: 0 10px;
    background: #fff;
    padding-top: 30px;
  }
  &-scroll {
    &.p-f {
      width: 100%;
      top: 0;
      bottom: 0;
      overflow: initial;
      height: auto;
    }
  }
  &-filter {
    top: -40px;
    right: 10px;
    font-size: $msgSize;
    img {
      width: 60px;
      height: 60px;
      border-radius: 5px;
      margin-bottom: 5px;
    }
  }
}
</style>
