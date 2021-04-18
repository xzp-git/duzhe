<template>
<teleport to="#message">
  <div :class="classObject" v-if="isVisible" class="alert message-info fixed-top w-50 mx-auto d-flex justify-content-between mt-2" role="alert">
    <strong>{{message}}</strong>
    <button type="button" class="btn-close" @click.prevent="hide" aria-label="Close">
      <!-- <span aria-hidden="true">&times;</span> -->
    </button>
  </div>
</teleport >
</template>

<script lang="ts">
import { defineComponent, PropType, onUnmounted, ref } from 'vue'
export type MessageType = 'success' | 'error' | 'default'
export default defineComponent({
  props: {
    message: String,
    type: {
      type: String as PropType<MessageType>,
      default: 'default'
    }
  },
  emits: ['close-message'],
  setup (props, context) {
    const node = document.createElement('div')
    node.id = 'message'
    document.body.appendChild(node)
    onUnmounted(() => {
      document.body.removeChild(node)
    })
    const isVisible = ref(true)
    const classObject = {
      'alert-success': props.type === 'success',
      'alert-danger': props.type === 'error',
      'alert-primary': props.type === 'default'
    }
    const hide = () => {
      isVisible.value = false
      context.emit('close-message', true)
    }
    return {
      classObject,
      isVisible,
      hide
    }
  }
})
</script>

<style>

</style>
