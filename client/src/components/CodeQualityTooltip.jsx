import { useState } from 'react'
import { Info, X } from 'lucide-react'

const CodeQualityTooltip = ({ score, stats }) => {
  const [isOpen, setIsOpen] = useState(false)

  const getScoreDescription = (score) => {
    if (score >= 80) return { label: 'Excellent', color: 'text-green-600', description: 'Outstanding code quality and community engagement' }
    if (score >= 60) return { label: 'Good', color: 'text-blue-600', description: 'Good practices with room for improvement' }
    if (score >= 40) return { label: 'Fair', color: 'text-yellow-600', description: 'Moderate quality, consider improving engagement' }
    if (score >= 20) return { label: 'Poor', color: 'text-orange-600', description: 'Needs significant improvement' }
    return { label: 'Very Poor', color: 'text-red-600', description: 'Critical areas need attention' }
  }

  const scoreInfo = getScoreDescription(score)

  const metrics = {
    engagement: {
      starRatio: stats.totalRepos > 0 ? (stats.totalStars / stats.totalRepos).toFixed(1) : '0',
      forkRatio: stats.totalRepos > 0 ? (stats.totalForks / stats.totalRepos).toFixed(1) : '0',
      watchRatio: stats.totalRepos > 0 ? (stats.totalWatchers / stats.totalRepos).toFixed(1) : '0'
    },
    activity: {
      totalCommits: stats.totalCommits || 0,
      totalRepos: stats.totalRepos || 0
    },
    diversity: {
      publicRepos: stats.publicRepos || 0,
      languages: stats.languages?.length || 0
    },
    impact: {
      totalStars: stats.totalStars || 0,
      totalForks: stats.totalForks || 0
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
        title="Code Quality Details"
      >
        <Info className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-6 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900">Code Quality Breakdown</h4>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">Overall Score</span>
              <span className={`font-bold ${scoreInfo.color}`}>
                {score}/100 ({scoreInfo.label})
              </span>
            </div>
            <p className="text-xs text-gray-600">{scoreInfo.description}</p>

            <hr className="border-gray-200" />

            <div className="space-y-2">
              <div>
                <h5 className="font-medium text-gray-700 text-sm">Repository Engagement (40%)</h5>
                <div className="text-xs text-gray-600 space-y-1 ml-2">
                  <div className="flex justify-between">
                    <span>Stars per repository:</span>
                    <span>{metrics.engagement.starRatio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Forks per repository:</span>
                    <span>{metrics.engagement.forkRatio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Watchers per repository:</span>
                    <span>{metrics.engagement.watchRatio}</span>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-700 text-sm">Activity Consistency (30%)</h5>
                <div className="text-xs text-gray-600 space-y-1 ml-2">
                  <div className="flex justify-between">
                    <span>Recent commits:</span>
                    <span>{metrics.activity.totalCommits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total repositories:</span>
                    <span>{metrics.activity.totalRepos}</span>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-700 text-sm">Repository Diversity (20%)</h5>
                <div className="text-xs text-gray-600 space-y-1 ml-2">
                  <div className="flex justify-between">
                    <span>Public repositories:</span>
                    <span>{metrics.diversity.publicRepos}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Programming languages:</span>
                    <span>{metrics.diversity.languages}</span>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-700 text-sm">Community Impact (10%)</h5>
                <div className="text-xs text-gray-600 space-y-1 ml-2">
                  <div className="flex justify-between">
                    <span>Total community engagement:</span>
                    <span>{metrics.impact.totalStars + metrics.impact.totalForks}</span>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div className="text-xs text-gray-500">
              <p className="font-medium mb-1">How to improve:</p>
              <ul className="space-y-1 list-disc list-inside">
                {score < 80 && <li>Create more engaging repositories with clear documentation</li>}
                {stats.publicRepos === 0 && <li>Make some repositories public to increase visibility</li>}
                {stats.totalCommits < 50 && <li>Maintain consistent coding activity</li>}
                {(stats.languages?.length || 0) < 3 && <li>Explore different programming languages</li>}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CodeQualityTooltip