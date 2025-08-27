'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Checkbox } from './ui/checkbox'
import { Separator } from './ui/separator'
import { Alert, AlertDescription } from './ui/alert'
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import type { Screen } from '../App'

interface SignInPageProps {
  onSignIn: () => void
  onNavigate: (screen: Screen) => void
}

export function SignInPage({ onSignIn, onNavigate }: SignInPageProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return
    }

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      onSignIn()
    } catch (err) {
      setError('Invalid email or password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true)
    // Simulate social login
    setTimeout(() => {
      onSignIn()
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
                onClick={() => onNavigate('landing')}
                className="p-2 mr-2"
              >
                <ArrowLeft className="w-5 h-5 text-jobza-blue" />
              </Button>
              <h1 className="text-2xl text-jobza-blue-dark">Jobza</h1>
            </div>
            
            <div className="text-sm text-jobza-grey">
              Don't have an account?{' '}
              <button 
                onClick={() => onNavigate('signup')}
                className="text-jobza-blue hover:text-jobza-blue-dark transition-colors"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className="w-full max-w-md">
          <Card className="p-8 jobza-shadow border-0 bg-white">
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <h2 className="text-jobza-blue-dark">Welcome Back</h2>
                <p className="text-jobza-grey">
                  Sign in to your Jobza account to continue
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-jobza-blue-dark">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-jobza-grey" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10 border-gray-200 focus:border-jobza-blue"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-jobza-blue-dark">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-jobza-grey" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-10 pr-10 border-gray-200 focus:border-jobza-blue"
                      disabled={isLoading}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-1 top-1 h-8 w-8 p-0"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-jobza-grey" />
                      ) : (
                        <Eye className="h-4 w-4 text-jobza-grey" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, rememberMe: !!checked }))
                      }
                      className="border-jobza-blue data-[state=checked]:bg-jobza-blue"
                      disabled={isLoading}
                    />
                    <Label 
                      htmlFor="remember" 
                      className="text-sm text-jobza-grey cursor-pointer"
                    >
                      Remember me
                    </Label>
                  </div>
                  
                  <button 
                    type="button"
                    className="text-sm text-jobza-blue hover:text-jobza-blue-dark transition-colors"
                    disabled={isLoading}
                  >
                    Forgot password?
                  </button>
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-jobza-blue hover:bg-jobza-blue-dark transition-colors"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <Separator />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white px-2 text-sm text-jobza-grey">Or continue with</span>
                </div>
              </div>

              {/* Social Login */}
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialLogin('google')}
                  disabled={isLoading}
                  className="w-full border-gray-200 hover:bg-gray-50"
                >
                  <div className="w-5 h-5 mr-2 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">G</span>
                  </div>
                  Continue with Google
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialLogin('facebook')}
                  disabled={isLoading}
                  className="w-full border-gray-200 hover:bg-gray-50"
                >
                  <div className="w-5 h-5 mr-2 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">f</span>
                  </div>
                  Continue with Facebook
                </Button>
              </div>

              {/* Footer */}
              <div className="text-center pt-4">
                <p className="text-xs text-jobza-grey">
                  By signing in, you agree to our{' '}
                  <a href="#" className="text-jobza-blue hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-jobza-blue hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </Card>

          {/* Success Message for Demo */}
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <p className="text-sm text-green-800">
                <strong>Demo Mode:</strong> Use any email and password to sign in
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}