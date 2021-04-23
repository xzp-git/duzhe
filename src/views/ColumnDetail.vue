<template>
  <div class="column-detail-page w-75 ma-auto">
    <div class="column-info row mb-4 border-bottom pb-4 align-items-center" v-if="column">
      <div class="col-3 text-center" >
        <img :src="column.avatar && column.avatar.fitUrl" :alt="column.title" class="rounded-circle border w-100">
      </div>
      <div class="col-9">
        <h4>{{column.title}}</h4>
        <p class="text-muted">{{column.description}}</p>
      </div>
    </div>
    <post-list :list="list"></post-list>
    <button
      class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25"
       @click="loadMorePage" v-if="!isLastPage"
    >
      加载更多
    </button>
  </div>
</template>

<script lang = "ts">
import { computed, defineComponent, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import PostList from '../components/PostList.vue'
import { ColumnProps, GlobalDataProps } from '../store/index'
import { addColumnAvatar } from '../helper'
import useLoadMore from '../hooks/useLoadMore'
export default defineComponent({
  components: {
    PostList
  },
  setup () {
    const route = useRoute()
    const store = useStore<GlobalDataProps>()
    const currentId = route.params.id
    onMounted(() => {
      store.dispatch('fetchColumn', currentId)
      store.dispatch('fetchPosts', { cid: currentId })
    })
    const column = computed(() => {
      const selectColumn = store.getters.getColumnById(currentId) as ColumnProps | undefined
      if (selectColumn) {
        addColumnAvatar(selectColumn, 100, 100)
      }
      return selectColumn
    })
    const list = computed(() => store.getters.getPostsByCid(currentId))
    const page = computed(() => store.getters.getPostPage(currentId))
    console.log(page.value)
    const { loadMorePage, isLastPage } = useLoadMore('fetchPosts', page.value.total, { pageSize: 3, currentPage: (page.value.currentPage ? page.value.currentPage + 1 : 2) })
    return {
      column,
      list,
      loadMorePage,
      isLastPage
    }
  }
})
</script>

<style>

</style>
