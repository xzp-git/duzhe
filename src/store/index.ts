import { Commit, createStore } from 'vuex'
import { arrToObj, objToArr } from '../helper'
import axios, { AxiosRequestConfig } from 'axios'
export interface ResponseType<P> {
  code: number;
  msg: string;
  data: P;
}
export interface ImageProps {
  _id?: string;
  url?: string;
  fitUrl?: string;
  createdAt?: string;
}
export interface UserProps {
    isLogin: boolean;
    nickName?: string;
    _id?: string;
    column?: string;
    email?:string;
    avatar?: ImageProps;
    description?: string;
}

export interface ColumnProps {
  _id:string;
  title:string;
  avatar?:ImageProps;
  description:string
}
export interface PostProps {
  _id?: string;
  title: string;
  excerpt?: string
  content: string;
  image?: ImageProps | string;
  createdAt?: string;
  column: string;
  author: string | UserProps;
  isHTML?: boolean;
}
interface ListProps<P>{
  [id:string]:P;
}
export interface GlobalErrorProps {
  status: boolean;
  message?:string
}
export interface GlobalDataProps {
  error:GlobalErrorProps
   token:string;
    columns: ListProps<ColumnProps>;
    posts: ListProps<PostProps>;
    user:UserProps,
    loading:false,
}
const getAndCommit = async (url:string, mutationsName:string, commit:Commit) => {
  const { data } = await axios.get(url)
  commit(mutationsName, data)
  return data
}
const postAndCommit = async (url:string, mutationsName:string, commit:Commit, payload:any) => {
  const { data } = await axios.post(url, payload)
  commit(mutationsName, data)
  return data
}
const asyncAndCommit = async (url:string, mutationsName:string, commit:Commit, config:AxiosRequestConfig = { method: 'get' }) => {
  const { data } = await axios(url, config)
  commit(mutationsName, data)
  return data
}
const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: {},
    posts: {},
    user: { isLogin: false }
  },
  mutations: {
    // login (state) {
    //   state.user = { ...state.user, isLogin: true, name: 'viking', columnId: 2 }
    // },
    createPost (state, newPost) {
      state.posts[newPost._id] = newPost
    },
    deletePost (state, { data }) {
      delete state.posts[data._id]
    },
    fetchColumns (state, rawData) {
      state.columns = arrToObj(rawData.data.list)
    },
    fetchColumn (state, rawData) {
      state.columns[rawData.data._id] = rawData.data
    },
    fetchPosts (state, rawData) {
      state.posts = arrToObj(rawData.data.list)
    },
    fetchPost (state, rawData) {
      state.posts[rawData.data._id] = rawData.data
    },
    updatePost (state, { data }) {
      state.posts[data._id] = data
    },
    setLoading (state, status) {
      state.loading = status
    },
    fetchCurrentUser (state, rowData) {
      state.user = { isLogin: true, ...rowData.data }
    },
    login (state, rawData) {
      const { token } = rawData.data
      state.token = token
      localStorage.setItem('token', token)
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    logout (state) {
      state.token = ''
      state.user = { isLogin: false }
      localStorage.removeItem('token')
      delete axios.defaults.headers.common.Authorization
    },
    setError (state, e: GlobalErrorProps) {
      state.error = e
    }
  },
  actions: {
    fetchColumns ({ commit }) {
      return getAndCommit('/api/columns', 'fetchColumns', commit)
    },
    fetchColumn ({ commit }, cid) {
      return getAndCommit(`/api/columns/${cid}`, 'fetchColumn', commit)
    },
    fetchPosts ({ commit }, cid) {
      return getAndCommit(`/api/columns/${cid}/posts`, 'fetchPosts', commit)
    },
    fetchPost ({ commit }, cid) {
      return getAndCommit(`/api/posts/${cid}`, 'fetchPost', commit)
    },
    updatePost ({ commit }, { cid, payload }) {
      return asyncAndCommit(`/api/posts/${cid}`, 'updatePost', commit, {
        method: 'patch',
        data: payload
      })
    },
    fetchCurrentUser ({ commit }) {
      return getAndCommit('/api/user/current', 'fetchCurrentUser', commit)
    },
    login ({ commit }, payload) {
      return postAndCommit('/api/user/login', 'login', commit, payload)
    },
    createPost ({ commit }, payload) {
      return postAndCommit('/api/posts', 'createPost', commit, payload)
    },
    deletePost ({ commit }, id) {
      return asyncAndCommit(`/api/posts/${id}`, 'deletePost', commit, {
        method: 'delete'
      })
    },
    loginAndFetch ({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
    }
  },
  getters: {
    getColumns: (state) => {
      return objToArr(state.columns)
    },
    getColumnById: (state) => (id:string) => {
      return state.columns[id]
    },
    getPostsByCid: (state) => (cid:string) => {
      return objToArr(state.posts).filter(c => c.column === cid)
    },
    getCurrentPost: (state) => (id: string) => {
      return state.posts[id]
    }
  }
})

export default store
