'use client'

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from './ui/sidebar'
import { WorkerHome } from './WorkerHome'
import { WorkerProfileDashboard } from './WorkerProfileDashboard'
import { BrowseJobs } from './BrowseJobs'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { 
  Home, 
  User, 
  Search, 
  Settings, 
  LogOut,
  Bell,
  Menu
} from 'lucide-react'
import type { Screen } from '../App'

interface WorkerDashboardProps {
  currentScreen: Screen
  onNavigate: (screen: Screen) => void
}

const sidebarItems = [
  {
    title: 'Home',
    icon: Home,
    screen: 'worker-home' as Screen,
    description: 'Dashboard overview'
  },
  {
    title: 'My Profile',
    icon: User,
    screen: 'worker-profile' as Screen,
    description: 'Manage your profile'
  },
  {
    title: 'Browse Jobs',
    icon: Search,
    screen: 'browse-jobs' as Screen,
    description: 'Find new opportunities'
  }
]

export function WorkerDashboard({ currentScreen, onNavigate }: WorkerDashboardProps) {
  const activeScreen = currentScreen === 'worker-dashboard' ? 'worker-home' : currentScreen

  const renderContent = () => {
    switch (activeScreen) {
      case 'worker-home':
        return <WorkerHome onNavigate={onNavigate} />
      case 'worker-profile':
        return <WorkerProfileDashboard onNavigate={onNavigate} />
      case 'browse-jobs':
        return <BrowseJobs onNavigate={onNavigate} />
      default:
        return <WorkerHome onNavigate={onNavigate} />
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <Sidebar className="border-r border-gray-200 bg-white">
          <SidebarHeader className="border-b border-gray-100 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-jobza-blue rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-medium">J</span>
              </div>
              <div>
                <h2 className="text-jobza-blue-dark">Jobza</h2>
                <p className="text-xs text-jobza-grey">Worker Dashboard</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-2">
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.screen}>
                  <SidebarMenuButton
                    onClick={() => onNavigate(item.screen)}
                    isActive={activeScreen === item.screen}
                    className={`w-full justify-start p-3 rounded-lg transition-all ${
                      activeScreen === item.screen
                        ? 'bg-jobza-blue text-white hover:bg-jobza-blue-dark'
                        : 'text-jobza-grey hover:bg-gray-50 hover:text-jobza-blue-dark'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="text-sm">{item.title}</div>
                      <div className={`text-xs ${
                        activeScreen === item.screen ? 'text-blue-100' : 'text-gray-400'
                      }`}>
                        {item.description}
                      </div>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-100 p-4">
            <div className="space-y-3">
              {/* Worker Profile Summary */}
              <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Worker" />
                  <AvatarFallback className="bg-jobza-pink text-white">AM</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-jobza-blue-dark truncate">
                    Amara Tekle
                  </div>
                  <div className="text-xs text-jobza-grey">
                    Housekeeping Specialist
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-jobza-grey hover:text-jobza-blue-dark hover:bg-gray-50"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate('landing')}
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <SidebarInset className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="border-b border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="lg:hidden">
                  <Menu className="w-5 h-5 text-jobza-grey" />
                </SidebarTrigger>
                <div>
                  <h1 className="text-jobza-blue-dark">
                    {sidebarItems.find(item => item.screen === activeScreen)?.title || 'Dashboard'}
                  </h1>
                  <p className="text-sm text-jobza-grey">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-5 h-5 text-jobza-grey" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-jobza-pink rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">3</span>
                  </span>
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto">
            {renderContent()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}