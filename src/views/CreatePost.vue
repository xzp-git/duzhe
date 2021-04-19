<template>
  <div class="create-post-page">
    <h4>新建文章</h4>
    <Uploader action="/api/upload" :beforeUpload="beforeUpload" @file-uploaded='onUploadFile' @file-uploaded-error='onUploadFileError'>
      <template #uploaded="dataProps">
        <img :src="dataProps.uploadedData.data.url" width="500">
      </template>
    </Uploader>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题：</label>
        <validate-input
          :rules="titleRules" v-model="titlelVal"
          placeholder="请输入文章标题"
          type="text"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">文章详情：</label>
        <validate-input
          type="text"
          tag="textarea"
          placeholder="请输入文章详情"
          :rules="contentRules"
          v-model="contentVal"
        />
      </div>
      <template #submit>
        <button type="submit" class="btn btn-primary btn-block btn-large">发表文章 </button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { GlobalDataProps, PostProps, ResponseType, ImageProps } from '../store/index'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import Uploader from '../components/Uploader.vue'
import createMessage from '../hooks/createMessage'
export default defineComponent({
  components: {
    ValidateInput,
    ValidateForm,
    Uploader
  },
  setup () {
    const router = useRouter()
    const store = useStore<GlobalDataProps>()
    const titleRules: RulesProp = [
      { type: 'required', message: '文章标题不能为空' }
    ]
    const contentRules: RulesProp = [
      { type: 'required', message: '文章详情不能为空' }
    ]
    const titleVal = ref('')
    const contentVal = ref('')
    const onFormSubmit = (res:boolean) => {
      if (res) {
        const { column } = store.state.user
        if (column) {
          const newPost: PostProps = {
            title: titleVal.value,
            content: contentVal.value,
            column
          }
          store.commit('createPost', newPost)
          router.push({ name: 'column', params: { id: column } })
        }
      }
    }
    const beforeUpload = (file: File) => {
      const isJPG = file.type === 'image/jpeg'
      if (!isJPG) {
        createMessage('上传图片只能是JPG格式', 'error')
      }
      return isJPG
    }
    const onUploadFile = (res: ResponseType<ImageProps>) => {
      if (res.code === 0) {
        createMessage('上传图片成功', 'success')
      }
    }
    const onUploadFileError = (res: ResponseType<ImageProps>) => {
      createMessage('上传图片失败', 'error')
      console.log(res)
    }

    return {
      titleRules,
      contentRules,
      titleVal,
      contentVal,
      onFormSubmit,
      beforeUpload,
      onUploadFile,
      onUploadFileError
    }
  }
})
</script>

<style>

</style>
