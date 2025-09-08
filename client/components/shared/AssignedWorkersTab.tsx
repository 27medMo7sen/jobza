"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AssignedWorker {
  id: number
  name: string
  specialization: string
  rating: number
  experience: number
  status: 'pending' | 'short_list' | 'rejected' | 'accepted'
  assignedDate: string
  employerFeedback?: string
}

interface AssignedWorkersTabProps {
  assignedWorkers: AssignedWorker[]
  onProceedContract?: (workerId: number) => void
}

export function AssignedWorkersTab({ assignedWorkers, onProceedContract }: AssignedWorkersTabProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Assigned Workers</CardTitle>
            <CardDescription>Track the status of workers assigned to this job</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {assignedWorkers.length > 0 ? (
          <div className="space-y-4">
            {assignedWorkers.map((worker) => (
              <div key={worker.id} className="p-4 border rounded-lg bg-card gap-4">
                <div className="flex items-start gap-4 min-w-0">
                  <Avatar className="flex-shrink-0">
                    <AvatarImage src="/placeholder.svg" alt={worker.name} />
                    <AvatarFallback>{worker.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-card-foreground truncate">{worker.name}</p>
                    <p className="text-base text-muted-foreground">
                      {worker.specialization} • ⭐ {worker.rating} • {worker.experience} years experience
                    </p>
                    <p className="text-sm text-muted-foreground">Assigned: {worker.assignedDate}</p>
                    {worker.employerFeedback && (
                      <p className="text-sm text-muted-foreground mt-1 break-words">Feedback: "{worker.employerFeedback}"</p>
                    )}

                    <div className="flex items-center gap-3 flex-wrap mt-3">
                      <Badge 
                        variant={
                          worker.status === 'accepted' ? 'default' : 
                          worker.status === 'short_list' ? 'secondary' : 
                          worker.status === 'rejected' ? 'destructive' : 'outline'
                        }
                        className="text-sm w-fit"
                      >
                        {worker.status === 'accepted' ? '✅ Accepted' :
                         worker.status === 'short_list' ? '📋 Short List' :
                         worker.status === 'rejected' ? '❌ Rejected' : '⏳ Pending'}
                      </Badge>

                      {onProceedContract && worker.status === 'accepted' && (
                        <Button size="sm" onClick={
                          () => onProceedContract(worker.id)} className="w-full sm:w-auto">
                          Proceed with Contract
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No workers assigned yet</p>
            <p className="text-sm">Use Assign Workers to select from affiliated workers</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


