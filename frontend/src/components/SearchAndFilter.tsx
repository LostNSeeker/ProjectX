import { useState } from 'react'
import { Search, Filter, X, Sparkles, Zap } from 'lucide-react'

interface SearchAndFilterProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  technologies: string[]
  selectedTechnologies: string[]
  onTechnologiesChange: (techs: string[]) => void
}

const SearchAndFilter = ({
  searchTerm,
  onSearchChange,
  technologies,
  selectedTechnologies,
  onTechnologiesChange
}: SearchAndFilterProps) => {
  const [showFilters, setShowFilters] = useState(false)

  const toggleTechnology = (tech: string) => {
    if (selectedTechnologies.includes(tech)) {
      onTechnologiesChange(selectedTechnologies.filter(t => t !== tech))
    } else {
      onTechnologiesChange([...selectedTechnologies, tech])
    }
  }

  const clearAllFilters = () => {
    onTechnologiesChange([])
    onSearchChange('')
  }

  const hasActiveFilters = searchTerm || selectedTechnologies.length > 0

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 animate-fade-in">
      {/* Compact Search Bar */}
      <div className="relative mb-4">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search jobs... (e.g., 'React Developer', 'Full Stack')"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all font-medium placeholder-gray-400"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Compact Filter Section */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 text-gray-700 hover:text-black transition-colors group"
        >
          <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
            <Filter className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-sm">Filter by Technology</p>
            {selectedTechnologies.length > 0 && (
              <span className="bg-black text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                {selectedTechnologies.length} selected
              </span>
            )}
          </div>
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center space-x-1 text-sm text-gray-500 hover:text-black transition-colors group"
          >
            <Zap className="w-4 h-4 group-hover:animate-pulse" />
            <span className="font-medium">Clear all</span>
          </button>
        )}
      </div>

      {/* Compact Technology Filters */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 animate-slide-in">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Technologies</h3>
            <p className="text-xs text-gray-600">Click to filter by technology</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <button
                key={tech}
                onClick={() => toggleTechnology(tech)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:scale-105 ${
                  selectedTechnologies.includes(tech)
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Compact Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 animate-slide-in">
          <div className="flex items-center space-x-1 mb-2">
            <Sparkles className="w-3 h-3 text-yellow-500" />
            <h3 className="text-sm font-semibold text-gray-900">Active Filters</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm bg-green-100 text-green-800 font-medium">
                <Search className="w-3 h-3 mr-1" />
                "{searchTerm}"
                <button
                  onClick={() => onSearchChange('')}
                  className="ml-1 text-green-600 hover:text-green-800 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedTechnologies.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center px-3 py-1 rounded-lg text-sm bg-blue-100 text-blue-800 font-medium"
              >
                <Zap className="w-3 h-3 mr-1" />
                {tech}
                <button
                  onClick={() => toggleTechnology(tech)}
                  className="ml-1 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchAndFilter
