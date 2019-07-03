<template>
  <div class="head-tab flex ac jc jb">
    <div>
      <i class="iconfont icon-fanhui" v-if="back" @click="$router.go(-1)"></i>
    </div>
    <div class="head-tab-title">{{title}}</div>
    <div>
      <slot name="headright"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'headtab',
  props: {
    title: {
      type: String,
      default: '标题'
    },
    back: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="scss" scoped>
.head-tab {
  width: 100%;
  height: 40px;
  font-size: $nameSize;
  background: $tabBg;
  &-title {
    font-size: $titSize;
  }
}
</style>

