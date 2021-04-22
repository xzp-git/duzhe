<template>
  <div class="create-post-page">
    <h4>{{ isEditMode? '编辑文章' : '新建文章'}}</h4>
    <Uploader class="d-flex align-items-center justify-content-center bg-light text-secondary  w-100 my-4" action="/api/upload" :beforeUpload="uploadCheck" @file-uploaded='onUploadFile' :uploaded="uploadedData" @file-uploaded-error='onUploadFileError'>
      <template #uploaded="dataProps">
        <img :src="dataProps.uploadedData.data.url">
      </template>
      <h2>点击上传头像</h2>
      <template #loading>
        <div class="d-flex">
          <div class="spinner-border text-secondary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <h2>正在上传</h2>
        </div>
      </template>
    </Uploader>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题：</label>
        <validate-input
          :rules="titleRules" v-model="titleVal"
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
        <button type="submit" class="btn btn-primary btn-block btn-large">{{ isEditMode? '更新文章' : '发表文章'}} </button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { GlobalDataProps, PostProps, ResponseType, ImageProps } from '../store/index'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import Uploader from '../components/Uploader.vue'
import createMessage from '../hooks/createMessage'
import { beforeUploadCheck } from '../helper'
export default defineComponent({
  components: {
    ValidateInput,
    ValidateForm,
    Uploader
  },
  setup () {
    let imageID = ''
    const titleVal = ref('')
    const contentVal = ref('')
    const uploadedData = ref()
    const router = useRouter()
    const route = useRoute()
    const isEditMode = !!route.query.id
    const store = useStore<GlobalDataProps>()
    const titleRules: RulesProp = [
      { type: 'required', message: '文章标题不能为空' }
    ]
    const contentRules: RulesProp = [
      { type: 'required', message: '文章详情不能为空' }
    ]
    onMounted(() => {
      if (isEditMode) {
        store.dispatch('fetchPost', route.query.id).then((rowData: ResponseType<PostProps>) => {
          const currentPost = rowData.data
          if (currentPost.image) {
            uploadedData.value = { data: currentPost.image }
          }
          titleVal.value = currentPost.title
          contentVal.value = currentPost.content || ''
        })
      }
    })
    const onFormSubmit = (res:boolean) => {
      if (res) {
        const { column, _id } = store.state.user
        if (column && _id) {
          const newPost: PostProps = {
            title: titleVal.value,
            content: contentVal.value,
            column,
            author: _id
          }
          if (imageID) {
            newPost.image = imageID
          }
          const actionName = isEditMode ? 'updatePost' : 'createPost'
          const sendData = isEditMode ? {
            cid: route.query.id,
            payload: newPost
          } : newPost
          store.dispatch(actionName, sendData).then(() => {
            createMessage(isEditMode ? '更新成功，2秒后跳转到文章' : '发表成功，2秒后跳转到文章', 'success', 2000)
            setTimeout(() => {
              router.push({ name: 'column', params: { id: column } })
            }, 2000)
          })
        }
      }
    }
    const onUploadFile = (res: ResponseType<ImageProps>) => {
      if (res.code === 0) {
        createMessage('上传图片成功', 'success')
        imageID = res.data._id as string
      }
    }
    const onUploadFileError = (res: ResponseType<ImageProps>) => {
      createMessage('上传图片失败', 'error')
      console.log(res)
    }
    const uploadCheck = (file:File) => {
      const result = beforeUploadCheck(file, { format: ['image/jpeg', 'image/png'], size: 1 })
      const { passed, error } = result
      if (error === 'format') {
        createMessage('上传图片只能是 JPG/PNG 格式!', 'error')
      }
      if (error === 'size') {
        createMessage('上传图片大小不能超过 1Mb', 'error')
      }
      return passed
    }
    return {
      titleRules,
      contentRules,
      titleVal,
      contentVal,
      onFormSubmit,
      onUploadFile,
      onUploadFileError,
      uploadCheck,
      uploadedData,
      isEditMode
    }
  }
})
</script>

<style>
.create-post-page .file-upload-container {
  height: 200px;
  cursor: pointer;
}
.create-post-page .file-upload-container img{
  width: 100%;
  height: 100%;
  cursor: pointer;
  object-fit: cover;
}
</style>
