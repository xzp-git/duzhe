<template>
  <div class="container">
    <GlobalHeader :user="userData"></GlobalHeader>
    <ColumnList :list="list" ></ColumnList>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ColumnList, { ColumnProps } from './components/ColumnList.vue'
import GlobalHeader, { UserProps } from './components/GlobalHeader.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
const userData:UserProps = {
  isLogin: false,
  name: 'Viking'
}
const testData:ColumnProps[] = [
  {
    id: 1,
    title: 'test1的专栏',
    description: '这是test1的专栏，有一段非常有意思的简介，可以更新一下欧'
    // avatar: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marke/5ee22dd58b3c4520012b9470.jpg?x-oss-process=image/resize,m-pad,h_100,w_100'
  },
  {
    id: 2,
    title: 'test2的专栏',
    description: '这是test2的专栏，有一段非常有意思的简介，可以更新一下欧'
    // avatar: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marke/5ee22dd58b3c4520012b9470.jpg?x-oss-process=image/resize,m-pad,h_100,w_100'
  },
  {
    id: 1,
    title: 'test1的专栏',
    description: '这是test1的专栏，有一段非常有意思的简介，可以更新一下欧'
    // avatar: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marke/5ee'
  },
  {
    id: 1,
    title: 'test1的专栏',
    description: '这是test1的专栏，有一段非常有意思的简介，可以更新一下欧'
    // avatar: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marke/5ee22dd58b3c4520012b9470.jpg?x-oss-process=image/resize,m-pad,h_100,w_100'
  }
]
export default defineComponent({
  name: 'App',
  components: {
    ColumnList,
    GlobalHeader
  },
  setup () {
    return {
      list: testData,
      userData
    }
  }
})
</script>

<style>

</style>
