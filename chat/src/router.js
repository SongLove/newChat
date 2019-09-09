import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './views/Home/home.vue'
import Circle from './views/Circle/circle.vue'
import NewsChat from './views/NewsChat/newsChat.vue'
import Chat from './views/NewsChat/chat.vue'
import Upload from './views/Upload/upload.vue'
import Search from './views/Search/search.vue'
import MyPage from './views/MyPage/myPage.vue'
import Login from './views/Login/login.vue'
import UserSpace from './views/UserSpace/userSpace.vue'
import changeAvater from './views/MyPage/changeAvater.vue'

Vue.use(VueRouter)

let router = new VueRouter({
  linkActiveClass: 'active',
  routes: [
    { path: '/', name: Home.name, component: Home, meta: { keepAlive: false } },
    { path: '/circle', name: Circle.name, component: Circle, meta: { keepAlive: true } },
    { path: '/news', name: NewsChat.name, component: NewsChat, meta: { keepAlive: false } },
    { path: '/upload', name: Upload.name, component: Upload, meta: { keepAlive: true } },
    { path: '/search', name: Search.name, component: Search, meta: { keepAlive: true } },
    {
      path: '/mypage', name: MyPage.name, component: MyPage, meta: { keepAlive: false },
      children: [
        {
          path:'/mypage/avater',
          component: changeAvater,
          meta: { keepAlive: true }
        }
      ]
    },
    { path: '/login', name: Login.name, component: Login, meta: { keepAlive: true } },
    { path: '/chat', name: Chat.name, component: Chat, meta: { keepAlive: true } },
    { path: '/userspace', name: UserSpace.name, component: UserSpace, meta: { keepAlive: true } }
  ]
})

export default router
