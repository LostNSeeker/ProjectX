import { ExternalLink, MapPin, Clock, Code } from 'lucide-react'
import type { Job } from '../types/job'

interface JobCardProps {
  job: Job
}

const JobCard = ({ job }: JobCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {job.title}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{job.is_remote ? 'Remote' : 'On-site'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{formatDate(job.scraped_at)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Code className="w-4 h-4" />
              <span>{getSourceName(job.source)}</span>
            </div>
          </div>
        </div>
        
        <a
          href={job.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <span>Apply</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {job.technologies.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {job.technologies.map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default JobCard
