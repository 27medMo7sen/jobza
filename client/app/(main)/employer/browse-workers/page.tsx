"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Clock, 
  DollarSign,
  Users,
  Home,
  Baby,
  Heart,
  ArrowLeft,
  Eye,
  MessageCircle
} from "lucide-react"
import Link from "next/link"

// Mock worker data
const mockWorkers = [
  {
    id: 1,
    name: "Amina Hassan",
    avatar: "/avatars/amina.jpg",
    role: "Maid / Housekeeper",
    rating: 4.8,
    reviews: 127,
    experience: "5 years",
    location: "Downtown, Cairo",
    hourlyRate: "EGP 45-60",
    availability: "Available Now",
    skills: ["Cleaning", "Laundry", "Cooking", "Pet Care"],
    languages: ["Arabic", "English"],
    verified: true,
    background: "verified",
    distance: "2.3 km"
  },
  {
    id: 2,
    name: "Fatima Ali",
    avatar: "/avatars/fatima.jpg",
    role: "Nanny / Child Care",
    rating: 4.9,
    reviews: 89,
    experience: "7 years",
    location: "Maadi, Cairo",
    hourlyRate: "EGP 50-70",
    availability: "Available Today",
    skills: ["Childcare", "Educational Activities", "Meal Prep", "Light Housekeeping"],
    languages: ["Arabic", "English", "French"],
    verified: true,
    background: "verified",
    distance: "5.1 km"
  },
  {
    id: 3,
    name: "Mariam Ahmed",
    avatar: "/avatars/mariam.jpg",
    role: "Adult Caregiver",
    rating: 4.7,
    reviews: 156,
    experience: "8 years",
    location: "Heliopolis, Cairo",
    hourlyRate: "EGP 55-75",
    availability: "Available Tomorrow",
    skills: ["Elder Care", "Medical Assistance", "Personal Care", "Companionship"],
    languages: ["Arabic", "English"],
    verified: true,
    background: "verified",
    distance: "8.7 km"
  },
  {
    id: 4,
    name: "Nour Ibrahim",
    avatar: "/avatars/nour.jpg",
    role: "Combined Role",
    rating: 4.6,
    reviews: 73,
    experience: "4 years",
    location: "Zamalek, Cairo",
    hourlyRate: "EGP 40-55",
    availability: "Available Now",
    skills: ["Housekeeping", "Childcare", "Cooking", "Pet Care"],
    languages: ["Arabic", "English"],
    verified: false,
    background: "pending",
    distance: "3.2 km"
  },
  {
    id: 5,
    name: "Sara Mohamed",
    avatar: "/avatars/sara.jpg",
    role: "Maid / Housekeeper",
    rating: 4.5,
    reviews: 94,
    experience: "6 years",
    location: "Nasr City, Cairo",
    hourlyRate: "EGP 42-58",
    availability: "Available This Week",
    skills: ["Deep Cleaning", "Laundry", "Ironing", "Organization"],
    languages: ["Arabic"],
    verified: true,
    background: "verified",
    distance: "6.8 km"
  }
]

export default function BrowseWorkersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [priceRange, setPriceRange] = useState("")
  const [availability, setAvailability] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const filteredWorkers = mockWorkers.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         worker.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesRole = !selectedRole || worker.role === selectedRole
    const matchesLocation = !selectedLocation || worker.location.includes(selectedLocation)
    const matchesPrice = !priceRange || worker.hourlyRate.includes(priceRange)
    const matchesAvailability = !availability || worker.availability.includes(availability)
    
    return matchesSearch && matchesRole && matchesLocation && matchesPrice && matchesAvailability
  })

  const getBackgroundColor = (background: string) => {
    switch (background) {
      case "verified":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAvailabilityColor = (availability: string) => {
    if (availability.includes("Now")) return "bg-green-100 text-green-800"
    if (availability.includes("Today")) return "bg-blue-100 text-blue-800"
    if (availability.includes("Tomorrow")) return "bg-purple-100 text-purple-800"
    return "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/employer/dashboard" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-gray-600">Browse Workers</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Available Workers</h1>
            <p className="text-gray-600">Find qualified domestic workers for short-term assistance</p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by name, skills, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:w-auto"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>

              {/* Quick Actions */}
              <div className="flex gap-2 lg:w-auto">
                <Button variant="outline" size="sm">
                  <MapPin className="w-4 h-4 mr-2" />
                  Near Me
                </Button>
                <Button variant="outline" size="sm">
                  <Clock className="w-4 h-4 mr-2" />
                  Available Now
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Roles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Roles</SelectItem>
                        <SelectItem value="Maid / Housekeeper">Maid / Housekeeper</SelectItem>
                        <SelectItem value="Nanny / Child Care">Nanny / Child Care</SelectItem>
                        <SelectItem value="Adult Caregiver">Adult Caregiver</SelectItem>
                        <SelectItem value="Combined Role">Combined Role</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Locations</SelectItem>
                        <SelectItem value="Downtown">Downtown</SelectItem>
                        <SelectItem value="Maadi">Maadi</SelectItem>
                        <SelectItem value="Heliopolis">Heliopolis</SelectItem>
                        <SelectItem value="Zamalek">Zamalek</SelectItem>
                        <SelectItem value="Nasr City">Nasr City</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Price Range</Label>
                    <Select value={priceRange} onValueChange={setPriceRange}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Prices" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Prices</SelectItem>
                        <SelectItem value="40">Under EGP 50</SelectItem>
                        <SelectItem value="50">EGP 50-60</SelectItem>
                        <SelectItem value="60">EGP 60-70</SelectItem>
                        <SelectItem value="70">Over EGP 70</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Availability</Label>
                    <Select value={availability} onValueChange={setAvailability}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Availability</SelectItem>
                        <SelectItem value="Now">Available Now</SelectItem>
                        <SelectItem value="Today">Available Today</SelectItem>
                        <SelectItem value="Tomorrow">Available Tomorrow</SelectItem>
                        <SelectItem value="Week">Available This Week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{filteredWorkers.length}</span> of <span className="font-semibold">{mockWorkers.length}</span> workers
            </p>
            <div className="flex items-center space-x-2">
              <Label className="text-sm">Sort by:</Label>
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="experience">Experience</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="distance">Distance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Workers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkers.map((worker) => (
              <Card key={worker.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={worker.avatar} alt={worker.name} />
                        <AvatarFallback className="text-lg font-semibold">
                          {worker.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{worker.name}</h3>
                        <p className="text-sm text-gray-600">{worker.role}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{worker.rating}</span>
                          <span className="text-sm text-gray-500">({worker.reviews})</span>
                        </div>
                      </div>
                    </div>
                    <Badge className={getBackgroundColor(worker.background)}>
                      {worker.background === "verified" ? "✓ Verified" : "Pending"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Key Info */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{worker.location}</span>
                      <span className="text-gray-400">•</span>
                      <span>{worker.distance}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{worker.experience} experience</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-medium">{worker.hourlyRate}/hour</span>
                    </div>
                  </div>

                  {/* Availability */}
                  <Badge className={getAvailabilityColor(worker.availability)}>
                    {worker.availability}
                  </Badge>

                  {/* Skills */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Skills</Label>
                    <div className="flex flex-wrap gap-1">
                      {worker.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {worker.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{worker.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Languages</Label>
                    <div className="flex flex-wrap gap-1">
                      {worker.languages.map((language, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                  </div>

                  {/* Quick Book */}
                  <Button className="w-full" size="sm">
                    <Clock className="w-4 h-4 mr-2" />
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredWorkers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No workers found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
              <Button variant="outline" onClick={() => {
                setSearchTerm("")
                setSelectedRole("")
                setSelectedLocation("")
                setPriceRange("")
                setAvailability("")
              }}>
                Clear All Filters
              </Button>
            </div>
          )}

          {/* Load More */}
          {filteredWorkers.length > 0 && (
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                Load More Workers
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


