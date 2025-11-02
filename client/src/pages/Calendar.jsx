import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Sidebar from '../components/Sidebar'

const Calendar = () => {
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(new Date())

  // Get calendar grid
  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 41) // 6 weeks * 7 days
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d))
    }
    
    return days
  }

  const days = getDaysInMonth(currentDate)
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const isToday = (date) => {
    return date.toDateString() === today.toDateString()
  }

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth()
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  return (
    <div className="min-h-screen bg-black flex">
      <Sidebar />
      
      <main className="flex-1 overflow-hidden ml-64">
        {/* Header */}
        <header className="bg-neutral-900 border-b border-neutral-800 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-white mb-2">Calendar</h1>
              <p className="text-gray-400">Keep track of your schedule and commitments</p>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-800">
              <h2 className="text-xl font-semibold text-white">{monthName}</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-2 hover:bg-neutral-800 rounded-lg"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-400" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 rounded-lg"
                >
                  Today
                </button>
                <button
                  onClick={() => navigateMonth(1)}
                  className="p-2 hover:bg-neutral-800 rounded-lg"
                >
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-6">
              {/* Day Headers */}
              <div className="grid grid-cols-7 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => (
                  <div
                    key={index}
                    className={`
                      aspect-square p-2 text-center text-sm cursor-pointer rounded-lg transition-colors
                      ${isCurrentMonth(day) 
                        ? isToday(day)
                          ? 'bg-white text-black hover:bg-gray-200'
                          : 'text-white hover:bg-neutral-800'
                        : 'text-gray-600'
                      }
                    `}
                  >
                    <div className="flex items-center justify-center h-full">
                      {day.getDate()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Today's Highlight */}
              {isCurrentMonth(today) && (
                <div className="mt-6 p-4 bg-neutral-800 rounded-lg border border-neutral-700">
                  <h3 className="font-medium text-white mb-2">Today - {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Calendar