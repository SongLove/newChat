<template>
  <div class="userspace">
    <head-tab
      class="userspace-headtab p-f"
      :title="$route.query.user_name"
      @back="$router.go(-1)"
      :back="true"
    >
      <van-button
        @click="goChatRecord($route.query)"
        class="recordBtn"
        slot="headright"
        type="primary"
        size="large"
      >发消息</van-button>
    </head-tab>
    <div class="userspace-bg-image" :style="bgStyle" ref="bgImage">
      <div class="filter" ref="filter"></div>
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
      <qyq-content :qyqList="tQyqList" @afreshQyq="getUserQyq" />
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
  data() {
    return {
      tQyqList: [], // 用户动态列表
      bgStyle:
        'background-image:url(http://y.gtimg.cn/music/photo_new/T003R300x300M000003IZaQY4TJcOC.jpg)',
      scrollY: 0
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
      this.$api.sendUserInfo({ _id: this.$route.query.user_id }).then(res => {
        console.log('个人空间：', res)
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
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`
      // 也就是滚到图片顶部的时候
      if (newY < this.minTranslateY) {
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
      } else {
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = '0px'
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
    top: 0;
    z-index: 40;
    background: none;
  }
  &-bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;
  }
  &-scroll{
    width: 100%;
    padding: 0 10px;
    margin-top: 10px;
  }
}
</style>
