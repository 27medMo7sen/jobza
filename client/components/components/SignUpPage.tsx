'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Checkbox } from './ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'
import { Separator } from './ui/separator'
import { Alert, AlertDescription } from './ui/alert'
import { Badge } from './ui/badge'
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock,
  User,
  Phone,
  MapPin,
  Users,
  Briefcase,
  AlertCircle,
  CheckCircle,
  Shield
} from 'lucide-react'
import type { Screen } from '../App'

interface SignUpPageProps {
  onSignUp: () => void
  onNavigate: (screen: Screen) => void
}

type UserType = 'family' | 'worker' | null

export function SignUpPage({ onSignUp, onNavigate }: SignUpPageProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [userType, setUserType] = useState<UserType>(null)
  const [formData, setFormData] = useState({
    // Basic info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    
    // Family specific
    familySize: '',
    location: '',
    
    // Worker specific
    experience: '',
    skills: [] as string[],
    country: '',
    bio: '',
    
    // Terms
    agreeToTerms: false,
    agreeToPrivacy: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const workerSkills = [
    'Housekeeping', 'Childcare', 'Elderly Care', 'Cooking', 
    'Pet Care', 'Garden Care', 'Laundry', 'Organization'
  ]

  const validateStep = (step: number): boolean => {
    setError('')
    
    if (step === 1 && !userType) {
      setError('Please select your account type')
      return false
    }
    
    if (step === 2) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        setError('Please fill in all required fields')
        return false
      }
      
      if (!formData.email.includes('@')) {
        setError('Please enter a valid email address')
        return false
      }
      
      if (formData.phone.length < 10) {
        setError('Please enter a valid phone number')
        return false
      }
    }
    
    if (step === 3) {
      if (!formData.password || !formData.confirmPassword) {
        setError('Please fill in both password fields')
        return false
      }
      
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long')
        return false
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return false
      }
      
      if (userType === 'family') {
        if (!formData.familySize || !formData.location) {
          setError('Please fill in all family information')
          return false
        }
      }
      
      if (userType === 'worker') {
        if (!formData.experience || !formData.country || formData.skills.length === 0) {
          setError('Please complete all worker information')
          return false
        }
      }
    }
    
    if (step === 4) {
      if (!formData.agreeToTerms || !formData.agreeToPrivacy) {
        setError('Please agree to the terms and privacy policy')
        return false
      }
    }
    
    return true
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => prev - 1)
    setError('')
  }

  const handleSubmit = async () => {
    if (!validateStep(4)) return
    
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      onSignUp()
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const handleSocialSignUp = (provider: string) => {
    setIsLoading(true)
    setTimeout(() => {
      onSignUp()
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-white jobza-shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => currentStep === 1 ? onNavigate('landing') : handleBack()}
                className="p-2 mr-2"
              >
                <ArrowLeft className="w-5 h-5 text-jobza-blue" />
              </Button>
              <h1 className="text-2xl text-jobza-blue-dark">Jobza</h1>
            </div>
            
            <div className="text-sm text-jobza-grey">
              Already have an account?{' '}
              <button 
                onClick={() => onNavigate('signin')}
                className="text-jobza-blue hover:text-jobza-blue-dark transition-colors"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-md mx-auto p-4">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${
                  step <= currentStep 
                    ? 'bg-jobza-blue text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-12 h-0.5 mx-2 transition-colors ${
                    step < currentStep ? 'bg-jobza-blue' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] p-4">
        <div className="w-full max-w-md">
          <Card className="p-8 jobza-shadow border-0 bg-white">
            {/* Step 1: User Type Selection */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-jobza-blue-dark">Join Jobza</h2>
                  <p className="text-jobza-grey">
                    Choose how you'd like to use Jobza
                  </p>
                </div>

                <div className="space-y-4">
                  <Button
                    type="button"
                    variant={userType === 'family' ? "default" : "outline"}
                    onClick={() => setUserType('family')}
                    className={`w-full h-auto p-4 flex flex-col items-center space-y-2 ${
                      userType === 'family' 
                        ? 'bg-jobza-blue hover:bg-jobza-blue-dark border-jobza-blue' 
                        : 'border-gray-200 hover:border-jobza-blue'
                    }`}
                  >
                    <Users className={`w-8 h-8 ${userType === 'family' ? 'text-white' : 'text-jobza-blue'}`} />
                    <div className="text-center">
                      <div className={userType === 'family' ? 'text-white' : 'text-jobza-blue-dark'}>
                        I'm a Family
                      </div>
                      <div className={`text-sm ${userType === 'family' ? 'text-blue-100' : 'text-jobza-grey'}`}>
                        Looking for domestic help
                      </div>
                    </div>
                  </Button>

                  <Button
                    type="button"
                    variant={userType === 'worker' ? "default" : "outline"}
                    onClick={() => setUserType('worker')}
                    className={`w-full h-auto p-4 flex flex-col items-center space-y-2 ${
                      userType === 'worker' 
                        ? 'bg-jobza-pink hover:bg-pink-600 border-jobza-pink' 
                        : 'border-gray-200 hover:border-jobza-pink'
                    }`}
                  >
                    <Briefcase className={`w-8 h-8 ${userType === 'worker' ? 'text-white' : 'text-jobza-pink'}`} />
                    <div className="text-center">
                      <div className={userType === 'worker' ? 'text-white' : 'text-jobza-blue-dark'}>
                        I'm a Worker
                      </div>
                      <div className={`text-sm ${userType === 'worker' ? 'text-pink-100' : 'text-jobza-grey'}`}>
                        Offering domestic services
                      </div>
                    </div>
                  </Button>
                </div>

                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  onClick={handleNext}
                  disabled={!userType}
                  className="w-full bg-jobza-blue hover:bg-jobza-blue-dark"
                >
                  Continue
                </Button>
              </div>
            )}

            {/* Step 2: Basic Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-jobza-blue-dark">Basic Information</h2>
                  <p className="text-jobza-grey">
                    Tell us about yourself
                  </p>
                </div>

                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-jobza-blue-dark">
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        className="border-gray-200 focus:border-jobza-blue"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-jobza-blue-dark">
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        className="border-gray-200 focus:border-jobza-blue"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-jobza-blue-dark">
                      Email Address *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-jobza-grey" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john.doe@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10 border-gray-200 focus:border-jobza-blue"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-jobza-blue-dark">
                      Phone Number *
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-jobza-grey" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+20 100 123 4567"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="pl-10 border-gray-200 focus:border-jobza-blue"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1 border-gray-200"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleNext}
                    className="flex-1 bg-jobza-blue hover:bg-jobza-blue-dark"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Additional Details & Password */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-jobza-blue-dark">
                    {userType === 'family' ? 'Family Details' : 'Professional Details'}
                  </h2>
                  <p className="text-jobza-grey">
                    {userType === 'family' 
                      ? 'Help us understand your household needs'
                      : 'Tell us about your experience and skills'
                    }
                  </p>
                </div>

                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  {/* Password fields */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-jobza-blue-dark">
                      Password *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-jobza-grey" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        className="pl-10 pr-10 border-gray-200 focus:border-jobza-blue"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-1 top-1 h-8 w-8 p-0"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-jobza-grey" />
                        ) : (
                          <Eye className="h-4 w-4 text-jobza-grey" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-jobza-blue-dark">
                      Confirm Password *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-jobza-grey" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="pl-10 pr-10 border-gray-200 focus:border-jobza-blue"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-1 top-1 h-8 w-8 p-0"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-jobza-grey" />
                        ) : (
                          <Eye className="h-4 w-4 text-jobza-grey" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Family-specific fields */}
                  {userType === 'family' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="familySize" className="text-jobza-blue-dark">
                          Family Size *
                        </Label>
                        <Select 
                          value={formData.familySize} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, familySize: value }))}
                        >
                          <SelectTrigger className="border-gray-200 focus:border-jobza-blue">
                            <SelectValue placeholder="Select family size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-2">1-2 people</SelectItem>
                            <SelectItem value="3-4">3-4 people</SelectItem>
                            <SelectItem value="5-6">5-6 people</SelectItem>
                            <SelectItem value="7+">7+ people</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-jobza-blue-dark">
                          Location *
                        </Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-jobza-grey" />
                          <Input
                            id="location"
                            placeholder="e.g., New Cairo, Maadi"
                            value={formData.location}
                            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                            className="pl-10 border-gray-200 focus:border-jobza-blue"
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Worker-specific fields */}
                  {userType === 'worker' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="country" className="text-jobza-blue-dark">
                          Country of Origin *
                        </Label>
                        <Select 
                          value={formData.country} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
                        >
                          <SelectTrigger className="border-gray-200 focus:border-jobza-blue">
                            <SelectValue placeholder="Select your country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ethiopia">Ethiopia</SelectItem>
                            <SelectItem value="kenya">Kenya</SelectItem>
                            <SelectItem value="uganda">Uganda</SelectItem>
                            <SelectItem value="sudan">Sudan</SelectItem>
                            <SelectItem value="ghana">Ghana</SelectItem>
                            <SelectItem value="nigeria">Nigeria</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="experience" className="text-jobza-blue-dark">
                          Years of Experience *
                        </Label>
                        <Select 
                          value={formData.experience} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}
                        >
                          <SelectTrigger className="border-gray-200 focus:border-jobza-blue">
                            <SelectValue placeholder="Select experience level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-2">1-2 years</SelectItem>
                            <SelectItem value="3-5">3-5 years</SelectItem>
                            <SelectItem value="6-10">6-10 years</SelectItem>
                            <SelectItem value="10+">10+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-jobza-blue-dark">
                          Skills & Services *
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                          {workerSkills.map((skill) => (
                            <div key={skill} className="flex items-center space-x-2">
                              <Checkbox
                                id={skill}
                                checked={formData.skills.includes(skill)}
                                onCheckedChange={() => handleSkillToggle(skill)}
                                className="border-jobza-blue data-[state=checked]:bg-jobza-pink"
                              />
                              <Label 
                                htmlFor={skill} 
                                className="text-sm text-gray-700 cursor-pointer"
                              >
                                {skill}
                              </Label>
                            </div>
                          ))}
                        </div>
                        {formData.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {formData.skills.map((skill) => (
                              <Badge 
                                key={skill} 
                                className="bg-jobza-pink text-white border-0"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio" className="text-jobza-blue-dark">
                          About You (Optional)
                        </Label>
                        <Textarea
                          id="bio"
                          placeholder="Tell families about your experience and what makes you special..."
                          value={formData.bio}
                          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                          className="border-gray-200 focus:border-jobza-blue min-h-[80px]"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex space-x-3">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1 border-gray-200"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleNext}
                    className="flex-1 bg-jobza-blue hover:bg-jobza-blue-dark"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Terms & Final Submission */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-jobza-blue-dark">Almost Done!</h2>
                  <p className="text-jobza-grey">
                    Review and accept our terms to complete your registration
                  </p>
                </div>

                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Account Summary */}
                <Card className="p-4 bg-blue-50 border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-jobza-blue rounded-full flex items-center justify-center">
                      {userType === 'family' ? (
                        <Users className="w-5 h-5 text-white" />
                      ) : (
                        <Briefcase className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-jobza-blue-dark">
                        {formData.firstName} {formData.lastName}
                      </p>
                      <p className="text-sm text-jobza-grey">
                        {userType === 'family' ? 'Family Account' : 'Worker Account'} • {formData.email}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, agreeToTerms: !!checked }))
                      }
                      className="border-jobza-blue data-[state=checked]:bg-jobza-blue mt-1"
                    />
                    <Label htmlFor="terms" className="text-sm text-jobza-grey cursor-pointer">
                      I agree to Jobza's{' '}
                      <a href="#" className="text-jobza-blue hover:underline">
                        Terms of Service
                      </a>{' '}
                      and understand the platform guidelines
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="privacy"
                      checked={formData.agreeToPrivacy}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, agreeToPrivacy: !!checked }))
                      }
                      className="border-jobza-blue data-[state=checked]:bg-jobza-blue mt-1"
                    />
                    <Label htmlFor="privacy" className="text-sm text-jobza-grey cursor-pointer">
                      I agree to Jobza's{' '}
                      <a href="#" className="text-jobza-blue hover:underline">
                        Privacy Policy
                      </a>{' '}
                      and consent to data processing
                    </Label>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-green-800">
                      <strong>Your data is secure.</strong>
                    </p>
                    <p className="text-green-700">
                      We use industry-standard encryption and never share your personal information without consent.
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1 border-gray-200"
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={isLoading || !formData.agreeToTerms || !formData.agreeToPrivacy}
                    className="flex-1 bg-jobza-blue hover:bg-jobza-blue-dark"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </div>

                {/* Social Signup Alternative */}
                {currentStep === 4 && (
                  <>
                    <div className="relative">
                      <Separator />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-white px-2 text-sm text-jobza-grey">Or sign up with</span>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSocialSignUp('google')}
                        disabled={isLoading}
                        className="flex-1 border-gray-200 hover:bg-gray-50"
                      >
                        <div className="w-5 h-5 mr-2 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">G</span>
                        </div>
                        Google
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSocialSignUp('facebook')}
                        disabled={isLoading}
                        className="flex-1 border-gray-200 hover:bg-gray-50"
                      >
                        <div className="w-5 h-5 mr-2 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">f</span>
                        </div>
                        Facebook
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}