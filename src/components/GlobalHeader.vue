<template>
  <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
    <router-link :to="'/'" class="navbar-brand">读者专栏</router-link>
    <ul v-if="!user.isLogin" class="list-inline mb-0">
      <li class="list-inline-item"><router-link to="/login" class="btn btn-outline-light">登陆</router-link></li>
      <li class="list-inline-item"><router-link to="/signup" class="btn btn-outline-light">注册</router-link></li>
    </ul>
    <ul v-else class="list-inline mb-0">
      <li class="list-inline-item">
        <dropdown :title="`你好 ${user.nickName}`">
          <dropdown-item><router-link class="dropdown-item" to="/create">新建文章</router-link></dropdown-item>
          <dropdown-item disabled><a class="dropdown-item" href="#">编辑资料</a></dropdown-item>
          <dropdown-item><a class="dropdown-item" href="javascript:;" @click="loginout">退出登陆</a></dropdown-item>
        </dropdown>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import Dropdown from './Dropdown.vue'
import DropdownItem from './DropdownItem.vue'
import { UserProps } from '../store/index'
import { useStore } from 'vuex'
export default defineComponent({
  name: 'GlobalHeader',
  components: {
    Dropdown,
    DropdownItem
  },
  props: {
    user: {
      type: Object as PropType<UserProps>,
      requir: true
    }
  },
  setup () {
    const store = useStore()
    const loginout = () => {
      store.commit('logout')
    }
    return {
      loginout
    }
  }
})
</script>

<style>

</style>
