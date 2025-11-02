import React from 'react'

const CircularProgress = ({ value, size = 'default', strokeWidth = 8, className = '' }) => {
  // Size configurations
  const sizeConfig = {
    mini: { width: 60, height: 60, strokeWidth: 6 },
    small: { width: 80, height: 80, strokeWidth: 6 },
    default: { width: 120, height: 120, strokeWidth: 8 },
    large: { width: 160, height: 160, strokeWidth: 10 }
  }

  const config = sizeConfig[size] || sizeConfig.default
  const radius = (config.width - config.strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  // Color based on score
  const getColor = (score) => {
    if (score >= 80) return '#ffffff' // white
    if (score >= 60) return '#f59e0b' // amber-500
    if (score >= 40) return '#f97316' // orange-500
    return '#ef4444' // red-500
  }

  const color = getColor(value)

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        width={config.width}
        height={config.height}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={config.width / 2}
          cy={config.height / 2}
          r={radius}
          stroke="#404040"
          strokeWidth={config.strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={config.width / 2}
          cy={config.height / 2}
          r={radius}
          stroke={color}
          strokeWidth={config.strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Centered text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className={`font-bold text-white ${
            size === 'mini' ? 'text-sm' : 
            size === 'small' ? 'text-lg' : 
            size === 'large' ? 'text-3xl' : 'text-2xl'
          }`}>
            {value}
          </div>
          <div className={`text-gray-400 ${
            size === 'mini' ? 'text-xs' : 
            size === 'small' ? 'text-xs' : 
            'text-sm'
          }`}>
            Score
          </div>
        </div>
      </div>
    </div>
  )
}

export default CircularProgress
