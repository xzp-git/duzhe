<template>
<div class="login-page mx-auto p-3 w-330">
<h5 class="my-4 text-center">注册账号</h5>
  <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
      <label class="form-label">邮箱地址</label>
      <validate-input
          :rules="emailRules" v-model="email"
          placeholder="请输入邮箱地址"
          type="text"
          ref="inputRef"
      />
      </div>
      <div class="mb-3">
      <label class="form-label">用户名</label>
      <validate-input
          :rules="nickNameRules" v-model="nickName"
          placeholder="请输入邮箱地址"
          type="text"
          ref="inputRef"
      />
      </div>
      <div class="mb-3">
      <label class="form-label">密码</label>
      <validate-input
          type="password"
          placeholder="请输入密码"
          :rules="pasRules"
          v-model="password"
      />
      </div>
      <div class="mb-3">
      <label class="form-label">重复密码</label>
      <validate-input
          type="password"
          placeholder="请输入密码"
          :rules="confirmPasswordRules"
          v-model="confirmPassword"
      />
      </div>
      <template #submit>
      <button type="submit" class="btn btn-primary btn-block  btn-large">注册</button>
      </template>
  </validate-form>
</div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import axios from 'axios'
import createMessage from '../hooks/createMessage'
import { useRouter } from 'vue-router'
interface formDataProps {
  email:string,
  nickName:string,
  password:string,
  confirmPassword:string
}
export default defineComponent({
  components: {
    ValidateInput,
    ValidateForm
  },
  setup () {
    const router = useRouter()
    const formData: formDataProps = reactive({
      email: '',
      nickName: '',
      password: '',
      confirmPassword: ''
    })
    const formDataRef = toRefs(formData)
    const emailRules: RulesProp = [
      { type: 'required', message: '电子邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的电子邮箱格式' }
    ]
    const nickNameRules: RulesProp = [
      { type: 'required', message: '用户名不能为空' }
    ]
    const pasRules: RulesProp = [
      { type: 'required', message: '密码不能为空' }
    ]
    const confirmPasswordRules: RulesProp = [
      { type: 'required', message: '重复密码不能为空' },
      {
        type: 'custom',
        message: '两次输入的密码不相同',
        validater: () => {
          return formData.password === formData.confirmPassword
        }
      }
    ]

    const onFormSubmit = (result: boolean) => {
      if (result) {
        const data = {
          email: formData.email,
          nickName: formData.nickName,
          password: formData.password
        }
        axios.post('/api/users', data).then(res => {
          console.log(res)
          if (res.data.code === 0) {
            createMessage('注册账号成功', 'success')
            router.push('/login')
          }
        })
      }
    }
    return {
      onFormSubmit,
      ...formDataRef,
      emailRules,
      pasRules,
      nickNameRules,
      confirmPasswordRules
    }
  }
})
</script>

<style>

</style>
