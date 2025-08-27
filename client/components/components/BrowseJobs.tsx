'use client'

import { useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Checkbox } from './ui/checkbox'
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Clock, 
  Calendar,
  Star,
  Filter,
  Heart,
  MessageCircle,
  Users,
  ChevronRight,
  Briefcase
} from 'lucide-react'
import type { Screen } from '../App'

interface BrowseJobsProps {
  onNavigate: (screen: Screen) => void
}

export function BrowseJobs({ onNavigate }: BrowseJobsProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('all-locations')
  const [selectedJobType, setSelectedJobType] = useState('all-services')
  const [showFilters, setShowFilters] = useState(false)
  const [savedJobs, setSavedJobs] = useState<string[]>([])

  const [filters, setFilters] = useState({
    minRate: '',
    maxRate: '',
    schedule: 'all-schedules',
    urgency: 'all-urgency',
    familySize: '',
    languages: [] as string[]
  })

  const jobListings = [
    {
      id: '1',
      title: 'Weekly House Cleaning',
      family: 'The Ahmed Family',
      location: 'New Cairo',
      description: 'Looking for a reliable housekeeper for weekly cleaning. 3-bedroom apartment, family of 4.',
      rate: '45-55 EGP/hour',
      schedule: 'Part-time',
      hours: '15 hours/week',
      posted: '2 hours ago',
      urgency: 'normal',
      requirements: ['Housekeeping', 'Organization'],
      familyRating: 4.8,
      avatar: '/placeholder-avatar.jpg',
      verified: true
    },
    {
      id: '2',
      title: 'Elderly Care Assistant',
      family: 'The Hassan Family',
      location: 'Maadi',
      description: 'Seeking a compassionate caregiver for elderly father. Experience with mobility assistance preferred.',
      rate: '60-70 EGP/hour',
      schedule: 'Full-time',
      hours: '40 hours/week',
      posted: '4 hours ago',
      urgency: 'urgent',
      requirements: ['Elderly Care', 'English'],
      familyRating: 4.9,
      avatar: '/placeholder-avatar.jpg',
      verified: true
    },
    {
      id: '3',
      title: 'Childcare & Light Housekeeping',
      family: 'The Mohamed Family',
      location: 'Zamalek',
      description: 'Need help with 2 young children (ages 3 & 5) and light housekeeping duties.',
      rate: '50-60 EGP/hour',
      schedule: 'Part-time',
      hours: '25 hours/week',
      posted: '1 day ago',
      urgency: 'normal',
      requirements: ['Childcare', 'Housekeeping', 'Arabic'],
      familyRating: 4.7,
      avatar: '/placeholder-avatar.jpg',
      verified: true
    },
    {
      id: '4',
      title: 'Deep Cleaning Service',
      family: 'The Ali Family',
      location: 'Heliopolis',
      description: 'One-time deep cleaning needed for 4-bedroom villa before family event.',
      rate: '40-50 EGP/hour',
      schedule: 'One-time',
      hours: '2 days',
      posted: '1 day ago',
      urgency: 'emergency',
      requirements: ['Deep Cleaning', 'Organization'],
      familyRating: 4.6,
      avatar: '/placeholder-avatar.jpg',
      verified: false
    },
    {
      id: '5',
      title: 'Live-in Domestic Helper',
      family: 'The Mahmoud Family',
      location: 'New Capital',
      description: 'Seeking live-in domestic helper for large household. Accommodation and meals provided.',
      rate: '3000 EGP/month',
      schedule: 'Full-time',
      hours: 'Live-in',
      posted: '2 days ago',
      urgency: 'normal',
      requirements: ['Housekeeping', 'Cooking', 'Organization'],
      familyRating: 4.8,
      avatar: '/placeholder-avatar.jpg',
      verified: true
    }
  ]

  const jobTypes = [
    'Housekeeping', 'Childcare', 'Elderly Care', 'Cooking', 
    'Pet Care', 'Garden Care', 'Laundry', 'Organization', 'Deep Cleaning'
  ]

  const locations = [
    'New Cairo', 'Maadi', 'Zamalek', 'Heliopolis', 'New Capital', 
    'Mohandessin', 'Garden City', 'Dokki', 'Agouza'
  ]

  const languages = ['English', 'Arabic', 'French', 'Amharic']

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    )
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'bg-red-100 text-red-800 border-red-200'
      case 'urgent': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.requirements.some(req => req.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesLocation = selectedLocation === 'all-locations' || job.location === selectedLocation
    const matchesJobType = selectedJobType === 'all-services' || job.requirements.includes(selectedJobType)
    
    return matchesSearch && matchesLocation && matchesJobType
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-jobza-blue-dark">Browse Jobs</h2>
          <p className="text-jobza-grey">Find new opportunities that match your skills</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setShowFilters(!showFilters)}
          className="border-jobza-blue text-jobza-blue hover:bg-blue-50"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Search and Quick Filters */}
      <Card className="p-4 jobza-shadow border-0 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-jobza-grey" />
              <Input
                placeholder="Search jobs by title, description, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-200 focus:border-jobza-blue"
              />
            </div>
          </div>
          <div>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="border-gray-200 focus:border-jobza-blue">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-locations">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={selectedJobType} onValueChange={setSelectedJobType}>
              <SelectTrigger className="border-gray-200 focus:border-jobza-blue">
                <SelectValue placeholder="Service Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-services">All Services</SelectItem>
                {jobTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Advanced Filters */}
      {showFilters && (
        <Card className="p-4 jobza-shadow border-0 bg-white">
          <h4 className="text-jobza-blue-dark mb-4">Advanced Filters</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-jobza-grey">Hourly Rate Range</label>
              <div className="flex space-x-2 mt-1">
                <Input
                  placeholder="Min"
                  value={filters.minRate}
                  onChange={(e) => setFilters(prev => ({ ...prev, minRate: e.target.value }))}
                  className="border-gray-200 focus:border-jobza-blue"
                />
                <Input
                  placeholder="Max"
                  value={filters.maxRate}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxRate: e.target.value }))}
                  className="border-gray-200 focus:border-jobza-blue"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-jobza-grey">Schedule Type</label>
              <Select value={filters.schedule} onValueChange={(value) => setFilters(prev => ({ ...prev, schedule: value }))}>
                <SelectTrigger className="mt-1 border-gray-200 focus:border-jobza-blue">
                  <SelectValue placeholder="Any schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-schedules">Any schedule</SelectItem>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="One-time">One-time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-jobza-grey">Urgency</label>
              <Select value={filters.urgency} onValueChange={(value) => setFilters(prev => ({ ...prev, urgency: value }))}>
                <SelectTrigger className="mt-1 border-gray-200 focus:border-jobza-blue">
                  <SelectValue placeholder="Any urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-urgency">Any urgency</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm text-jobza-grey">Languages Required</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {languages.map((language) => (
                <div key={language} className="flex items-center space-x-2">
                  <Checkbox
                    id={`filter-${language}`}
                    checked={filters.languages.includes(language)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFilters(prev => ({ ...prev, languages: [...prev.languages, language] }))
                      } else {
                        setFilters(prev => ({ ...prev, languages: prev.languages.filter(l => l !== language) }))
                      }
                    }}
                    className="border-jobza-blue data-[state=checked]:bg-jobza-blue"
                  />
                  <label htmlFor={`filter-${language}`} className="text-sm cursor-pointer">
                    {language}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-jobza-grey">
            Showing {filteredJobs.length} jobs {searchQuery && `for "${searchQuery}"`}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-jobza-grey">Sort by:</span>
          <Select defaultValue="newest">
            <SelectTrigger className="w-40 border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="rate-high">Highest Rate</SelectItem>
              <SelectItem value="rate-low">Lowest Rate</SelectItem>
              <SelectItem value="rating">Family Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="p-6 jobza-shadow border-0 bg-white hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={job.avatar} alt={job.family} />
                  <AvatarFallback className="bg-jobza-blue text-white">
                    {job.family.split(' ')[1]?.[0] || 'F'}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg text-jobza-blue-dark">{job.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-jobza-grey">{job.family}</span>
                        {job.verified && (
                          <Badge className="bg-green-100 text-green-800 border-0 text-xs">
                            Verified
                          </Badge>
                        )}
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-jobza-grey ml-1">{job.familyRating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge className={getUrgencyColor(job.urgency)}>
                        {job.urgency}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSaveJob(job.id)}
                        className={savedJobs.includes(job.id) ? 'text-jobza-pink' : 'text-jobza-grey'}
                      >
                        <Heart className={`w-4 h-4 ${savedJobs.includes(job.id) ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </div>

                  <p className="text-jobza-grey mt-2 line-clamp-2">{job.description}</p>

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-jobza-grey">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {job.rate}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {job.hours}
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-1" />
                      {job.schedule}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Posted {job.posted}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex flex-wrap gap-1">
                      {job.requirements.map((req) => (
                        <Badge key={req} variant="outline" className="border-jobza-blue text-jobza-blue">
                          {req}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-jobza-grey text-jobza-grey hover:bg-gray-50"
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Message
                      </Button>
                      <Button
                        size="sm"
                        className="bg-jobza-blue hover:bg-jobza-blue-dark"
                      >
                        Apply Now
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {filteredJobs.length > 0 && (
        <div className="text-center pt-6">
          <Button 
            variant="outline" 
            className="border-jobza-blue text-jobza-blue hover:bg-blue-50"
          >
            Load More Jobs
          </Button>
        </div>
      )}

      {/* Empty State */}
      {filteredJobs.length === 0 && (
        <Card className="p-12 jobza-shadow border-0 bg-white text-center">
          <Search className="w-12 h-12 text-jobza-grey mx-auto mb-4" />
          <h3 className="text-xl text-jobza-blue-dark mb-2">No jobs found</h3>
          <p className="text-jobza-grey mb-4">
            Try adjusting your search criteria or check back later for new opportunities.
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchQuery('')
              setSelectedLocation('all-locations')
              setSelectedJobType('all-services')
            }}
            className="border-jobza-blue text-jobza-blue hover:bg-blue-50"
          >
            Clear Filters
          </Button>
        </Card>
      )}
    </div>
  )
}