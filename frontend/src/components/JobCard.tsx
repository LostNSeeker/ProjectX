import { ExternalLink, MapPin, Clock, Code } from 'lucide-react'
import type { Job } from '../types/job'

interface JobCardProps {
  job: Job
}

const JobCard = ({ job }: JobCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getSourceName = (sourceUrl: string) => {
    try {
      const url = new URL(sourceUrl)
      return url.hostname.replace('www.', '')
    } catch {
      return 'Unknown Source'
    }
  }


  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-200 p-5 card-hover hover:shadow-lg transition-all duration-300 animate-fade-in">
      {/* Compact header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 pr-3">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-black transition-colors">
            {job.title}
          </h3>
          
          {/* Compact metadata */}
          <div className="flex items-center space-x-4 text-xs text-gray-600 mb-3">
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-green-600" />
              <span className="font-medium">{job.is_remote ? 'Remote' : 'On-site'}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-blue-600" />
              <span className="font-medium">{formatDate(job.scraped_at)}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Code className="w-3 h-3 text-purple-600" />
              <span className="font-medium">{getSourceName(job.source)}</span>
            </div>
          </div>
        </div>
        
        <a
          href={job.link}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary flex items-center space-x-1 px-4 py-2 rounded-lg font-semibold text-sm shadow-sm hover:shadow-md transition-all group-hover:scale-105"
        >
          <span>Apply</span>
          <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>

      {/* Technology tags - more compact */}
      {job.technologies.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1.5">
            {job.technologies.slice(0, 4).map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium hover:bg-gray-200 transition-colors"
              >
                {tech}
              </span>
            ))}
            {job.technologies.length > 4 && (
              <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded-md text-xs font-medium">
                +{job.technologies.length - 4}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Compact footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
        <span>Posted {formatDate(job.scraped_at)}</span>
        <div className="flex items-center space-x-1">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          <span>Active</span>
        </div>
      </div>
    </div>
  )
}

export default JobCard
