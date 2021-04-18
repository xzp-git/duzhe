<template>
  <div class="container">
    <GlobalHeader :user="currentUser"></GlobalHeader>
    <Loader v-if="isLoading" text = '拼命加载中...' background="rgba(0,0,0,.6)"></Loader>
    <Message type="error" :message="error.message"></Message>
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
import Loader from './components/Loader.vue'
import Message from './components/Message.vue'
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
    GlobalHeader,
    Loader,
    Message
    // ValidateInput,
    // ValidateForm
  },
  setup () {
    const store = useStore()

    const currentUser = computed(() => store.state.user)
    const isLoading = computed(() => store.state.loading)
    const error = computed(() => store.state.error)
    return {
      currentUser,
      isLoading,
      error
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
