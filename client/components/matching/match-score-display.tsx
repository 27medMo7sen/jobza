import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, MapPin, Clock, DollarSign, Award, Zap } from "lucide-react"
import type { MatchScore } from "@/lib/matching/algorithms"

interface MatchScoreDisplayProps {
  matchScore: MatchScore
  showBreakdown?: boolean
  compact?: boolean
}

export function MatchScoreDisplay({ matchScore, showBreakdown = false, compact = false }: MatchScoreDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return "text-green-600"
    if (score >= 0.6) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 0.9) return "Excellent Match"
    if (score >= 0.8) return "Great Match"
    if (score >= 0.7) return "Good Match"
    if (score >= 0.6) return "Fair Match"
    return "Poor Match"
  }

  const scorePercentage = Math.round(matchScore.totalScore * 100)

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant={scorePercentage >= 80 ? "default" : scorePercentage >= 60 ? "secondary" : "destructive"}>
          {scorePercentage}% Match
        </Badge>
        <span className="text-sm text-muted-foreground">{getScoreLabel(matchScore.totalScore)}</span>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Match Score</CardTitle>
          <Badge variant={scorePercentage >= 80 ? "default" : scorePercentage >= 60 ? "secondary" : "destructive"}>
            {scorePercentage}%
          </Badge>
        </div>
        <div className="space-y-2">
          <Progress value={scorePercentage} className="h-2" />
          <p className={`text-sm font-medium ${getScoreColor(matchScore.totalScore)}`}>
            {getScoreLabel(matchScore.totalScore)}
          </p>
        </div>
      </CardHeader>

      {showBreakdown && (
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Skills Match</span>
              </div>
              <span className="text-sm font-medium">{Math.round(matchScore.breakdown.skillsMatch * 100)}%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-500" />
                <span className="text-sm">Location</span>
              </div>
              <span className="text-sm font-medium">{Math.round(matchScore.breakdown.locationMatch * 100)}%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-500" />
                <span className="text-sm">Availability</span>
              </div>
              <span className="text-sm font-medium">{Math.round(matchScore.breakdown.availabilityMatch * 100)}%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Budget</span>
              </div>
              <span className="text-sm font-medium">{Math.round(matchScore.breakdown.budgetMatch * 100)}%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-orange-500" />
                <span className="text-sm">Experience</span>
              </div>
              <span className="text-sm font-medium">{Math.round(matchScore.breakdown.experienceMatch * 100)}%</span>
            </div>

            {matchScore.breakdown.ratingBonus > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm">Rating Bonus</span>
                </div>
                <span className="text-sm font-medium">+{Math.round(matchScore.breakdown.ratingBonus * 100)}%</span>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
