import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { HiSearch, HiUser, HiBan, HiLocationMarker } from "react-icons/hi";

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

interface SearchParams {
  name?: string;
  city?: string;
  country?: string;
  role?: string;
  isActive?: boolean;
}

const searchUsers = async (params: SearchParams): Promise<ProfileResponse[]> => {
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

const inputStyle = {
  width: "100%", background: "white",
  border: "1.5px solid #EDE8E3", borderRadius: 10,
  padding: "9px 14px", fontSize: 13, color: "#1A1814",
  outline: "none", fontFamily: "'DM Sans', sans-serif",
  boxSizing: "border-box" as const,
};

const labelStyle = {
  fontSize: 11, color: "#6B6058", fontWeight: 500,
  display: "block", marginBottom: 5, letterSpacing: "0.02em",
};

export default function AdminPage() {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [searched, setSearched] = useState(false);
  const [filters, setFilters] = useState<SearchParams>({});

  const { data: users, isLoading } = useQuery({
    queryKey: ["adminUsers", filters],
    queryFn: () => searchUsers(filters),
    enabled: searched,
  });

  const deactivateMutation = useMutation({
    mutationFn: deactivateUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminUsers"] }),
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
    setName(""); setCity(""); setCountry(""); setRole("");
    setIsActive(undefined); setFilters({}); setSearched(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FAF9F7", padding: "40px 32px", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');`}</style>

      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 10, color: "#C4B8AC", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, marginBottom: 8 }}>
            Administration
          </p>
          <h1 style={{ fontSize: 36, fontWeight: 400, color: "#1A1814", lineHeight: 1.1, fontFamily: "'Cormorant Garamond', serif" }}>
            User Management
          </h1>
          <div style={{ width: 32, height: 1.5, background: "#1A1814", marginTop: 12 }} />
        </div>

        {/* Filters */}
        <div style={{
          background: "white", borderRadius: 20, border: "1px solid #F0EDE8",
          boxShadow: "0 2px 8px rgba(26,24,20,0.04)", padding: "24px 28px", marginBottom: 20,
        }}>
          <p style={{ fontSize: 10, color: "#C4B8AC", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, marginBottom: 18 }}>
            Search & Filter
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Name</label>
              <input style={inputStyle} placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>City</label>
              <input style={inputStyle} placeholder="Kathmandu" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Country</label>
              <input style={inputStyle} placeholder="Nepal" value={country} onChange={(e) => setCountry(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={inputStyle}
              >
                <option value="">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select
                value={isActive === undefined ? "" : String(isActive)}
                onChange={(e) => setIsActive(e.target.value === "" ? undefined : e.target.value === "true")}
                style={inputStyle}
              >
                <option value="">All</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={handleSearch}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "#1A1814", color: "white", border: "none",
                borderRadius: 10, padding: "9px 20px", fontSize: 13,
                fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <HiSearch style={{ width: 14, height: 14 }} />
              Search
            </button>
            <button
              onClick={handleReset}
              style={{
                background: "white", color: "#6B6058",
                border: "1.5px solid #EDE8E3", borderRadius: 10,
                padding: "9px 20px", fontSize: 13, fontWeight: 500,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Empty prompt */}
        {!searched && (
          <div style={{ textAlign: "center", padding: "64px 0" }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14, background: "#F5F0EA",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 14px",
            }}>
              <HiUser style={{ width: 22, height: 22, color: "#C4A882" }} />
            </div>
            <p style={{ fontSize: 13, color: "#B8B0A8" }}>Use the filters above to search for users</p>
          </div>
        )}

        {/* Loading */}
        {searched && isLoading && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "64px 0" }}>
            <div style={{ display: "inline-flex", gap: 6 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: "50%", background: "#C4A882",
                  animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
            <style>{`@keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}`}</style>
          </div>
        )}

        {/* No results */}
        {searched && !isLoading && (users?.length ?? 0) === 0 && (
          <div style={{ textAlign: "center", padding: "64px 0" }}>
            <p style={{ fontSize: 13, color: "#B8B0A8" }}>No users found.</p>
          </div>
        )}

        {/* Results */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {users?.map((user: ProfileResponse) => (
            <div key={user.id} style={{
              background: "white", borderRadius: 20,
              border: "1px solid #F0EDE8",
              boxShadow: "0 2px 8px rgba(26,24,20,0.04)",
              padding: "20px 24px",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
            }}>
              {/* Left */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                  background: "linear-gradient(135deg, #1A1814, #3D2E1E)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#E8D5B7", fontSize: 13, fontWeight: 600,
                }}>
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: "#1A1814", marginBottom: 2 }}>
                    {user.firstName} {user.lastName}
                  </p>
                  <p style={{ fontSize: 12, color: "#B8B0A8", marginBottom: 2 }}>{user.email}</p>
                  {(user.city || user.country) && (
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <HiLocationMarker style={{ width: 11, height: 11, color: "#C4A882" }} />
                      <span style={{ fontSize: 11, color: "#A89880" }}>
                        {[user.city, user.country].filter(Boolean).join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                <span style={{
                  fontSize: 11, fontWeight: 500, padding: "4px 12px", borderRadius: 100,
                  background: user.isActive ? "#EDFAF3" : "#FEF2EE",
                  color: user.isActive ? "#2D7A4F" : "#C4735A",
                }}>
                  {user.isActive ? "Active" : "Inactive"}
                </span>

                {user.isActive && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        fontSize: 12, color: "#C4735A", background: "#FEF2EE",
                        border: "1px solid #F5C4B5", borderRadius: 8,
                        padding: "6px 14px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                      }}>
                        <HiBan style={{ width: 12, height: 12 }} />
                        Deactivate
                      </button>
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
                        <AlertDialogAction onClick={() => deactivateMutation.mutate(user.id)}>
                          Deactivate
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}