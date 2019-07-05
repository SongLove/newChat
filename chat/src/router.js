import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './views/Home/home.vue'
import NewsChat from './views/NewsChat/newsChat.vue'
import Chat from './views/NewsChat/chat.vue'
import Upload from './views/Upload/upload.vue'
import Search from './views/Search/search.vue'
import MyPage from './views/MyPage/myPage.vue'
import Login from './views/Login/login.vue'
import UserSpace from './views/UserSpace/userSpace.vue'

Vue.use(VueRouter)

let router = new VueRouter({
  mode: 'history',
  linkActiveClass: 'active',
  routes: [
    { path: '/', name: Home.name, component: Home },
    { path: '/news', name: NewsChat.name, component: NewsChat },
    { path: '/upload', name: Upload.name, component: Upload },
    { path: '/search', name: Search.name, component: Search },
    { path: '/mypage', name: MyPage.name, component: MyPage },
    { path: '/login', name: Login.name, component: Login },
    { path: '/chat', name: Chat.name, component: Chat },
    { path: '/userspace', name: UserSpace.name, component: UserSpace }
  ]
})

export default router
