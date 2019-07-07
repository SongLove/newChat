<template>
  <div
    id="app"
    class="flex dir-col"
  >
    <router-view
      v-if="!$route.meta.keepAlive"
      class="content"
    />
    <transition name="slide">
      <router-view
        v-if="$route.meta.keepAlive"
        class="content"
      />
    </transition>
    <footer-tab />
  </div>
</template>

<script>
import Socket from "./utils/socket";
import footerTab from "./components/footerTab.vue";
import { mapState } from "vuex";

export default {
  name: "app",
  components: {
    footerTab
  },
  created() {
    this.updateSocket();
  },
  computed: {
    ...mapState(["userInfo"])
  },
  methods: {
    updateSocket() {
      if (this.userInfo) {
        Socket.Instance.send({
          cmd: "login",
          param: {
            user_name: this.userInfo.user_name,
            pass_word: this.userInfo.password
          }
        });
      }
    }
  },
  beforeCreate() {
    Socket.Instance.init();
  }
};
</script>

<style lang="scss" scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
  background: #fff;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}
.slide-enter {
  transform: translate3d(0, 100%, 0);
}
.slide-leave-active {
  transform: translate3d(0, 100%, 0);
}
</style>

