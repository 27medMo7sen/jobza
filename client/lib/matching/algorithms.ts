import type { Job, WorkerProfile } from "@/lib/types"

export interface MatchScore {
  workerId: string
  jobId: string
  totalScore: number
  breakdown: {
    skillsMatch: number
    locationMatch: number
    availabilityMatch: number
    budgetMatch: number
    experienceMatch: number
    ratingBonus: number
  }
}

export interface JobRecommendation {
  job: Job
  matchScore: number
  reasons: string[]
}

export interface WorkerRecommendation {
  worker: WorkerProfile
  matchScore: number
  reasons: string[]
}

// Calculate skill compatibility between job requirements and worker skills
export function calculateSkillsMatch(job: Job, worker: WorkerProfile): number {
  if (!job.requirements?.skills || job.requirements.skills.length === 0) return 1.0

  const requiredSkills = job.requirements.skills.map((s) => s.toLowerCase())
  const workerSkills = worker.skills.map((s) => s.toLowerCase())

  const matchedSkills = requiredSkills.filter(
    (skill) => workerSkills.includes(skill) || workerSkills.includes(job.serviceType),
  )

  return matchedSkills.length / requiredSkills.length
}

// Calculate location proximity score (simplified - in production use actual coordinates)
export function calculateLocationMatch(job: Job, worker: WorkerProfile): number {
  // For now, exact city match = 1.0, same country = 0.7, different = 0.3
  if (job.location.city.toLowerCase() === worker.location?.city?.toLowerCase()) return 1.0
  if (job.location.country.toLowerCase() === worker.location?.country?.toLowerCase()) return 0.7
  return 0.3
}

// Calculate availability compatibility
export function calculateAvailabilityMatch(job: Job, worker: WorkerProfile): number {
  if (!worker.availability?.days || worker.availability.days.length === 0) return 0.5

  // Simplified: if worker is available any day, assume good match
  // In production, check specific schedule compatibility
  const hasFlexibility = worker.availability.days.length >= 5
  const hasWeekendAvailability = worker.availability.days.some(
    (day) => day.toLowerCase().includes("saturday") || day.toLowerCase().includes("sunday"),
  )

  if (job.cycleType === "daily" && hasFlexibility) return 1.0
  if (job.cycleType === "weekly" && hasWeekendAvailability) return 0.9
  if (job.cycleType === "one-time") return 0.8

  return 0.6
}

// Calculate budget compatibility
export function calculateBudgetMatch(job: Job, worker: WorkerProfile): number {
  if (!worker.hourlyRate) return 0.5

  const jobMaxBudget = job.budget.max
  const workerMinRate = worker.hourlyRate.min
  const workerMaxRate = worker.hourlyRate.max

  // Perfect match if job budget overlaps with worker rate range
  if (jobMaxBudget >= workerMinRate && job.budget.min <= workerMaxRate) return 1.0

  // Partial match if close
  const budgetGap = Math.abs(jobMaxBudget - workerMinRate)
  const tolerance = jobMaxBudget * 0.2 // 20% tolerance

  if (budgetGap <= tolerance) return 0.8
  if (budgetGap <= tolerance * 2) return 0.6

  return 0.3
}

// Calculate experience match
export function calculateExperienceMatch(job: Job, worker: WorkerProfile): number {
  const requiredExperience = job.requirements?.experience || 0
  const workerExperience = worker.experience || 0

  if (workerExperience >= requiredExperience) return 1.0
  if (workerExperience >= requiredExperience * 0.7) return 0.8
  if (workerExperience >= requiredExperience * 0.5) return 0.6

  return 0.4
}

// Calculate rating bonus
export function calculateRatingBonus(worker: WorkerProfile): number {
  if (!worker.rating || worker.reviewCount < 3) return 0

  // Bonus based on rating (0-0.2 additional points)
  return Math.max(0, (worker.rating - 4.0) * 0.1)
}

// Main matching algorithm
export function calculateJobWorkerMatch(job: Job, worker: WorkerProfile): MatchScore {
  const skillsMatch = calculateSkillsMatch(job, worker)
  const locationMatch = calculateLocationMatch(job, worker)
  const availabilityMatch = calculateAvailabilityMatch(job, worker)
  const budgetMatch = calculateBudgetMatch(job, worker)
  const experienceMatch = calculateExperienceMatch(job, worker)
  const ratingBonus = calculateRatingBonus(worker)

  // Weighted scoring
  const weights = {
    skills: 0.3,
    location: 0.25,
    availability: 0.2,
    budget: 0.15,
    experience: 0.1,
  }

  const totalScore =
    skillsMatch * weights.skills +
    locationMatch * weights.location +
    availabilityMatch * weights.availability +
    budgetMatch * weights.budget +
    experienceMatch * weights.experience +
    ratingBonus

  return {
    workerId: worker.id,
    jobId: job.id,
    totalScore: Math.min(1.0, totalScore), // Cap at 1.0
    breakdown: {
      skillsMatch,
      locationMatch,
      availabilityMatch,
      budgetMatch,
      experienceMatch,
      ratingBonus,
    },
  }
}

// Generate job recommendations for a worker
export function generateJobRecommendations(
  worker: WorkerProfile,
  availableJobs: Job[],
  limit = 10,
): JobRecommendation[] {
  const recommendations = availableJobs
    .map((job) => {
      const matchScore = calculateJobWorkerMatch(job, worker)
      const reasons = generateMatchReasons(matchScore, job, worker)

      return {
        job,
        matchScore: matchScore.totalScore,
        reasons,
      }
    })
    .filter((rec) => rec.matchScore > 0.4) // Only show decent matches
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit)

  return recommendations
}

// Generate worker recommendations for a job
export function generateWorkerRecommendations(
  job: Job,
  availableWorkers: WorkerProfile[],
  limit = 10,
): WorkerRecommendation[] {
  const recommendations = availableWorkers
    .map((worker) => {
      const matchScore = calculateJobWorkerMatch(job, worker)
      const reasons = generateMatchReasons(matchScore, job, worker)

      return {
        worker,
        matchScore: matchScore.totalScore,
        reasons,
      }
    })
    .filter((rec) => rec.matchScore > 0.4) // Only show decent matches
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit)

  return recommendations
}

// Generate human-readable match reasons
function generateMatchReasons(matchScore: MatchScore, job: Job, worker: WorkerProfile): string[] {
  const reasons: string[] = []

  if (matchScore.breakdown.skillsMatch >= 0.8) {
    reasons.push("Perfect skill match for " + job.serviceType)
  } else if (matchScore.breakdown.skillsMatch >= 0.6) {
    reasons.push("Good skill compatibility")
  }

  if (matchScore.breakdown.locationMatch >= 0.9) {
    reasons.push("Located in same area")
  } else if (matchScore.breakdown.locationMatch >= 0.7) {
    reasons.push("Located in same region")
  }

  if (matchScore.breakdown.budgetMatch >= 0.8) {
    reasons.push("Budget aligns with rate expectations")
  }

  if (matchScore.breakdown.experienceMatch >= 0.9) {
    reasons.push(`${worker.experience}+ years experience`)
  }

  if (matchScore.breakdown.ratingBonus > 0) {
    reasons.push(`Highly rated (${worker.rating}★)`)
  }

  if (matchScore.breakdown.availabilityMatch >= 0.8) {
    reasons.push("Schedule flexibility matches needs")
  }

  return reasons.slice(0, 3) // Limit to top 3 reasons
}
