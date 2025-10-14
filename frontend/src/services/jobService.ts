import type { JobSource } from '../types/job'

const API_BASE_URL = 'http://localhost:8000'

export const fetchJobs = async (): Promise<JobSource> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/jobs`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching jobs:', error)
    throw error
  }
}

export const refreshJobs = async (): Promise<JobSource> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/jobs/refresh`, {
      method: 'POST'
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error refreshing jobs:', error)
    throw error
  }
}
