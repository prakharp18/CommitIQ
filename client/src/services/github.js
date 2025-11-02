import api from './api.js'

export const githubService = {
  getUser: async () => {
    const response = await api.get('/api/github/user')
    return response.data
  },

  getRepositories: async () => {
    const response = await api.get('/api/github/repos')
    return response.data
  },

  getPullRequests: async (owner, repo, state = 'all') => {
    const response = await api.get(`/api/github/repos/${owner}/${repo}/pulls?state=${state}`)
    return response.data
  },

  getCommits: async () => {
    const response = await api.get('/api/github/commits')
    return response.data
  },

  getOrganizations: async () => {
    const response = await api.get('/api/github/orgs')
    return response.data
  },

  getStats: async () => {
    const response = await api.get('/api/github/stats')
    return response.data
  },

  getContributions: async () => {
    const response = await api.get('/api/github/contributions')
    return response.data
  }
}

export default githubService