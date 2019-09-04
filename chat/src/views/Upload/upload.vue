<template>
  <div class="field">
    <van-cell-group>
      <van-field
        v-model="message"
        type="textarea"
        placeholder="请说出你想说的话"
        rows="1"
        :autosize="{maxHeight: 200, minHeight: 150}"
        class="field-msg"
      />
    </van-cell-group>
    <van-uploader
      :before-read="beforeRead"
      :after-read="afterRead"
      @delete="fileDelete"
      accept="image/*"
      class="field-imglist"
      v-model="fileList"
      multiple
      :max-count="9"
    ></van-uploader>
    <van-button @click="sendReport" :loading="loading" type="primary" loading-text="发表中...">发 表</van-button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'upload',
  data() {
    return {
      message: '',
      fileList: [],
      postFileList: [],
      loading: false
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  created() {
    if (!this.userInfo) {
      this.$router.push({
        path: '/mypage'
      })
    }
  },
  methods: {
    beforeRead(file, detail) {
      console.log(file.length, detail, 'beforeRead')
      if (!file.length) {
        this.postFileList.push(file)
        return true
      }
      file.forEach(item => {
        this.postFileList.push(item)
      })
      return true
    },
    afterRead(file, detail) {
      console.log(this.postFileList, file.file, 'afterRead')
      return true
    },
    fileDelete(file) {
      // 删除需要上传的数据
      this.postFileList.forEach((item, index) => {
        if (item.name === file.file.name) {
          this.postFileList.splice(index, 1)
        }
      })
    },
    sendReport() {
      console.log(this.postFileList, 'postFileLists')
      let dataFrom = new FormData()
      this.postFileList.forEach(item => {
        console.log(item.name, 'item')
        dataFrom.append('file', item)
      })
      // dataFrom.append('writer',  this.userInfo._id)
      // dataFrom.append('content', this.message)
      this.$api.sendUpImg(dataFrom).then(({ data }) => {
        let obj = {
          writer: this.userInfo._id,
          content: this.message,
          uploadImg: data
        }
        this.$api.sendUpQyq(obj).then(({ msg }) => {
          this.$toast({
            duration: 700,
            message: msg,
            onClose: () => {
              this.$router.push({
                path: '/circle'
              })
            }
          })
        })
      })

      // this.$api.sendUpQyq(obj).then(res => {
      //   console.log('发表动态', res)
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
.field {
  &-imglist {
    margin-top: 10px;
  }
}
</style>

