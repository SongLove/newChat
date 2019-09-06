<template>
  <div class="head-tab p-ab flex ac jb">
    <div class="head-left">
      <i class="iconfont icon-fanhui" v-if="back" @click="$emit('back')"></i>
    </div>
    <div class="head-title ellipsis p-ab">{{title}}</div>
    <div class="head-right">
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
.head {
  &-tab {
    width: 100%;
    height: 40px;
    top: 0;
    left: 0;
    font-size: $nameSize;
    background: $tabBg;
    padding: 0 10px;
  }
 
  &-right {
    right: 0;
  }
  &-title {
    font-size: $titSize;
    text-align: center;
    width: 50%;
    left: 25%;
  }
}
</style>

