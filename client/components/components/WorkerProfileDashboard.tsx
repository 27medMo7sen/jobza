'use client'

import { useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Checkbox } from './ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Progress } from './ui/progress'
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  Calendar,
  DollarSign,
  Camera,
  Edit,
  Save,
  Shield,
  Award,
  Clock,
  CheckCircle
} from 'lucide-react'
import type { Screen } from '../App'

interface WorkerProfileDashboardProps {
  onNavigate: (screen: Screen) => void
}

export function WorkerProfileDashboard({ onNavigate }: WorkerProfileDashboardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: 'Amara',
    lastName: 'Tekle',
    email: 'amara.tekle@email.com',
    phone: '+20 100 123 4567',
    location: 'New Cairo, Egypt',
    country: 'Ethiopia',
    bio: 'Experienced domestic worker with 8+ years of professional service. Specializing in housekeeping, childcare, and elderly care. I take pride in creating clean, organized, and comfortable living environments for families.',
    hourlyRate: '50',
    experience: '8+ years',
    languages: ['English', 'Arabic', 'Amharic'],
    skills: ['Housekeeping', 'Childcare', 'Elderly Care', 'Cooking', 'Organization'],
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    }
  })

  const availableSkills = [
    'Housekeeping', 'Childcare', 'Elderly Care', 'Cooking', 
    'Pet Care', 'Garden Care', 'Laundry', 'Organization',
    'Deep Cleaning', 'Ironing', 'Window Cleaning', 'Baby Care'
  ]

  const availableLanguages = [
    'English', 'Arabic', 'French', 'Amharic', 'Swahili', 'Tigrinya'
  ]

  const profileStats = {
    completedJobs: 147,
    rating: 4.9,
    reviews: 89,
    responseTime: '< 2 hours',
    profileViews: 234,
    completion: 85
  }

  const recentReviews = [
    {
      id: '1',
      family: 'Ahmed Family',
      rating: 5,
      comment: 'Amara is exceptional! Always punctual, thorough, and trustworthy.',
      date: '2024-01-10'
    },
    {
      id: '2',
      family: 'Hassan Family',
      rating: 5,
      comment: 'Wonderful with our elderly mother. Very caring and professional.',
      date: '2024-01-08'
    },
    {
      id: '3',
      family: 'Mohamed Family',
      rating: 4,
      comment: 'Great housekeeping skills and very reliable.',
      date: '2024-01-05'
    }
  ]

  const handleSkillToggle = (skill: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const handleLanguageToggle = (language: string) => {
    setProfileData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }))
  }

  const handleSave = () => {
    setIsEditing(false)
    // Here you would save to backend
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-jobza-blue-dark">My Profile</h2>
          <p className="text-jobza-grey">Manage your professional profile and settings</p>
        </div>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-jobza-blue hover:bg-jobza-blue-dark">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="bg-jobza-blue hover:bg-jobza-blue-dark">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card className="p-6 jobza-shadow border-0 bg-white">
            <div className="text-center">
              <div className="relative inline-block">
                <Avatar className="w-24 h-24 mx-auto">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
                  <AvatarFallback className="bg-jobza-pink text-white text-2xl">AT</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button 
                    size="sm" 
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-jobza-blue hover:bg-jobza-blue-dark"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <h3 className="mt-4 text-xl text-jobza-blue-dark">
                {profileData.firstName} {profileData.lastName}
              </h3>
              <p className="text-jobza-grey">Domestic Worker</p>
              
              <div className="flex items-center justify-center mt-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="ml-1 text-jobza-blue-dark">{profileStats.rating}</span>
                <span className="ml-1 text-jobza-grey">({profileStats.reviews} reviews)</span>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-center text-sm text-jobza-grey">
                  <MapPin className="w-4 h-4 mr-1" />
                  {profileData.location}
                </div>
                <div className="flex items-center justify-center text-sm text-jobza-grey">
                  <DollarSign className="w-4 h-4 mr-1" />
                  {profileData.hourlyRate} EGP/hour
                </div>
                <div className="flex items-center justify-center text-sm text-jobza-grey">
                  <Clock className="w-4 h-4 mr-1" />
                  Response time: {profileStats.responseTime}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-jobza-grey">Profile Completion</span>
                    <span className="text-jobza-blue-dark">{profileStats.completion}%</span>
                  </div>
                  <Progress value={profileStats.completion} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg text-jobza-blue-dark">{profileStats.completedJobs}</div>
                    <div className="text-xs text-jobza-grey">Jobs Completed</div>
                  </div>
                  <div>
                    <div className="text-lg text-jobza-blue-dark">{profileStats.profileViews}</div>
                    <div className="text-xs text-jobza-grey">Profile Views</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Verification Status */}
          <Card className="p-4 jobza-shadow border-0 bg-white mt-6">
            <h4 className="text-jobza-blue-dark mb-3 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Verification Status
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-jobza-grey">Identity Verified</span>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-jobza-grey">Background Check</span>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-jobza-grey">References</span>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="personal" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            {/* Personal Information */}
            <TabsContent value="personal">
              <Card className="p-6 jobza-shadow border-0 bg-white">
                <h4 className="text-lg text-jobza-blue-dark mb-4">Personal Information</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country of Origin</Label>
                    <Select value={profileData.country} onValueChange={(value) => setProfileData(prev => ({ ...prev, country: value }))} disabled={!isEditing}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ethiopia">Ethiopia</SelectItem>
                        <SelectItem value="Kenya">Kenya</SelectItem>
                        <SelectItem value="Uganda">Uganda</SelectItem>
                        <SelectItem value="Sudan">Sudan</SelectItem>
                        <SelectItem value="Ghana">Ghana</SelectItem>
                        <SelectItem value="Nigeria">Nigeria</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="bio">About You</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    disabled={!isEditing}
                    className="mt-1 min-h-[100px]"
                    placeholder="Tell families about your experience and what makes you special..."
                  />
                </div>
              </Card>
            </TabsContent>

            {/* Professional Information */}
            <TabsContent value="professional">
              <Card className="p-6 jobza-shadow border-0 bg-white">
                <h4 className="text-lg text-jobza-blue-dark mb-4">Professional Information</h4>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hourlyRate">Hourly Rate (EGP)</Label>
                      <Input
                        id="hourlyRate"
                        type="number"
                        value={profileData.hourlyRate}
                        onChange={(e) => setProfileData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Select value={profileData.experience} onValueChange={(value) => setProfileData(prev => ({ ...prev, experience: value }))} disabled={!isEditing}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-2 years">1-2 years</SelectItem>
                          <SelectItem value="3-5 years">3-5 years</SelectItem>
                          <SelectItem value="6-8 years">6-8 years</SelectItem>
                          <SelectItem value="8+ years">8+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Skills & Services</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {availableSkills.map((skill) => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox
                            id={skill}
                            checked={profileData.skills.includes(skill)}
                            onCheckedChange={() => handleSkillToggle(skill)}
                            disabled={!isEditing}
                            className="border-jobza-blue data-[state=checked]:bg-jobza-blue"
                          />
                          <Label htmlFor={skill} className="text-sm">
                            {skill}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {profileData.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {profileData.skills.map((skill) => (
                          <Badge key={skill} className="bg-jobza-blue text-white border-0">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Languages</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {availableLanguages.map((language) => (
                        <div key={language} className="flex items-center space-x-2">
                          <Checkbox
                            id={language}
                            checked={profileData.languages.includes(language)}
                            onCheckedChange={() => handleLanguageToggle(language)}
                            disabled={!isEditing}
                            className="border-jobza-blue data-[state=checked]:bg-jobza-pink"
                          />
                          <Label htmlFor={language} className="text-sm">
                            {language}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {profileData.languages.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {profileData.languages.map((language) => (
                          <Badge key={language} className="bg-jobza-pink text-white border-0">
                            {language}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Availability */}
            <TabsContent value="availability">
              <Card className="p-6 jobza-shadow border-0 bg-white">
                <h4 className="text-lg text-jobza-blue-dark mb-4">Weekly Availability</h4>
                
                <div className="space-y-3">
                  {Object.entries(profileData.availability).map(([day, available]) => (
                    <div key={day} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                      <Label htmlFor={day} className="capitalize cursor-pointer">
                        {day}
                      </Label>
                      <Checkbox
                        id={day}
                        checked={available}
                        onCheckedChange={(checked) => 
                          setProfileData(prev => ({
                            ...prev,
                            availability: { ...prev.availability, [day]: !!checked }
                          }))
                        }
                        disabled={!isEditing}
                        className="border-jobza-blue data-[state=checked]:bg-jobza-blue"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Calendar className="w-5 h-5 text-jobza-blue mt-0.5" />
                    <div>
                      <p className="text-sm text-jobza-blue-dark">
                        <strong>Note:</strong> Your availability helps families find you at the right time.
                      </p>
                      <p className="text-sm text-jobza-grey mt-1">
                        You can still accept specific jobs outside these hours if needed.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Reviews */}
            <TabsContent value="reviews">
              <Card className="p-6 jobza-shadow border-0 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg text-jobza-blue-dark">Reviews & Ratings</h4>
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-lg text-jobza-blue-dark">{profileStats.rating}</span>
                    <span className="text-jobza-grey">({profileStats.reviews} reviews)</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {recentReviews.map((review) => (
                    <div key={review.id} className="p-4 border border-gray-100 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-jobza-blue-dark">{review.family}</span>
                          <div className="flex">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-jobza-grey">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-jobza-grey">{review.comment}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-center">
                  <Button variant="outline" className="border-jobza-blue text-jobza-blue hover:bg-blue-50">
                    View All Reviews
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}