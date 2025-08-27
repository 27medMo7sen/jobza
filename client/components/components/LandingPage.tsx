'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { 
  Shield, 
  Users, 
  MessageCircle, 
  Star, 
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  Heart,
  Award,
  Search,
  UserCheck,
  Zap,
  Menu,
  X
} from 'lucide-react'
import { ImageWithFallback } from './figma/ImageWithFallback'
import type { Screen } from '../App'

interface LandingPageProps {
  onGetStarted: () => void
  onNavigate: (screen: Screen) => void
}

const features = [
  {
    icon: <Shield className="w-8 h-8 text-jobza-blue" />,
    title: "Verified Workers",
    description: "Every worker is thoroughly background-checked, reference-verified and fully insured for your peace of mind."
  },
  {
    icon: <MessageCircle className="w-8 h-8 text-jobza-pink" />,
    title: "Direct Communication",
    description: "Chat directly with workers, schedule interviews, and coordinate work through our secure platform."
  },
  {
    icon: <Star className="w-8 h-8 text-jobza-blue" />,
    title: "Quality Guaranteed",
    description: "Rate and review every service. Our commitment to quality ensures you get the best domestic help."
  },
  {
    icon: <Users className="w-8 h-8 text-jobza-pink" />,
    title: "Trusted Community",
    description: "Join thousands of Egyptian families who trust Jobza for their domestic worker needs."
  }
]

const stats = [
  { number: "10,000+", label: "Verified Workers" },
  { number: "5,000+", label: "Happy Families" },
  { number: "4.9/5", label: "Average Rating" },
  { number: "24/7", label: "Support Available" }
]

const testimonials = [
  {
    name: "Sarah Ahmed",
    location: "New Cairo",
    rating: 5,
    comment: "Jobza helped me find the perfect housekeeper for my family. The verification process gave me complete confidence, and Amara has been wonderful with our children.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "Mohamed Hassan",
    location: "Maadi",
    rating: 5,
    comment: "As a busy executive, I needed reliable help at home. Jobza's platform made it easy to find Grace, who has been taking excellent care of my elderly mother.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "Layla Mansour",
    location: "Heliopolis",
    rating: 5,
    comment: "The transparency and communication tools on Jobza are excellent. I could interview several workers and find the perfect match for our family's needs.",
    avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face"
  }
]

const howItWorks = [
  {
    step: 1,
    title: "Post Your Needs",
    description: "Describe what kind of help you need - housekeeping, childcare, cooking, or elderly care.",
    icon: <Search className="w-6 h-6" />
  },
  {
    step: 2,
    title: "Browse Workers",
    description: "View verified profiles, read reviews, and check availability of workers in your area.",
    icon: <UserCheck className="w-6 h-6" />
  },
  {
    step: 3,
    title: "Connect & Hire",
    description: "Chat directly, schedule interviews, and hire the perfect worker for your family.",
    icon: <Zap className="w-6 h-6" />
  }
]

export function LandingPage({ onGetStarted, onNavigate }: LandingPageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [email, setEmail] = useState('')

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white jobza-shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl text-jobza-blue-dark">Jobza</h1>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <button 
                  onClick={() => scrollToSection('features')}
                  className="text-jobza-grey hover:text-jobza-blue px-3 py-2 text-sm transition-colors"
                >
                  Features
                </button>
                <button 
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-jobza-grey hover:text-jobza-blue px-3 py-2 text-sm transition-colors"
                >
                  How it Works
                </button>
                <button 
                  onClick={() => scrollToSection('testimonials')}
                  className="text-jobza-grey hover:text-jobza-blue px-3 py-2 text-sm transition-colors"
                >
                  Reviews
                </button>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="text-jobza-grey hover:text-jobza-blue px-3 py-2 text-sm transition-colors"
                >
                  Contact
                </button>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => onNavigate('signin')}
                className="border-jobza-blue text-jobza-blue hover:bg-blue-50"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => onNavigate('signup')}
                className="bg-jobza-blue hover:bg-jobza-blue-dark"
              >
                Get Started
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button 
                onClick={() => scrollToSection('features')}
                className="block px-3 py-2 text-jobza-grey hover:text-jobza-blue w-full text-left"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="block px-3 py-2 text-jobza-grey hover:text-jobza-blue w-full text-left"
              >
                How it Works
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')}
                className="block px-3 py-2 text-jobza-grey hover:text-jobza-blue w-full text-left"
              >
                Reviews
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="block px-3 py-2 text-jobza-grey hover:text-jobza-blue w-full text-left"
              >
                Contact
              </button>
              <div className="px-3 py-2 space-y-2">
                <Button 
                  variant="outline" 
                  onClick={() => onNavigate('signin')}
                  className="w-full border-jobza-blue text-jobza-blue hover:bg-blue-50"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => onNavigate('signup')}
                  className="w-full bg-jobza-blue hover:bg-jobza-blue-dark"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-jobza-pink text-white">
                  Trusted by 5,000+ Egyptian Families
                </Badge>
                <h1 className="text-4xl lg:text-5xl text-jobza-blue-dark leading-tight">
                  Find Trusted Domestic Workers for Your Family
                </h1>
                <p className="text-xl text-jobza-grey leading-relaxed">
                  Connect with verified, experienced domestic workers from across Africa. 
                  Transparent, secure, and designed for Egyptian families who value quality care.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={() => onNavigate('signup')}
                  className="bg-jobza-blue hover:bg-jobza-blue-dark text-lg px-8 py-3"
                >
                  Find Workers Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate('signup')}
                  className="border-jobza-pink text-jobza-pink hover:bg-pink-50 text-lg px-8 py-3"
                >
                  Join as Worker
                </Button>
              </div>

              <div className="flex items-center space-x-6 pt-4">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-jobza-blue-dark">4.9/5 Rating</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-jobza-blue-dark">100% Verified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-jobza-blue" />
                  <span className="text-jobza-blue-dark">Fully Insured</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1613501767902-96cf840115bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwd29tYW4lMjBjbGVhbmluZyUyMGhvdXNlJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc1NjIxNTI5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Professional domestic worker"
                  className="rounded-2xl jobza-shadow w-full h-[500px] object-cover object-center"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl jobza-shadow">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-jobza-blue-dark">Background Verified</p>
                    <p className="text-sm text-jobza-grey">100% Secure</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-jobza-blue-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl text-white mb-2">{stat.number}</div>
                <div className="text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl text-jobza-blue-dark mb-4">
              Why Families Choose Jobza
            </h2>
            <p className="text-xl text-jobza-grey max-w-3xl mx-auto">
              We've built the most trusted platform for connecting Egyptian families 
              with qualified domestic workers from across Africa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 text-center jobza-shadow border-0 bg-white hover:scale-105 transition-transform">
                <div className="mb-4 mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-jobza-blue-dark mb-3">{feature.title}</h3>
                <p className="text-jobza-grey text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl text-jobza-blue-dark mb-4">
              How Jobza Works
            </h2>
            <p className="text-xl text-jobza-grey max-w-3xl mx-auto">
              Finding the perfect domestic worker for your family is simple and secure with our 3-step process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="mb-6 mx-auto w-20 h-20 bg-gradient-to-r from-jobza-blue to-jobza-pink rounded-full flex items-center justify-center text-white">
                  <span className="text-2xl">{step.step}</span>
                </div>
                <div className="mb-4 mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-jobza-blue">
                  {step.icon}
                </div>
                <h3 className="text-jobza-blue-dark mb-3">{step.title}</h3>
                <p className="text-jobza-grey leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg"
              onClick={() => onNavigate('signup')}
              className="bg-jobza-blue hover:bg-jobza-blue-dark text-lg px-8 py-3"
            >
              Start Your Search
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-r from-blue-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl text-jobza-blue-dark mb-4">
              What Families Say About Jobza
            </h2>
            <p className="text-xl text-jobza-grey max-w-3xl mx-auto">
              Join thousands of satisfied families who have found their perfect domestic help through Jobza.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 jobza-shadow border-0 bg-white">
                <div className="flex items-center mb-4">
                  <ImageWithFallback 
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="text-jobza-blue-dark">{testimonial.name}</h4>
                    <p className="text-sm text-jobza-grey">{testimonial.location}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star}
                      className={`w-4 h-4 ${
                        star <= testimonial.rating 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                
                <p className="text-jobza-grey leading-relaxed">
                  "{testimonial.comment}"
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl text-jobza-blue-dark leading-tight">
                Take Jobza With You Anywhere
              </h2>
              <p className="text-xl text-jobza-grey leading-relaxed">
                Our mobile app makes it easy to manage your domestic help on the go. 
                Chat with workers, track services, and handle payments from your phone.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-jobza-blue-dark">Real-time chat and notifications</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-jobza-blue-dark">Schedule and track services</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-jobza-blue-dark">Secure in-app payments</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-jobza-blue-dark">Rate and review workers</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg"
                  className="bg-black text-white hover:bg-gray-800"
                >
                  Download for iOS
                </Button>
                <Button 
                  size="lg"
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  Download for Android
                </Button>
              </div>
            </div>

            <div className="relative">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1614020661483-d2bb855eee1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBwaG9uZSUyMHNjcmVlbnxlbnwxfHx8fDE3NTYyMTUzMDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Jobza mobile app"
                className="rounded-2xl jobza-shadow w-full max-w-md mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-jobza-blue-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl text-white mb-4">
            Stay Updated with Jobza
          </h2>
          <p className="text-blue-200 mb-8 text-lg">
            Get the latest updates on new workers, features, and special offers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white border-0 focus:ring-2 focus:ring-white"
            />
            <Button className="bg-jobza-pink hover:bg-pink-600 px-8">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl text-jobza-pink">Jobza</h3>
              <p className="text-gray-400 leading-relaxed">
                Connecting Egyptian families with trusted domestic workers from across Africa.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-jobza-blue rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
                  <span className="text-white">f</span>
                </div>
                <div className="w-10 h-10 bg-jobza-pink rounded-full flex items-center justify-center cursor-pointer hover:bg-pink-600 transition-colors">
                  <span className="text-white">ig</span>
                </div>
                <div className="w-10 h-10 bg-jobza-blue rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
                  <span className="text-white">tw</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white mb-4">For Families</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Find Workers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Post Jobs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Safety Guidelines</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white mb-4">For Workers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Join Jobza</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Worker Resources</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white mb-4">Contact Us</h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5" />
                  <span>+20 100 123 4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5" />
                  <span>hello@jobza.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5" />
                  <span>Cairo, Egypt</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Jobza. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  )
}