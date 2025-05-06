import axios from 'axios'

// 创建 axios 实例
const api = axios.create({
  baseURL: '/api',  // 根据实际后端 API 地址配置
  timeout: 5000
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // 未授权，跳转到登录页
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api 