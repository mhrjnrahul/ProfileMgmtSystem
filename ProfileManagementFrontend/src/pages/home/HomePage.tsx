import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getAllProfiles } from "@/api/profileApi";
import type { ProfileResponse } from "@/types/profile";
import { HiLocationMarker, HiUser } from "react-icons/hi";
import PublicNavbar from "@/components/layouts/PublicNavbar";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const navigate = useNavigate();

  const { data: users, isLoading } = useQuery({
    queryKey: ["allProfiles"],
    queryFn: getAllProfiles,
  });

  return (
    <div className="min-h-screen bg-[#f8f8f6]">
      <PublicNavbar />

      {/* Hero */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-8 py-20 text-center">
          <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-3">
            Portfolio Platform
          </p>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Discover Talented <br /> Professionals
          </h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-8">
            Browse portfolios, explore skills, and connect with people doing amazing work.
          </p>
          <Button onClick={() => navigate("/register")}>
            Create Your Portfolio
          </Button>
        </div>
      </div>

      {/* Profiles */}
      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="mb-8">
          <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">
            Community
          </p>
          <h2 className="text-2xl font-bold text-gray-900">Browse Profiles</h2>
          <div className="w-12 h-0.5 bg-gray-900 mt-3" />
        </div>

        {isLoading && (
          <div className="text-center py-16 text-gray-400 text-sm">Loading profiles...</div>
        )}

        {!isLoading && users?.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <HiUser className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No profiles yet.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {users?.map((user: ProfileResponse) => (
            <div
              key={user.id}
              onClick={() => navigate(`/portfolio/${user.id}`)}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>

              {user.bio && (
                <p className="text-xs text-gray-500 line-clamp-2 mb-3">{user.bio}</p>
              )}

              {(user.city || user.country) && (
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <HiLocationMarker className="w-3 h-3" />
                  {[user.city, user.country].filter(Boolean).join(", ")}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}