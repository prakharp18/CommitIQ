import { TrendingUp } from 'lucide-react'
import Sidebar from '../components/Sidebar'

const Analytics = () => {
  return (
    <div className="min-h-screen bg-black flex">
      <Sidebar />
      
      <main className="flex-1 overflow-hidden ml-64">
        <header className="bg-neutral-900 border-b border-neutral-800 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-white">Analytics</h1>
              <p className="text-gray-400">Deep insights into your coding patterns and productivity</p>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-12 text-center">
            <div className="max-w-2xl mx-auto">
              <TrendingUp className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Advanced Analytics Coming Soon</h2>
              <p className="text-gray-400 mb-6">
                We're working on providing detailed analytics including commit trends, PR analysis, 
                and productivity insights. This feature requires additional GitHub API data that we're 
                currently integrating.
              </p>
              <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
                <h3 className="text-lg font-semibold text-white mb-3">What you'll get:</h3>
                <ul className="text-left text-gray-400 space-y-2">
                  <li>• Commit & PR trend analysis over time</li>
                  <li>• Weekly and monthly activity patterns</li>
                  <li>• Repository-specific insights</li>
                  <li>• Language usage statistics</li>
                  <li>• Code quality metrics</li>
                  <li>• Collaboration patterns</li>
                </ul>
              </div>
              <p className="text-sm text-gray-500 mt-6">
                For now, please check your Dashboard for real-time GitHub statistics.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Analytics
