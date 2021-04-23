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
interface GlobalColumns {
  data: ListProps<ColumnProps>;
  total: number;
  currentPage: number;
}
interface GlobalPosts {
  data: ListProps<PostProps>;
  loadedColumns: ListProps<{total?:number; currentPage?:number}>;
}
export interface GlobalDataProps {
  error:GlobalErrorProps
   token:string;
    columns: GlobalColumns;
    posts: GlobalPosts;
    user:UserProps,
    loading:false,
}
const asyncAndCommit = async (url:string, mutationsName:string, commit:Commit, config:AxiosRequestConfig = { method: 'get' }, extraData?: any) => {
  const { data } = await axios(url, config)
  if (extraData) {
    commit(mutationsName, { data, extraData })
  } else {
    commit(mutationsName, data)
  }

  return data
}
const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: { data: {}, total: 0, currentPage: 0 },
    posts: { data: {}, loadedColumns: {} },
    user: { isLogin: false }
  },
  mutations: {
    // login (state) {
    //   state.user = { ...state.user, isLogin: true, name: 'viking', columnId: 2 }
    // },
    createPost (state, newPost) {
      state.posts.data[newPost._id] = newPost
    },
    deletePost (state, { data }) {
      delete state.posts.data[data._id]
    },
    fetchColumns (state, rawData) {
      const { data } = state.columns
      const { list, count, currentPage } = rawData.data
      state.columns = {
        data: { ...data, ...arrToObj(list) },
        total: count,
        currentPage: currentPage * 1
      }
    },
    fetchColumn (state, rawData) {
      state.columns.data[rawData.data._id] = rawData.data
    },
    fetchPosts (state, { data: rawData, extraData: columnId }) {
      state.posts.data = { ...state.posts.data, ...arrToObj(rawData.data.list) }
      const { currentPage, count } = rawData.data
      console.log(rawData.data)

      state.posts.loadedColumns = { ...state.posts.loadedColumns, ...{ [columnId]: { total: count, currentPage: currentPage } } }
      // state.posts.loadedColumns.push(columnId)
    },
    fetchPost (state, rawData) {
      state.posts.data[rawData.data._id] = rawData.data
    },
    updatePost (state, { data }) {
      state.posts.data[data._id] = data
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
    fetchColumns ({ state, commit }, params = {}) {
      const { currentPage = 1, pageSize = 6 } = params
      // if (!state.columns.isLoaded) {
      //   return asyncAndCommit('/api/columns', 'fetchColumns', commit, { method: 'get' })
      // }
      if (state.columns.currentPage < currentPage) {
        return asyncAndCommit(`/api/columns?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchColumns', commit, { method: 'get' })
      }
    },
    fetchColumn ({ state, commit }, cid) {
      if (!state.columns.data[cid]) {
        return asyncAndCommit(`/api/columns/${cid}`, 'fetchColumn', commit, { method: 'get' })
      }
    },
    fetchPosts ({ state, commit }, params = {}) {
      const { cid, currentPage = 1, pageSize = 3 } = params
      console.log(cid)
      if (!state.posts.loadedColumns[cid]) {
        console.log(11111111111)

        return asyncAndCommit(`/api/columns/${cid}/posts?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchPosts', commit, { method: 'get' }, cid)
      }
    },
    fetchPost ({ state, commit }, cid) {
      const currentPost = state.posts.data[cid]
      if (!currentPost || !currentPost.content) {
        return asyncAndCommit(`/api/posts/${cid}`, 'fetchPost', commit, { method: 'get' })
      } else {
        return Promise.resolve({ data: currentPost })
      }
    },
    updatePost ({ commit }, { cid, payload }) {
      return asyncAndCommit(`/api/posts/${cid}`, 'updatePost', commit, {
        method: 'patch',
        data: payload
      })
    },
    fetchCurrentUser ({ commit }) {
      return asyncAndCommit('/api/user/current', 'fetchCurrentUser', commit, { method: 'get' })
    },
    login ({ commit }, payload) {
      return asyncAndCommit('/api/user/login', 'login', commit, { method: 'post', data: payload })
    },
    createPost ({ commit }, payload) {
      return asyncAndCommit('/api/posts', 'createPost', commit, { method: 'post', data: payload })
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
    getPostPage: (state) => (id: string) => {
      console.log(id)
      if (state.posts.loadedColumns[id]) {
        return state.posts.loadedColumns[id]
      }
    },
    getColumns: (state) => {
      return objToArr(state.columns.data)
    },
    getColumnById: (state) => (id:string) => {
      return state.columns.data[id]
    },
    getPostsByCid: (state) => (cid:string) => {
      return objToArr(state.posts.data).filter(c => c.column === cid)
    },
    getCurrentPost: (state) => (id: string) => {
      return state.posts.data[id]
    }
  }
})

export default store
