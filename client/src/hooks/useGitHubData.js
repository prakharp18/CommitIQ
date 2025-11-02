import { useState, useEffect } from 'react'
import githubService from '../services/github'
import { useAuth } from '../context/AuthContext'

export const useGitHubData = () => {
  const { isAuthenticated } = useAuth()
  const [data, setData] = useState({
    user: null,
    repositories: [],
    commits: [],
    organizations: [],
    contributions: null,
    stats: {
      totalRepos: 0,
      publicRepos: 0,
      privateRepos: 0,
      totalStars: 0,
      totalForks: 0,
      totalWatchers: 0,
      totalCommits: 0,
      languages: []
    }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchGitHubData = async () => {
    if (!isAuthenticated) return

    setLoading(true)
    setError(null)

    try {
      // Fetch all data in parallel
      const [user, repos, commits, orgs, statsData, contributionsData] = await Promise.all([
        githubService.getUser(),
        githubService.getRepositories(),
        githubService.getCommits(),
        githubService.getOrganizations(),
        githubService.getStats(),
        githubService.getContributions()
      ])

      // Debug logging to see what data we're getting
      console.log('GitHub Data Debug:', {
        reposCount: repos.length,
        statsData,
        firstFewRepos: repos.slice(0, 3).map(r => ({
          name: r.name,
          stars: r.stargazers_count,
          forks: r.forks_count,
          private: r.private
        }))
      })

      // Use more accurate commit count from contributions if available
      const totalCommits = contributionsData?.totalContributions || commits.length

      // Combine stats with more accurate commit count
      const combinedStats = {
        ...statsData,
        totalCommits
      }

      setData({
        user,
        repositories: repos,
        commits,
        organizations: orgs,
        contributions: contributionsData,
        stats: combinedStats
      })

    } catch (err) {
      console.error('Failed to fetch GitHub data:', err)
      setError(err.message)
      
      // Set fallback data on error
      setData({
        user: null,
        repositories: [],
        commits: [],
        organizations: [],
        contributions: null,
        stats: {
          totalRepos: 0,
          publicRepos: 0,
          privateRepos: 0,
          totalStars: 0,
          totalForks: 0,
          totalWatchers: 0,
          totalCommits: 0,
          languages: []
        }
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchGitHubData()
    }
  }, [isAuthenticated])

  return {
    data,
    loading,
    error,
    refetch: fetchGitHubData
  }
}

export default useGitHubData