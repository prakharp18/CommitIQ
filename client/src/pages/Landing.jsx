import { Github, BarChart3, Users, GitPullRequest } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'
import StarBorder from '../components/StarBorder'
import MagicBento from '../components/MagicBento'

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
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-20 bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage: 'url(/bg-pattern.jpg)'
        }}
      ></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Transform Your GitHub <br />
            <span className="text-gray-400">Into Actionable Intelligence</span>
          </h1>
          <p className="text-xl text-gray-300 mb-4 max-w-3xl mx-auto">
            Unlock the hidden patterns in your code commits, PR reviews, and team collaboration. 
            Get AI-powered insights that actually help you ship better code faster.
          </p>
          <p className="text-lg text-gray-500 mb-8 italic">
            "Because 'fixed bug' isn't a PR description, Kevin."
          </p>
          
          <StarBorder>
            <button 
              onClick={handleLogin}
              data-clickable="true"
              className="bg-white text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-200 inline-flex items-center space-x-2 transition-colors"
            >
              <Github className="h-6 w-6" />
              <span>Get Started with GitHub</span>
            </button>
          </StarBorder>
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <MagicBento className="text-center p-6 bg-neutral-900 rounded-xl shadow-sm border border-neutral-800">
            <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-6 w-6 text-black" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Smart Code Analytics</h3>
            <p className="text-gray-400">
              AI-powered insights that reveal code quality patterns, technical debt hotspots, and optimization opportunities across your repositories.
            </p>
          </MagicBento>

          <MagicBento className="text-center p-6 bg-neutral-900 rounded-xl shadow-sm border border-neutral-800">
            <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-black" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Team Performance Intelligence</h3>
            <p className="text-gray-400">
              Deep dive into collaboration patterns, review bottlenecks, and team velocity metrics that actually matter for shipping quality software.
            </p>
          </MagicBento>

          <MagicBento className="text-center p-6 bg-neutral-900 rounded-xl shadow-sm border border-neutral-800">
            <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-4">
              <GitPullRequest className="h-6 w-6 text-black" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">PR Excellence Score</h3>
            <p className="text-gray-400">
              Get actionable feedback on PR descriptions, commit messages, and review quality to elevate your team's development standards.
            </p>
          </MagicBento>
        </div>
      </main>
      </div>
    </div>
  )
}

export default Landing