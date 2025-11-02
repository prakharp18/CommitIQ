import api from './api.js'

export const authService = {
  loginWithGitHub: () => {
    window.location.href = `${api.defaults.baseURL}/auth/github`
  },

  verifyAuth: async () => {
    try {
      const response = await api.get('/auth/verify')
      return response.data.user
    } catch (error) {
      throw error
    }
  },

  logout: () => {
    localStorage.removeItem('commitiq_token')
    window.location.href = '/'
  },

  getToken: () => {
    return localStorage.getItem('commitiq_token')
  },

  setToken: (token) => {
    localStorage.setItem('commitiq_token', token)
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('commitiq_token')
    return !!token
  }
}

export default authService