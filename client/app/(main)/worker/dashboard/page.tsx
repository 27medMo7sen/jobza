"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, Clock, Building2 } from "lucide-react";
import { SharedHeader } from "@/components/layout/shared-header";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { User } from "@/types/user";

export default function WorkerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <SharedHeader
        title={`Welcome ${(user as User).name || "Worker Dashboard"}`}
        subtitle="Manage your jobs and track your progress"
      />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        {/* Mobile dropdown */}
        <div className="sm:hidden">
          <select
            className="w-full p-2 border border-border rounded-md bg-background text-foreground"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            <option value="overview">Overview</option>
            <option value="jobs">Jobs</option>
            <option value="affiliations">Affiliations</option>
          </select>
        </div>

        {/* Desktop tabs */}
        <TabsList className="hidden sm:grid sm:grid-cols-3 w-full">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="jobs" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Jobs
          </TabsTrigger>
          <TabsTrigger value="affiliations" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Affiliations
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Dashboard Overview
                </CardTitle>
                <CardDescription>
                  Your job status and recent activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Building2 className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Active Jobs</p>
                      <p className="text-2xl font-bold">0</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Users className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Agencies</p>
                      <p className="text-2xl font-bold">0</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Clock className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Pending</p>
                      <p className="text-2xl font-bold">0</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Calendar className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">This Week</p>
                      <p className="text-2xl font-bold">0</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest job applications and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No recent activity</p>
                  <p className="text-sm text-muted-foreground">
                    Start by applying to jobs or connecting with agencies
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Jobs Tab */}
        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Available Jobs
              </CardTitle>
              <CardDescription>
                Browse and apply to available job opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No jobs available</p>
                <p className="text-sm text-muted-foreground">
                  Check back later for new job opportunities
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Affiliations Tab */}
        <TabsContent value="affiliations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Agency Affiliations
              </CardTitle>
              <CardDescription>
                Manage your connections with agencies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No agency affiliations</p>
                <p className="text-sm text-muted-foreground">
                  Connect with agencies to find more job opportunities
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
