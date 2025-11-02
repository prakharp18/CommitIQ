import { BarChart3, Home, Calendar, TrendingUp, Users, Settings, HelpCircle, LogOut } from 'lucide-react'
import { useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Sidebar = () => {
  const location = useLocation()
  const { user, logout } = useAuth()
  
  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
    { icon: Calendar, label: 'Calendar', path: '/calendar' },
    { icon: TrendingUp, label: 'Analytics', path: '/analytics' },
    { icon: Users, label: 'PR Insights', path: '/pr-insights' }
  ]

  const generalItems = [
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: HelpCircle, label: 'Help', path: '/help' },
    { icon: LogOut, label: 'Logout', path: '/logout' }
  ]

  return (
    <div className="w-64 bg-neutral-900 h-screen flex flex-col border-r border-neutral-800 fixed left-0 top-0 bottom-0">
      {/* Header */}
      <div className="p-6 border-b border-neutral-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-sm">C</span>
          </div>
          <span className="text-xl font-semibold text-white">CommitIQ</span>
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="mb-8">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">MENU</h3>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                data-clickable="true"
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors group ${
                  location.pathname === item.path
                    ? 'bg-white text-black' 
                    : 'text-gray-400 hover:bg-neutral-800 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className={`h-5 w-5 ${
                    location.pathname === item.path 
                      ? 'text-black' 
                      : 'text-gray-500 group-hover:text-gray-300'
                  }`} />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    location.pathname === item.path 
                      ? 'bg-gray-200 text-black' 
                      : 'bg-neutral-800 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">GENERAL</h3>
          <nav className="space-y-1">
            {generalItems.map((item) => (
              <button
                key={item.label}
                data-clickable="true"
                onClick={(e) => {
                  if (item.label === 'Logout') {
                    e.preventDefault()
                    logout()
                  }
                }}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-neutral-800 hover:text-white transition-colors group text-left"
              >
                <item.icon className="h-5 w-5 text-gray-500 group-hover:text-gray-300" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-neutral-800 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.username} className="w-10 h-10 rounded-full" />
            ) : (
              <span className="text-black text-sm font-semibold">
                {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.username || 'GitHub User'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || '@username'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar