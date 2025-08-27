'use client'

import { useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Progress } from './ui/progress'
import { 
  DollarSign, 
  Clock, 
  Star, 
  TrendingUp, 
  Calendar,
  MapPin,
  MessageCircle,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Users,
  User,
  Search
} from 'lucide-react'
import type { Screen } from '../App'

interface WorkerHomeProps {
  onNavigate: (screen: Screen) => void
}

export function WorkerHome({ onNavigate }: WorkerHomeProps) {
  const [activeJobs] = useState([
    {
      id: '1',
      title: 'Weekly House Cleaning',
      family: 'The Ahmed Family',
      location: 'New Cairo',
      rate: '50 EGP/hour',
      nextSession: '2024-01-15',
      status: 'confirmed',
      avatar: '/placeholder-avatar.jpg'
    },
    {
      id: '2',
      title: 'Elderly Care Assistant',
      family: 'The Hassan Family',
      location: 'Maadi',
      rate: '60 EGP/hour',
      nextSession: '2024-01-16',
      status: 'pending',
      avatar: '/placeholder-avatar.jpg'
    }
  ])

  const [recentMessages] = useState([
    {
      id: '1',
      family: 'Ahmed Family',
      message: 'Thank you for the excellent service yesterday!',
      time: '2 hours ago',
      unread: true
    },
    {
      id: '2',
      family: 'Hassan Family',
      message: 'Can we reschedule tomorrow\'s session?',
      time: '5 hours ago',
      unread: true
    },
    {
      id: '3',
      family: 'Mohamed Family',
      message: 'Looking forward to working with you next week.',
      time: '1 day ago',
      unread: false
    }
  ])

  const stats = {
    monthlyEarnings: '3,240',
    hoursWorked: '84',
    rating: '4.9',
    completedJobs: '23'
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-jobza-blue-dark">Welcome back, Amara!</h2>
          <p className="text-jobza-grey">You have 2 active jobs and 3 new messages</p>
        </div>
        <Button 
          onClick={() => onNavigate('browse-jobs')}
          className="bg-jobza-pink hover:bg-pink-600"
        >
          Find New Jobs
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-4 jobza-shadow border-0 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-jobza-grey">Monthly Earnings</p>
              <p className="text-2xl text-jobza-blue-dark">{stats.monthlyEarnings} EGP</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-2 text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +12% from last month
          </div>
        </Card>

        <Card className="p-4 jobza-shadow border-0 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-jobza-grey">Hours This Month</p>
              <p className="text-2xl text-jobza-blue-dark">{stats.hoursWorked}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-jobza-blue" />
            </div>
          </div>
          <div className="mt-2">
            <Progress value={68} className="h-2" />
            <p className="text-sm text-jobza-grey mt-1">68% of monthly goal</p>
          </div>
        </Card>

        <Card className="p-4 jobza-shadow border-0 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-jobza-grey">Rating</p>
              <div className="flex items-center">
                <p className="text-2xl text-jobza-blue-dark">{stats.rating}</p>
                <Star className="w-5 h-5 text-yellow-400 ml-1 fill-current" />
              </div>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-sm text-jobza-grey mt-2">Based on {stats.completedJobs} reviews</p>
        </Card>

        <Card className="p-4 jobza-shadow border-0 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-jobza-grey">Completed Jobs</p>
              <p className="text-2xl text-jobza-blue-dark">{stats.completedJobs}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">+3 this week</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Jobs */}
        <div className="lg:col-span-2">
          <Card className="p-6 jobza-shadow border-0 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg text-jobza-blue-dark">Active Jobs</h3>
              <Button variant="ghost" size="sm" className="text-jobza-blue">
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="space-y-4">
              {activeJobs.map((job) => (
                <div key={job.id} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={job.avatar} alt={job.family} />
                        <AvatarFallback className="bg-jobza-blue text-white">
                          {job.family.split(' ')[1]?.[0] || 'F'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="text-jobza-blue-dark">{job.title}</h4>
                        <p className="text-sm text-jobza-grey">{job.family}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-jobza-grey">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {job.location}
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {job.rate}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(job.nextSession).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge 
                        className={
                          job.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800 border-0' 
                            : 'bg-yellow-100 text-yellow-800 border-0'
                        }
                      >
                        {job.status === 'confirmed' ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Confirmed
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Pending
                          </>
                        )}
                      </Badge>
                      <Button variant="ghost" size="sm" className="text-jobza-blue">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Message
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <Button 
                variant="outline" 
                className="w-full border-jobza-blue text-jobza-blue hover:bg-blue-50"
                onClick={() => onNavigate('browse-jobs')}
              >
                <Users className="w-4 h-4 mr-2" />
                Find More Jobs
              </Button>
            </div>
          </Card>
        </div>

        {/* Recent Messages */}
        <div className="lg:col-span-1">
          <Card className="p-6 jobza-shadow border-0 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg text-jobza-blue-dark">Recent Messages</h3>
              <div className="w-6 h-6 bg-jobza-pink rounded-full flex items-center justify-center">
                <span className="text-xs text-white">3</span>
              </div>
            </div>

            <div className="space-y-3">
              {recentMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    message.unread ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm ${
                          message.unread ? 'text-jobza-blue-dark' : 'text-jobza-grey'
                        }`}>
                          {message.family}
                        </p>
                        {message.unread && (
                          <div className="w-2 h-2 bg-jobza-pink rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-jobza-grey mt-1 line-clamp-2">
                        {message.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{message.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <Button 
                variant="ghost" 
                className="w-full text-jobza-blue hover:bg-blue-50"
                onClick={() => onNavigate('messages')}
              >
                View All Messages
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="p-6 jobza-shadow border-0 bg-white">
        <h3 className="text-lg text-jobza-blue-dark mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            className="p-4 h-auto flex flex-col items-center space-y-2 border-jobza-blue text-jobza-blue hover:bg-blue-50"
            onClick={() => onNavigate('worker-profile')}
          >
            <User className="w-6 h-6" />
            <span>Update Profile</span>
          </Button>
          <Button 
            variant="outline" 
            className="p-4 h-auto flex flex-col items-center space-y-2 border-jobza-pink text-jobza-pink hover:bg-pink-50"
            onClick={() => onNavigate('browse-jobs')}
          >
            <Search className="w-6 h-6" />
            <span>Browse Jobs</span>
          </Button>
          <Button 
            variant="outline" 
            className="p-4 h-auto flex flex-col items-center space-y-2 border-green-500 text-green-600 hover:bg-green-50"
          >
            <TrendingUp className="w-6 h-6" />
            <span>View Earnings</span>
          </Button>
        </div>
      </Card>
    </div>
  )
}