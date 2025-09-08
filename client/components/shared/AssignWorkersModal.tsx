"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle } from "lucide-react"

interface AffiliatedWorker {
  id: number
  name: string
  specialization: string
  rating: number
  experience: number
  location: string
  availability: string
  skills: string[]
  matchScore: number
}

interface AssignWorkersModalProps {
  open: boolean
  workers: AffiliatedWorker[]
  selected: number[]
  onToggleSelect: (workerId: number) => void
  onClose: () => void
  onAssign: () => void
}

export function AssignWorkersModal({ open, workers, selected, onToggleSelect, onClose, onAssign }: AssignWorkersModalProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg p-6 max-w-4xl w-full mx-4 shadow-xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Assign Workers to Job</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>
        
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Select workers from your affiliated pool. Workers are ranked by match score.
          </p>
          
          <div className="space-y-3">
            {workers.map((worker) => (
              <div
                key={worker.id}
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                  selected.includes(worker.id)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                }`}
                onClick={() => onToggleSelect(worker.id)}
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" alt={worker.name} />
                    <AvatarFallback>{worker.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{worker.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {worker.specialization} • ⭐ {worker.rating} • {worker.experience} years experience
                    </p>
                    <p className="text-xs text-muted-foreground">
                      📍 {worker.location} • {worker.availability}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {worker.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs">
                    Match: {worker.matchScore}%
                  </Badge>
                  {selected.includes(worker.id) && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onAssign} disabled={selected.length === 0}>
              Assign {selected.length} Worker{selected.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}


