<template>
  <div class="container">
    <GlobalHeader :user="userData"></GlobalHeader>
    <form>
      <div class="mb-3">
        <label for="exampleInputEmail3" class="form-label"> 邮箱 </label>
        <validate-input :rules="emailRules" v-model="inputVal"></validate-input>
        {{inputVal}}
      </div>
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label">密码</label>
        <input type="password" class="form-control" id="exampleInputPassword1">
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
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
    const inputVal = ref('viking')
    return {
      userData,
      emailRules,
      inputVal
    }
  }
})
</script>

<style>

</style>
