"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, Plus, LogOut, Eye } from "lucide-react";
import { useHttp } from "@/hooks/use-http";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { clearAuth } from "@/lib/slices/authSlice";
import { clearFiles } from "@/lib/slices/filesSlice";

interface Admin {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  admin?: {
    _id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    gender?: string;
    country?: string;
    nationality?: string;
  };
}

export default function SuperadminDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const { post, del, get } = useHttp();

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await get<any>("/superadmin/admins");
      setAdmins(response.admins);
    } catch (error) {
      console.error("Failed to fetch admins:", error);
      toast.error("Failed to fetch admins");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAdmin = async () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsCreating(true);
    try {
      await post("/superadmin/create-admin", newAdmin);
      toast.success("Admin created successfully");
      setNewAdmin({ name: "", email: "", password: "", role: "admin" });
      setIsCreateDialogOpen(false);
      fetchAdmins();
    } catch (error) {
      console.error("Failed to create admin:", error);
      toast.error("Failed to create admin");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteAdmin = async (email: string) => {
    if (!confirm("Are you sure you want to delete this admin?")) {
      return;
    }

    try {
      await del(`/superadmin/delete-admin/${email}`);
      toast.success("Admin deleted successfully");
      fetchAdmins();
    } catch (error) {
      console.error("Failed to delete admin:", error);
      toast.error("Failed to delete admin");
    }
  };

  const handleLogout = () => {
    dispatch(clearAuth());
    dispatch(clearFiles());
    window.location.href = "/auth";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Superadmin Dashboard
              </h1>
              <p className="text-gray-600">Manage system administrators</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Admin Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Admin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>Create Admin</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Admin</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newAdmin.name}
                      onChange={(e) =>
                        setNewAdmin({ ...newAdmin, name: e.target.value })
                      }
                      placeholder="Enter admin name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newAdmin.email}
                      onChange={(e) =>
                        setNewAdmin({ ...newAdmin, email: e.target.value })
                      }
                      placeholder="Enter admin email"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newAdmin.password}
                      onChange={(e) =>
                        setNewAdmin({ ...newAdmin, password: e.target.value })
                      }
                      placeholder="Enter admin password"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={newAdmin.role}
                      onValueChange={(value) =>
                        setNewAdmin({ ...newAdmin, role: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateAdmin} disabled={isCreating}>
                    {isCreating ? "Creating..." : "Create Admin"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Admins List */}
        <Card>
          <CardHeader>
            <CardTitle>System Administrators</CardTitle>
          </CardHeader>
          <CardContent>
            {admins.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No administrators found
              </div>
            ) : (
              <div className="space-y-4">
                {admins.map((admin) => (
                  <div
                    key={admin._id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{admin.name}</h3>
                      <p className="text-sm text-gray-600">{admin.email}</p>
                      <p className="text-xs text-gray-500">
                        Role: {admin.role}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/superadmin/admin-profile/${
                              admin.admin?._id || admin._id
                            }`
                          )
                        }
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View Profile
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteAdmin(admin.email)}
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
