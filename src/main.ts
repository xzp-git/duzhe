import { createApp } from 'vue'
import axios from 'axios'
import router from './router/index'
import store from './store/index'

import App from './App.vue'
axios.interceptors.request.use(config => {
  store.commit('setError', { status: false, message: '' })
  store.commit('setLoading', true)
  // config.params = { ...config. params, icode: 'Cafkekfe5' }
  return config
})

axios.interceptors.response.use(config => {
  store.commit('setLoading', false)

  // config.params = { ...config. params, icode: 'Cafkekfe5' }
  return config
}, e => {
  const { error } = e.response.data
  console.log(error)

  store.commit('setError', { status: true, message: error })
  store.commit('setLoading', false)
  return Promise.reject(error)
})

const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
