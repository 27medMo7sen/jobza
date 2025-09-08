"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, Star, CheckCircle, XCircle } from "lucide-react"

type Application = {
  id: number
  workerName: string
  workerAvatar?: string
  appliedDate: string
  status: string
  rating?: number
  experience?: string
  location?: string
  hourlyRate?: string
  skills: string[]
  languages: string[]
}

interface ApplicantsListProps {
  applications: Application[]
  onAction?: (applicationId: number, action: "accept" | "reject" | "short_list") => void
  getStatusBadgeClass?: (status: string) => string
  showViewProfileButton?: boolean
}

export function ApplicantsList({
  applications,
  onAction,
  getStatusBadgeClass = () => "",
  showViewProfileButton = true,
}: ApplicantsListProps) {
  const sortApplications = (apps: Application[]) => {
    const rank: Record<string, number> = {
      accepted: 0,
      short_list: 1,
      pending: 2,
      reviewed: 3,
      completed: 4,
      rejected: 5,
    }
    return [...apps].sort((a, b) => (rank[a.status] ?? 99) - (rank[b.status] ?? 99))
  }

  return (
    <div className="space-y-4">
      {sortApplications(applications).map((app) => (
        <div key={app.id} className="border rounded-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-4">
            <div className="flex items-start space-x-3 sm:space-x-4">
              <Avatar className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
                <AvatarImage src={app.workerAvatar} alt={app.workerName} />
                <AvatarFallback className="text-lg sm:text-xl font-semibold">
                  {app.workerName.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold break-words">{app.workerName}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {typeof app.rating !== "undefined" && (
                        <>
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current flex-shrink-0" />
                          <span className="text-sm sm:text-base font-medium">{app.rating}</span>
                        </>
                      )}
                      {app.experience && (
                        <span className="text-xs sm:text-sm text-gray-500">({app.experience} experience)</span>
                      )}
                    </div>
                    {app.location && (
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">{app.location}</p>
                    )}
                  </div>
                  <Badge className={getStatusBadgeClass(app.status)}>{app.status}</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="font-medium mb-2 text-sm sm:text-base">Skills</h4>
              <div className="flex flex-wrap gap-1">
                {app.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-sm sm:text-base">Languages</h4>
              <div className="flex flex-wrap gap-1">
                {app.languages.map((lang, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t gap-4">
            <div className="text-xs sm:text-sm text-gray-600">Applied: {app.appliedDate}</div>
            <div className="flex flex-wrap gap-2">
              {showViewProfileButton && (
                <Button size="sm" variant="outline" className="text-xs sm:text-sm">
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  View Profile
                </Button>
              )}
              {onAction && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAction(app.id, "short_list")}
                  className="text-xs sm:text-sm"
                >
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Short List
                </Button>
              )}
              {onAction && app.status === "pending" && (
                <>
                  <Button size="sm" onClick={() => onAction(app.id, "accept")} className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAction(app.id, "reject")}
                    className="text-red-600 hover:text-red-700 text-xs sm:text-sm"
                  >
                    <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Reject
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}


