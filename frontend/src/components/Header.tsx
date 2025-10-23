import React from 'react'
import { RefreshCw, Briefcase, TrendingUp, Users, Zap, LogOut, Settings, Shield, User } from 'lucide-react'

interface HeaderProps {
  totalJobs: number
  onRefresh: () => void
  loading: boolean
  onLogout?: () => void
  currentUser?: any
  onViewChange?: (view: 'jobs' | 'admin' | 'profile') => void
  currentView?: 'jobs' | 'admin' | 'profile'
}

const Header: React.FC<HeaderProps> = ({ totalJobs, onRefresh, loading, onLogout, currentUser, onViewChange, currentView }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and title */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="flex items-center justify-center w-10 h-10 bg-black rounded-lg shadow-sm">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Remote Jobs
              </h1>
              <p className="text-xs text-gray-500">
                Full-stack opportunities
              </p>
            </div>
          </div>
          
          {/* Stats and refresh button */}
          <div className="flex items-center space-x-4">
            {/* Compact stats */}
            <div className="flex items-center space-x-3">
              <div className="text-center">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-gray-600" />
                </div>
                <p className="text-xs text-gray-500 mt-1">{totalJobs} jobs</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
                  <Users className="w-4 h-4 text-gray-600" />
                </div>
                <p className="text-xs text-gray-500 mt-1">50+ companies</p>
              </div>
            </div>
            
            {/* Compact refresh button */}
            <button
              onClick={onRefresh}
              disabled={loading}
              className="btn-primary flex items-center space-x-1 px-4 py-2 rounded-lg font-semibold text-sm shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            
            {/* Admin navigation */}
            {currentUser?.is_admin && onViewChange && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onViewChange('jobs')}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                    currentView === 'jobs' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Jobs</span>
                </button>
                <button
                  onClick={() => onViewChange('admin')}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                    currentView === 'admin' 
                      ? 'bg-red-100 text-red-700' 
                      : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </button>
              </div>
            )}

            {/* Profile navigation */}
            {onViewChange && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onViewChange('profile')}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                    currentView === 'profile'
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
              </div>
            )}

            {/* Logout button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center space-x-1 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
