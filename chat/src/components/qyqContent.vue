<template>
  <div>
    <article>
      <div
        v-for="(qyq, index) in qyqList"
        :key="index"
        class="qyq flex dir-row p-r"
      >
        <!-- 头像 -->
        <img
          @click="goUserSpace(qyq.writer._id, qyq.writer.user_name)"
          class="qyq-avater"
          :src="qyq.writer.avater"
        />
        <!-- 动态内容 -->
        <div class="qyq-msgbox">
          <p
            @click="goUserSpace(qyq.writer._id, qyq.writer.user_name)"
            class="qyq-name"
          >{{qyq.writer.user_name}}</p>
          <p class="qyq-content">{{qyq.content}}</p>
          <!-- 是否带图片 -->
          <ul class="qyq-pimgs"></ul>
          <!-- 评论 -->
          <div class="qyq-interact flex jb ac">
            <span>{{qyq.addTime}}</span>
            <span
              class="comment"
              @click="commentQyq(qyq)"
            >评论</span>
          </div>
          <!-- 评论列表 -->
          <ul
            class="qyq-commentlist"
            v-for="(comment, index) in qyq.comments"
            :key="index"
          >
            <li @click="commentQyq(qyq, comment)">
              <!-- 评论 -->
              <div v-if="!comment.to">
                <span class="qyq-commentlist-name namecolor">{{comment.from}}：</span>
                <span class="qyq-commentlist-conent">{{comment.content}}</span>
              </div>
              <!-- 回复 -->
              <div v-else>
                <span class="qyq-commentlist-name">
                  <span class="namecolor">{{comment.from}}</span>
                  回复
                  <span class="namecolor">{{comment.to}}：</span>
                </span>
                <span class="qyq-commentlist-conent">{{comment.content}}</span>
              </div>
            </li>
          </ul>
        </div>
        <!--如果是当前用户的动态 显示删除按钮-->
        <i
          v-if="qyq.writer._id == userInfo._id"
          class="iconfont icon-guanbi qyq-close p-ab"
        ></i>
      </div>
    </article>
    <!-- 评论内容 -->
    <van-popup
      v-model="showComment"
      position="bottom"
      :style="{ height: '20%' }"
    >
      <van-cell-group>
        <van-field
          v-model="commentContent"
          :label="replyLab"
          type="textarea"
          placeholder="请输入您要说的内容"
          rows="1"
          :autosize="{maxHeight: 200, minHeight: 150}"
        >
          <van-button
            slot="button"
            size="small"
            @click="submitCommtent"
            type="primary"
          >发 送</van-button>
        </van-field>
      </van-cell-group>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "qyqcontent",
  props: {
    qyqList: {
      tyep: Array,
      default: []
    }
  },
  data() {
    return {
      showComment: false, // 是否显示评论弹窗
      replyLab: "", // 回复谁
      commentContent: "", // 评论或者回复内容
      atQyq: {}, // 当前评论或者回复的数据
      atReply: {} // 当前回复的数据
    };
  },
  computed: {
    ...mapState(["userInfo"])
  },
  methods: {
    /**
     * 评论
     * @param qyq 动态
     * @param reply 为回复内容
     */
    commentQyq(qyq, reply) {
      this.atQyq = qyq;
      this.atReply = reply;
      this.showComment = true;
      if (reply) {
        this.replyLab = `回复@${reply.from}`;
      } else {
        this.replyLab = `评论@${qyq.writer.user_name}`;
      }
    },
    // 提交评论或者回复
    submitCommtent() {
      let obj = {
        from: this.userInfo.user_name, // 来之谁的评论
        to: this.atReply ? this.atReply.from : "", // 回复谁的评论
        writer: this.atQyq.writer.user_name, // 这条评论的作者
        content: this.commentContent, // 评论内容
        qyq: this.atQyq._id // 评论的id
      };
      console.log(obj);
      this.$api.sendComment(obj).then(({ msg }) => {
        this.$toast({
          message: msg,
          duration: 100,
          onClose: () => {
            this.showComment = false;
            this.$emit("afreshQyq");
          }
        });
      });
    },
    // 进入用户空间
    goUserSpace(user_id, user_name) {
      console.log(this);
      this.$router.push({
        path: "/userspace",
        query: {
          user_id,
          user_name
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.qyq {
  margin-top: 10px;
  border-bottom: 1px solid #000;
  padding-bottom: 10px;
  &-msgbox {
    width: 100%;
  }
  &-avater {
    width: 50px;
    height: 50px;
    margin-right: 10px;
    border-radius: 5px;
  }
  &-name {
    font-size: $nameSize;
    margin-bottom: 5px;
  }
  &-content {
    font-size: $msgSize;
  }
  &-close {
    right: 10px;
  }
  &-interact {
    font-size: $msgSize;
    margin: 5px 0;
  }
  &-commentlist {
    width: 100%;
    max-height: 150px;
    background: #fff;
    border-radius: 3px;
    padding: 5px;
    font-size: $nameSize;
  }
}
</style>

