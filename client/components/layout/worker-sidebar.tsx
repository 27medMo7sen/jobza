"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Briefcase,
  Clock,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

export function WorkerSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: "Dashboard", href: "/worker/dashboard", icon: LayoutDashboard },
    { name: "Job Offers", href: "/worker/job-offers", icon: Briefcase },
    { name: "Applications", href: "/worker/applications", icon: Clock },
    { name: "Profile", href: "/worker/profile", icon: User },
  ]

  return (
    <div className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
                <span className="text-sidebar-primary-foreground font-bold text-sm">J</span>
              </div>
              <span className="font-semibold text-sidebar-foreground">Jobza</span>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="p-1">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

                {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                                  <div
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm" 
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    }`}
                  >
                                      <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span className="font-medium">{item.name}</span>}
                </div>
              </Link>
            )
          })}
          
          {/* Logout button directly under profile with no spacing */}
          <div className="pt-2">
            <Button
              variant="ghost"
              onClick={() => {
                // Handle logout logic here
                window.location.href = "/"
              }}
              className={`w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors duration-200 ${
                collapsed ? "px-2" : "px-3"
              }`}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="ml-3">Logout</span>}
            </Button>
          </div>
        </nav>
      </div>
    </div>
  )
}
