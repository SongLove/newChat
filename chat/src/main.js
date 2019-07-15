import Vue from 'vue'
import App from './App.vue'
import router from './router'
import *as Vant from 'vant'
import { Toast } from 'vant'
import store from './store'
import 'minireset.css'
import 'vant/lib/index.css'
import './assets/styles/index.scss'
import './assets/iconFonts/iconfont.css'
import { setRem } from './utils/rem.js'
import axios from './api'
import components from './utils/components'
import Directives from './utils/directives'
Vue.use(axios)
Vue.use(components)

Vue.config.productionTip = false
Vue.use(Vant)
// 全局自定义方法
Object.keys(Directives).forEach(item => {
  Vue.directive(item, Directives[item])
})

Toast.setDefaultOptions({ duration: 1200 })
Vue.use(Toast)
/* 设置rem */
setRem(document, window)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
