<template>
  <scroll>
    <article>
      <div v-for="(qyq, index) in qyqList" :key="index" class="qyq flex dir-row p-r">
        <van-skeleton title avatar :row="3" style="width: 100%" :loading="loading" >
          <!-- 头像 -->
          <img
            v-space="[qyq.writer._id, qyq.writer.user_name]"
            class="qyq-avater"
            v-lazy="qyq.writer.avater"
          />
          <!-- 动态内容 -->
          <div class="qyq-msgbox">
            <p
              v-space="[qyq.writer._id, qyq.writer.user_name]"
              class="qyq-name atc ellipsis"
            >{{qyq.writer.user_name}}</p>
            <p class="qyq-content ellipsis3">{{qyq.content}}</p>
            <!-- 是否带图片 -->
            <ul class="qyq-pimgs flex fw">
              <li
                class="qyq-pimgslist flex ac jc"
                v-for="(item,index) in qyq.uploadImg"
                :key="index"
              >
                <img :src="item" :preview="qyq._id" v-lazy="item" :preview-text="qyq.content" />
              </li>
            </ul>
            <!-- 评论 -->
            <div class="qyq-interact flex jb ac">
              <span>{{qyq.addTime | fomatTime}}</span>
              <span class="comment" @click="commentQyq(qyq)">评论</span>
            </div>
            <!-- 评论列表 -->
            <ul class="qyq-commentlist" v-for="(comment, index) in qyq.comments" :key="index">
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
            @click="deleteQyq(qyq._id)"
            class="iconfont icon-guanbi qyq-close p-ab"
          ></i>
        </van-skeleton>
      </div>
      <!-- <loading v-show="loading" /> -->
    </article>
    <!-- 评论内容 -->
    <van-popup
      v-model="showComment"
      class="qyq-comment"
      position="bottom"
      :style="{ height: '18%' }"
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
          <van-button slot="button" size="small" @click="submitCommtent" type="primary">发 送</van-button>
        </van-field>
      </van-cell-group>
    </van-popup>
  </scroll>
</template>

<script>
import { mapState } from 'vuex'
import { Dialog } from 'vant'

export default {
  name: 'qyqcontent',
  props: {
    qyqList: {
      tyep: Array,
      default: []
    }
  },
  watch: {
    qyqList(val) {
      console.log(val, 'bian')
      this.$previewRefresh()
    }
  },
  data() {
    return {
      showComment: false, // 是否显示评论弹窗
      replyLab: '', // 回复谁
      commentContent: '', // 评论或者回复内容
      atQyq: {}, // 当前评论或者回复的数据
      atReply: {}, // 当前回复的数据
      loading: false
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    // 删除动态
    deleteQyq(qyqid) {
      Dialog.confirm({
        title: '消息',
        message: '请问是否确认删除此消息'
      })
        .then(() => {
          console.log(qyqid)
          this.$api.sendDeleteQyq({ _id: qyqid }).then(({ msg }) => {
            this.$toast({
              duration: 700,
              message: msg,
              onClose: () => {
                this.$emit('afreshQyq')
              }
            })
          })
        })
        .catch(() => {
          // on cancel
        })
    },
    /**
     * 评论
     * @param qyq 动态
     * @param reply 为回复内容
     */
    commentQyq(qyq, reply) {
      this.atQyq = qyq
      this.atReply = reply
      this.showComment = true
      if (reply) {
        this.replyLab = `回复@${reply.from}`
      } else {
        this.replyLab = `评论@${qyq.writer.user_name}`
      }
    },
    // 提交评论或者回复
    submitCommtent() {
      let obj = {
        from: this.userInfo.user_name, // 来之谁的评论
        to: this.atReply ? this.atReply.from : '', // 回复谁的评论
        writer: this.atQyq.writer.user_name, // 这条评论的作者
        content: this.commentContent, // 评论内容
        qyq: this.atQyq._id // 评论的id
      }
      console.log(obj)
      this.$api.sendComment(obj).then(({ msg }) => {
        this.$toast({
          message: msg,
          duration: 100,
          onClose: () => {
            this.showComment = false
            this.commentContent = ''
            this.$emit('afreshQyq')
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.qyq {
  margin-top: 10px;
  border-bottom: 1px solid #000;
  padding-bottom: 10px;
  &-pimgs {
    margin: 10px 0;
    overflow: hidden;
  }
  &-pimgslist {
    width: 29%;
    height: 100px;
    margin: 5px;
  }
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
    width: 80%;
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
  &-comment {
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

