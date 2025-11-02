import { Github, BarChart3, Users, GitPullRequest } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'

const Landing = () => {
  const navigate = useNavigate()
  const { login, isAuthenticated, loading } = useAuth()

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleLogin = () => {
    login()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="px-6 py-4 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-white" />
            <span className="text-2xl font-bold text-white">CommitIQ</span>
          </div>
          <button 
            onClick={handleLogin}
            className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            <Github className="h-5 w-5" />
            <span>Login with GitHub</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            GitHub Analytics <br />
            <span className="text-gray-400">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-300 mb-4 max-w-3xl mx-auto">
            Get deep insights into your GitHub activity, PR quality, and team collaboration. 
          </p>
          <p className="text-lg text-gray-500 mb-8 italic">
            "Because 'fixed bug' isn't a PR description, Kevin."
          </p>
          
          <button 
            onClick={handleLogin}
            className="bg-white text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-200 inline-flex items-center space-x-2"
          >
            <Github className="h-6 w-6" />
            <span>Get Started with GitHub</span>
          </button>
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-neutral-900 rounded-xl shadow-sm border border-neutral-800">
            <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-6 w-6 text-black" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Smart Analytics</h3>
            <p className="text-gray-400">
              AI-powered insights into your code quality, PR patterns, and productivity trends.
            </p>
          </div>

          <div className="text-center p-6 bg-neutral-900 rounded-xl shadow-sm border border-neutral-800">
            <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-black" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Team Insights</h3>
            <p className="text-gray-400">
              Understand collaboration patterns, review speeds, and team dynamics.
            </p>
          </div>

          <div className="text-center p-6 bg-neutral-900 rounded-xl shadow-sm border border-neutral-800">
            <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-4">
              <GitPullRequest className="h-6 w-6 text-black" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">PR Quality Score</h3>
            <p className="text-gray-400">
              Get AI feedback on your PR descriptions and commit message quality.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Landing