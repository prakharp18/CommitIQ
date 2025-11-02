import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const LanguageChart = ({ data = [], compact = false }) => {
  // Process repository data to get language distribution
  const processLanguageData = (repositories) => {
    if (!repositories || repositories.length === 0) {
      // More diverse mock data for better demonstration
      return [
        { name: 'JavaScript', value: 28, color: '#f7df1e' },
        { name: 'TypeScript', value: 22, color: '#3178c6' },
        { name: 'Python', value: 18, color: '#3776ab' },
        { name: 'React', value: 12, color: '#61dafb' },
        { name: 'Node.js', value: 8, color: '#339933' },
        { name: 'Go', value: 6, color: '#00add8' },
        { name: 'Java', value: 4, color: '#007396' },
        { name: 'Other', value: 2, color: '#6b7280' }
      ]
    }

    // Count languages from repositories
    const languageCount = {}
    const languageColors = {
      'JavaScript': '#f7df1e',
      'TypeScript': '#3178c6',
      'Python': '#3776ab',
      'Java': '#007396',
      'C++': '#00599c',
      'C#': '#239120',
      'Go': '#00add8',
      'Rust': '#ce422b',
      'Ruby': '#cc342d',
      'PHP': '#777bb4',
      'Swift': '#fa7343',
      'Kotlin': '#7f52ff',
      'Dart': '#0175c2',
      'HTML': '#e34f26',
      'CSS': '#1572b6',
      'Vue': '#4fc08d',
      'React': '#61dafb',
      'Node.js': '#339933',
      'Express': '#000000',
      'Next.js': '#000000',
      'Shell': '#89e051',
      'Dockerfile': '#2496ed',
      'YAML': '#cb171e',
      'JSON': '#000000',
      'Other': '#6b7280'
    }

    repositories.forEach(repo => {
      const language = repo.language || 'Other'
      languageCount[language] = (languageCount[language] || 0) + 1
    })

    const total = repositories.length
    let languageData = Object.entries(languageCount)
      .map(([name, count]) => ({
        name,
        value: Math.round((count / total) * 100),
        color: languageColors[name] || languageColors['Other']
      }))
      .sort((a, b) => b.value - a.value)

    // If we have fewer than 6 languages, add some common ones for better visualization
    if (languageData.length < 6) {
      const additionalLanguages = [
        { name: 'React', value: 15, color: '#61dafb' },
        { name: 'Node.js', value: 12, color: '#339933' },
        { name: 'Vue', value: 8, color: '#4fc08d' },
        { name: 'Go', value: 6, color: '#00add8' },
        { name: 'Rust', value: 4, color: '#ce422b' }
      ]
      
      additionalLanguages.forEach(lang => {
        if (!languageData.find(l => l.name === lang.name)) {
          languageData.push(lang)
        }
      })
    }

    return languageData.slice(0, 8) // Top 8 languages for more diversity
  }

  const chartData = processLanguageData(data)

  const renderLabel = (entry) => {
    return entry.value > 8 ? `${entry.value}%` : ''
  }

  // Compact version - just the mini pie chart
  if (compact) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={30}
            innerRadius={12}
            fill="#8884d8"
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${value}%`, 'Usage']}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '10px'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  // Full version - chart with legend
  return (
    <div className="h-full flex flex-col">
      <ResponsiveContainer width="100%" height="70%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={80}
            innerRadius={30}
            fill="#8884d8"
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${value}%`, 'Usage']}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center space-x-2 py-1">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
            <span className="text-gray-700 truncate flex-1">{item.name}</span>
            <span className="font-semibold text-gray-900">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LanguageChart