export interface Job {
  title: string
  link: string
  technologies: string[]
  is_remote: boolean
  scraped_at: string
  source: string
}

export interface JobSource {
  [sourceUrl: string]: Omit<Job, 'source'>[]
}
