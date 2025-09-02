"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { JobCard } from "@/components/jobs/job-card"
import { MatchScoreDisplay } from "./match-score-display"
import { Sparkles, Eye } from "lucide-react"
import type { JobRecommendation } from "@/lib/matching/algorithms"

interface RecommendedJobsProps {
  recommendations: JobRecommendation[]
  title?: string
  showMatchScore?: boolean
  limit?: number
}

export function RecommendedJobs({
  recommendations,
  title = "Recommended Jobs",
  showMatchScore = true,
  limit = 5,
}: RecommendedJobsProps) {
  const displayedRecommendations = recommendations.slice(0, limit)

  if (displayedRecommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No job recommendations available at the moment.</p>
            <p className="text-sm text-muted-foreground mt-2">Update your profile and skills to get better matches.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          <Badge variant="secondary">{recommendations.length} matches</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayedRecommendations.map((recommendation, index) => (
          <div key={recommendation.job.id} className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <JobCard job={recommendation.job} />
              </div>
              {showMatchScore && (
                <div className="ml-4 min-w-[200px]">
                  <MatchScoreDisplay
                    matchScore={{
                      workerId: "current-user",
                      jobId: recommendation.job.id,
                      totalScore: recommendation.matchScore,
                      breakdown: {
                        skillsMatch: recommendation.matchScore,
                        locationMatch: recommendation.matchScore,
                        availabilityMatch: recommendation.matchScore,
                        budgetMatch: recommendation.matchScore,
                        experienceMatch: recommendation.matchScore,
                        ratingBonus: 0,
                      },
                    }}
                    compact={true}
                  />
                </div>
              )}
            </div>

            {recommendation.reasons.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {recommendation.reasons.map((reason, reasonIndex) => (
                  <Badge key={reasonIndex} variant="outline" className="text-xs">
                    {reason}
                  </Badge>
                ))}
              </div>
            )}

            {index < displayedRecommendations.length - 1 && <hr className="my-4" />}
          </div>
        ))}

        {recommendations.length > limit && (
          <div className="text-center pt-4">
            <Button variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              View All {recommendations.length} Recommendations
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
