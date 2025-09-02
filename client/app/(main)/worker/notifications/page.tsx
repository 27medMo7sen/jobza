"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { WorkerSidebar } from "@/components/layout/worker-sidebar"
import { ArrowLeft, Briefcase, MessageSquare, Calendar, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: "job_offer",
      title: "New Job Offer",
      message: "Johnson Family has posted a new house cleaning job that matches your profile.",
      time: "2 hours ago",
      read: false,
      icon: Briefcase,
      color: "text-blue-600",
    },
    {
      id: 2,
      type: "message",
      title: "New Message",
      message: "Elite Care Agency sent you a message regarding your application.",
      time: "4 hours ago",
      read: false,
      icon: MessageSquare,
      color: "text-green-600",
    },
    {
      id: 3,
      type: "application_update",
      title: "Application Update",
      message: "Your application for the nanny position has been reviewed.",
      time: "1 day ago",
      read: true,
      icon: CheckCircle,
      color: "text-purple-600",
    },
    {
      id: 4,
      type: "schedule",
      title: "Schedule Reminder",
      message: "You have a job scheduled tomorrow at 9:00 AM with the Smith Family.",
      time: "1 day ago",
      read: true,
      icon: Calendar,
      color: "text-orange-600",
    },
    {
      id: 5,
      type: "job_offer",
      title: "Job Match",
      message: "We found 3 new jobs that match your skills and preferences.",
      time: "2 days ago",
      read: true,
      icon: Briefcase,
      color: "text-blue-600",
    },
  ]

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="flex h-screen bg-gray-50">
      <WorkerSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/worker/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">J</span>
                </div>
                <span className="font-semibold text-gray-900">Jobza</span>
              </div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="rounded-full">
                    {unreadCount}
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm">
              Mark All as Read
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-3">
            {notifications.map((notification) => {
              const IconComponent = notification.icon
              return (
                <Card
                  key={notification.id}
                  className={`hover:shadow-md transition-shadow ${!notification.read ? "border-blue-200 bg-blue-50/30" : ""}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-full bg-gray-100 ${notification.color}`}>
                        <IconComponent className="h-5 w-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-medium ${!notification.read ? "text-gray-900" : "text-gray-700"}`}>
                            {notification.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">{notification.time}</span>
                            {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                          </div>
                        </div>
                        <p className={`text-sm ${!notification.read ? "text-gray-700" : "text-gray-600"}`}>
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
