<template>
  <div id="app" class="flex dir-col">
    <keep-alive><router-view class="content"/></keep-alive>
    <footer-tab/>
  </div>
</template>

<script>
import Socket from './utils/socket'
import footerTab from './components/footerTab.vue'

export default {
  name: 'app',
  components: {
    footerTab
  },
  beforeCreate () {
    Socket.Instance.init()
  }
}
</script>

<style lang="scss" scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
}
</style>

