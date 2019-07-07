const state = {
  userInfo: JSON.parse(localStorage.getItem('USERINFO')) || '', //用户基本信息
  imgdata: {}, // 查看图片中的数据
  chatList: {}// 聊天的列表
}

export default state