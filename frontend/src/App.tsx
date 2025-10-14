import { useState, useEffect } from 'react'
import JobList from './components/JobList'
import Header from './components/Header'
import SearchAndFilter from './components/SearchAndFilter'
import type { Job, JobSource } from './types/job'
import { fetchJobs } from './services/jobService'
import './App.css'

function App() {
  const [jobs, setJobs] = useState<JobSource>({})
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([])

  useEffect(() => {
    loadJobs()
  }, [])

  useEffect(() => {
    filterJobs()
  }, [jobs, searchTerm, selectedTechnologies])

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        totalJobs={getTotalJobCount()}
        onRefresh={loadJobs}
        loading={loading}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          technologies={getUniqueTechnologies()}
          selectedTechnologies={selectedTechnologies}
          onTechnologiesChange={setSelectedTechnologies}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error loading jobs
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={loadJobs}
                    className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <JobList jobs={filteredJobs} />
        )}
      </main>
    </div>
  )
}

export default App
