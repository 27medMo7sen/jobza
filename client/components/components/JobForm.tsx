'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Checkbox } from './ui/checkbox'
import { Badge } from './ui/badge'
import { Calendar } from './ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { ArrowLeft, CalendarIcon, MapPin, Clock, DollarSign } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from './ui/utils'
import type { Screen } from '../App'

interface JobFormProps {
  onNavigate: (screen: Screen) => void
}

const jobTypes = [
  'Housekeeping',
  'Childcare',
  'Elderly Care',
  'Cooking',
  'Pet Care',
  'Garden Care',
  'Laundry',
  'Organization'
]

const scheduleOptions = [
  'Full-time (40+ hours/week)',
  'Part-time (20-40 hours/week)',
  'Occasional (< 20 hours/week)',
  'One-time only',
  'Emergency/Urgent'
]

export function JobForm({ onNavigate }: JobFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    jobType: [] as string[],
    schedule: '',
    hourlyRate: '',
    startDate: undefined as Date | undefined,
    requirements: '',
    urgency: 'normal'
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleJobTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      jobType: prev.jobType.includes(type)
        ? prev.jobType.filter(t => t !== type)
        : [...prev.jobType, type]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    onNavigate('home')
  }

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
          <h2 className="text-jobza-blue-dark">Post a Job</h2>
          <div className="w-8" />
        </div>
      </div>

      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title */}
          <Card className="p-4 jobza-shadow border-0 bg-white">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-jobza-blue-dark">Job Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Weekly house cleaning"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-1 border-gray-200 focus:border-jobza-blue"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-jobza-blue-dark">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what you need help with..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1 border-gray-200 focus:border-jobza-blue min-h-[100px]"
                  required
                />
              </div>
            </div>
          </Card>

          {/* Job Type */}
          <Card className="p-4 jobza-shadow border-0 bg-white">
            <Label className="text-jobza-blue-dark">Services Needed</Label>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {jobTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={formData.jobType.includes(type)}
                    onCheckedChange={() => handleJobTypeToggle(type)}
                    className="border-jobza-blue data-[state=checked]:bg-jobza-blue"
                  />
                  <Label 
                    htmlFor={type} 
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {type}
                  </Label>
                </div>
              ))}
            </div>
            
            {formData.jobType.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {formData.jobType.map((type) => (
                  <Badge 
                    key={type} 
                    className="bg-jobza-pink text-white border-0"
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            )}
          </Card>

          {/* Location & Schedule */}
          <Card className="p-4 jobza-shadow border-0 bg-white">
            <div className="space-y-4">
              <div>
                <Label htmlFor="location" className="text-jobza-blue-dark flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="e.g., New Cairo, Maadi"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="mt-1 border-gray-200 focus:border-jobza-blue"
                  required
                />
              </div>

              <div>
                <Label className="text-jobza-blue-dark flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Schedule
                </Label>
                <Select value={formData.schedule} onValueChange={(value) => setFormData(prev => ({ ...prev, schedule: value }))}>
                  <SelectTrigger className="mt-1 border-gray-200 focus:border-jobza-blue">
                    <SelectValue placeholder="Select schedule type" />
                  </SelectTrigger>
                  <SelectContent>
                    {scheduleOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Budget & Date */}
          <Card className="p-4 jobza-shadow border-0 bg-white">
            <div className="space-y-4">
              <div>
                <Label htmlFor="hourlyRate" className="text-jobza-blue-dark flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Hourly Rate (EGP)
                </Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  placeholder="e.g., 45"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                  className="mt-1 border-gray-200 focus:border-jobza-blue"
                  required
                />
              </div>

              <div>
                <Label className="text-jobza-blue-dark flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Start Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full mt-1 justify-start text-left border-gray-200 hover:border-jobza-blue",
                        !formData.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </Card>

          {/* Requirements */}
          <Card className="p-4 jobza-shadow border-0 bg-white">
            <div>
              <Label htmlFor="requirements" className="text-jobza-blue-dark">
                Special Requirements (Optional)
              </Label>
              <Textarea
                id="requirements"
                placeholder="Any specific requirements or preferences..."
                value={formData.requirements}
                onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                className="mt-1 border-gray-200 focus:border-jobza-blue"
              />
            </div>
          </Card>

          {/* Urgency */}
          <Card className="p-4 jobza-shadow border-0 bg-white">
            <Label className="text-jobza-blue-dark">Urgency</Label>
            <div className="flex gap-2 mt-3">
              {['normal', 'urgent', 'emergency'].map((level) => (
                <Button
                  key={level}
                  type="button"
                  variant={formData.urgency === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, urgency: level }))}
                  className={
                    formData.urgency === level
                      ? level === 'emergency' 
                        ? 'bg-red-500 hover:bg-red-600'
                        : level === 'urgent'
                        ? 'bg-orange-500 hover:bg-orange-600'
                        : 'bg-jobza-blue hover:bg-jobza-blue-dark'
                      : 'border-gray-200 hover:border-jobza-blue'
                  }
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Button>
              ))}
            </div>
          </Card>

          {/* Submit Button */}
          <div className="pb-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-jobza-blue hover:bg-jobza-blue-dark transition-colors"
            >
              {isSubmitting ? 'Posting Job...' : 'Post Job'}
            </Button>
            
            <p className="text-xs text-jobza-grey text-center mt-2">
              Your job will be visible to verified workers in your area
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}