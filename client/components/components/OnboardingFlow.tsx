'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { ChevronRight, Shield, Users, MessageCircle, Star } from 'lucide-react'

interface OnboardingFlowProps {
  onComplete: (userType: 'family' | 'worker') => void
}

const onboardingSteps = [
  {
    id: 1,
    title: "Welcome to Jobza",
    subtitle: "Connecting families with trusted domestic workers",
    content: "Find reliable, verified domestic workers for your home. Our platform ensures quality, transparency, and peace of mind.",
    icon: <Users className="w-16 h-16 text-jobza-blue" />,
    features: ["Verified workers", "Transparent pricing", "Secure payments"]
  },
  {
    id: 2,
    title: "Trust & Safety First",
    subtitle: "Every worker is thoroughly verified",
    content: "We conduct background checks, verify references, and ensure all workers meet our high standards for your family's safety.",
    icon: <Shield className="w-16 h-16 text-jobza-pink" />,
    features: ["Background checks", "Reference verification", "Insurance coverage"]
  },
  {
    id: 3,
    title: "Direct Communication",
    subtitle: "Chat directly with workers",
    content: "Discuss requirements, schedule interviews, and coordinate work directly through our secure messaging platform.",
    icon: <MessageCircle className="w-16 h-16 text-jobza-blue" />,
    features: ["In-app messaging", "Video calls", "Real-time updates"]
  },
  {
    id: 4,
    title: "Quality Guaranteed",
    subtitle: "Rate and review every service",
    content: "Help build our community by rating workers and sharing your experience. Quality service is our commitment.",
    icon: <Star className="w-16 h-16 text-jobza-pink" />,
    features: ["Rating system", "Detailed reviews", "Quality assurance"]
  }
]

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // For demo purposes, defaulting to worker dashboard
      // In a real app, this would come from the signup process
      onComplete('worker') // Change to 'family' to test family dashboard
    }
  }

  const skip = () => {
    // For demo purposes, defaulting to worker dashboard
    onComplete('worker')
  }

  const step = onboardingSteps[currentStep]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <div className="flex space-x-2">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index <= currentStep ? 'bg-jobza-blue' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        <Button variant="ghost" onClick={skip} className="text-jobza-grey">
          Skip
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6">
        <Card className="p-8 jobza-shadow border-0 bg-white">
          <div className="text-center space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              {step.icon}
            </div>

            {/* Title and Subtitle */}
            <div className="space-y-2">
              <h1 className="text-jobza-blue-dark">{step.title}</h1>
              <p className="text-jobza-grey">{step.subtitle}</p>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">
              {step.content}
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center gap-2">
              {step.features.map((feature) => (
                <Badge 
                  key={feature} 
                  variant="secondary" 
                  className="bg-blue-50 text-jobza-blue border-0"
                >
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Navigation */}
      <div className="p-6">
        <Button 
          onClick={nextStep}
          className="w-full bg-jobza-blue hover:bg-jobza-blue-dark transition-colors"
        >
          {currentStep < onboardingSteps.length - 1 ? (
            <>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </>
          ) : (
            'Get Started'
          )}
        </Button>
      </div>
    </div>
  )
}