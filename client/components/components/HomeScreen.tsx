'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Search, Filter, Star, MapPin, Clock, Heart } from 'lucide-react'
import { ImageWithFallback } from './figma/ImageWithFallback'
import type { Screen } from '../App'

interface HomeScreenProps {
  onNavigate: (screen: Screen, workerId?: string) => void
}

const workers = [
  {
    id: '1',
    name: 'Amara Hassan',
    age: 28,
    country: 'Ethiopia',
    specialties: ['Housekeeping', 'Childcare'],
    rating: 4.9,
    reviewCount: 47,
    hourlyRate: 45,
    location: 'New Cairo',
    experience: '5 years',
    availability: 'Available now',
    image: 'woman professional portrait',
    verified: true,
    featured: true
  },
  {
    id: '2', 
    name: 'Grace Mwangi',
    age: 35,
    country: 'Kenya',
    specialties: ['Cooking', 'Elderly Care'],
    rating: 4.8,
    reviewCount: 32,
    hourlyRate: 50,
    location: 'Maadi',
    experience: '8 years',
    availability: 'Available weekends',
    image: 'african woman smiling',
    verified: true,
    featured: false
  },
  {
    id: '3',
    name: 'Fatima Ali',
    age: 24,
    country: 'Sudan',
    specialties: ['Housekeeping', 'Pet Care'],
    rating: 4.7,
    reviewCount: 23,
    hourlyRate: 40,
    location: 'Heliopolis',
    experience: '3 years',
    availability: 'Flexible schedule',
    image: 'young woman professional',
    verified: true,
    featured: false
  }
]

const categories = [
  { id: 'all', name: 'All', count: 156 },
  { id: 'housekeeping', name: 'Housekeeping', count: 89 },
  { id: 'childcare', name: 'Childcare', count: 45 },
  { id: 'cooking', name: 'Cooking', count: 67 },
  { id: 'elderly', name: 'Elderly Care', count: 23 }
]

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [favorites, setFavorites] = useState<string[]>([])

  const toggleFavorite = (workerId: string) => {
    setFavorites(prev => 
      prev.includes(workerId) 
        ? prev.filter(id => id !== workerId)
        : [...prev, workerId]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white jobza-shadow">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-jobza-blue-dark">Find Your Helper</h1>
              <p className="text-jobza-grey">Trusted domestic workers near you</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-jobza-blue text-jobza-blue"
              onClick={() => onNavigate('job-form')}
            >
              Post Job
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-jobza-grey" />
            <Input
              placeholder="Search by name, skills, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-12 border-gray-200 focus:border-jobza-blue"
            />
            <Button
              size="sm"
              variant="ghost"
              className="absolute right-1 top-1 h-8 w-8 p-0"
            >
              <Filter className="h-4 w-4 text-jobza-grey" />
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="px-6 pb-4">
          <div className="flex space-x-2 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-jobza-blue hover:bg-jobza-blue-dark'
                    : 'border-gray-200 hover:border-jobza-blue'
                }`}
              >
                {category.name}
                <Badge 
                  variant="secondary" 
                  className="ml-2 bg-white text-jobza-grey"
                >
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Worker List */}
      <div className="p-4 space-y-4">
        {workers.map((worker) => (
          <Card 
            key={worker.id} 
            className="p-4 jobza-shadow border-0 bg-white cursor-pointer hover:scale-[1.02] transition-transform"
            onClick={() => onNavigate('profile', worker.id)}
          >
            <div className="flex gap-4">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={`https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face`} />
                  <AvatarFallback>{worker.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                {worker.verified && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-jobza-blue rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-jobza-blue-dark truncate">{worker.name}</h3>
                      {worker.featured && (
                        <Badge className="bg-jobza-pink text-white text-xs">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-jobza-grey">
                      {worker.age} years • {worker.country} • {worker.experience}
                    </p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(worker.id)
                    }}
                    className="p-1 h-auto"
                  >
                    <Heart 
                      className={`w-5 h-5 ${
                        favorites.includes(worker.id) 
                          ? 'text-jobza-pink fill-current' 
                          : 'text-gray-400'
                      }`} 
                    />
                  </Button>
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {worker.specialties.map((specialty) => (
                    <Badge 
                      key={specialty} 
                      variant="secondary"
                      className="text-xs bg-blue-50 text-jobza-blue border-0"
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>

                {/* Bottom Row */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-4 text-sm text-jobza-grey">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{worker.rating}</span>
                      <span>({worker.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{worker.location}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-jobza-blue-dark">EGP {worker.hourlyRate}/hr</p>
                    <p className="text-xs text-jobza-grey flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {worker.availability}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}