import { useState, useEffect } from 'react'
import { RefreshCw, ArrowUpRight, TrendingUp, Users, GitBranch, Star, GitCommit, Eye, UserPlus } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../context/AuthContext'
import useGitHubData from '../hooks/useGitHubData'
import TodoBlock from '../components/TodoBlock'
import CircularProgress from '../components/CircularProgress'
import LanguageChart from '../components/LanguageChart'
import CodeQualityTooltip from '../components/CodeQualityTooltip'
import MagicBento from '../components/MagicBento'

const Dashboard = () => {
  const { user } = useAuth()
  const { data, loading, error, refetch } = useGitHubData()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefreshTime, setLastRefreshTime] = useState(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleRefresh = async () => {
    if (isRefreshing) return
    
    setIsRefreshing(true)
    try {
      await refetch()
      setLastRefreshTime(new Date())
    } catch (error) {
      console.error('Refresh failed:', error)
    } finally {
      setTimeout(() => setIsRefreshing(false), 500)
    }
  }

  const getRefreshTimeText = () => {
    if (!lastRefreshTime) return 'Never refreshed'
    const seconds = Math.floor((new Date() - lastRefreshTime) / 1000)
    if (seconds < 60) return 'Just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes === 1) return '1 minute ago'
    if (minutes < 60) return `${minutes} minutes ago`
    const hours = Math.floor(minutes / 60)
    if (hours === 1) return '1 hour ago'
    return `${hours} hours ago`
  }

  const stats = data.stats.totalRepos > 0 ? data.stats : {
    totalRepos: 0,
    publicRepos: 0,
    privateRepos: 0,
    totalStars: 0,
    totalForks: 0,
    totalWatchers: 0,
    totalCommits: 0
  }

  const actualCommitCount = data.contributions?.totalContributions || stats.totalCommits

  const generateWeeklyActivity = () => {
    if (!data.contributions?.contributions) return []
    
    const contributions = data.contributions.contributions
    const last7Days = contributions.slice(-7)
    
    return last7Days.map(day => ({
      day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
      date: day.date,
      commits: day.count,
      contributed: day.count > 0
    }))
  }

  const getLanguageDistribution = () => {
    if (!data.repositories || data.repositories.length === 0) {
      return [{ name: 'No data', value: 100, color: '#6b7280' }]
    }

    const languageCounts = {}
    let totalRepos = 0

    data.repositories.forEach(repo => {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1
        totalRepos++
      }
    })

    if (totalRepos === 0) {
      return [{ name: 'No data', value: 100, color: '#6b7280' }]
    }

    const languageColors = {
      'JavaScript': '#f7df1e',
      'TypeScript': '#3178c6',
      'Python': '#3776ab',
      'Java': '#007396',
      'Go': '#00add8',
      'Rust': '#dea584',
      'Ruby': '#cc342d',
      'PHP': '#777bb4',
      'C++': '#f34b7d',
      'C': '#555555',
      'C#': '#239120',
      'Swift': '#ffac45',
      'Kotlin': '#7f52ff',
      'Dart': '#00b4ab',
      'HTML': '#e34c26',
      'CSS': '#563d7c',
      'Shell': '#89e051',
      'Jupyter Notebook': '#da5007'
    }

    const languageData = Object.entries(languageCounts)
      .map(([name, count]) => ({
        name,
        value: Math.round((count / totalRepos) * 100),
        color: languageColors[name] || '#6b7280'
      }))
      .sort((a, b) => b.value - a.value)

    // Show only top 3 languages, group rest as "Others"
    if (languageData.length > 3) {
      const top3 = languageData.slice(0, 3)
      const others = languageData.slice(3)
      const othersValue = others.reduce((sum, lang) => sum + lang.value, 0)
      
      if (othersValue > 0) {
        top3.push({
          name: 'Others',
          value: othersValue,
          color: '#6b7280'
        })
      }
      
      return top3
    }

    return languageData
  }

  const getUniqueLanguageCount = () => {
    if (!data.repositories || data.repositories.length === 0) return 0
    const uniqueLanguages = new Set()
    data.repositories.forEach(repo => {
      if (repo.language) {
        uniqueLanguages.add(repo.language)
      }
    })
    return uniqueLanguages.size
  }

  const calculateCodeQuality = () => {
    if (stats.totalRepos === 0) return 0

    const commitCount = actualCommitCount

    const metrics = {
      starRatio: Math.min(100, (stats.totalStars / stats.totalRepos) * 20),
      forkRatio: Math.min(100, (stats.totalForks / stats.totalRepos) * 30),
      watchRatio: Math.min(100, (stats.totalWatchers / stats.totalRepos) * 25),
      commitActivity: Math.min(100, (commitCount / 100) * 100),
      repoActivity: Math.min(100, (stats.totalRepos / 10) * 100),
      publicPrivateBalance: stats.publicRepos > 0 ? 100 : 50,
      languageDiversity: Math.min(100, (stats.languages?.length || 1) * 15),
      totalImpact: Math.min(100, Math.sqrt(stats.totalStars + stats.totalForks) * 10)
    }

    const score = (
      (metrics.starRatio + metrics.forkRatio + metrics.watchRatio) * 0.4 / 3 +
      (metrics.commitActivity + metrics.repoActivity) * 0.3 / 2 +
      (metrics.publicPrivateBalance + metrics.languageDiversity) * 0.2 / 2 +
      metrics.totalImpact * 0.1
    )

    return Math.round(Math.max(0, Math.min(100, score)))
  }

  const weeklyActivity = generateWeeklyActivity()
  const languageDistribution = getLanguageDistribution()
  const uniqueLanguageCount = getUniqueLanguageCount()
  const codeQualityScore = calculateCodeQuality()
  const recentRepos = data.repositories.slice(0, 8)

  return (
    <div className="min-h-screen bg-black flex">
      <Sidebar />
      
      <main className="flex-1 overflow-auto ml-64">
        <header className="bg-neutral-900 border-b border-neutral-800 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-white px-6 py-3">
                <div className="text-lg font-bold">
                  Welcome, {user?.username || 'Developer'}!
                </div>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                data-clickable="true"
                className="p-2 text-gray-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-50"
                title={`Refresh data - ${getRefreshTimeText()}`}
              >
                <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right mr-3">
                <p className="text-sm font-medium text-gray-400">
                  {currentTime.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>{currentTime.getFullYear()}</span>
                  <span>•</span>
                  <span>
                    {currentTime.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: true
                    })}
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.username} className="w-10 h-10 rounded-full" />
                ) : (
                  <span className="text-black text-sm font-semibold">
                    {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-white mb-1">Dashboard</h1>
            <p className="text-gray-400 text-sm">Your GitHub analytics at a glance</p>
          </div>

          {/* Perfect Bento Grid Layout */}
          <div className="grid grid-cols-12 gap-6 max-w-7xl">
            
            {/* Hero Repository Card */}
            <MagicBento className="col-span-12 md:col-span-4 bg-white text-black p-6 h-[160px] shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm text-gray-600">Total Repositories</h3>
                  <ArrowUpRight className="h-5 w-5 text-gray-500" />
                </div>
                <div className="text-4xl font-bold mb-3">{stats.totalRepos}</div>
                <div className="flex items-center text-gray-700">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Active projects</span>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-gray-200 rounded-full opacity-20 transform translate-x-8 translate-y-8"></div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-gray-200 rounded-full opacity-10 transform -translate-y-4 translate-x-4"></div>
            </MagicBento>

            {/* Primary Stats Row */}
            <MagicBento className="col-span-6 md:col-span-2 bg-neutral-900 p-5 h-[160px] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col h-full justify-between">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-neutral-800 rounded-xl">
                    <GitBranch className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 font-medium">PUBLIC</div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-400 mb-2">Public Repos</p>
                  <p className="text-3xl font-bold text-white">{stats.publicRepos}</p>
                </div>
              </div>
            </MagicBento>

            <MagicBento className="col-span-6 md:col-span-2 bg-neutral-900 p-5 h-[160px] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col h-full justify-between">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-neutral-800 rounded-xl">
                    <GitBranch className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 font-medium">PRIVATE</div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-400 mb-2">Private Repos</p>
                  <p className="text-3xl font-bold text-white">{stats.privateRepos}</p>
                </div>
              </div>
            </MagicBento>

            <MagicBento className="col-span-6 md:col-span-2 bg-neutral-900 p-5 h-[160px] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col h-full justify-between">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-neutral-800 rounded-xl">
                    <Star className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 font-medium">COMMUNITY</div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-400 mb-2">Total Stars</p>
                  <p className="text-3xl font-bold text-white">{stats.totalStars}</p>
                </div>
              </div>
            </MagicBento>

            <MagicBento className="col-span-6 md:col-span-2 bg-neutral-900 p-5 h-[160px] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col h-full justify-between">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-neutral-800 rounded-xl">
                    <GitCommit className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 font-medium">ACTIVITY</div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-400 mb-2">Total Commits</p>
                  <p className="text-3xl font-bold text-white">{actualCommitCount}</p>
                </div>
              </div>
            </MagicBento>

            {/* Secondary Stats Row */}
            <MagicBento className="col-span-6 md:col-span-3 bg-neutral-900 p-5 h-[140px] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4 h-full">
                <div className="p-3 bg-neutral-800 rounded-xl">
                  <GitBranch className="h-6 w-6 text-indigo-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-400 mb-1">Total Forks</p>
                  <p className="text-2xl font-bold text-white">{stats.totalForks}</p>
                  <p className="text-xs text-gray-500 mt-1">Repository forks</p>
                </div>
              </div>
            </MagicBento>

            <MagicBento className="col-span-6 md:col-span-3 bg-neutral-900 p-5 h-[140px] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4 h-full">
                <div className="p-3 bg-neutral-800 rounded-xl">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-400 mb-1">Total Watchers</p>
                  <p className="text-2xl font-bold text-white">{stats.totalWatchers}</p>
                  <p className="text-xs text-gray-500 mt-1">Repository watchers</p>
                </div>
              </div>
            </MagicBento>

            {/* Contribution Streak Cards */}
            <MagicBento className="col-span-6 md:col-span-3 bg-neutral-900 p-5 h-[140px] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4 h-full">
                <div className="p-3 bg-neutral-800 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-400 mb-1">Current Streak</p>
                  <p className="text-2xl font-bold text-white">{data.contributions?.currentStreak || 0} days</p>
                  <p className="text-xs text-gray-500 mt-1">Active coding streak</p>
                </div>
              </div>
            </MagicBento>

            <MagicBento className="col-span-6 md:col-span-3 bg-neutral-900 p-5 h-[140px] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4 h-full">
                <div className="p-3 bg-neutral-800 rounded-xl">
                  <Star className="h-6 w-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-400 mb-1">Longest Streak</p>
                  <p className="text-2xl font-bold text-white">{data.contributions?.longestStreak || 0} days</p>
                  <p className="text-xs text-gray-500 mt-1">Best coding streak</p>
                </div>
              </div>
            </MagicBento>

            {/* Premium Widget Section */}
            <MagicBento className="col-span-12 md:col-span-4 bg-neutral-900 p-6 h-[140px] shadow-sm hover:shadow-md transition-shadow">
              <TodoBlock />
            </MagicBento>

            <div className="col-span-12 md:col-span-4 bg-neutral-900 p-6 h-[140px] shadow-sm hover:shadow-md transition-shadow rounded-lg border border-neutral-800">
              <div className="h-full flex items-start">
                {/* Left side - Chart */}
                <div className="flex items-center justify-center w-16 h-16 mr-4 flex-shrink-0">
                  <CircularProgress value={codeQualityScore} size="small" />
                </div>
                
                {/* Right side - Details */}
                <div className="flex-1 h-full flex flex-col min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-white">Code Quality</h3>
                    <CodeQualityTooltip score={codeQualityScore} stats={stats} />
                  </div>
                  
                  <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                    <div className="space-y-1.5 pr-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-400">Score</span>
                        <span className="text-sm font-bold text-white">{codeQualityScore}/100</span>
                      </div>
                      
                      <div className="space-y-0.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">• Engagement</span>
                          <span className="text-gray-400">40%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">• Activity</span>
                          <span className="text-gray-400">30%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">• Diversity</span>
                          <span className="text-gray-400">20%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">• Impact</span>
                          <span className="text-gray-400">10%</span>
                        </div>
                      </div>
                      
                      <div className="pt-1 border-t border-neutral-800">
                        <div className="text-xs text-gray-500 space-y-0.5">
                          <div className="font-medium">Key Metrics:</div>
                          <div>Stars/Repo: {stats.totalRepos > 0 ? (stats.totalStars / stats.totalRepos).toFixed(1) : '0'}</div>
                          <div>Commits: {actualCommitCount}</div>
                          <div>Languages: {uniqueLanguageCount}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Community Stats Card */}
            <MagicBento className="col-span-12 md:col-span-4 bg-neutral-900 p-6 h-[140px] shadow-sm hover:shadow-md transition-shadow">
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white">Community</h3>
                  <UserPlus className="h-4 w-4 text-gray-400" />
                </div>
                
                <div className="flex-1 flex items-center justify-around">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">{stats.followers || 0}</div>
                    <div className="text-xs text-gray-400">Followers</div>
                  </div>
                  
                  <div className="h-12 w-px bg-neutral-800"></div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">{stats.following || 0}</div>
                    <div className="text-xs text-gray-400">Following</div>
                  </div>
                  
                  <div className="h-12 w-px bg-neutral-800"></div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">{data.organizations?.length || 0}</div>
                    <div className="text-xs text-gray-400">Orgs</div>
                  </div>
                </div>
              </div>
            </MagicBento>

            <MagicBento className="col-span-12 md:col-span-4 bg-neutral-900 p-6 h-[140px] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center h-full">
                {/* Left side - Mini Chart */}
                <div className="w-20 h-20 mr-4 flex-shrink-0">
                  <LanguageChart data={data.repositories} compact={true} />
                </div>
                
                {/* Right side - Language List with scrollbar */}
                <div className="flex-1 h-full flex flex-col">
                  <h3 className="text-sm font-bold text-white mb-2">Languages ({uniqueLanguageCount})</h3>
                  
                  <div className="flex-1 overflow-y-auto pr-2">
                    <div className="space-y-1">
                      {languageDistribution.slice(0, 8).map((lang, index) => (
                        <div key={index} className="flex items-center justify-between py-1">
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: lang.color }}></div>
                            <span className="text-xs text-gray-400 truncate">{lang.name}</span>
                          </div>
                          <span className="text-xs font-semibold text-white ml-2">{lang.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </MagicBento>

            {/* Enhanced Recent Repositories Section */}
            <MagicBento className="col-span-12 bg-neutral-900 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white">Recent Repositories</h3>
                <p className="text-sm text-gray-400 mt-1">Your latest GitHub projects ({recentRepos.length} showing)</p>
              </div>
              {recentRepos.length > 0 ? (
                <div className="overflow-y-auto pr-2" style={{ maxHeight: '300px' }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {recentRepos.map((repo, index) => (
                      <MagicBento key={repo.id || index} className="bg-neutral-800 p-4 hover:bg-neutral-700 transition-colors flex flex-col">
                        <div className="flex-1 mb-3">
                          <h4 className="font-bold text-white text-sm mb-2">{repo.name}</h4>
                          <p className="text-xs text-gray-400 line-clamp-3 min-h-[3rem]">
                            {repo.description || 'No description provided for this repository'}
                          </p>
                        </div>
                        
                        {/* Repository Stats */}
                        <div className="flex items-center space-x-3 text-xs text-gray-400 mb-2">
                          {repo.stargazers_count > 0 && (
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3" />
                              <span>{repo.stargazers_count}</span>
                            </div>
                          )}
                          {repo.forks_count > 0 && (
                            <div className="flex items-center space-x-1">
                              <GitBranch className="h-3 w-3" />
                              <span>{repo.forks_count}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Language and Visibility */}
                        <div className="flex items-center justify-between pt-2 border-t border-neutral-700">
                          <div className="flex items-center space-x-2">
                            {repo.language && (
                              <>
                                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                <span className="text-xs font-medium text-gray-400">{repo.language}</span>
                              </>
                            )}
                          </div>
                          <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                            repo.private ? 'bg-red-900 text-red-200 border border-red-700' : 'bg-white text-black'
                          }`}>
                            {repo.private ? 'Private' : 'Public'}
                          </span>
                        </div>
                      </MagicBento>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No repositories found</p>
                </div>
              )}
            </MagicBento>

          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
