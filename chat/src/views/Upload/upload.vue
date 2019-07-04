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
      capture="camera"
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
  methods: {
    beforeRead(file, detail) {
      console.log(file, detail, 'beforeRead')
      return true
    },
    afterRead(file, detail) {
      console.log(file, detail, 'afterRead')
      this.postFileList.push(file.file)
      return true
    },
    fileDelete(file) {
      // 删除需要上传的数据
      this.postFileList.forEach((item, index) => {
        if (item.name === file.file.name) {
          this.postFileList.splice(index, 1)
        }
      })
      console.log(this.postFileList, 'postFileLists')
    },
    sendReport() {
      // 发表
      let dataFrom = new FormData()
      dataFrom.append('file', this.postFileList)
      let obj = {
        user_id: this.userInfo._id,
        content: this.message,
        dataFrom
      }
      this.$api.sendUpQyq(obj).then(res => {
        console.log('发表动态', res)
      })
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

