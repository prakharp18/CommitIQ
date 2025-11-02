import express from 'express'
import axios from 'axios'
import jwt from 'jsonwebtoken'

const router = express.Router()

const authenticateGitHub = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header' })
  }

  try {
    const token = authHeader.replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    req.githubToken = decoded.accessToken
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
}

router.get('/user', authenticateGitHub, async (req, res) => {
  try {
    const response = await axios.get('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${req.githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user data' })
  }
})

router.get('/repos', authenticateGitHub, async (req, res) => {
  try {
    const response = await axios.get('https://api.github.com/user/repos?per_page=100&sort=updated', {
      headers: {
        'Authorization': `Bearer ${req.githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch repositories' })
  }
})

router.get('/repos/:owner/:repo/pulls', authenticateGitHub, async (req, res) => {
  const { owner, repo } = req.params
  const { state = 'all', per_page = 50 } = req.query

  try {
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/pulls?state=${state}&per_page=${per_page}`, {
      headers: {
        'Authorization': `Bearer ${req.githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pull requests' })
  }
})

router.get('/commits', authenticateGitHub, async (req, res) => {
  try {
    const eventsResponse = await axios.get(`https://api.github.com/users/${req.user.username}/events/public?per_page=100`, {
      headers: {
        'Authorization': `Bearer ${req.githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })

    const pushEvents = eventsResponse.data
      .filter(event => event.type === 'PushEvent')
      .slice(0, 20)

    let allCommits = []
    
    pushEvents.forEach(event => {
      if (event.payload && event.payload.commits) {
        const commits = event.payload.commits.map(commit => ({
          ...commit,
          created_at: event.created_at,
          repository: event.repo.name,
          commit: {
            author: {
              date: event.created_at,
              name: commit.author.name,
              email: commit.author.email
            },
            message: commit.message
          }
        }))
        allCommits = allCommits.concat(commits)
      }
    })

    try {
      const searchResponse = await axios.get(`https://api.github.com/search/commits?q=author:${req.user.username}&sort=author-date&order=desc&per_page=50`, {
        headers: {
          'Authorization': `Bearer ${req.githubToken}`,
          'Accept': 'application/vnd.github.cloak-preview+json'
        }
      })
      
      if (searchResponse.data && searchResponse.data.items) {
        const searchCommits = searchResponse.data.items.slice(0, 30)
        allCommits = allCommits.concat(searchCommits)
      }
    } catch (searchError) {
      console.log('Search API not available, using events only')
    }

    const uniqueCommits = allCommits
      .filter((commit, index, self) => 
        index === self.findIndex(c => c.sha === commit.sha)
      )
      .sort((a, b) => new Date(b.created_at || b.commit?.author?.date) - new Date(a.created_at || a.commit?.author?.date))
      .slice(0, 100)

    res.json(uniqueCommits)
  } catch (error) {
    console.error('Failed to fetch commits:', error)
    res.status(500).json({ error: 'Failed to fetch commits' })
  }
})

router.get('/orgs', authenticateGitHub, async (req, res) => {
  try {
    const response = await axios.get('https://api.github.com/user/orgs', {
      headers: {
        'Authorization': `Bearer ${req.githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch organizations' })
  }
})

router.get('/contributions', authenticateGitHub, async (req, res) => {
  try {
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${req.githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })

    const username = userResponse.data.login

    const eventsResponse = await axios.get(`https://api.github.com/users/${username}/events/public?per_page=100`, {
      headers: {
        'Authorization': `Bearer ${req.githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })

    const contributions = {}
    const events = eventsResponse.data

    events.forEach(event => {
      if (event.type === 'PushEvent' && event.payload?.commits) {
        const date = new Date(event.created_at).toISOString().split('T')[0]
        contributions[date] = (contributions[date] || 0) + event.payload.commits.length
      }
    })

    const contributionData = []
    const today = new Date()
    
    for (let i = 365; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const dateString = date.toISOString().split('T')[0]
      
      contributionData.push({
        date: dateString,
        count: contributions[dateString] || 0,
        level: getContributionLevel(contributions[dateString] || 0)
      })
    }

    const totalContributions = Object.values(contributions).reduce((sum, count) => sum + count, 0)
    const contributionDays = Object.keys(contributions).length

    res.json({
      contributions: contributionData,
      totalContributions,
      contributionDays,
      longestStreak: calculateLongestStreak(contributionData),
      currentStreak: calculateCurrentStreak(contributionData)
    })

  } catch (error) {
    console.error('Failed to fetch contributions:', error)
    res.status(500).json({ error: 'Failed to fetch contribution data' })
  }
})

function getContributionLevel(count) {
  if (count === 0) return 0
  if (count <= 3) return 1
  if (count <= 6) return 2
  if (count <= 9) return 3
  return 4
}

function calculateLongestStreak(contributions) {
  let maxStreak = 0
  let currentStreak = 0
  
  for (const day of contributions) {
    if (day.count > 0) {
      currentStreak++
      maxStreak = Math.max(maxStreak, currentStreak)
    } else {
      currentStreak = 0
    }
  }
  
  return maxStreak
}

function calculateCurrentStreak(contributions) {
  let streak = 0
  
  for (let i = contributions.length - 1; i >= 0; i--) {
    if (contributions[i].count > 0) {
      streak++
    } else {
      break
    }
  }
  
  return streak
}

router.get('/stats', authenticateGitHub, async (req, res) => {
  try {
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${req.githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })

    const user = userResponse.data

    const reposResponse = await axios.get(`https://api.github.com/user/repos?per_page=100&sort=updated&type=all`, {
      headers: {
        'Authorization': `Bearer ${req.githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })

    const repositories = reposResponse.data

    let contributionStats = {}
    try {
      const contributionsResponse = await axios.get(`https://api.github.com/users/${user.login}/events/public?per_page=100`, {
        headers: {
          'Authorization': `Bearer ${req.githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      })
      
      const events = contributionsResponse.data
      const pushEvents = events.filter(event => event.type === 'PushEvent')
      const totalCommitsFromEvents = pushEvents.reduce((sum, event) => 
        sum + (event.payload?.commits?.length || 0), 0
      )
      
      contributionStats.recentCommits = totalCommitsFromEvents
    } catch (error) {
      console.log('Could not fetch contribution events')
      contributionStats.recentCommits = 0
    }

    const ownedRepos = repositories.filter(repo => repo.owner.login === user.login)
    const forkedRepos = repositories.filter(repo => repo.fork)

    const stats = {
      totalRepos: ownedRepos.length,
      totalForkedRepos: forkedRepos.length,
      publicRepos: ownedRepos.filter(repo => !repo.private).length,
      privateRepos: ownedRepos.filter(repo => repo.private).length,
      
      totalStars: ownedRepos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0),
      totalForks: ownedRepos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0),
      totalWatchers: ownedRepos.reduce((sum, repo) => sum + (repo.watchers_count || 0), 0),
      
      publicGists: user.public_gists || 0,
      followers: user.followers || 0,
      following: user.following || 0,
      
      totalSize: ownedRepos.reduce((sum, repo) => sum + (repo.size || 0), 0),
      languages: [...new Set(ownedRepos.map(repo => repo.language).filter(Boolean))],
      lastUpdated: Math.max(...ownedRepos.map(repo => new Date(repo.updated_at).getTime())),
      
      recentCommitsFromEvents: contributionStats.recentCommits
    }

    res.json(stats)
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    res.status(500).json({ error: 'Failed to fetch statistics' })
  }
})

export default router