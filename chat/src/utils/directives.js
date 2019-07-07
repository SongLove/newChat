// 全局函数
export default {
  userSpace: {
    bind: function (el) {
      el.addEventListener('click', (e) => {
        e.stopPropagation()
      })
    }
  }
}