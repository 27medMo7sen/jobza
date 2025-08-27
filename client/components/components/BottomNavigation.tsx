'use client'

import { Home, Search, MessageCircle, Plus } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface BottomNavigationProps {
  currentScreen: string
  onNavigate: (screen: string) => void
}

export function BottomNavigation({ onNavigate }: BottomNavigationProps) {
  const pathname = usePathname()

  const getScreenFromPath = (path: string) => {
    if (path === '/home' || path === '/') return 'home'
    if (path === '/search') return 'search'
    if (path === '/messages' || path === '/chat') return 'messages'
    if (path === '/job-form') return 'job-form'
    return 'home'
  }

  const currentScreen = getScreenFromPath(pathname)

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'job-form', label: 'Post Job', icon: Plus },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-pb">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentScreen === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive 
                  ? 'text-jobza-blue bg-blue-50' 
                  : 'text-gray-500 hover:text-jobza-blue hover:bg-blue-50'
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 ${item.id === 'job-form' ? 'w-7 h-7' : ''}`} />
              <span className="text-xs">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}