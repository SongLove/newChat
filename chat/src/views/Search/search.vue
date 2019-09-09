<template>
  <div class="search">
    <div class="search-input-box flex ac je">
      <div class="search-box flex ac je">
        <i class="iconfont icon-fanhui search-back" v-show="showBack" @click="hideSearchType"></i>
        <div :class="{'type':showBack}" class="search-content flex ac">
          <i class="iconfont icon-sousuo"></i>
          <van-field
            @input="searchIng"
            v-model="msgInp"
            class="search-input"
            center
            clearable
            :placeholder="typeName"
          />
        </div>
      </div>
      <div @click="$router.go(-1)" class="search-back">取消</div>
    </div>
    <!-- 查找到的内容 -->
    <div v-show="showBack" class="search-seekout">
      <ul>
        <li
          class="search-user-list"
          v-for="(item, index) in searchList"
          :key="index"
          v-space="[item._id, item.user_name]"
        >
          <div class="flex ac" v-if="searchType === 'user'">
            <div class="search-user-avater">
              <img :src="item.avater" />
            </div>
            <div class="search-user-name">{{item.user_name}}</div>
          </div>
          <div class="search-circle" v-if="searchType === 'circle'">
            <div class="search-user-avater">
              <img :src="item.writer.avater" />
            </div>
            <div class="search-user-name">{{item.writer.user_name}}</div>
          </div>
        </li>
      </ul>
    </div>
    <!-- 查找类型 默认是聊天记录  -->
    <div v-show="!showBack" class="search-type flex dir-col ac jc">
      <div class="search-type-title">搜索指定内容</div>
      <ul class="flex ac jc">
        <li
          v-for="(item, index) in searchTypes"
          :key="index"
          @click="changeType(item)"
        >{{item.name}}</li>
      </ul>
    </div>
    <!-- 朋友圈搜索条件 -->
    <div v-if="searchType === 'circle'" class="search-circle-condition flex ac jc">
      <span>发布人</span>
      <span>发布时间</span>
    </div>
    <div v-show="searchLoading && firstSearch" class="flex ac jc">
      <van-loading color="#1989fa" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'search',
  data() {
    return {
      msgInp: '',
      typeName: '搜索',
      searchTypes: [
        { name: '朋友圈', type: 'circle' },
        { name: '用户', type: 'user' }
      ],
      firstSearch: true,
      searchList: [],
      searchType: '',
      searchLoading: false,
      showBack: false // 控制返回 显示返回时候的宽度
    }
  },
  methods: {
    hideSearchType() {
      this.showBack = false
      this.typeName = '搜索'
      this.searchList = []
      this.msgInp = ''
      this.searchType = ''
    },
    /**
     * 切换搜索类型
     * @param type 搜索列表
     */
    changeType(type) {
      this.showBack = true
      this.typeName = type.name
      this.searchType = type.type
    },
    searchIng(val) {
      if (this.firstSearch) this.searchLoading = true
      let obj = {
        search: val,
        type: this.searchType
      }
      this.$api.sendSearch(obj).then(({ data }) => {
        this.searchList = data
        console.log(data)
        this.searchLoading = false
        this.firstSearch = false
        if (!val) this.firstSearch = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  padding: 10px 0;
  bottom: 0;
  z-index: 12;
  background: #ddd;
  font-size: $msgSize;
  &-circle {
    &-condition {
      background: #fff;
      padding: 10px 0;
      span{
        flex: 1;
        text-align: center;
        font-size: $msgSize;
      }
    }
  }
  &-seekout {
    width: 100%;
    height: auto;
    background: #fff;
  }
  &-user {
    &-list {
      margin: 10px 10px 10px 10px;
    }
    &-avater img {
      width: 50px;
      height: 50px;
      border-radius: 5px;
    }
    &-name {
      font-size: $nameSize;
      font-weight: 500;
    }
  }
  &-box {
    width: 90%;
  }
  &-type {
    height: 80px;
    &-title {
      margin-bottom: 10px;
    }
    li {
      width: 60px;
      text-align: center;
    }
  }
  &-back {
    flex: 1;
    text-align: center;
  }
  &-content {
    background: #fff;
    padding-left: 5px;
    width: 100%;
    margin-right: 5px;
    border-radius: 5px;
    transition: all 0.5s ease-in;
    &.type {
      width: 90%;
    }
  }
  &-input {
    padding: 0;
    border: none;
    height: 30px;
    width: 90%;
    margin-left: 5px;
  }
  &-input-box {
    width: 100%;
    margin-bottom: 10px;
    padding: 0 10px;
  }
}
</style>

