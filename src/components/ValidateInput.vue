<template>
<div class="validate-input-container pd-3">
  <input type="text"
  class="form-control"
  :class="{'is-invalid':inputRef.error}"
  v-model="inputRef.val"
  @blur="validateInputs"
  >
  <span v-if="inputRef.error" class="invalid-feedback">{{inputRef.message}}</span>
</div>
</template>

<script lang="ts">
import { defineComponent, reactive, PropType } from 'vue'
const emailReg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
interface RuleProp {
    type:'required' | 'email',
    message: string
}
export type RulesProp = RuleProp[]
export default defineComponent({
  name: 'ValidateInput',
  props: {
    rules: Array as PropType<RulesProp>
  },
  setup (props) {
    const inputRef = reactive({
      val: '',
      error: false,
      message: ''
    })
    const validateInputs = () => {
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
      }
    }
    return {
      inputRef,
      validateInputs
    }
  }
})
</script>

<style>

</style>
