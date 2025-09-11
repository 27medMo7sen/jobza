"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Building2,
  FileText,
  Eye,
  ChevronLeft,
  ChevronRight,
  User,
  Briefcase,
} from "lucide-react";
import { UnifiedSidebar } from "@/components/layout/unified-sidebar";
import { useHttp } from "@/hooks/use-http";
import { toast } from "sonner";
import { ProfileLink } from "@/components/shared/ProfileLink";

interface PendingUser {
  _id: string;
  name: string;
  email: string;
  userName: string;
  role: string;
  status: string;
  createdAt: string;
  // Flattened data - no nested objects
  phoneNumber?: string;
  country?: string;
  nationality?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  skillSet?: string[];
  experience?: string;
  companyName?: string;
  industry?: string;
  businessType?: string;
  agencyName?: string;
  licenseNumber?: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface PendingData {
  data: PendingUser[];
  pagination: PaginationInfo;
}

export default function AdminDashboard() {
  const { get, put } = useHttp();

  // State for pending data
  const [pendingWorkers, setPendingWorkers] = useState<PendingUser[]>([]);
  const [pendingEmployers, setPendingEmployers] = useState<PendingUser[]>([]);
  const [pendingAgencies, setPendingAgencies] = useState<PendingUser[]>([]);
  const [pendingContracts, setPendingContracts] = useState<any[]>([]);

  // Pagination state
  const [workersPagination, setWorkersPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [employersPagination, setEmployersPagination] =
    useState<PaginationInfo>({ page: 1, limit: 10, total: 0, pages: 0 });
  const [agenciesPagination, setAgenciesPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [contractsPagination, setContractsPagination] =
    useState<PaginationInfo>({ page: 1, limit: 10, total: 0, pages: 0 });

  // Loading states
  const [loading, setLoading] = useState({
    workers: false,
    employers: false,
    agencies: false,
    contracts: false,
  });

  // Fetch pending workers
  const fetchPendingWorkers = async (page: number = 1) => {
    setLoading((prev) => ({ ...prev, workers: true }));
    try {
      const response = await get<PendingData>(
        `/admin/pending/workers?page=${page}&limit=10`
      );
      setPendingWorkers(response.data);
      setWorkersPagination(response.pagination);
    } catch (error) {
      console.error("Error fetching pending workers:", error);
      toast.error("Failed to fetch pending workers");
    } finally {
      setLoading((prev) => ({ ...prev, workers: false }));
    }
  };

  // Fetch pending employers
  const fetchPendingEmployers = async (page: number = 1) => {
    setLoading((prev) => ({ ...prev, employers: true }));
    try {
      const response = await get<PendingData>(
        `/admin/pending/employers?page=${page}&limit=10`
      );
      setPendingEmployers(response.data);
      setEmployersPagination(response.pagination);
    } catch (error) {
      console.error("Error fetching pending employers:", error);
      toast.error("Failed to fetch pending employers");
    } finally {
      setLoading((prev) => ({ ...prev, employers: false }));
    }
  };

  // Fetch pending agencies
  const fetchPendingAgencies = async (page: number = 1) => {
    setLoading((prev) => ({ ...prev, agencies: true }));
    try {
      const response = await get<PendingData>(
        `/admin/pending/agencies?page=${page}&limit=10`
      );
      setPendingAgencies(response.data);
      setAgenciesPagination(response.pagination);
    } catch (error) {
      console.error("Error fetching pending agencies:", error);
      toast.error("Failed to fetch pending agencies");
    } finally {
      setLoading((prev) => ({ ...prev, agencies: false }));
    }
  };

  // Fetch pending contracts
  const fetchPendingContracts = async (page: number = 1) => {
    setLoading((prev) => ({ ...prev, contracts: true }));
    try {
      const response = await get<PendingData>(
        `/admin/pending/contracts?page=${page}&limit=10`
      );
      setPendingContracts(response.data);
      setContractsPagination(response.pagination);
    } catch (error) {
      console.error("Error fetching pending contracts:", error);
      toast.error("Failed to fetch pending contracts");
    } finally {
      setLoading((prev) => ({ ...prev, contracts: false }));
    }
  };

  // No accept/reject actions in dashboard - these are handled in profile view

  // Load initial data
  useEffect(() => {
    fetchPendingWorkers();
    fetchPendingEmployers();
    fetchPendingAgencies();
    fetchPendingContracts();
  }, []);

  // Simplified user card component - only shows basic info and view profile button
  const UserCard = ({ user }: { user: PendingUser }) => {
    return (
      <Card className="mb-4">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm text-foreground truncate">
                  {user.name}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  @{user.userName}
                </p>
                <p className="text-xs text-muted-foreground/70">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end sm:justify-start">
              <ProfileLink username={user.userName}>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs w-full sm:w-auto"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">View Profile</span>
                  <span className="sm:hidden">View</span>
                </Button>
              </ProfileLink>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Pagination component
  const Pagination = ({
    pagination,
    onPageChange,
  }: {
    pagination: PaginationInfo;
    onPageChange: (page: number) => void;
  }) => {
    if (pagination.pages <= 1) return null;

    return (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
        <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
          Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
          {pagination.total} results
        </p>
        <div className="flex items-center justify-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="text-xs"
          >
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline ml-1">Previous</span>
          </Button>
          <span className="text-xs sm:text-sm text-muted-foreground px-2">
            {pagination.page} / {pagination.pages}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.pages}
            className="text-xs"
          >
            <span className="hidden sm:inline mr-1">Next</span>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <UnifiedSidebar userRole="admin" />

      <div className="lg:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage pending users and contracts
            </p>
          </div>

          <Tabs defaultValue="workers" className="w-full">
            {/* Mobile dropdown */}
            <div className="sm:hidden mb-4">
              <select
                className="w-full p-2 border border-border rounded-md bg-background text-foreground"
                onChange={(e) => {
                  const tabValue = e.target.value;
                  // Find the tab trigger and click it
                  const tabTrigger = document.querySelector(
                    `[data-value="${tabValue}"]`
                  ) as HTMLElement;
                  if (tabTrigger) tabTrigger.click();
                }}
                defaultValue="workers"
              >
                <option value="workers">
                  Workers ({workersPagination.total})
                </option>
                <option value="employers">
                  Employers ({employersPagination.total})
                </option>
                <option value="agencies">
                  Agencies ({agenciesPagination.total})
                </option>
                <option value="contracts">
                  Contracts ({contractsPagination.total})
                </option>
              </select>
            </div>

            {/* Desktop/Tablet tab bar */}
            <TabsList className="hidden sm:grid w-full grid-cols-2 md:grid-cols-4 gap-1">
              <TabsTrigger
                value="workers"
                className="flex items-center gap-1 text-xs sm:text-sm"
              >
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Workers</span>
                <span className="sm:hidden">W</span>
                <span className="text-xs">({workersPagination.total})</span>
              </TabsTrigger>
              <TabsTrigger
                value="employers"
                className="flex items-center gap-1 text-xs sm:text-sm"
              >
                <Building2 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Employers</span>
                <span className="sm:hidden">E</span>
                <span className="text-xs">({employersPagination.total})</span>
              </TabsTrigger>
              <TabsTrigger
                value="agencies"
                className="flex items-center gap-1 text-xs sm:text-sm"
              >
                <Briefcase className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Agencies</span>
                <span className="sm:hidden">A</span>
                <span className="text-xs">({agenciesPagination.total})</span>
              </TabsTrigger>
              <TabsTrigger
                value="contracts"
                className="flex items-center gap-1 text-xs sm:text-sm"
              >
                <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Contracts</span>
                <span className="sm:hidden">C</span>
                <span className="text-xs">({contractsPagination.total})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="workers" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Pending Workers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading.workers ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2 text-muted-foreground">
                        Loading workers...
                      </p>
                    </div>
                  ) : pendingWorkers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p>No workers yet</p>
                    </div>
                  ) : (
                    <>
                      {pendingWorkers.map((worker) => (
                        <UserCard key={worker._id} user={worker} />
                      ))}
                      <Pagination
                        pagination={workersPagination}
                        onPageChange={fetchPendingWorkers}
                      />
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="employers" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Pending Employers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading.employers ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2 text-muted-foreground">
                        Loading employers...
                      </p>
                    </div>
                  ) : pendingEmployers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p>No employers yet</p>
                    </div>
                  ) : (
                    <>
                      {pendingEmployers.map((employer) => (
                        <UserCard key={employer._id} user={employer} />
                      ))}
                      <Pagination
                        pagination={employersPagination}
                        onPageChange={fetchPendingEmployers}
                      />
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="agencies" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Pending Agencies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading.agencies ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2 text-muted-foreground">
                        Loading agencies...
                      </p>
                    </div>
                  ) : pendingAgencies.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p>No agencies yet</p>
                    </div>
                  ) : (
                    <>
                      {pendingAgencies.map((agency) => (
                        <UserCard key={agency._id} user={agency} />
                      ))}
                      <Pagination
                        pagination={agenciesPagination}
                        onPageChange={fetchPendingAgencies}
                      />
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contracts" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Pending Contracts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading.contracts ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2 text-muted-foreground">
                        Loading contracts...
                      </p>
                    </div>
                  ) : pendingContracts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p>No contracts yet</p>
                    </div>
                  ) : (
                    <>
                      {pendingContracts.map((contract) => (
                        <div
                          key={contract.id}
                          className="mb-4 p-4 border rounded"
                        >
                          <p>Contract ID: {contract.id}</p>
                        </div>
                      ))}
                      <Pagination
                        pagination={contractsPagination}
                        onPageChange={fetchPendingContracts}
                      />
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
