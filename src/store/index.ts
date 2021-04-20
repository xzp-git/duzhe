import { Commit, createStore } from 'vuex'
import axios from 'axios'
export interface ResponseType<P> {
  code: number;
  msg: string;
  data: P;
}
export interface UserProps {
    isLogin: boolean;
    nickName?: string;
    _id?: string;
    column?: string;
    email?:string
}
export interface ImageProps {
  _id?: string;
  url?: string;
  fitUrl?: string;
  createdAt?: string
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
  author: string
}
export interface GlobalErrorProps {
  status: boolean;
  message?:string
}
export interface GlobalDataProps {
  error:GlobalErrorProps
   token:string;
    columns: ColumnProps[];
    posts: PostProps[];
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
const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: [],
    posts: [],
    user: { isLogin: false }
  },
  mutations: {
    // login (state) {
    //   state.user = { ...state.user, isLogin: true, name: 'viking', columnId: 2 }
    // },
    createPost (state, newPost) {
      state.posts.push(newPost)
    },
    fetchColumns (state, rawData) {
      state.columns = rawData.data.list
    },
    fetchColumn (state, rawData) {
      state.columns = [rawData.data]
    },
    fetchPosts (state, rawData) {
      state.posts = rawData.data.list
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
      localStorage.remove('token')
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
    fetchCurrentUser ({ commit }) {
      return getAndCommit('/api/user/current', 'fetchCurrentUser', commit)
    },
    login ({ commit }, payload) {
      return postAndCommit('/api/user/login', 'login', commit, payload)
    },
    createPost ({ commit }, payload) {
      return postAndCommit('/api/posts', 'createPost', commit, payload)
    },
    loginAndFetch ({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
    }
  },
  getters: {

    getColumnById: (state) => (id:string) => {
      return state.columns.find(c => c._id === id)
    },
    getPostsByCid: (state) => (cid:string) => {
      return state.posts.filter(c => c.column === cid)
    }
  }
})

export default store
