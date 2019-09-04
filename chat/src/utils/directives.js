// 全局函数

import router from '../router'

export default {
  space: {
    bind: function (el, binding) {
      el.addEventListener('click', (e) => {
        e.stopPropagation()
        console.log(binding.value, 'vlaue')
        router.push({
          path: "/userspace",
          query: {
            user_id: binding.value[0],
            user_name: binding.value[1]
          }
        })
      })
    }
  }
}