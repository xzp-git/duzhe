<template>
  <div class="container">
    <GlobalHeader :user="currentUser"></GlobalHeader>
    <router-view></router-view>
    <footer class="text-center py-4 text-secondary bg-light mt-6">
      <small>
        <ul class="list-inline mb-0">
          <li class="list-inline-item">
            ©2021读者专栏
          </li>
          <li class="list-inline-item">
            课程
          </li>
          <li class="list-inline-item">
            文档
          </li>
          <li class="list-inline-item">
            联系
          </li>
          <li class="list-inline-item">
            更多
          </li>
        </ul>
      </small>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import GlobalHeader from './components/GlobalHeader.vue'
import { useStore } from 'vuex'
// import ValidateInput, { RulesProp } from './components/ValidateInput.vue'
// import ValidateForm from './components/ValidateForm.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
// const userData:UserProps = {
//   isLogin: true,
//   name: 'Viking'
// }

export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader
    // ValidateInput,
    // ValidateForm
  },
  setup () {
    // const emailRules: RulesProp = [
    //   { type: 'required', message: '电子邮箱地址不能为空' },
    //   { type: 'email', message: '请输入正确的电子邮箱格式' }
    // ]
    // const pasRules: RulesProp = [
    //   { type: 'required', message: '密码不能为空' }
    // ]
    // const inputVal = ref('')
    // const inputPas = ref('')
    // const onFormSubmit = (res: boolean) => {
    //   console.log('res', res)
    // }
    const store = useStore()
    const currentUser = computed(() => store.state.user)
    return {
      currentUser
      // userData
      // emailRules,
      // inputVal,
      // inputPas,
      // pasRules,
      // onFormSubmit
    }
  }
})
</script>

<style>

</style>
