import { useState, useEffect } from 'react'
import JobList from './components/JobList'
import Header from './components/Header'
import SearchAndFilter from './components/SearchAndFilter'
import AuthFlow from './components/AuthFlow'
import AdminDashboard from './components/AdminDashboard'
import Profile from './components/Profile'
import type { Job, JobSource } from './types/job'
import { fetchJobs } from './services/jobService'
import { authService } from './services/authService'
import './App.css'

function App() {
  const [jobs, setJobs] = useState<JobSource>({})
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [currentView, setCurrentView] = useState<'jobs' | 'admin' | 'profile'>('jobs')

  useEffect(() => {
    checkAuthStatus()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadJobs()
    }
  }, [isAuthenticated])

  useEffect(() => {
    filterJobs()
  }, [jobs, searchTerm, selectedTechnologies])

  const checkAuthStatus = async () => {
    try {
      if (authService.isAuthenticated()) {
        const user = await authService.getCurrentUser()
        setCurrentUser(user)
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      authService.logout()
    } finally {
      setAuthLoading(false)
    }
  }

  const handleAuthComplete = () => {
    setIsAuthenticated(true)
    loadJobs()
  }

  const handleLogout = () => {
    authService.logout()
    setIsAuthenticated(false)
  }

  const loadJobs = async () => {
    try {
      setLoading(true)
      const jobData = await fetchJobs()
      setJobs(jobData)
      setError(null)
    } catch (err) {
      setError('Failed to load jobs. Please try again later.')
      console.error('Error loading jobs:', err)
    } finally {
      setLoading(false)
    }
  }

  const filterJobs = () => {
    const allJobs: Job[] = []
    
    // Flatten all jobs from different sources
    Object.entries(jobs).forEach(([source, sourceJobs]) => {
      sourceJobs.forEach(job => {
        allJobs.push({
          ...job,
          source: source
        })
      })
    })

    // Apply filters
    let filtered = allJobs

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Technology filter
    if (selectedTechnologies.length > 0) {
      filtered = filtered.filter(job =>
        selectedTechnologies.some(tech =>
          job.technologies.some(jobTech =>
            jobTech.toLowerCase().includes(tech.toLowerCase())
          )
        )
      )
    }

    setFilteredJobs(filtered)
  }

  const getUniqueTechnologies = (): string[] => {
    const techs = new Set<string>()
    Object.values(jobs).forEach(sourceJobs => {
      sourceJobs.forEach(job => {
        job.technologies.forEach(tech => techs.add(tech))
      })
    })
    return Array.from(techs).sort()
  }

  const getTotalJobCount = (): number => {
    return Object.values(jobs).reduce((total, sourceJobs) => total + sourceJobs.length, 0)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 mx-auto mb-4"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AuthFlow onAuthComplete={handleAuthComplete} />
  }

  // Show admin dashboard if user is admin and current view is admin
  if (currentUser?.is_admin && currentView === 'admin') {
    return <AdminDashboard />
  }

  // Show profile page if current view is profile
  if (currentView === 'profile') {
    return <Profile />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <Header 
        totalJobs={getTotalJobCount()}
        onRefresh={loadJobs}
        loading={loading}
        onLogout={handleLogout}
        currentUser={currentUser}
        onViewChange={setCurrentView}
        currentView={currentView}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          technologies={getUniqueTechnologies()}
          selectedTechnologies={selectedTechnologies}
          onTechnologiesChange={setSelectedTechnologies}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6 shadow-soft animate-slide-in">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-semibold text-red-800">
                  Error loading jobs
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={loadJobs}
                    className="btn-secondary px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-medium"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col justify-center items-center py-16">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-black border-t-transparent absolute top-0 left-0"></div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Loading jobs<span className="loading-dots"></span></p>
          </div>
        ) : (
          <JobList jobs={filteredJobs} />
        )}
      </main>
    </div>
  )
}

export default App
