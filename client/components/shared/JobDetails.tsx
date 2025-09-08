"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, DollarSign, MapPin, CheckCircle } from "lucide-react"

type UnifiedJobDetails = {
  // Common
  title?: string
  jobTitle?: string
  familyName?: string
  type?: string
  status?: string
  salary?: string
  budget?: string
  postedDate?: string
  startDate?: string
  description?: string
  schedule?: string
  workingHours?: string
  location?: string
  requirements?: string[]
  responsibilities?: string[]
  benefits?: string[]

  // Agency-specific sections (optional)
  familyDetails?: {
    members: number
    children: number
    elderly: number
    pets: boolean
    houseSize: string
  }
  additionalInfo?: {
    accommodation: boolean
    meals: boolean
    transportation: boolean
    benefits: string[]
  }
}

interface JobDetailsProps {
  job: UnifiedJobDetails
  audience?: "agency" | "employer"
  getTypeBadgeClass?: (type: string) => string
  getStatusBadgeClass?: (status: string) => string
}

export function JobDetails({ job, audience, getTypeBadgeClass, getStatusBadgeClass }: JobDetailsProps) {
  const title = job.title ?? job.jobTitle ?? "Job"
  const subtitle = job.familyName
  const location = job.location
  const money = job.salary ?? job.budget
  const dateLabel = job.postedDate ? `Posted: ${job.postedDate}` : job.startDate ? `Start: ${job.startDate}` : undefined
  const workHours = job.schedule ?? job.workingHours

  const showFamilyDetails = Boolean(job.familyDetails) && (audience ? (audience === "agency" || audience === "employer") : true)
  const hasBenefits = Array.isArray(job.benefits) && job.benefits.length > 0
  const showBenefits = hasBenefits && (audience ? (audience === "agency" || audience === "employer") : true)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl sm:text-2xl break-words">{title}</CardTitle>
              {subtitle && <CardDescription className="text-base sm:text-lg break-words">{subtitle}</CardDescription>}
              {(job.type || job.status) && (
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {job.type && (
                    <Badge className={getTypeBadgeClass ? getTypeBadgeClass(job.type) : ""}>
                      {job.type === "long-term" ? "Long-term" : job.type}
                    </Badge>
                  )}
                  {job.status && (
                    <Badge className={getStatusBadgeClass ? getStatusBadgeClass(job.status) : ""}>{job.status}</Badge>
                  )}
                </div>
              )}
            </div>
            {money && (
              <div className="flex flex-col sm:text-right">
                <div className="text-sm text-muted-foreground">{job.salary ? "Salary" : "Budget"}</div>
                <div className="text-lg font-semibold break-words">{money}</div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm text-muted-foreground truncate">{location}</span>
              </div>
            )}
            {money && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm text-muted-foreground truncate">{money}</span>
              </div>
            )}
            {dateLabel && (
              <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-1">
                <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm text-muted-foreground truncate">{dateLabel}</span>
              </div>
            )}
          </div>

          {(job.description || workHours) && (
            <div className="space-y-4">
              {job.description && (
                <div>
                  <h3 className="font-medium text-foreground mb-2">Job Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{job.description}</p>
                </div>
              )}
              {workHours && (
                <div>
                  <h3 className="font-medium text-foreground mb-2">Working Hours</h3>
                  <p className="text-muted-foreground">{workHours}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {job.requirements && job.requirements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Requirements & Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {job.requirements.map((requirement, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">{requirement}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {showBenefits && (
        <Card>
          <CardHeader>
            <CardTitle>Benefits & Perks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(job.benefits ?? []).map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {(showFamilyDetails || job.additionalInfo) && (
        <Card>
          <CardHeader>
            <CardTitle>Family Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {showFamilyDetails && job.familyDetails && (
                <div>
                  <h4 className="font-medium text-foreground mb-3">Household Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Members:</span>
                      <span className="text-sm font-medium">{job.familyDetails.members}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Children:</span>
                      <span className="text-sm font-medium">{job.familyDetails.children}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Elderly:</span>
                      <span className="text-sm font-medium">{job.familyDetails.elderly}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Pets:</span>
                      <span className="text-sm font-medium">{job.familyDetails.pets ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">House Size:</span>
                      <span className="text-sm font-medium">{job.familyDetails.houseSize}</span>
                    </div>
                  </div>
                </div>
              )}

              {job.additionalInfo && (
                <div>
                  <h4 className="font-medium text-foreground mb-3">Benefits & Accommodation</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Accommodation:</span>
                      <span className="text-sm font-medium">{job.additionalInfo.accommodation ? "Provided" : "Not provided"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Meals:</span>
                      <span className="text-sm font-medium">{job.additionalInfo.meals ? "Provided" : "Not provided"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Transportation:</span>
                      <span className="text-sm font-medium">{job.additionalInfo.transportation ? "Provided" : "Not provided"}</span>
                    </div>
                  </div>

                  {job.additionalInfo.benefits && job.additionalInfo.benefits.length > 0 && (
                    <div className="mt-4">
                      <h5 className="font-medium text-foreground mb-2">Additional Benefits</h5>
                      <div className="flex flex-wrap gap-2">
                        {job.additionalInfo.benefits.map((benefit, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
