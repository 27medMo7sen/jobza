"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { X, Briefcase } from "lucide-react"
import type { Job } from "@/lib/types"

interface JobDetailsModalProps {
  job: Job & {
    family?: {
      familyName: string
      location: {
        city: string
        country: string
      }
    }
    agency?: {
      businessName: string
      location: {
        city: string
        country: string
      }
    }
  }
  isOpen: boolean
  onClose: () => void
  onApply?: () => void
}

export function JobDetailsModal({ job, isOpen, onClose, onApply }: JobDetailsModalProps) {
  const formatBudget = (min?: number, max?: number, currency?: string) => {
    if (!min || !max || !currency) {
      return "Budget not specified"
    }
    return `${currency} ${min.toLocaleString()}-${max.toLocaleString()}`
  }

  const formatServiceType = (serviceType: string) => {
    return serviceType
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const getJobTypeLabel = (jobType: string) => {
    return jobType === "long-term" ? "Long-term" : "Short-term"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" showCloseButton={false}>
        {/* Custom header with close button */}
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">{job.title}</DialogTitle>
              <p className="text-sm text-muted-foreground">
                {job.family?.familyName || job.agency?.businessName} • {job.city}, {job.country}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Job info grid */}
        <div className="grid grid-cols-3 gap-4 py-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Salary</p>
            <p className="font-semibold">{formatBudget(job.budget?.min, job.budget?.max, job.budget?.currency)}</p>
            <p className="text-xs text-muted-foreground">
              {job.cycleType === "monthly" ? "/month" : job.cycleType === "weekly" ? "/week" : "/hour"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Start Date</p>
            <p className="font-semibold">
              {job.schedule?.startDate ? new Date(job.schedule.startDate).toLocaleDateString() : "Not specified"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Type</p>
            <p className="font-semibold">{getJobTypeLabel(job.jobType)}</p>
          </div>
        </div>

        <Separator />

        {/* Job Description */}
        <div className="py-4">
          <h3 className="font-semibold mb-3">Job Description</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
        </div>

        <Separator />

        {/* Requirements and Benefits */}
        <div className="grid md:grid-cols-2 gap-6 py-4">
          <div>
            <h3 className="font-semibold mb-3">Requirements</h3>
            <ul className="space-y-2 text-sm">
              {job.requirements.experience > 0 && (
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                  <span>
                    {job.requirements.experience}+ years of experience as a{" "}
                    {formatServiceType(job.serviceType).toLowerCase()}
                  </span>
                </li>
              )}
              {job.requirements.languages?.length > 0 && (
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                  <span>Fluent in {job.requirements.languages.join(" and ")}</span>
                </li>
              )}
              {job.requirements.backgroundCheck && (
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                  <span>Valid background check certificate</span>
                </li>
              )}
              {job.requirements.skills?.length > 0 &&
                job.requirements.skills.map((skill, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                    <span>{skill}</span>
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Benefits</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <span>
                  Competitive salary of {formatBudget(job.budget?.min, job.budget?.max, job.budget?.currency)}
                </span>
              </li>
              {job.jobType === "long-term" && (
                <>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    <span>Health insurance coverage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    <span>Paid time off and vacation days</span>
                  </li>
                </>
              )}
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <span>Flexible working arrangements</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <span>Professional development opportunities</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Required Tasks */}
        {job.requiredTasks?.length > 0 && (
          <>
            <Separator />
            <div className="py-4">
              <h3 className="font-semibold mb-3">Required Tasks</h3>
              <div className="flex flex-wrap gap-2">
                {job.requiredTasks.map((task, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {task}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            Close
          </Button>
          {onApply && (
            <Button onClick={onApply} className="flex-1 bg-blue-600 hover:bg-blue-700">
              Apply Now
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
