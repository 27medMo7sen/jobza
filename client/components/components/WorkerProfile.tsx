'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Progress } from './ui/progress'
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Phone, 
  Heart,
  Shield,
  Calendar,
  Award,
  Users
} from 'lucide-react'
import type { Screen } from '../App'

interface WorkerProfileProps {
  workerId: string
  onNavigate: (screen: Screen) => void
}

const workerData = {
  id: '1',
  name: 'Amara Hassan',
  age: 28,
  country: 'Ethiopia',
  location: 'New Cairo, Egypt',
  joinedDate: 'March 2023',
  rating: 4.9,
  reviewCount: 47,
  hourlyRate: 45,
  completedJobs: 156,
  responseTime: '2 hours',
  languages: ['English', 'Arabic', 'Amharic'],
  specialties: ['Housekeeping', 'Childcare', 'Cooking'],
  experience: '5 years',
  availability: 'Mon-Fri: 8AM-6PM',
  image: 'woman professional portrait',
  verified: true,
  background: 'Experienced domestic worker with excellent references. Specializes in family care and maintaining clean, organized homes.',
  skills: [
    { name: 'House Cleaning', level: 95 },
    { name: 'Childcare', level: 90 },
    { name: 'Cooking', level: 85 },
    { name: 'Organization', level: 92 },
    { name: 'Pet Care', level: 78 }
  ],
  reviews: [
    {
      id: 1,
      author: 'Sarah M.',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Amara is absolutely wonderful! She takes excellent care of our home and children. Highly recommended.'
    },
    {
      id: 2,
      author: 'Ahmed K.',
      rating: 5,
      date: '1 month ago',
      comment: 'Very professional and reliable. Our house has never been cleaner!'
    },
    {
      id: 3,
      author: 'Layla H.',
      rating: 4,
      date: '2 months ago',
      comment: 'Great work ethic and very trustworthy. Good with kids and pets.'
    }
  ]
}

export function WorkerProfile({ workerId, onNavigate }: WorkerProfileProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white jobza-shadow sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate('home')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5 text-jobza-blue" />
          </Button>
          <h2 className="text-jobza-blue-dark">Worker Profile</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2"
          >
            <Heart 
              className={`w-5 h-5 ${
                isFavorite ? 'text-jobza-pink fill-current' : 'text-gray-400'
              }`} 
            />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Profile Header */}
        <Card className="p-6 jobza-shadow border-0 bg-white">
          <div className="flex gap-4">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face" />
                <AvatarFallback>AH</AvatarFallback>
              </Avatar>
              {workerData.verified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-jobza-blue rounded-full flex items-center justify-center">
                  <Shield className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-jobza-blue-dark">{workerData.name}</h1>
                  <Badge className="bg-green-100 text-green-700 border-0">
                    Available
                  </Badge>
                </div>
                
                <p className="text-jobza-grey">
                  {workerData.age} years • {workerData.country}
                </p>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-jobza-blue-dark">{workerData.rating}</span>
                    <span className="text-jobza-grey">({workerData.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-jobza-grey">
                    <MapPin className="w-4 h-4" />
                    <span>{workerData.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hourly Rate */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-jobza-grey">Hourly Rate</p>
                <p className="text-2xl text-jobza-blue-dark">EGP {workerData.hourlyRate}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-jobza-grey">Response Time</p>
                <p className="text-jobza-blue-dark">{workerData.responseTime}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center jobza-shadow border-0 bg-white">
            <Users className="w-6 h-6 text-jobza-blue mx-auto mb-2" />
            <p className="text-2xl text-jobza-blue-dark">{workerData.completedJobs}</p>
            <p className="text-xs text-jobza-grey">Jobs Done</p>
          </Card>
          
          <Card className="p-4 text-center jobza-shadow border-0 bg-white">
            <Award className="w-6 h-6 text-jobza-pink mx-auto mb-2" />
            <p className="text-2xl text-jobza-blue-dark">{workerData.experience}</p>
            <p className="text-xs text-jobza-grey">Experience</p>
          </Card>
          
          <Card className="p-4 text-center jobza-shadow border-0 bg-white">
            <Calendar className="w-6 h-6 text-jobza-blue mx-auto mb-2" />
            <p className="text-2xl text-jobza-blue-dark">2023</p>
            <p className="text-xs text-jobza-grey">Joined</p>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white jobza-shadow border-0">
            <TabsTrigger value="about" className="data-[state=active]:bg-jobza-blue data-[state=active]:text-white">
              About
            </TabsTrigger>
            <TabsTrigger value="skills" className="data-[state=active]:bg-jobza-blue data-[state=active]:text-white">
              Skills
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-jobza-blue data-[state=active]:text-white">
              Reviews
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="space-y-4">
            <Card className="p-4 jobza-shadow border-0 bg-white">
              <h3 className="text-jobza-blue-dark mb-3">About</h3>
              <p className="text-gray-600 leading-relaxed">{workerData.background}</p>
            </Card>
            
            <Card className="p-4 jobza-shadow border-0 bg-white">
              <h3 className="text-jobza-blue-dark mb-3">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {workerData.specialties.map((specialty) => (
                  <Badge 
                    key={specialty} 
                    className="bg-jobza-pink text-white border-0"
                  >
                    {specialty}
                  </Badge>
                ))}
              </div>
            </Card>
            
            <Card className="p-4 jobza-shadow border-0 bg-white">
              <h3 className="text-jobza-blue-dark mb-3">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {workerData.languages.map((language) => (
                  <Badge 
                    key={language} 
                    variant="secondary"
                    className="bg-blue-50 text-jobza-blue border-0"
                  >
                    {language}
                  </Badge>
                ))}
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="skills" className="space-y-4">
            <Card className="p-4 jobza-shadow border-0 bg-white">
              <h3 className="text-jobza-blue-dark mb-4">Skill Levels</h3>
              <div className="space-y-4">
                {workerData.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-jobza-blue-dark">{skill.name}</span>
                      <span className="text-sm text-jobza-grey">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="space-y-4">
            {workerData.reviews.map((review) => (
              <Card key={review.id} className="p-4 jobza-shadow border-0 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-jobza-blue-dark">{review.author}</span>
                  </div>
                  <span className="text-xs text-jobza-grey">{review.date}</span>
                </div>
                <p className="text-gray-600 text-sm">{review.comment}</p>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="space-y-3 pb-4">
          <Button 
            className="w-full bg-jobza-blue hover:bg-jobza-blue-dark transition-colors"
            onClick={() => onNavigate('chat')}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Send Message
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full border-jobza-blue text-jobza-blue hover:bg-blue-50"
          >
            <Phone className="w-4 h-4 mr-2" />
            Schedule Interview
          </Button>
        </div>
      </div>
    </div>
  )
}