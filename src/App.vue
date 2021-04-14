<template>
  <div class="container">
    <GlobalHeader :user="userData"></GlobalHeader>
    <validate-form @form-submit='onFormSubmit'>
      <div class="mb-3">
        <label for="exampleInputEmail3" class="form-label"> 邮箱 </label>
        <validate-input :rules="emailRules" v-model="inputVal" type="text" placeholder="请输入邮箱"></validate-input>
        {{inputVal}}
      </div>
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label">密码</label>
        <validate-input :rules="pasRules" v-model="inputPas" type="password" placeholder="请输入密码"></validate-input>
        {{inputPas}}
      </div>
      <template #submit>
        <span class="btn btn-danger">Submit</span>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import GlobalHeader, { UserProps } from './components/GlobalHeader.vue'
import ValidateInput, { RulesProp } from './components/ValidateInput.vue'
import ValidateForm from './components/ValidateForm.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
const userData:UserProps = {
  isLogin: true,
  name: 'Viking'
}

export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader,
    ValidateInput,
    ValidateForm
  },
  setup () {
    const emailRules: RulesProp = [
      { type: 'required', message: '电子邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的电子邮箱格式' }
    ]
    const pasRules: RulesProp = [
      { type: 'required', message: '密码不能为空' }
    ]
    const inputVal = ref('')
    const inputPas = ref('')
    const onFormSubmit = (res: boolean) => {
      console.log('res', res)
    }
    return {
      userData,
      emailRules,
      inputVal,
      inputPas,
      pasRules,
      onFormSubmit
    }
  }
})
</script>

<style>

</style>
