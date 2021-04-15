<template>
<div class="validate-input-container pd-3">
  <input
  v-if="tag !== 'textarea'"
  v-bind="$attrs"
  class="form-control"
  :class="{'is-invalid':inputRef.error}"
  @blur="validateInputs"
  @input="updateInput"
  :value="inputRef.val"
  >
  <textarea
  v-else
  rows="10"
  v-bind="$attrs"
  class="form-control"
  :class="{'is-invalid':inputRef.error}"
  @blur="validateInputs"
  @input="updateInput"
  :value="inputRef.val"
  >
  </textarea>
  <span v-if="inputRef.error" class="invalid-feedback">{{inputRef.message}}</span>
</div>
</template>

<script lang="ts">
import { defineComponent, reactive, PropType } from 'vue'
import { emitter } from '@/components/ValidateForm.vue'
type ValidateFunc = () => boolean
const emailReg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
interface RuleProp {
    type:'required' | 'email',
    message: string
}
export type RulesProp = RuleProp[]
export type TagType = 'input' | 'textarea'
export default defineComponent({
  name: 'ValidateInput',
  props: {
    rules: Array as PropType<RulesProp>,
    modelValue: String,
    tag: {
      type: String as PropType<TagType>,
      default: 'input'
    }
  },
  inheritAttrs: false,
  setup (props, context) {
    const inputRef = reactive({
      val: props.modelValue || '',
      error: false,
      message: ''
    })
    const updateInput = (e: KeyboardEvent) => {
      const targetValue = (e.target as HTMLInputElement).value
      inputRef.val = targetValue
      context.emit('update:modelValue', targetValue)
    }
    const validateInputs :ValidateFunc = () => {
      if (props.rules) {
        const allPassed = props.rules.every(rule => {
          let passed = true

          inputRef.message = rule.message
          switch (rule.type) {
            case 'required':
              passed = inputRef.val.trim() !== ''
              break
            case 'email':
              passed = emailReg.test(inputRef.val)
              break
            default:
              break
          }
          return passed
        })
        inputRef.error = !allPassed
        return allPassed
      }
      return true
    }
    emitter.emit('form-item-created', validateInputs)
    return {
      inputRef,
      validateInputs,
      updateInput
    }
  }
})
</script>

<style>

</style>
