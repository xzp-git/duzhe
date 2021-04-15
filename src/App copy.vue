<template>
  <div class="container">
    <GlobalHeader :user="userData"></GlobalHeader>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GlobalHeader, { UserProps } from './components/GlobalHeader.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
const userData:UserProps = {
  isLogin: true,
  name: 'Viking'
}
export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader
  },
  setup () {
    return {
      userData
    }
  }
})
</script>

<style>

</style>
