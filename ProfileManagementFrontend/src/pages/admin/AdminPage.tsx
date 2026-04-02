import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { HiSearch, HiUser, HiBan } from "react-icons/hi";

interface ProfileResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  city?: string;
  country?: string;
  isActive: boolean;
}

const searchUsers = async (params: {
  name?: string;
  city?: string;
  country?: string;
  role?: string;
  isActive?: boolean;
}): Promise<ProfileResponse[]> => {
  const query = new URLSearchParams();
  if (params.name) query.append("name", params.name);
  if (params.city) query.append("city", params.city);
  if (params.country) query.append("country", params.country);
  if (params.role) query.append("role", params.role);
  if (params.isActive !== undefined) query.append("isActive", String(params.isActive));

  const response = await axiosInstance.get(`/profile/search?${query.toString()}`);
  return response.data;
};

const deactivateUser = async (userId: string): Promise<void> => {
  await axiosInstance.put(`/profile/${userId}/deactivate`);
};

export default function AdminPage() {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [searched, setSearched] = useState(false);

  const [filters, setFilters] = useState({});

  const { data: users, isLoading } = useQuery({
    queryKey: ["adminUsers", filters],
    queryFn: () => searchUsers(filters as any),
    enabled: searched,
  });

  const deactivateMutation = useMutation({
    mutationFn: deactivateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
  });

  const handleSearch = () => {
    setFilters({
      name: name || undefined,
      city: city || undefined,
      country: country || undefined,
      role: role || undefined,
      isActive,
    });
    setSearched(true);
  };

  const handleReset = () => {
    setName("");
    setCity("");
    setCountry("");
    setRole("");
    setIsActive(undefined);
    setFilters({});
    setSearched(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f8f6] p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">
            Administration
          </p>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <div className="w-12 h-0.5 bg-gray-900 mt-3" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
          <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-4">
            Search & Filter
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Name</label>
              <Input
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">City</label>
              <Input
                placeholder="Kathmandu"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Country</label>
              <Input
                placeholder="Nepal"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border rounded-md p-2 text-sm"
              >
                <option value="">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Status</label>
              <select
                value={isActive === undefined ? "" : String(isActive)}
                onChange={(e) =>
                  setIsActive(
                    e.target.value === "" ? undefined : e.target.value === "true"
                  )
                }
                className="w-full border rounded-md p-2 text-sm"
              >
                <option value="">All</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSearch} className="flex items-center gap-2">
              <HiSearch className="w-4 h-4" />
              Search
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>

        {/* Results */}
        {!searched && (
          <div className="text-center py-16 text-gray-400">
            <HiUser className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Use the filters above to search for users</p>
          </div>
        )}

        {searched && isLoading && (
          <div className="text-center py-16 text-gray-400 text-sm">Searching...</div>
        )}

        {searched && !isLoading && users?.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm">No users found.</div>
        )}

        <div className="space-y-3">
          {users?.map((user: ProfileResponse) => (
            <Card key={user.id} className="border border-gray-100 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white text-sm font-semibold">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                      {(user.city || user.country) && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {[user.city, user.country].filter(Boolean).join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      user.isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-600"
                    }`}>
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                    {user.isActive && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm" className="flex items-center gap-1">
                            <HiBan className="w-3 h-3" />
                            Deactivate
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Deactivate user?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will deactivate {user.firstName} {user.lastName}'s account. They will no longer be able to log in.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deactivateMutation.mutate(user.id)}
                            >
                              Deactivate
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}