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

export default function AdminDashboard() {
  const { get } = useHttp();
  const [activeTab, setActiveTab] = useState("workers");

  // State for each user type
  const [workers, setWorkers] = useState<PendingUser[]>([]);
  const [employers, setEmployers] = useState<PendingUser[]>([]);
  const [agencies, setAgencies] = useState<PendingUser[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);

  // Pagination state for each user type
  const [workersPagination, setWorkersPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [employersPagination, setEmployersPagination] =
    useState<PaginationInfo>({
      page: 1,
      limit: 10,
      total: 0,
      pages: 0,
    });
  const [agenciesPagination, setAgenciesPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [contractsPagination, setContractsPagination] =
    useState<PaginationInfo>({
      page: 1,
      limit: 10,
      total: 0,
      pages: 0,
    });

  // Loading states
  const [loading, setLoading] = useState({
    workers: false,
    employers: false,
    agencies: false,
    contracts: false,
  });

  // Fetch functions
  const fetchPendingWorkers = async (page: number = 1) => {
    setLoading((prev) => ({ ...prev, workers: true }));
    try {
      const response: any = await get(
        `/admin/pending-workers?page=${page}&limit=10`
      );
      if (response) {
        setWorkers(response.data || []);
        setWorkersPagination(response.pagination || workersPagination);
      }
    } catch (error) {
      console.error("Error fetching pending workers:", error);
      toast.error("Failed to fetch pending workers");
    } finally {
      setLoading((prev) => ({ ...prev, workers: false }));
    }
  };

  const fetchPendingEmployers = async (page: number = 1) => {
    setLoading((prev) => ({ ...prev, employers: true }));
    try {
      const response: any = await get(
        `/admin/pending-employers?page=${page}&limit=10`
      );
      if (response) {
        setEmployers(response.data || []);
        setEmployersPagination(response.pagination || employersPagination);
      }
    } catch (error) {
      console.error("Error fetching pending employers:", error);
      toast.error("Failed to fetch pending employers");
    } finally {
      setLoading((prev) => ({ ...prev, employers: false }));
    }
  };

  const fetchPendingAgencies = async (page: number = 1) => {
    setLoading((prev) => ({ ...prev, agencies: true }));
    try {
      const response: any = await get(
        `/admin/pending-agencies?page=${page}&limit=10`
      );
      if (response) {
        setAgencies(response.data || []);
        setAgenciesPagination(response.pagination || agenciesPagination);
      }
    } catch (error) {
      console.error("Error fetching pending agencies:", error);
      toast.error("Failed to fetch pending agencies");
    } finally {
      setLoading((prev) => ({ ...prev, agencies: false }));
    }
  };

  const fetchPendingContracts = async (page: number = 1) => {
    setLoading((prev) => ({ ...prev, contracts: true }));
    try {
      const response: any = await get(
        `/admin/pending-contracts?page=${page}&limit=10`
      );
      if (response) {
        setContracts(response.data || []);
        setContractsPagination(response.pagination || contractsPagination);
      }
    } catch (error) {
      console.error("Error fetching pending contracts:", error);
      toast.error("Failed to fetch pending contracts");
    } finally {
      setLoading((prev) => ({ ...prev, contracts: false }));
    }
  };

  // Initial load
  useEffect(() => {
    fetchPendingWorkers();
    fetchPendingEmployers();
    fetchPendingAgencies();
    fetchPendingContracts();
  }, []);

  // User card component
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
              </div>
            </div>
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
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
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
            <option value="workers">Workers ({workersPagination.total})</option>
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

        {/* Desktop tabs */}
        <TabsList className="hidden sm:grid sm:grid-cols-4 w-full">
          <TabsTrigger value="workers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Workers ({workersPagination.total})
          </TabsTrigger>
          <TabsTrigger value="employers" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Employers ({employersPagination.total})
          </TabsTrigger>
          <TabsTrigger value="agencies" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Agencies ({agenciesPagination.total})
          </TabsTrigger>
          <TabsTrigger value="contracts" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Contracts ({contractsPagination.total})
          </TabsTrigger>
        </TabsList>

        {/* Workers Tab */}
        <TabsContent value="workers">
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
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Loading...
                  </p>
                </div>
              ) : workers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No workers yet</p>
                </div>
              ) : (
                <>
                  {workers.map((worker) => (
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

        {/* Employers Tab */}
        <TabsContent value="employers">
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
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Loading...
                  </p>
                </div>
              ) : employers.length === 0 ? (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No employers yet</p>
                </div>
              ) : (
                <>
                  {employers.map((employer) => (
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

        {/* Agencies Tab */}
        <TabsContent value="agencies">
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
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Loading...
                  </p>
                </div>
              ) : agencies.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No agencies yet</p>
                </div>
              ) : (
                <>
                  {agencies.map((agency) => (
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

        {/* Contracts Tab */}
        <TabsContent value="contracts">
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
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Loading...
                  </p>
                </div>
              ) : contracts.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No contracts yet</p>
                </div>
              ) : (
                <>
                  {contracts.map((contract) => (
                    <div key={contract.id} className="mb-4 p-4 border rounded">
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
  );
}
