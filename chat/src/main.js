import Vue from 'vue'
import App from './App.vue'
import router from './router'
import *as Vant from 'vant'
import { Toast } from 'vant'
import 'minireset.css'
import 'vant/lib/index.css'
import './assets/styles/index.scss'
import './assets/iconFonts/iconfont.css'
import { setRem } from './utils/rem.js'
import axios from './api'
Vue.use(axios)

Vue.config.productionTip = false
Vue.use(Vant)
Toast.setDefaultOptions({ duration: 1200 })
Vue.use(Toast)
/* 设置rem */
setRem(document, window)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
