import { Briefcase, TrendingUp, Clock, Sparkles } from 'lucide-react'
import type { Job } from '../types/job'
import JobCard from './JobCard'

interface JobListProps {
  jobs: Job[]
}

const JobList = ({ jobs }: JobListProps) => {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="mx-auto w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mb-6 shadow-soft">
          <Briefcase className="w-16 h-16 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">No jobs found</h3>
        <p className="text-gray-600 text-lg max-w-md mx-auto mb-6">
          We couldn't find any jobs matching your criteria. Try adjusting your search or filters.
        </p>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <Sparkles className="w-4 h-4" />
          <span>New opportunities are added daily</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Compact header with stats */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-black rounded-lg">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {jobs.length} {jobs.length === 1 ? 'Job' : 'Jobs'} Found
              </h2>
              <p className="text-sm text-gray-600">Remote opportunities</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg mb-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-xs text-gray-500">Fresh</p>
              <p className="text-sm font-bold text-gray-900">
                {jobs.filter(job => {
                  const hours = Math.floor((new Date().getTime() - new Date(job.scraped_at).getTime()) / (1000 * 60 * 60))
                  return hours < 24
                }).length}
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mb-1">
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-xs text-gray-500">Updated</p>
              <p className="text-xs font-semibold text-gray-900">
                {new Date().toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        </div>
        
        {/* Compact stats */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-200">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">
              {jobs.filter(job => job.is_remote).length}
            </p>
            <p className="text-xs text-gray-600">Remote</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">
              {new Set(jobs.map(job => job.source)).size}
            </p>
            <p className="text-xs text-gray-600">Sources</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">
              {new Set(jobs.flatMap(job => job.technologies)).size}
            </p>
            <p className="text-xs text-gray-600">Technologies</p>
          </div>
        </div>
      </div>

      {/* Job grid with better spacing */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job, index) => (
          <div 
            key={`${job.source}-${index}`}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <JobCard job={job} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default JobList
