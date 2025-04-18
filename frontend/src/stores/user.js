import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || '{}'))

  // 设置axios默认配置
  if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  const login = async (data) => {
    try {
      const response = await axios.post('/api/users/login/', data)
      const { token: newToken, user } = response.data
      
      // 保存token和用户信息
      token.value = newToken
      userInfo.value = user
      localStorage.setItem('token', newToken)
      localStorage.setItem('userInfo', JSON.stringify(user))
      
      // 设置axios默认配置
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    } catch (error) {
      throw new Error(error.response?.data?.message || '登录失败')
    }
  }

  const logout = () => {
    token.value = ''
    userInfo.value = {}
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    delete axios.defaults.headers.common['Authorization']
  }

  return {
    token,
    userInfo,
    login,
    logout
  }
}) 