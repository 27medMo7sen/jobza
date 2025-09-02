import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, DollarSign, Calendar, Users } from "lucide-react"
import Link from "next/link"
import type { Job } from "@/lib/types"

interface JobCardProps {
  job: Job & {
    family?: {
      familyName: string
      location: {
        city: string
        country: string
      }
    }
  }
  showApplyButton?: boolean
}

export function JobCard({ job, showApplyButton = true }: JobCardProps) {
  const formatBudget = (min: number, max: number, currency: string) => {
    return `${currency} ${min}-${max}`
  }

  const formatServiceType = (serviceType: string) => {
    return serviceType
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{job.title}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {job.family?.familyName || "Family"}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2">
            <Badge variant={getUrgencyColor(job.urgencyLevel)}>{job.urgencyLevel} priority</Badge>
            <Badge variant="outline">{formatServiceType(job.serviceType)}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>
              {job.city}, {job.country}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>{formatBudget(job.budget.min, job.budget.max, job.currency)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="capitalize">{job.cycleType}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{new Date(job.startDate).toLocaleDateString()}</span>
          </div>
        </div>

        {job.requiredTasks.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Required Tasks:</p>
            <div className="flex flex-wrap gap-1">
              {job.requiredTasks.slice(0, 3).map((task, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {task}
                </Badge>
              ))}
              {job.requiredTasks.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{job.requiredTasks.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-muted-foreground">
            {job.applicationsCount} application{job.applicationsCount !== 1 ? "s" : ""}
          </div>
          {showApplyButton && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/jobs/${job.id}`}>View Details</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href={`/jobs/${job.id}/apply`}>Apply Now</Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
