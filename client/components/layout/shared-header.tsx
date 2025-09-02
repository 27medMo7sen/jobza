"use client"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { ArrowLeft, Bell } from "lucide-react"
import { useRouter } from "next/navigation"

interface SharedHeaderProps {
  title: string
  subtitle?: string
  showLogo?: boolean
  showBackButton?: boolean
  showNotification?: boolean
}

export function SharedHeader({ 
  title, 
  subtitle, 
  showLogo = true, 
  showBackButton = false,
  showNotification = true
}: SharedHeaderProps) {
  const router = useRouter()

  return (
    <div className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          {showLogo && (
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">J</span>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {showNotification && (
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
