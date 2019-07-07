<template>
  <div class="mypage">
    <head-tab title="我" />
    <!-- 未登陆 -->
    <div
      v-if="!userInfo"
      class="nologin text-c"
    >
      <img src="../../assets/logo.png" />
      <div>
        <p>您还没有登录</p>
        <p>
          请先
          <router-link
            tag="span"
            to="/login"
          >登录</router-link>
        </p>
      </div>
    </div>
    <!-- 已登陆 -->
    <!--<div v-else>
      <div class="user flex dir-r">
        <img
          class="user-avater"
          :src="userInfo.avater"
        />
        <div class="flex dir-col">
          <p class="user-name">{{userInfo.user_name}}</p>
          <p class="user-sign">{{userInfo.signature}}</p>
          <p class="user-sign">地区</p>
        </div>
      </div>
      <div class="user user-qyq">自己的朋友圈</div>
      <van-button
        type="danger"
        size="large"
        class="user-logout"
      >退出登录</van-button>
    </div>-->
    <div v-else>
      <van-cell
        title="头像"
        is-link
        value="内容"
      />
      <van-cell
        title="名字"
        is-link
        :value="userInfo.user_name"
      />
      <van-cell
        title="个性签名"
        is-link
        value-class="info-sign"
        @click="alterCotent('设置个性签名', 'signature', userInfo.signature)"
        :value="userInfo.signature"
      />
      <van-button
        type="danger"
        size="large"
        class="user-logout"
        @click="logOut"
      >退出登录</van-button>
    </div>
    <!-- 修改内容 -->
    <van-popup
      v-model="showContent"
      position="bottom"
      :style="{ height: '30%' }"
      class="alter"
    >
      <van-cell-group>
        <div class="flex alter-topbox jb">
          <van-icon
            @click="showContent = false"
            name="arrow-left"
          />
          <span class="alter-title">{{alterType}}</span>
          <van-button
            size="small"
            @click="submitContent"
            type="primary"
          >确 定</van-button>
        </div>
        <van-field
          v-model="alterValueEnd"
          type="textarea"
          :focus="alterFocus"
          class="aa"
          autosize
        />
      </van-cell-group>
    </van-popup>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { Dialog } from "vant";
export default {
  name: "mypage",
  computed: {
    ...mapState(["userInfo"])
  },
  data() {
    return {
      showContent: false, // 是否显示修改内容框
      alterType: "", // 修改类型
      alterValue: "", // 修改内容
      alterName: "", // 需要修改的字段
      alterValueEnd: "", //修改后的内容
      alterFocus: false // 选中
    };
  },
  methods: {
    ...mapMutations(["set_userInfo"]),
    // 退出登录
    logOut() {
      Dialog.confirm({
        title: "提示",
        message: "确认退出当前账号吗？"
      })
        .then(() => {
          // on confirm
          localStorage.removeItem("USERINFO");
          this.set_userInfo("");
        })
        .catch(() => {
          // on cancel
        });
    },
    alterCotent(type, alterName, value) {
      this.alterType = type;
      this.alterValue = value;
      this.alterName = alterName;
      this.showContent = true;
      setTimeout(() => {
        this.alterFocus = true;
      }, 500);
    },
    // 修改内容
    submitContent() {
      if (!this.alterValueEnd) {
        this.showContent = false;
        return;
      }
      let obj = {
        user_id: this.userInfo._id,
        alter: {
          signature: this.alterValueEnd
            ? this.alterValueEnd
            : "这个人很懒，什么都没写"
        }
      };

      this.$toast.loading();
      this.$api.sendAlterInfo(obj).then(({ msg }) => {
        this.$api.sendUserInfo({ _id: this.userInfo._id }).then(({ data }) => {
          this.$toast({
            message: msg,
            dispatch: 700,
            onClose: () => {
              this.showContent = false;
              this.set_userInfo(data);
              this.alterValueEnd = "";
            }
          });
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.mypage {
  .nologin {
  }
}
.alter {
  &-topbox {
    padding: 10px;
  }
  &-title {
    font-size: $nameSize;
  }
}
.info {
  &-sign {
    flex: 0 0 70%;
  }
}
.user {
  background: #fff;
  padding: 10px;
  margin-bottom: 10px;
  &-avater {
    width: 60px;
    height: 60px;
    margin-right: 20px;
  }
  &-name {
    font-size: $titSize;
  }
  &-sign {
    font-size: $msgSize;
  }
  &-logout {
    display: block;
    width: 80%;
    margin: 0 auto;
    margin-top: 20px;
  }
}
</style>


