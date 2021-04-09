<template>
  <div class="container">
    <GlobalHeader :user="userData"></GlobalHeader>
    <form>
      <div class="mb-3">
        <label for="exampleInputEmail3" class="form-label"> 邮箱 </label>
        <validate-input :rules="emailRules"></validate-input>
      </div>
      <div class="mb-3">
        <label for="exampleInputEmail1" class="form-label"> 邮箱 </label>
        <input type="email" class="form-control" id="exampleInputEmail1"
        v-model="emailRef.val"
        @blur="validateEmail"
        >
         <div  class="form-text">{{emailRef.message}}</div>
      </div>
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label">密码</label>
        <input type="password" class="form-control" id="exampleInputPassword1">
      </div>
      <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="exampleCheck1">
        <label class="form-check-label" for="exampleCheck1">Check me out</label>
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import GlobalHeader, { UserProps } from './components/GlobalHeader.vue'
import ValidateInput, { RulesProp } from './components/ValidateInput.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
const userData:UserProps = {
  isLogin: true,
  name: 'Viking'
}

export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader,
    ValidateInput
  },
  setup () {
    const emailRules: RulesProp = [
      { type: 'required', message: '电子邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的电子邮箱格式' }
    ]
    const emailReg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
    const emailRef = reactive({
      val: '',
      error: false,
      message: ''
    })
    const validateEmail = () => {
      if (emailRef.val.trim() === '') {
        emailRef.error = true
        emailRef.message = '不能为空'
      } else if (!emailReg.test(emailRef.val)) {
        emailRef.error = true
        emailRef.message = '填写正确的邮箱格式'
      }
    }
    return {
      userData,
      emailRef,
      validateEmail,
      emailRules
    }
  }
})
</script>

<style>

</style>
