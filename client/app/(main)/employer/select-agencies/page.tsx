"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Clock, 
  Users,
  Building2,
  Shield,
  Award,
  ArrowLeft,
  Eye,
  MessageCircle,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import Link from "next/link"

// Mock agency data
const mockAgencies = [
  {
    id: 1,
    name: "BrightHands Agency",
    logo: "/logos/bright-hands.png",
    rating: 4.8,
    reviews: 127,
    experience: "12 years",
    location: "Downtown, Cairo",
    specializations: ["Maid Services", "Nanny Services", "Elder Care"],
    verifiedWorkers: 45,
    responseTime: "2-4 hours",
    successRate: "98%",
    languages: ["Arabic", "English", "French"],
    verified: true,
    premium: true,
    distance: "2.3 km",
    fees: "15% service fee",
    insurance: "Full coverage included",
    background: "verified"
  },
  {
    id: 2,
    name: "CareComm Agency",
    logo: "/logos/care-comm.png",
    rating: 4.7,
    reviews: 98,
    experience: "8 years",
    location: "Nasr City, Cairo",
    specializations: ["Child Care", "Housekeeping", "Pet Care"],
    verifiedWorkers: 32,
    responseTime: "4-6 hours",
    successRate: "95%",
    languages: ["Arabic", "English"],
    verified: true,
    premium: false,
    distance: "6.8 km",
    fees: "12% service fee",
    insurance: "Basic coverage",
    background: "verified"
  },
  {
    id: 3,
    name: "HomeHelpers Agency",
    logo: "/logos/home-helpers.png",
    rating: 4.6,
    reviews: 76,
    experience: "6 years",
    location: "Maadi, Cairo",
    specializations: ["Domestic Help", "Cleaning Services", "Laundry"],
    verifiedWorkers: 28,
    responseTime: "3-5 hours",
    successRate: "93%",
    languages: ["Arabic", "English"],
    verified: true,
    premium: false,
    distance: "5.1 km",
    fees: "10% service fee",
    insurance: "Basic coverage",
    background: "verified"
  },
  {
    id: 4,
    name: "FamilyFirst Agency",
    logo: "/logos/family-first.png",
    rating: 4.9,
    reviews: 156,
    experience: "15 years",
    location: "Heliopolis, Cairo",
    specializations: ["Premium Services", "VIP Care", "International Workers"],
    verifiedWorkers: 67,
    responseTime: "1-3 hours",
    successRate: "99%",
    languages: ["Arabic", "English", "French", "German"],
    verified: true,
    premium: true,
    distance: "8.7 km",
    fees: "20% service fee",
    insurance: "Premium coverage",
    background: "verified"
  },
  {
    id: 5,
    name: "TrustCare Agency",
    logo: "/logos/trust-care.png",
    rating: 4.5,
    reviews: 89,
    experience: "5 years",
    location: "Zamalek, Cairo",
    specializations: ["Elder Care", "Medical Assistance", "Companionship"],
    verifiedWorkers: 23,
    responseTime: "4-8 hours",
    successRate: "91%",
    languages: ["Arabic", "English"],
    verified: false,
    premium: false,
    distance: "3.2 km",
    fees: "8% service fee",
    insurance: "No coverage",
    background: "pending"
  }
]

export default function SelectAgenciesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedSpecialization, setSelectedSpecialization] = useState("")
  const [priceRange, setPriceRange] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedAgencies, setSelectedAgencies] = useState<number[]>([])
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)

  const filteredAgencies = mockAgencies.filter(agency => {
    const matchesSearch = agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agency.specializations.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesLocation = !selectedLocation || agency.location.includes(selectedLocation)
    const matchesSpecialization = !selectedSpecialization || agency.specializations.includes(selectedSpecialization)
    const matchesPrice = !priceRange || agency.fees.includes(priceRange)
    const matchesPremium = !showPremiumOnly || agency.premium
    
    return matchesSearch && matchesLocation && matchesSpecialization && matchesPrice && matchesPremium
  })

  const handleAgencySelection = (agencyId: number) => {
    setSelectedAgencies(prev => 
      prev.includes(agencyId) 
        ? prev.filter(id => id !== agencyId)
        : [...prev, agencyId]
    )
  }

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

  const getResponseTimeColor = (responseTime: string) => {
    if (responseTime.includes("1-3")) return "bg-green-100 text-green-800"
    if (responseTime.includes("2-4")) return "bg-blue-100 text-blue-800"
    if (responseTime.includes("3-5")) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const getSuccessRateColor = (successRate: string) => {
    const rate = parseInt(successRate)
    if (rate >= 98) return "bg-green-100 text-green-800"
    if (rate >= 95) return "bg-blue-100 text-blue-800"
    if (rate >= 90) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
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
              <Building2 className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-gray-600">Select Agencies</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Service Agencies</h1>
            <p className="text-gray-600">Choose from our network of verified domestic help agencies</p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search agencies by name or specialization..."
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

              {/* Premium Filter */}
              <div className="flex items-center space-x-2 lg:w-auto">
                <Checkbox 
                  id="premiumOnly" 
                  checked={showPremiumOnly}
                  onCheckedChange={(checked) => setShowPremiumOnly(checked as boolean)}
                />
                <Label htmlFor="premiumOnly" className="text-sm">Premium Only</Label>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Locations</SelectItem>
                        <SelectItem value="Downtown">Downtown</SelectItem>
                        <SelectItem value="Nasr City">Nasr City</SelectItem>
                        <SelectItem value="Maadi">Maadi</SelectItem>
                        <SelectItem value="Heliopolis">Heliopolis</SelectItem>
                        <SelectItem value="Zamalek">Zamalek</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Specialization</Label>
                    <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Specializations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Specializations</SelectItem>
                        <SelectItem value="Maid Services">Maid Services</SelectItem>
                        <SelectItem value="Nanny Services">Nanny Services</SelectItem>
                        <SelectItem value="Elder Care">Elder Care</SelectItem>
                        <SelectItem value="Child Care">Child Care</SelectItem>
                        <SelectItem value="Premium Services">Premium Services</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Service Fee</Label>
                    <Select value={priceRange} onValueChange={setPriceRange}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Fees" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Fees</SelectItem>
                        <SelectItem value="8%">Under 10%</SelectItem>
                        <SelectItem value="12%">10-15%</SelectItem>
                        <SelectItem value="15%">15-20%</SelectItem>
                        <SelectItem value="20%">Over 20%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Response Time</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Any Time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-3">1-3 hours</SelectItem>
                        <SelectItem value="2-4">2-4 hours</SelectItem>
                        <SelectItem value="3-5">3-5 hours</SelectItem>
                        <SelectItem value="4+">4+ hours</SelectItem>
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
              Showing <span className="font-semibold">{filteredAgencies.length}</span> of <span className="font-semibold">{mockAgencies.length}</span> agencies
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
                  <SelectItem value="responseTime">Response Time</SelectItem>
                  <SelectItem value="successRate">Success Rate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Agencies Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAgencies.map((agency) => (
              <Card key={agency.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-lg">{agency.name}</h3>
                          {agency.premium && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              <Award className="w-3 h-3 mr-1" />
                              Premium
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{agency.experience} experience</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{agency.rating}</span>
                          <span className="text-sm text-gray-500">({agency.reviews})</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={getBackgroundColor(agency.background)}>
                        {agency.background === "verified" ? "✓ Verified" : "Pending"}
                      </Badge>
                      <Checkbox 
                        checked={selectedAgencies.includes(agency.id)}
                        onCheckedChange={() => handleAgencySelection(agency.id)}
                      />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Key Info */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{agency.location}</span>
                      <span className="text-gray-400">•</span>
                      <span>{agency.distance}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{agency.verifiedWorkers} verified workers</span>
                    </div>
                  </div>

                  {/* Specializations */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Specializations</Label>
                    <div className="flex flex-wrap gap-1">
                      {agency.specializations.map((spec, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-xs text-gray-600">Response Time</p>
                      <Badge className={getResponseTimeColor(agency.responseTime)}>
                        {agency.responseTime}
                      </Badge>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-xs text-gray-600">Success Rate</p>
                      <Badge className={getSuccessRateColor(agency.successRate)}>
                        {agency.successRate}
                      </Badge>
                    </div>
                  </div>

                  {/* Services & Fees */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Service Fee:</span>
                      <span className="font-medium">{agency.fees}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Insurance:</span>
                      <span className="font-medium">{agency.insurance}</span>
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Languages Supported</Label>
                    <div className="flex flex-wrap gap-1">
                      {agency.languages.map((language, index) => (
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
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredAgencies.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No agencies found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
              <Button variant="outline" onClick={() => {
                setSearchTerm("")
                setSelectedLocation("")
                setSelectedSpecialization("")
                setPriceRange("")
                setShowPremiumOnly(false)
              }}>
                Clear All Filters
              </Button>
            </div>
          )}

          {/* Selection Summary */}
          {selectedAgencies.length > 0 && (
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
              <div className="container mx-auto max-w-7xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-medium">
                        {selectedAgencies.length} agenc{selectedAgencies.length === 1 ? 'y' : 'ies'} selected
                      </p>
                      <p className="text-sm text-gray-600">
                        Ready to proceed with your short-term booking
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Button variant="outline" onClick={() => setSelectedAgencies([])}>
                      Clear Selection
                    </Button>
                    <Button>
                      Continue with {selectedAgencies.length} Agenc{selectedAgencies.length === 1 ? 'y' : 'ies'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


